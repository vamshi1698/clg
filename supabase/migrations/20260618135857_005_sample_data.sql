-- Insert sample faculty
INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Dr. Rajesh Kumar', id, 'Professor & Head', 'Ph.D. (Computer Science)', 25, true, 1, 'Artificial Intelligence', 'rajesh.kumar@nationalcollege.edu.in' FROM departments WHERE code = 'CS';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email, is_hod) 
SELECT 'Dr. Priya Sharma', id, 'Professor', 'Ph.D. (Electronics)', 20, true, 2, 'VLSI Design', 'priya.sharma@nationalcollege.edu.in', true FROM departments WHERE code = 'EC';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email, is_hod) 
SELECT 'Dr. Amit Verma', id, 'Professor', 'Ph.D. (Mechanical Engineering)', 22, true, 3, 'Manufacturing Systems', 'amit.verma@nationalcollege.edu.in', true FROM departments WHERE code = 'ME';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Prof. Suresh Rao', id, 'Associate Professor', 'M.Sc., M.Phil (Mathematics)', 18, true, 4, 'Applied Mathematics', 'suresh.rao@nationalcollege.edu.in' FROM departments WHERE code = 'MA';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Dr. Meena Iyer', id, 'Professor', 'Ph.D. (Physics)', 15, true, 5, 'Quantum Physics', 'meena.iyer@nationalcollege.edu.in' FROM departments WHERE code = 'PH';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Dr. Ramesh Gupta', id, 'Professor', 'Ph.D. (Chemistry)', 17, true, 6, 'Organic Chemistry', 'ramesh.gupta@nationalcollege.edu.in' FROM departments WHERE code = 'CH';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Prof. Kamala Devi', id, 'Professor', 'M.Com, Ph.D.', 20, true, 7, 'Financial Accounting', 'kamala.devi@nationalcollege.edu.in' FROM departments WHERE code = 'CO';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Dr. Vikram Singh', id, 'Professor', 'Ph.D. (Management)', 22, true, 8, 'Strategic Management', 'vikram.singh@nationalcollege.edu.in' FROM departments WHERE code = 'MB';

INSERT INTO faculty (name, department_id, designation, qualification, experience_years, is_active, sort_order, specialization, email) 
SELECT 'Prof. Elizabeth Thomas', id, 'Professor', 'M.A., Ph.D. (English)', 30, true, 9, 'English Literature', 'elizabeth.thomas@nationalcollege.edu.in' FROM departments WHERE code = 'EN';

-- Insert sample news
INSERT INTO news (title, slug, excerpt, content, category, is_featured, is_active, published_at, author) VALUES
('Annual Convocation 2024', 'annual-convocation-2024', 'The college celebrated its 58th Annual Convocation with distinguished guests and meritorious students.', 'The Annual Convocation ceremony was held on March 15, 2024, with over 500 students receiving their degrees. Dr. K. Radhakrishnan, former ISRO Chairman, was the chief guest.', 'academic', true, true, NOW(), 'Admin'),
('Placement Drive Success', 'placement-drive-success-2024', 'Record-breaking placement season with 95% students placed in top companies.', 'The 2024 placement season has been exceptional with companies like Infosys, TCS, Wipro, and Amazon recruiting over 400 students with packages ranging from 4 LPA to 25 LPA.', 'placement', true, true, NOW() - INTERVAL '5 days', 'Placement Cell'),
('NACC Accreditation A++ Grade', 'naac-accreditation-a-plus', 'National College Jayanagar awarded A++ grade by NAAC for academic excellence.', 'The National Assessment and Accreditation Council has awarded A++ grade to National College Jayanagar, recognizing our commitment to quality education and infrastructure.', 'academic', true, true, NOW() - INTERVAL '10 days', 'Admin'),
('Inter-College Sports Championship', 'sports-championship-2024', 'Our college won the inter-college sports championship for the third consecutive year.', 'The sports team brought home the championship trophy, winning gold medals in basketball, athletics, and swimming.', 'events', false, true, NOW() - INTERVAL '15 days', 'Sports Committee');

-- Insert sample events
INSERT INTO events (title, slug, description, venue, event_date, event_time, end_date, end_time, category, is_featured, is_upcoming, is_active) VALUES
('Annual Science Exhibition', 'science-exhibition-2024', 'Annual science exhibition showcasing innovative student projects and research work.', 'Main Auditorium', '2024-04-15', '10:00 AM', '2024-04-17', '5:00 PM', 'academic', true, true, true),
('Alumni Meet 2024', 'alumni-meet-2024', 'Annual gathering of alumni from all batches for networking and reminiscence.', 'College Campus', '2024-05-20', '6:00 PM', NULL, '10:00 PM', 'general', true, true, true),
('Industry Connect Seminar', 'industry-connect-2024', 'Seminar connecting students with industry leaders for career guidance.', 'Seminar Hall A', '2024-04-05', '2:00 PM', NULL, '6:00 PM', 'academic', false, true, true);

