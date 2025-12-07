package com.bloodbank.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bloodbank.dto.DonorResponse;
import com.bloodbank.model.Donor;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    Optional<Donor> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT new com.bloodbank.dto.DonorResponse(d.name, d.bloodGroup, d.city, d.phoneNumber, d.lastDonationDate) " +
           "FROM Donor d WHERE " +
           "(:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup) AND " +
           "(:city IS NULL OR LOWER(d.city) LIKE LOWER(CONCAT('%', :city, '%')))")
    List<DonorResponse> findDonorsByBloodGroupAndCity(@Param("bloodGroup") String bloodGroup, 
                                                     @Param("city") String city);
}