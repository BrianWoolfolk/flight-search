package com.flights.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Iterator;
import java.util.List;

@Service
public class FlightService {

    final static int PAGINATION_FLIGHT_LEN = 10;
    final static int PAGINATION_IATA_LEN = 20;

    private final RestTemplate restTemplate;
    private final FlightAuth flightAuth;
    private final JsonService jsonService;
    private final FlightCodeSearcher flightCodeSearcher;

    @Autowired
    public FlightService(RestTemplate restTemplate, FlightAuth flightAuth, JsonService jsonService, FlightCodeSearcher flightCodeSearcher) {
        this.restTemplate = restTemplate;
        this.flightAuth = flightAuth;
        this.jsonService = jsonService;
        this.flightCodeSearcher = flightCodeSearcher;
    }

    public String searchFlight(FlightSearchQuery query) {
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

        return jsonService.pickFlightInfo(body, locObj).toString();
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
        // FORMULATE REQUEST
        String url = flightAuth.getUrl() + "/v1/reference-data/locations/A";
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
