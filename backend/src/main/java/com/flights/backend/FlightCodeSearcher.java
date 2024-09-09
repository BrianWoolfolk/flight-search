package com.flights.backend;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class FlightCodeSearcher {
    // AMADEUS API NEEDS A 100ms WINDOW BETWEEN REQUESTS
    private static final int REQUEST_TIMEOUT = 100;
    private final List<ResponseEntity<String>> responses = new ArrayList<>();
    private ResponseEntity<String> extraCodes = null;

    private final RestTemplate restTemplate;
    private final JsonService jsonService;

    @Autowired
    public FlightCodeSearcher(RestTemplate restTemplate, JsonService jsonService) {
        this.restTemplate = restTemplate;
        this.jsonService = jsonService;
    }

    public JsonNode fetchLocationsObj(String mainUrl, Iterator<String> codes, HttpHeaders headers) throws InterruptedException {
        // CREATE SCHEDULER
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        CountDownLatch latch = new CountDownLatch(1); // Make synchronous

        // MAKE REQUEST & GET RESPONSE
        HttpEntity<String> request = new HttpEntity<>(headers);

        // CALL API FOR EVERY ITEM IN LIST
        Runnable task = new Runnable() {
            final List<String> notFoundCodes = new ArrayList<>();

            @Override
            public void run() {
                // MAKE REQUEST IF STILL HAS NEXT
                if (codes.hasNext()) {
                    String code = codes.next();
                    String sttr = mainUrl + "/v1/reference-data/locations/A" + code;

                    try {
                        ResponseEntity<String> resp = restTemplate.exchange(
                            sttr,
                            HttpMethod.GET,
                            request,
                            String.class
                        );

                        responses.add(resp); // GOOD RESPONSE
                    } catch (HttpClientErrorException err) {
                        notFoundCodes.add(code);
                    }

                } else {
                    if (!notFoundCodes.isEmpty()) {
                        try {
                            extraCodes = restTemplate.exchange(
                                    mainUrl + "/v1/reference-data/airlines?airlineCodes="
                                            + String.join(",", notFoundCodes),
                                    HttpMethod.GET,
                                    request,
                                    String.class
                            );
                        } catch (HttpClientErrorException err) {
                            err.printStackTrace(); // Hopefully this won't happen, but is needed to not freeze the app
                            System.out.println("Unexpected error in codes: " + err.getMessage());
                        }
                    } else extraCodes = null;

                    latch.countDown(); // let go
                    scheduler.shutdown();
                }
            }
        };

        scheduler.scheduleAtFixedRate(task, 0, REQUEST_TIMEOUT, TimeUnit.MILLISECONDS);
        latch.await();
        return jsonService.createLocationsObj(responses, extraCodes);
    }
}

