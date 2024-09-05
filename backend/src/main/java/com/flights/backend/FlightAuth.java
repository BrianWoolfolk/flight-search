package com.flights.backend;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

@Component
public class FlightAuth {

    // SENSITIVE INFO
    @Value("${spring.datasource.client_id}")
    private String client_id;

    @Value("${spring.datasource.client_secret}")
    private String client_secret;

    @Value("${spring.datasource.url}")
    private String url;

    // RETRIEVE URL
    public String getUrl() {
        return url;
    }

    // TOKEN MANAGEMENT
    private String token = null;
    private Instant tokenCreationTime = null;
    private int tokenDurationSeconds = 0;

    /**
     * Checks if the current token already expired.
     * @return True if there's no token or its valid time already passed. False if it's still valid.
     */
    private boolean isTokenExpired() {
        if (this.token == null || this.tokenCreationTime == null) return true;

        Instant time = Instant.now();
        return time.isAfter(tokenCreationTime.plusSeconds(tokenDurationSeconds));
    }

    /**
     * Makes a request using private client id & secret. It renovates the token for future petitions.
     */
    private void getCredentials() {
        // FORMULATE REQUEST
        String url = this.url + "/v1/security/oauth2/token";
        Map<String, String> body = Map.of(
                "client_id", this.client_id,
                "client_secret", this.client_secret,
                "grant_type", "client_credentials"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // MAKE REQUEST & GET RESPONSE
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = new RestTemplate().exchange(url, HttpMethod.POST, request, String.class);

        // READ BODY
        JsonNode resBody = JsonService.readBody(response);
        this.token = "Bearer " + resBody.get("access_token");
        this.tokenCreationTime = Instant.now();
        this.tokenDurationSeconds = resBody.get("expires_in").asInt();
    }

    /**
     * First checks if isTokenExpired() and getCredentials() if true.
     * Then, with the now valid token, generates a HttpHeaders automatically.
     * @return HttpHeaders to use directly in a request, guaranteed with a valid token.
     */
    public HttpHeaders getHeaders() {
        if (isTokenExpired()) getCredentials();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.token);
        return headers;
    }
}
