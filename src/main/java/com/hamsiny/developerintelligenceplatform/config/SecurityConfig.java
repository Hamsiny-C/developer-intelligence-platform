package com.hamsiny.developerintelligenceplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/auth/**",
                                "/hello",
                                "/users/**",
                                "/profile/**",
                                "/github/**",
                                "/score/**",
                                "/languages/**",
                                "/recommendations/**",
                                "/developer-report/**",
                                "/roadmap/**",
                                "/recruiter-view/**",
                                "/resume/**",
                                "/resume-upload/**",
                                "/resume-report/**",
                                "/resume-history/**",
                                "/interview-questions/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}