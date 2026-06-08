package com.hamsiny.developerintelligenceplatform.service;

import com.hamsiny.developerintelligenceplatform.dto.LoginRequest;
import com.hamsiny.developerintelligenceplatform.dto.RegisterRequest;
import com.hamsiny.developerintelligenceplatform.entity.User;
import com.hamsiny.developerintelligenceplatform.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already registered";
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setGithubUsername(request.getGithubUsername());

        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);

        userRepository.save(user);

        return "Registration successful";
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return "Invalid email";
        }

        boolean isPasswordMatching =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!isPasswordMatching) {
            return "Invalid password";
        }

        return "Login successful";
    }
}