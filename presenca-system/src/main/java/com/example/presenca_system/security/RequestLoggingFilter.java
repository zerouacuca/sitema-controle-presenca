package com.example.presenca_system.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getServletPath();
        String method = httpRequest.getMethod();
        
        System.out.println("=== REQUEST DEBUG ===");
        System.out.println("Method: " + method);
        System.out.println("Path: " + path);
        System.out.println("Full URL: " + httpRequest.getRequestURL());
        System.out.println("=====================");
        
        chain.doFilter(request, response);
    }
}