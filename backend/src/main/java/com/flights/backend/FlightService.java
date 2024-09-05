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

@Service
public class FlightService {

    final static int PAGINATION_FLIGHT_LEN = 10;
    final static int PAGINATION_IATA_LEN = 20;

    private final RestTemplate restTemplate;
    private final FlightAuth flightAuth;
    private final JsonService jsonService;

    @Autowired
    public FlightService(RestTemplate restTemplate, FlightAuth flightAuth, JsonService jsonService) {
        this.restTemplate = restTemplate;
        this.flightAuth = flightAuth;
        this.jsonService = jsonService;
    }

    public String searchFlight(FlightSearchQuery query) {
        // FORMULATE REQUEST
        String url = flightAuth.getUrl() + "/v2/shopping/flight-offers?" + query + "&max=" + PAGINATION_FLIGHT_LEN;
        HttpHeaders headers = flightAuth.getHeaders();

        // MAKE REQUEST & GET RESPONSE
        HttpEntity<String> request = new HttpEntity<>(null, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        // READ RESPONSE
        JsonNode body = JsonService.readBody(response);
        return jsonService.pickFlightInfo(body).toString();
    }

    public String searchIATA(String keyword) {
        // FORMULATE REQUEST
        String url = flightAuth.getUrl() + "/v1/reference-data/locations?subType=AIRPORT&view=LIGHT&keyword=" + keyword + "&page[limit]=" + PAGINATION_IATA_LEN;
        HttpHeaders headers = flightAuth.getHeaders();

        // MAKE REQUEST & GET RESPONSE
        HttpEntity<String> request = new HttpEntity<>(null, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        // READ RESPONSE
        JsonNode body = JsonService.readBody(response);
        return jsonService.pickIATAInfo(body).toString();
    }
}
