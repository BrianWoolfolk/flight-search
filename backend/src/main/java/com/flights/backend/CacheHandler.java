package com.flights.backend;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class CacheHandler {
    private JsonNode lastResponse = null;
    private FlightSearchQuery lastRequest = null;

    public void setLastResponse(JsonNode response) {
        lastResponse = response;
    }

    public void setLastRequest(FlightSearchQuery request) {
        lastRequest = request;
    }

    public boolean needsNewResponse(FlightSearchQuery request) {
        if (this.lastResponse == null || this.lastRequest == null)
            return true;

        return !Objects.equals(lastRequest.toString(), request.toString());
    }

    public JsonNode getLastResponse() {
        return lastResponse;
    }
}
