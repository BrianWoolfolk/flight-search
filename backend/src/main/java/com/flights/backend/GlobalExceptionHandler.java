package com.flights.backend;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpStatusCodeException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<String> handleHttpStatusCodes(HttpStatusCodeException err) {
        System.out.println("error at client request: " + err);
        err.printStackTrace();
        return new ResponseEntity<>(err.getMessage(), err.getStatusCode());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArguments(IllegalArgumentException err) {
        return new ResponseEntity<>(err.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JsonProcessingException.class)
    public ResponseEntity<String> handleJsonProcessing(JsonProcessingException err) {
        return new ResponseEntity<>("Error while processing the response body: " + err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleEverythingElse(Exception ex) {
        return new ResponseEntity<>("Unknown error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}