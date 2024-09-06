package com.flights.backend;

public enum Currency {
    USD("USD"),
    MXN("MXN"),
    EUR("EUR");

    private final String code;

    Currency(String displayName) {
        this.code = displayName;
    }

    public String getCode() {
        return code;
    }
}
