
package com.bloodbank.dto;

import java.time.LocalDate;

public class DonorResponse {
    private String name;
    private String bloodGroup;
    private String city;
    private String phoneNumber;
    private LocalDate lastDonationDate;

    public DonorResponse() {}

    public DonorResponse(String name, String bloodGroup, String city, 
                        String phoneNumber, LocalDate lastDonationDate) {
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.city = city;
        this.phoneNumber = phoneNumber;
        this.lastDonationDate = lastDonationDate;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
}