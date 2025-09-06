package com.example.presenca_system.security;

import java.util.Date;
import java.util.function.Function;
import io.jsonwebtoken.Claims;

public interface JwtService {

    String generateToken(String email);

    String extractUserEmail(String token);

    Date extractExpiration(String token);
    
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    boolean isTokenValid(String token, String userEmail);
    
    boolean isTokenExpired(String token);
}