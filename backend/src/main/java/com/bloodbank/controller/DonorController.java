package com.bloodbank.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bloodbank.dto.DonorResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.LoginResponse;
import com.bloodbank.dto.ProfileUpdateRequest;
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
            LoginResponse result = donorService.loginDonor(request);
            return ResponseEntity.ok(new LoginApiResponse(true, "Login successful", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        try {
            LoginResponse result = donorService.updateProfile(request);
            return ResponseEntity.ok(new LoginApiResponse(true, "Profile updated successfully", result));
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

    @GetMapping("/all")
    public ResponseEntity<?> getAllDonors() {
        try {
            List<DonorResponse> donors = donorService.getAllDonors();
            return ResponseEntity.ok(donors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to fetch donors: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
        try {
            donorService.deleteDonor(id);
            return ResponseEntity.ok(new ApiResponse(true, "Donor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/fix-cities")
    public ResponseEntity<?> fixCities() {
        try {
            donorService.cleanCities();
            return ResponseEntity.ok(new ApiResponse(true, "Old city misspellings fixed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to fix cities: " + e.getMessage()));
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

class LoginApiResponse extends ApiResponse {
    private LoginResponse donorData;

    public LoginApiResponse(boolean success, String message, LoginResponse donorData) {
        super(success, message);
        this.donorData = donorData;
    }

    public LoginResponse getDonorData() { return donorData; }
    public void setDonorData(LoginResponse donorData) { this.donorData = donorData; }
}