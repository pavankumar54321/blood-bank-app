package com.bloodbank.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.bloodbank.dto.DonorResponse;
import com.bloodbank.dto.LoginRequest;
import com.bloodbank.dto.LoginResponse;
import com.bloodbank.dto.ProfileUpdateRequest;
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

        if ("admin@bloodbank.com".equalsIgnoreCase(request.getEmail())) {
            donor.setAdmin(true);
        }

        donorRepository.save(donor);
        return "Donor registered successfully";
    }

    public LoginResponse loginDonor(LoginRequest request) {
        Optional<Donor> donorOptional = donorRepository.findByEmail(request.getEmail());
        
        if (donorOptional.isPresent() && 
            passwordEncoder.matches(request.getPassword(), donorOptional.get().getPassword())) {
            
            Donor donor = donorOptional.get();
            return new LoginResponse(
                donor.getId(),
                donor.getName(),
                donor.getEmail(),
                donor.getBloodGroup(),
                donor.getCity(),
                donor.getPhoneNumber(),
                donor.getLastDonationDate(),
                donor.getProfilePhotoBase64(),
                donor.isAdmin()
            );
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }

    public LoginResponse updateProfile(ProfileUpdateRequest request) {
        Optional<Donor> donorOptional = donorRepository.findByEmail(request.getEmail());
        if (!donorOptional.isPresent()) {
            throw new RuntimeException("Donor not found");
        }

        Donor donor = donorOptional.get();
        if (request.getName() != null && !request.getName().isEmpty()) donor.setName(request.getName());
        if (request.getBloodGroup() != null && !request.getBloodGroup().isEmpty()) donor.setBloodGroup(request.getBloodGroup());
        if (request.getCity() != null && !request.getCity().isEmpty()) donor.setCity(request.getCity());
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) donor.setPhoneNumber(request.getPhoneNumber());
        if (request.getProfilePhotoBase64() != null && !request.getProfilePhotoBase64().isEmpty()) donor.setProfilePhotoBase64(request.getProfilePhotoBase64());
        
        if (request.getLastDonationDate() != null && !request.getLastDonationDate().isEmpty()) {
            donor.setLastDonationDate(LocalDate.parse(request.getLastDonationDate()));
        }

        donorRepository.save(donor);

        return new LoginResponse(
            donor.getId(),
            donor.getName(),
            donor.getEmail(),
            donor.getBloodGroup(),
            donor.getCity(),
            donor.getPhoneNumber(),
            donor.getLastDonationDate(),
            donor.getProfilePhotoBase64(),
            donor.isAdmin()
        );
    }

    public List<DonorResponse> searchDonors(SearchRequest request) {
        return donorRepository.findDonorsByBloodGroupAndCity(
            request.getBloodGroup(), 
            request.getCity()
        );
    }

    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAll().stream().map(donor -> new DonorResponse(
            donor.getId(),
            donor.getName(),
            donor.getBloodGroup(),
            donor.getCity(),
            donor.getPhoneNumber(),
            donor.getLastDonationDate(),
            donor.getProfilePhotoBase64()
        )).toList();
    }

    public void deleteDonor(Long id) {
        if (!donorRepository.existsById(id)) {
            throw new RuntimeException("Donor not found");
        }
        donorRepository.deleteById(id);
    }

    public void cleanCities() {
        List<Donor> donors = donorRepository.findAll();
        boolean changed = false;
        for (Donor d : donors) {
            String city = d.getCity().toLowerCase();
            if (city.equals("hyderbad")) {
                d.setCity("Hyderabad");
                changed = true;
            } else if (city.equals("banglore")) {
                d.setCity("Bangalore");
                changed = true;
            } else if (city.equals("chenai")) {
                d.setCity("Chennai");
                changed = true;
            }
            if (changed) {
                donorRepository.save(d);
                changed = false;
            }
        }
    }
}