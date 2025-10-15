package com.uvp.service;

import com.uvp.entity.Certificate;
import com.uvp.entity.User;
import com.uvp.projection.ProofTaskProjection;
import com.uvp.repository.CertificateRepository;
import com.uvp.repository.UserRepository;
import com.uvp.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VolunteerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    public User getProfile(String token) {
        int userId = JwtUtil.extractUserId(token);
        return userRepository.findById(userId).orElse(null);
    }


    public Object userProfileUpdate(Integer userId,User user) {
        User existingUser=userRepository.findById(userId).orElseThrow();
        System.out.println(user);
        System.out.println(user.getEmail());

        existingUser.setName(user.getName());
        existingUser.setBio(user.getBio());
        existingUser.setPhone(user.getPhone());
        existingUser.setEmail(user.getEmail());
        existingUser.setLocation(user.getLocation());

        return userRepository.save(existingUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
