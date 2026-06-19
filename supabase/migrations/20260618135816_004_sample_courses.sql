-- Insert sample courses
INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.Sc. Computer Science', 'BSC-CS', 'ug', '3 Years', 3, id, '10+2 with Mathematics and Science', true, 1, 'A comprehensive undergraduate program covering programming, data structures, algorithms, and software development.', 60, 45000 FROM departments WHERE code = 'CS';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'M.Sc. Computer Science', 'MSC-CS', 'pg', '2 Years', 2, id, 'B.Sc. Computer Science or equivalent', true, 2, 'Advanced program in computer science with specialization options in AI, data science, and cybersecurity.', 30, 55000 FROM departments WHERE code = 'CS';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.Com', 'BCOM', 'ug', '3 Years', 3, id, '10+2 with Commerce or Mathematics', true, 3, 'Professional course in accounting, finance, taxation, and business management.', 120, 35000 FROM departments WHERE code = 'CO';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'MBA', 'MBA', 'pg', '2 Years', 2, id, 'Any Bachelor degree with valid score', true, 4, 'Master of Business Administration with specializations in Finance, Marketing, HR, and Operations.', 60, 75000 FROM departments WHERE code = 'MB';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.E. Electronics', 'BE-ECE', 'ug', '4 Years', 4, id, '10+2 with Physics and Mathematics', true, 5, 'Undergraduate engineering program in electronics and communication systems.', 45, 65000 FROM departments WHERE code = 'EC';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.E. Mechanical', 'BE-MECH', 'ug', '4 Years', 4, id, '10+2 with Physics and Mathematics', true, 6, 'Undergraduate program in mechanical engineering with focus on design and manufacturing.', 60, 65000 FROM departments WHERE code = 'ME';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.Sc. Mathematics', 'BSC-MATH', 'ug', '3 Years', 3, id, '10+2 with Mathematics', true, 7, 'Comprehensive program in pure and applied mathematics.', 50, 30000 FROM departments WHERE code = 'MA';

INSERT INTO courses (name, code, level, duration, duration_years, department_id, eligibility, is_active, sort_order, overview, seats, annual_fee) 
SELECT 'B.Sc. Physics', 'BSC-PHY', 'ug', '3 Years', 3, id, '10+2 with Physics', true, 8, 'Program covering classical mechanics, quantum physics, and electronics.', 40, 30000 FROM departments WHERE code = 'PH';