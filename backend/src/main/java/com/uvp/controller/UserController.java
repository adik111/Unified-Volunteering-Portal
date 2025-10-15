package com.uvp.controller;


import com.uvp.entity.User;
import com.uvp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping("/")
    public String Greeting(){
        return "Hello World";
    }

    @GetMapping("/details")
    public List<User> getUsers(){
        return service.getUserDetails();
    }

}
