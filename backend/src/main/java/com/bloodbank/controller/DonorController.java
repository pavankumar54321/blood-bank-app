package com.bloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.dto.DonorResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.RegisterRequest;
import com.bloodbank.dto.SearchRequest;
import com.bloodbank.service.DonorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "http://localhost:3000")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @PostMapping("/register")
    public ResponseEntity<?> registerDonor(@Valid @RequestBody RegisterRequest request) {
        try {
            String result = donorService.registerDonor(request);
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDonor(@Valid @RequestBody LoginRequest request) {
        try {
            String result = donorService.loginDonor(request);
            return ResponseEntity.ok(new ApiResponse(true, result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchDonors(@RequestBody SearchRequest request) {
        try {
            List<DonorResponse> donors = donorService.searchDonors(request);
            return ResponseEntity.ok(donors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Search failed: " + e.getMessage()));
        }
    }
}

class ApiResponse {
    private boolean success;
    private String message;

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}