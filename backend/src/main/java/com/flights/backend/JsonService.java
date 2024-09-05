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

import java.util.Set;

@Service
public class JsonService {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Set<String> flightDataKeys = Set.of(
            "itineraries", "price", "pricingOptions", "travelerPricings"
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

    public JsonNode pickFlightInfo(JsonNode root) {
        // PICK INFO FROM ALL DATA ENTRIES
        JsonNode allData = root.get("data");
        ArrayNode pickedData = objectMapper.createArrayNode();
        for (JsonNode entry : allData) {

            // ONLY CHOSEN KEYS
            ObjectNode newEntry = objectMapper.createObjectNode();
            for (String key : flightDataKeys) newEntry.set(key, entry.get(key));

            pickedData.add(newEntry);
        }

        // CREATE & RETURN FILTERED OBJECT
        ObjectNode newRoot = objectMapper.createObjectNode();
        newRoot.set("data", pickedData);
        newRoot.set("dictionaries", root.get("dictionaries"));

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
}
