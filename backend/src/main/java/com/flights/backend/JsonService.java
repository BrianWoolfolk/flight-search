package com.flights.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Service
public class JsonService {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Set<String> flightDataKeys = Set.of(
            "itineraries", "price", "pricingOptions", "travelerPricings"
    );
    private static final Set<String> airlineDataKeys = Set.of(
            "name", "id", "iataCode"
    );

    public static JsonNode readBody(ResponseEntity<String> response) {
        JsonNode jsonBody;

        // GET JSON CONTENT
        try {
            jsonBody = objectMapper.readTree(response.getBody());
        } catch (JsonProcessingException err) {
            throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, err.getMessage());
        }

        // SHOW ERRORS IF ANY
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new HttpClientErrorException(response.getStatusCode(), jsonBody.get("errors").get(0).get("title").toString());
        }

        if (jsonBody == null) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "Request return no response at all");
        }

        return jsonBody;
    }

    public JsonNode pickFlightInfo(JsonNode root, JsonNode locationsObj) {
        // PICK INFO FROM ALL DATA ENTRIES
        JsonNode allData = root.get("data");
        ArrayNode pickedData = objectMapper.createArrayNode();
        ObjectNode newRoot = objectMapper.createObjectNode();
        newRoot.set("meta", root.get("meta"));

        // COPY ALL DICTIONARIES
        newRoot.set("dictionaries", root.get("dictionaries"));
        if (locationsObj != null) {
            JsonNode dPath = newRoot.path("dictionaries");

            if (dPath.isObject()) {
                ObjectNode dictObj = (ObjectNode) dPath;
                dictObj.replace("locations", locationsObj);
            }
        }

        // COPY & FILTER ALL REMAINING DATA
        for (JsonNode entry : allData) {

            // ONLY CHOSEN KEYS
            ObjectNode newEntry = objectMapper.createObjectNode();
            for (String key : flightDataKeys) newEntry.set(key, entry.get(key));

            pickedData.add(newEntry);
        }
        newRoot.set("data", pickedData);

        return newRoot;
    }

    public JsonNode pickIATAInfo(JsonNode root) {
        // PICK INFO FROM ALL DATA ENTRIES
        JsonNode allData = root.get("data");
        ArrayNode pickedData = objectMapper.createArrayNode();
        for (JsonNode entry : allData) {

            // COMPOSE CUSTOM STRING
            String compose =
                    entry.get("name").asText() + " - "
                            + entry.get("address").get("cityName").asText()
                            + " ("  + entry.get("iataCode").asText() + ")";

            pickedData.add(compose);
        }

        return pickedData;
    }

    public JsonNode pickAirportInfo(JsonNode root) {
        // PICK INFO FROM ALL DATA ENTRIES
        JsonNode dataObj = root.get("data");

        // ONLY CHOSEN KEYS
        ObjectNode newEntry = objectMapper.createObjectNode();
        for (String key : airlineDataKeys) newEntry.set(key, dataObj.get(key));

        newEntry.set("cityName", dataObj.get("address").get("cityName"));
        newEntry.set("cityCode", dataObj.get("address").get("cityCode"));
        newEntry.set("countryCode", dataObj.get("address").get("countryCode"));

        // RETURN FILTERED OBJECT
        return newEntry;
    }

    public JsonNode createLocationsObj(
            List<ResponseEntity<String>> fromResponses,
            ResponseEntity<String> extraCodes
    ) {
        ObjectNode locationsObj = objectMapper.createObjectNode();

        // FOR EVERY RESPONSE ADD: "<IATA CODE>": { <info about IATA code> }
        for (ResponseEntity<String> resp : fromResponses) {
            JsonNode objData = pickAirportInfo(readBody(resp));
            locationsObj.set(objData.get("iataCode").asText(), objData);
        }

        if (extraCodes != null) {
            JsonNode codesData = readBody(extraCodes).get("data");
            if (codesData.isArray()) {
                for (JsonNode item : codesData) {
                    ObjectNode newItem = objectMapper.createObjectNode();
                    String iata = "Unknown";
                    if (item.get("icaoCode") != null) {
                        iata = item.get("icaoCode").asText();
                    } else if (item.get("iataCode") != null) {
                        iata = item.get("iataCode").asText();
                    }

                    String name = "Unknown";
                    if (item.get("commonName") != null) {
                        name = item.get("commonName").asText();
                    } else if (item.get("businessName") != null) {
                        name = item.get("businessName").asText();
                    }

                    // AS IT APPEARS, AMADEUS HAS NOT THIS INFO YET
                    newItem.put("id", iata);
                    newItem.put("name", name + "~");
                    newItem.put("iataCode", iata);
                    newItem.put("cityName", name + "~");
                    newItem.put("cityCode", iata);
                    newItem.put("countryCode", iata);

                    // ADD INFO
                    locationsObj.set(iata, newItem);
                }
            }
        }

        // THIS CAN BE ADDED AS "locations": <locationsObj>
        return locationsObj;
    }

    public Iterator<String> pickLocationsFromDictionary(JsonNode root) {
        JsonNode dict = root.get("dictionaries");
        if (dict == null || dict.isEmpty()) return null;

        dict = dict.get("locations");
        if (dict == null || dict.isEmpty()) return null;

        return dict.fieldNames();
    }

    public JsonNode getPagination(JsonNode root, int page, int pageSize) {
        ArrayNode dataJson = (ArrayNode) root.get("data");
        ArrayNode smallData = objectMapper.createArrayNode();
        page = Math.max(1, Math.min(page, 10));

        for (int i = (page - 1) * pageSize; i < page * pageSize; i++) {
            JsonNode item = dataJson.get(i);
            if (item != null && !item.isEmpty())
                smallData.add(item);
        }

        ObjectNode newObjNode = objectMapper.createObjectNode();
        newObjNode.set("data", smallData);
        newObjNode.set("dictionaries", root.get("dictionaries"));

        return newObjNode;
    }
}
