package com.hamsiny.developerintelligenceplatform.controller;

import com.hamsiny.developerintelligenceplatform.dto.LoginRequest;
import com.hamsiny.developerintelligenceplatform.dto.RegisterRequest;
import com.hamsiny.developerintelligenceplatform.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}