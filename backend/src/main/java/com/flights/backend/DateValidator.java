package com.flights.backend;

import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateValidator {

    // Date formatter shortcut
    static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Check if date string is in yyyy-MM-dd format.
     * @param dateStr the date string to be validated
     * @return true or false depending on if the dateStr is valid or not
     */
    public static boolean isInvalidDate(String dateStr) {
        if (dateStr == null) return true;

        // Check validity
        try {
            FORMATTER.parse(dateStr);
            return false;
        } catch (DateTimeParseException e) {
            return true;
        }
    }
}

