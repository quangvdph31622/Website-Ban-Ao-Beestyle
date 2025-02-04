package com.datn.beestyle.config;

import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class AuditAwareImpl<T> implements AuditorAware<T> {

    @Override
    public Optional<T> getCurrentAuditor() {
//        return Optional.ofNullable(SecurityContextHolder.getContext())
//                .map(SecurityContext::getAuthentication)
//                .filter(Authentication::isAuthenticated)
//                .map(Authentication::getPrincipal)
//                .map(User.class::cast);
        return (Optional<T>) Optional.ofNullable(Integer.valueOf(1));
    }
}
