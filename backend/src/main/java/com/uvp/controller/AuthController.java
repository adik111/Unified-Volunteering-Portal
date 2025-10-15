package com.uvp.controller;


import com.uvp.entity.OrganizationHome;
import com.uvp.entity.User;
import com.uvp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){
         boolean saved = service.register(user);
         if(saved){
             return  ResponseEntity.ok("Login Successfully");
         }else{
             return ResponseEntity.badRequest().body("User Already Exist");
         }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){
        try {
            return ResponseEntity.ok(service.login(user.getEmail(), user.getPassword()));
        }catch (Exception e) {
            return ResponseEntity.status(401).body("Email and password incorrect");
        }
    }

    @PostMapping("/orgregister")
    public ResponseEntity<?> orgRegister(@RequestBody OrganizationHome org){
        boolean saved = service.orgRegister(org);
        if(saved){
            return  ResponseEntity.ok("Login Successfully");
        }else{
            return ResponseEntity.badRequest().body("User Already Exist");
        }

    }



    @PostMapping("/orglogin")
    public ResponseEntity<?> orgLogin(@RequestBody OrganizationHome org){
        try {
            System.out.println(org.getEmail()+" "+org.getPassword());
            return ResponseEntity.ok(service.orglogin(org.getEmail(), org.getPassword()));
        }catch (Exception e) {
            System.out.println("Error Something");
            return ResponseEntity.status(401).body("Email and password incorrect");
        }
    }
}
