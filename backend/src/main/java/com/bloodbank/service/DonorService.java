package com.bloodbank.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bloodbank.dto.DonorResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.RegisterRequest;
import com.bloodbank.dto.SearchRequest;
import com.bloodbank.model.Donor;
import com.bloodbank.repository.DonorRepository;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String registerDonor(RegisterRequest request) {
        if (donorRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Donor donor = new Donor();
        donor.setName(request.getName());
        donor.setEmail(request.getEmail());
        donor.setPassword(passwordEncoder.encode(request.getPassword()));
        donor.setBloodGroup(request.getBloodGroup());
        donor.setCity(request.getCity());
        donor.setPhoneNumber(request.getPhoneNumber());
        
        if (request.getLastDonationDate() != null && !request.getLastDonationDate().isEmpty()) {
            donor.setLastDonationDate(LocalDate.parse(request.getLastDonationDate()));
        }

        donorRepository.save(donor);
        return "Donor registered successfully";
    }

    public String loginDonor(LoginRequest request) {
        Optional<Donor> donorOptional = donorRepository.findByEmail(request.getEmail());
        
        if (donorOptional.isPresent() && 
            passwordEncoder.matches(request.getPassword(), donorOptional.get().getPassword())) {
            return "Login successful";
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }

    public List<DonorResponse> searchDonors(SearchRequest request) {
        return donorRepository.findDonorsByBloodGroupAndCity(
            request.getBloodGroup(), 
            request.getCity()
        );
    }
}