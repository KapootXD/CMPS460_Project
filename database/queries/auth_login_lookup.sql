-- Login: customer lookup by email (used by POST /api/auth/login in backend)
--
-- Passwords are stored as bcrypt hashes in customers.password_hash.
-- Verification MUST happen in application code (e.g. bcrypt.compare), not in SQL,
-- because bcrypt uses a random salt per hash—you cannot pre-hash the login password
-- and compare with WHERE password_hash = ...
--
-- Application binds: $1 = normalized email (trim + lower case)

SELECT customer_id,
       full_name,
       email,
       phone,
       created_at,
       password_hash
FROM customers
WHERE email = $1
  AND is_active = TRUE
LIMIT 1;
