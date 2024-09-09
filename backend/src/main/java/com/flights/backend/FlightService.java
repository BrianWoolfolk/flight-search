package com.flights.backend;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Iterator;
import java.util.List;

@Service
public class FlightService {
    final static int PAGINATION_FLIGHT_LEN = 100;
    final static int PAGINATION_IATA_LEN = 20;
    final static int PAGE_SIZE = 10;

    private final RestTemplate restTemplate;
    private final FlightAuth flightAuth;
    private final JsonService jsonService;
    private final FlightCodeSearcher flightCodeSearcher;
    private final CacheHandler cacheHandler;

    @Autowired
    public FlightService(
            RestTemplate restTemplate,
            FlightAuth flightAuth,
            JsonService jsonService,
            FlightCodeSearcher flightCodeSearcher,
            CacheHandler cacheHandler
    ) {
        this.restTemplate = restTemplate;
        this.flightAuth = flightAuth;
        this.jsonService = jsonService;
        this.flightCodeSearcher = flightCodeSearcher;
        this.cacheHandler = cacheHandler;
    }

    public String searchFlight(FlightSearchQuery query, int pag) {
        JsonNode res;

        // CHECK TO GET NEW RESPONSE
        if (!cacheHandler.needsNewResponse(query)) {
            res = cacheHandler.getLastResponse();
        } else {
            // FORMULATE REQUEST
            String url = flightAuth.getUrl() + "/v2/shopping/flight-offers?" + query + "&max=" + PAGINATION_FLIGHT_LEN;
            HttpHeaders headers = flightAuth.getHeaders();

            // MAKE REQUEST & GET RESPONSE
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            // READ RESPONSE
            JsonNode body = JsonService.readBody(response);

            // READ DICTIONARY TO FETCH ALL IATA CODES
            JsonNode locObj = searchCodes(jsonService.pickLocationsFromDictionary(body));
            res = jsonService.pickFlightInfo(body, locObj);

            // THIS THE WHOLE RESPONSE, CACHE IT FOR PAGINATION PURPOSES
            cacheHandler.setLastRequest(query);
            cacheHandler.setLastResponse(res);
        }

        // PAGINATION IN BACKEND - reason, with too much info we can save substantial re-processing time
        // JsonNode smallJson = jsonService.getPagination(res, pag, PAGE_SIZE);
        // return smallJson.toString();

        // PAGINATION IN CLIENT
        return res.toString();
    }

    public String searchIATA(String keyword) {
        // FORMULATE REQUEST
        String url = flightAuth.getUrl() + "/v1/reference-data/locations?subType=AIRPORT&view=LIGHT&keyword=" + keyword + "&page[limit]=" + PAGINATION_IATA_LEN;
        HttpHeaders headers = flightAuth.getHeaders();

        // MAKE REQUEST & GET RESPONSE
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        // READ RESPONSE
        JsonNode body = JsonService.readBody(response);
        return jsonService.pickIATAInfo(body).toString();
    }

    public JsonNode searchCodes(Iterator<String> codes) {
        if (codes == null) return null;

        // FORMULATE REQUEST
        String url = flightAuth.getUrl();
        HttpHeaders headers = flightAuth.getHeaders();

        // MAKE REQUESTS
        JsonNode locationsObj;
        try {
            locationsObj = flightCodeSearcher.fetchLocationsObj(url, codes, headers);
        } catch (InterruptedException err) {
            throw new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR, err.getMessage());
        }

        return locationsObj;
    }

    public String searchCodes(List<String> codes) {
        return searchCodes(codes.iterator()).toString();
    }
}
