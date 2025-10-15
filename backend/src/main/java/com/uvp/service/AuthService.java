    package com.uvp.service;

    import com.uvp.entity.OrganizationHome;
    import com.uvp.entity.User;
    import com.uvp.repository.OrganizationHomeRepository;
    import com.uvp.repository.UserRepository;
    import com.uvp.utility.JwtUtil;
    import org.springframework.beans.factory.annotation.Autowired;

    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    import java.util.Map;

    @Service
    public class AuthService {

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private UserRepository userRepo;
        @Autowired
        private OrganizationHomeRepository organizationRepository;

        public boolean register(User user) {
            if (userRepo.existsByEmail(user.getEmail())) {
                return false;
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepo.save(user);
            return true;
        }

        public Map<String, Object> login(String email, String password) {
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found!"));

            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new RuntimeException("Invalid password!");
            }

            String token = JwtUtil.generateToken(user.getUserId());

            String role = user.getRole().name().toLowerCase();

            // Normalize role names


            return Map.of(
                    "token", token,
                    "role", role,
                    "message", "Login successful for " + role
            );
        }


        public Map<String, Object> orglogin(String email, String password) {
            OrganizationHome org = organizationRepository.findByEmail(email).orElseThrow();
            if (!passwordEncoder.matches(password,org.getPassword())) {
                throw new RuntimeException("Password is incorrect");
            }
            String token = JwtUtil.generateToken(org.getOrgId());
            return Map.of("token", token);
        }

        public boolean orgRegister(OrganizationHome org) {
            if (organizationRepository.existsByEmail(org.getEmail())) {
                return false; // Email already exists
            }
            org.setPassword(passwordEncoder.encode(org.getPassword())); // Encode password
            organizationRepository.save(org);
            return true;

        }
    }
