package com.datn.beestyle.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e, WebRequest request) {
        ErrorResponse errorResponse = this.createErrorResponse(HttpStatus.NOT_FOUND, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        BindingResult bindingResult = e.getBindingResult();
        for (FieldError fieldError: bindingResult.getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ErrorResponse errorResponse = this.createErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage(), request);
        errorResponse.setError("Invalid Payload");
        errorResponse.setMessage(errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler({InvalidDataException.class, EmptyResultDataAccessException.class})
    public ResponseEntity<ErrorResponse> handleInvalidDataException(Exception e, WebRequest request) {
        ErrorResponse errorResponse = this.createErrorResponse(HttpStatus.CONFLICT, e.getMessage(), request);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleInternalServerErrorException(Exception e, WebRequest request) {
        ErrorResponse errorResponse = this.createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request);
        log.info("Class exception: {}", e.getClass());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private ErrorResponse createErrorResponse(HttpStatus httpStatus, String message, WebRequest request) {
        String path = request.getDescription(false).replace("uri=", "");

        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setCode(httpStatus.value());
        errorResponse.setPath(path);
        errorResponse.setError(httpStatus.getReasonPhrase());
        errorResponse.setMessage(message);

        log.error("Path: {} - Msg error: {}",path, message);
        return errorResponse;
    }
}
