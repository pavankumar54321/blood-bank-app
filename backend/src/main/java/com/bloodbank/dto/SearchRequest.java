package com.bloodbank.dto;

public class SearchRequest {
    private String bloodGroup;
    private String city;

    // Getters and Setters
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}