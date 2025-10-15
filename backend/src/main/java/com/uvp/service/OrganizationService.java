package com.uvp.service;

import com.uvp.entity.OrganizationHome;
import com.uvp.repository.OrganizationHomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationService {

    @Autowired
     private OrganizationHomeRepository organization;

    public OrganizationHome getOrganizations(Integer orgId) {
        return organization.findById(orgId).orElse(null);
    }

    public List<OrganizationHome> getOrganizationsByType(String type) {
        if (type == null || type.equalsIgnoreCase("all")) {
            return organization.findAll();
        }
        return organization.findByType(type);
    }

    public OrganizationHome getOrganizationById(Integer orgId) {
        return organization.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
    }
}
