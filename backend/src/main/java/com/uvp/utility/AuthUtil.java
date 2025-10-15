package com.uvp.utility;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class AuthUtil {
    public static int getUserIdByAuthHeader(String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return 0;
        }

        String token = authHeader.substring(7); // Remove "Bearer "
        if (!JwtUtil.isTokenValid(token)) {
            return 0;
        }

        return JwtUtil.extractUserId(token);
    }
}
