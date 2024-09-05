package com.flights.backend;

/**
 * Gets the needed parameters to compose a query string for Amadeus API.
 * @param originLocationCode amadeus parameter
 * @param destinationLocationCode amadeus parameter
 * @param departureDate amadeus parameter
 * @param returnDate amadeus parameter
 * @param adults amadeus parameter
 * @param nonStop amadeus parameter
 */
public record FlightSearchQuery(
        String originLocationCode,
        String destinationLocationCode,
        String departureDate,
        String returnDate,
        int adults,
        boolean nonStop
) {
     public FlightSearchQuery {
         if (originLocationCode == null || originLocationCode.isBlank())
             throw new IllegalArgumentException("originLocationCode cannot be null or blank");
         if (destinationLocationCode == null || destinationLocationCode.isBlank())
             throw new IllegalArgumentException("destinationLocationCode cannot be null or blank");
         if (DateValidator.isInvalidDate(departureDate))
             throw new IllegalArgumentException("Invalid departure date format");
         if (returnDate != null && DateValidator.isInvalidDate(returnDate))
             throw new IllegalArgumentException("Invalid return date format");
         if (adults <= 0)
             throw new IllegalArgumentException("Number of adults must be greater or equal to 1");
     }

     @Override
     public String toString() {
         String str = "originLocationCode=" + originLocationCode +
                 "&destinationLocationCode=" + destinationLocationCode +
                 "&departureDate=" + departureDate +
                 "&adults=" + adults +
                 "&returnDate=" + returnDate +
                 "&nonStop=" + nonStop;
         if (returnDate != null) str += "&returnDate=" + returnDate;

         return str;
     }
}
