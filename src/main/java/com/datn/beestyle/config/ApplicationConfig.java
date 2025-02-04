package com.datn.beestyle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

@Configuration
public class ApplicationConfig {

    @Bean
    public AuditorAware<?> auditorAware() {
        return new AuditAwareImpl<>();
    }

}
