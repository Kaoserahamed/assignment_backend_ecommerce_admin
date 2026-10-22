# assignment_backend_ecommerce_admin Authentication Module

## Overview
Authentication system for admin/staff/vendor roles with OAuth2, JWT, and MFA.

## Files
- `services/product/auth.py` - Authentication logic
- `services/product/models.py` - User and role models
- `services/product/middleware.py` - Auth middleware and RBAC
- `services/product/routes/auth.py` - Auth API routes
- `services/product/mfa.py` - Multi-factor authentication

## Features
- Admin, staff, and vendor account registration/login
- JWT-based session management
- OAuth2 provider integration
- Role-Based Access Control (RBAC)
- Multi-factor authentication (MFA)
- Password hashing with bcrypt
- Session timeout handling

## Tech Stack
- Node.js/NestJS
- PostgreSQL
- JWT
- OAuth2
- bcrypt for password hashing

## Day 5 Outcome
Authentication module implemented. 1 PR created targeting development.