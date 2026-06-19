INSERT INTO admin_users (email, password_hash, role, name)
VALUES ('admin@nationalcollege.edu.in', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'super_admin', 'Administrator')
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    updated_at = now();
