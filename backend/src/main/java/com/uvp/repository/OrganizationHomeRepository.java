package com.uvp.repository;

import com.uvp.entity.OrganizationHome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationHomeRepository extends JpaRepository<OrganizationHome, Integer> {
    Optional<OrganizationHome> findByEmail(String email);
    boolean existsByEmail(String email);

    List<OrganizationHome> findByType(String type);
}


