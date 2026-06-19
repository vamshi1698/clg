-- Reset the bootstrap admin password to a known bcrypt hash of "ChangeMe@123".
-- (Password the user should change after first login.)
UPDATE auth_users
SET password_hash = '$2b$10$uVb1H/S2CXkPbEv//AskCOwGFoLsvBoI1tTJ7vpbnDSTuUzCahUt2',
    email_verified = true,
    is_active = true,
    updated_at = now()
WHERE email = 'admin@nationalcollege.edu.in';
