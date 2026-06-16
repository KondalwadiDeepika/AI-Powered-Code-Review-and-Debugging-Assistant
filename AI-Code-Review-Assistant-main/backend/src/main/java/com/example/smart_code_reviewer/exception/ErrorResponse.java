package com.example.smart_code_reviewer.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private Map<String, String> fieldErrors;

    public static ErrorResponse of(HttpStatus status, String message) {
        ErrorResponse r = new ErrorResponse();
        r.status = status.value();
        r.error = status.getReasonPhrase();
        r.message = message;
        r.timestamp = LocalDateTime.now();
        return r;
    }
}
