package com.bloodbank.dto;

import java.time.LocalDate;

public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String bloodGroup;
    private String city;
    private String phoneNumber;
    private LocalDate lastDonationDate;
    private String profilePhotoBase64;
    private boolean isAdmin;

    public LoginResponse() {}

    public LoginResponse(Long id, String name, String email, String bloodGroup, String city, 
                        String phoneNumber, LocalDate lastDonationDate, String profilePhotoBase64, boolean isAdmin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bloodGroup = bloodGroup;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.lastDonationDate = lastDonationDate;
        this.profilePhotoBase64 = profilePhotoBase64;
        this.isAdmin = isAdmin;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
    public String getProfilePhotoBase64() { return profilePhotoBase64; }
    public void setProfilePhotoBase64(String profilePhotoBase64) { this.profilePhotoBase64 = profilePhotoBase64; }
    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean isAdmin) { this.isAdmin = isAdmin; }
}
