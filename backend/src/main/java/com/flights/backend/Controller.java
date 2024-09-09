package com.flights.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class Controller {
    @Autowired
    FlightService service;

    @RequestMapping(method = { RequestMethod.GET }, value = { "/searchFlight" })
    public ResponseEntity<String> apiSearchFlight(
            @RequestParam() String originLocationCode,
            @RequestParam() String destinationLocationCode,
            @RequestParam() String departureDate,
            @RequestParam( required = false ) String returnDate,
            @RequestParam( defaultValue = "1" ) int adults,
            @RequestParam( defaultValue = "false") boolean nonStop,
            @RequestParam( defaultValue = "USD" ) Currency currencyCode,
            @RequestParam( defaultValue = "1" ) int pag
    ) {
        // CONVERT VALUES
        FlightSearchQuery req = new FlightSearchQuery(
                originLocationCode,
                destinationLocationCode,
                departureDate,
                returnDate,
                adults,
                nonStop,
                currencyCode);

        // MAKE REQUEST
        String res = service.searchFlight(req, pag);

        // RETURN RESPONSE
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @RequestMapping(method = { RequestMethod.GET }, value = { "/searchIATA" })
    public ResponseEntity<String> apiSearchIATA(@RequestParam() String keyword) {
        if (keyword == null || keyword.isBlank())
            return new ResponseEntity<>("Keyword cannot be null or blank", HttpStatus.BAD_REQUEST);

        // MAKE REQUEST
        String res = service.searchIATA(keyword);

        // RETURN RESPONSE
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @RequestMapping(method = { RequestMethod.GET }, value = { "/searchCodes" })
    public ResponseEntity<String> apiSearchCodes(@RequestParam() List<String> codes) {
         if (codes.isEmpty())
             return new ResponseEntity<>("At least 1 IATA code is required", HttpStatus.BAD_REQUEST);

        // MAKE REQUEST
         String res = service.searchCodes(codes);

         // RETURN RESPONSE
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}

