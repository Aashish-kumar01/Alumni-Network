-- =============================================
-- Alumni Hub Data Seeder (runs at startup)
-- =============================================

-- Admin user (password: Admin@123)
INSERT INTO users (full_name, email, password, role, department, graduation_year, company, job_title, bio, enabled, is_approved, available_for_mentorship)
VALUES ('Admin User', 'admin@alumni.com',
        '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji',
        'ADMIN', 'Administration', 2015, 'Alumni Network HQ', 'Platform Admin',
        'Managing the Alumni Networking Hub platform.', true, true, false)
ON CONFLICT (email) DO NOTHING;

-- Alumni users (password: Alumni@123)
INSERT INTO users (full_name, email, password, role, department, graduation_year, company, job_title, bio, enabled, is_approved, available_for_mentorship) VALUES
('Priya Sharma',     'priya.sharma@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2018, 'Google',          'Software Engineer',      'Passionate about building scalable systems.', true, true, true),
('Rahul Gupta',      'rahul.gupta@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Electronics',      2017, 'Microsoft',       'Product Manager',        'Building products that matter.', true, true, true),
('Anjali Singh',     'anjali.singh@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Mechanical',       2019, 'Tesla',           'Mechanical Engineer',    'Electric vehicles enthusiast.', true, true, false),
('Vikram Patel',     'vikram.patel@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2016, 'Amazon',          'Senior SDE',             'Cloud architecture and distributed systems.', true, true, true),
('Neha Verma',       'neha.verma@example.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'MBA',              2020, 'McKinsey',        'Business Analyst',       'Strategy consulting and data analytics.', true, true, true),
('Arjun Mehta',      'arjun.mehta@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2015, 'Meta',            'ML Engineer',            'Machine learning and AI at scale.', true, true, true),
('Kavya Reddy',      'kavya.reddy@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Design',           2021, 'Figma',           'UX Designer',            'Human-centered design advocate.', true, true, false),
('Suresh Kumar',     'suresh.kumar@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Civil',            2014, 'L&T',             'Project Manager',        'Infrastructure and construction management.', true, true, false),
('Pooja Joshi',      'pooja.joshi@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2022, 'Startupland',     'Full Stack Developer',   'Building full stack web applications.', true, true, true),
('Kiran Nair',       'kiran.nair@example.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Finance',          2018, 'Goldman Sachs',   'Investment Analyst',     'Financial markets and quantitative analysis.', true, true, true),
('Aditya Bansal',    'aditya.bansal@example.com',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2017, 'Flipkart',        'Data Scientist',         'Data science and machine learning.', true, true, true),
('Sneha Pillai',     'sneha.pillai@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Biotechnology',    2019, 'Biocon',          'Research Scientist',     'Biotechnology and pharmaceutical research.', true, true, false),
('Rohan Mishra',     'rohan.mishra@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Electronics',      2016, 'Qualcomm',        'Chip Designer',          'VLSI and embedded systems expert.', true, true, true),
('Meera Iyer',       'meera.iyer@example.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'MBA',              2020, 'BCG',             'Management Consultant',  'Strategy and organizational transformation.', true, true, true),
('Tarun Khanna',     'tarun.khanna@example.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2021, 'Adobe',           'Frontend Engineer',      'React and design systems enthusiast.', true, true, true),
('Divya Menon',      'divya.menon@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Architecture',     2018, 'Zaha Hadid',      'Architect',              'Sustainable and parametric design.', true, true, false),
('Saurabh Rao',      'saurabh.rao@example.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2015, 'Stripe',          'Backend Engineer',       'Payments infrastructure and distributed systems.', true, true, true),
('Ananya Das',       'ananya.das@example.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Chemistry',        2020, 'BASF',            'Chemical Engineer',      'Green chemistry and sustainable processes.', true, true, false),
('Harsh Agarwal',    'harsh.agarwal@example.com',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Computer Science', 2019, 'Atlassian',       'DevOps Engineer',        'CI/CD, Kubernetes, cloud native development.', true, true, true),
('Riya Choudhury',   'riya.choudhury@example.com',   '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'ALUMNI', 'Psychology',       2021, 'Mindful Corp',    'UX Researcher',          'Human behavior and cognitive psychology in UX.', true, true, true)
ON CONFLICT (email) DO NOTHING;

-- Student users (password: Student@123)
INSERT INTO users (full_name, email, password, role, department, graduation_year, enabled, is_approved, available_for_mentorship) VALUES
('Aarav Sharma',     'aarav.sharma@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Computer Science', 2025, true, true, false),
('Ishaan Patel',     'ishaan.patel@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Electronics',      2025, true, true, false),
('Nisha Gupta',      'nisha.gupta@student.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'MBA',              2024, true, true, false),
('Yash Verma',       'yash.verma@student.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Computer Science', 2026, true, true, false),
('Tanvi Singh',      'tanvi.singh@student.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Design',           2025, true, true, false),
('Krish Mehta',      'krish.mehta@student.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Mechanical',       2025, true, true, false),
('Anika Nair',       'anika.nair@student.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Biotechnology',    2024, true, true, false),
('Dev Reddy',        'dev.reddy@student.com',        '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Computer Science', 2025, true, true, false),
('Prachi Joshi',     'prachi.joshi@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Finance',          2026, true, true, false),
('Aryan Kumar',      'aryan.kumar@student.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Computer Science', 2025, true, true, false),
('Sanya Iyer',       'sanya.iyer@student.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Electronics',      2024, true, true, false),
('Rohit Bansal',     'rohit.bansal@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Civil',            2025, true, true, false),
('Mia Das',          'mia.das@student.com',          '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Psychology',       2026, true, true, false),
('Kabir Rao',        'kabir.rao@student.com',        '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Chemistry',        2025, true, true, false),
('Zara Agarwal',     'zara.agarwal@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Architecture',     2024, true, true, false),
('Om Choudhury',     'om.choudhury@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Computer Science', 2025, true, true, false),
('Sia Pillai',       'sia.pillai@student.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Biotechnology',    2026, true, true, false),
('Neil Khanna',      'neil.khanna@student.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'MBA',              2025, true, true, false),
('Pari Menon',       'pari.menon@student.com',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Design',           2024, true, true, false),
('Samar Mishra',     'samar.mishra@student.com',     '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKe/rO/3PEnRmBBKrHdTLdqxZ3ji', 'STUDENT', 'Electronics',      2025, true, true, false)
ON CONFLICT (email) DO NOTHING;