-- Insert recruiters
INSERT INTO recruiters (name, industry, is_featured, is_active, sort_order) VALUES
('Infosys', 'IT Services', true, true, 1),
('TCS', 'IT Services', true, true, 2),
('Wipro', 'IT Services', true, true, 3),
('Amazon', 'E-commerce', true, true, 4),
('Deloitte', 'Consulting', true, true, 5),
('KPMG', 'Consulting', true, true, 6),
('HDFC Bank', 'Banking', false, true, 7),
('ICICI Bank', 'Banking', false, true, 8),
('Accenture', 'Consulting', false, true, 9),
('Cognizant', 'IT Services', false, true, 10);

-- Insert testimonials
INSERT INTO testimonials (name, designation, company, batch_year, content, rating, is_featured, is_active, sort_order) VALUES
('Arjun Patel', 'Senior Software Engineer', 'Google', 2018, 'National College provided me with an excellent foundation in computer science. The faculty and infrastructure are world-class.', 5, true, true, 1),
('Sneha Reddy', 'Product Manager', 'Amazon', 2016, 'The practical exposure and industry connections at National College helped shape my career in product management.', 5, true, true, 2),
('Rahul Kumar', 'Data Scientist', 'Microsoft', 2019, 'The research-oriented approach at the college helped me develop analytical skills crucial for my career.', 4, true, true, 3),
('Priya Nair', 'Chartered Accountant', 'Deloitte', 2015, 'The commerce program gave me strong fundamentals and practical knowledge that helped me clear CA exams.', 5, false, true, 4);

-- Insert milestones
INSERT INTO milestones (year, title, description, is_active, sort_order) VALUES
(1965, 'Foundation', 'National College Jayanagar was established with a vision to provide quality education.', true, 1),
(1975, 'First Expansion', 'New science and commerce blocks were inaugurated.', true, 2),
(1985, 'Professional Courses', 'Introduced professional courses in Management and Computer Applications.', true, 3),
(1995, 'Autonomous Status', 'College attained autonomous status and introduced industry-relevant curriculum.', true, 4),
(2005, 'NAAC Accreditation', 'Received A grade from NAAC for the first time.', true, 5),
(2015, 'Golden Jubilee', 'Celebrated 50 years of excellence with over 50,000 alumni.', true, 6),
(2020, 'Digital Campus', 'Complete digital transformation with smart classrooms and online learning.', true, 7),
(2024, 'NAAC A++', 'Awarded A++ grade by NAAC, a testament to our commitment to excellence.', true, 8);

-- Insert accreditations
INSERT INTO accreditations (name, issuing_body, grade, valid_from, valid_until, is_active, sort_order) VALUES
('NAAC Accreditation', 'National Assessment and Accreditation Council', 'A++', '2024-01-01', '2029-12-31', true, 1),
('NBA Accreditation', 'National Board of Accreditation', 'Accredited', '2023-06-01', '2026-05-31', true, 2),
('ISO 9001:2015', 'International Organization for Standardization', 'Certified', '2022-01-01', '2025-12-31', true, 3);

-- Insert leadership
INSERT INTO leadership (name, designation, qualification, is_active, sort_order) VALUES
('Dr. K. Srinivas', 'Principal', 'Ph.D., M.Sc.', true, 1),
('Prof. M. Lalitha', 'Vice Principal (Academics)', 'M.Phil, M.Sc.', true, 2),
('Dr. R. Chandrashekar', 'Vice Principal (Administration)', 'Ph.D., MBA', true, 3),
('Prof. N. Venkatesh', 'Dean, Student Affairs', 'M.A., B.Ed', true, 4),
('Dr. S. Gowri', 'Controller of Examinations', 'Ph.D., M.Com', true, 5);

-- Insert gallery items
INSERT INTO gallery (title, description, category, image_url, is_active, sort_order) VALUES
('Academic Block', 'Main academic building with modern facilities', 'campus', 'https://images.pexels.com/photos/256687/pexels-photo-256687.jpeg', true, 1),
('Library', 'State-of-the-art library with digital resources', 'facilities', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', true, 2),
('Computer Lab', 'Modern computer laboratory with latest equipment', 'facilities', 'https://images.pexels.com/photos/211117/subway-station-books-cyber-cafe-211117.jpeg', true, 3),
('Sports Ground', 'Multi-sport playground with athletic facilities', 'sports', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg', true, 4),
('Convocation Hall', 'Main auditorium for convocation and events', 'campus', 'https://images.pexels.com/photos/260685/pexels-photo-260685.jpeg', true, 5);

-- Insert achievements
INSERT INTO achievements (title, description, year, category, is_active, sort_order) VALUES
('Best College Award', 'Received Best College Award from State Government for academic excellence', 2024, 'academic', true, 1),
('100% Placement', 'Achieved 100% placement for Computer Science department', 2024, 'placement', true, 2),
('Research Excellence', 'Faculty published 150+ research papers in indexed journals', 2023, 'research', true, 3),
('Sports Championship', 'Won inter-collegiate sports championship for 3rd consecutive year', 2024, 'sports', true, 4);