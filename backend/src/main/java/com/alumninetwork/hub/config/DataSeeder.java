package com.alumninetwork.hub.config;

import com.alumninetwork.hub.entity.*;
import com.alumninetwork.hub.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final EventRepository eventRepository;
    private final DonationCampaignRepository campaignRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }

        log.info("Seeding database with initial data...");
        seedUsers();
        seedJobsAndEvents();
        seedDonationCampaigns();
        log.info("Database seeding complete.");
    }

    private void seedUsers() {
        String adminPass = passwordEncoder.encode("Admin@123");
        String alumniPass = passwordEncoder.encode("Alumni@123");
        String studentPass = passwordEncoder.encode("Student@123");

        // Admin
        userRepository.save(User.builder()
                .fullName("Admin User").email("admin@alumni.com")
                .password(adminPass).role(Role.ADMIN)
                .department("Administration").bio("Platform Administrator")
                .isApproved(true).build());

        // Alumni
        String[][] alumni = {
                {"Priya Sharma", "priya.sharma@example.com", "Computer Science", "2018", "Google", "Software Engineer"},
                {"Rahul Gupta", "rahul.gupta@example.com", "Electronics", "2017", "Microsoft", "Product Manager"},
                {"Anjali Singh", "anjali.singh@example.com", "Mechanical", "2019", "Tesla", "Mechanical Engineer"},
                {"Vikram Patel", "vikram.patel@example.com", "Computer Science", "2016", "Amazon", "Senior SDE"},
                {"Neha Verma", "neha.verma@example.com", "MBA", "2020", "McKinsey", "Business Analyst"},
                {"Arjun Mehta", "arjun.mehta@example.com", "Computer Science", "2015", "Meta", "ML Engineer"},
                {"Kavya Reddy", "kavya.reddy@example.com", "Design", "2021", "Figma", "UX Designer"},
                {"Suresh Kumar", "suresh.kumar@example.com", "Civil", "2014", "L&T", "Project Manager"},
                {"Pooja Joshi", "pooja.joshi@example.com", "Computer Science", "2022", "Startupland", "Full Stack Developer"},
                {"Kiran Nair", "kiran.nair@example.com", "Finance", "2018", "Goldman Sachs", "Investment Analyst"},
                {"Aditya Bansal", "aditya.bansal@example.com", "Computer Science", "2017", "Flipkart", "Data Scientist"},
                {"Sneha Pillai", "sneha.pillai@example.com", "Biotechnology", "2019", "Biocon", "Research Scientist"},
                {"Rohan Mishra", "rohan.mishra@example.com", "Electronics", "2016", "Qualcomm", "Chip Designer"},
                {"Meera Iyer", "meera.iyer@example.com", "MBA", "2020", "BCG", "Management Consultant"},
                {"Tarun Khanna", "tarun.khanna@example.com", "Computer Science", "2021", "Adobe", "Frontend Engineer"},
                {"Divya Menon", "divya.menon@example.com", "Architecture", "2018", "Zaha Hadid", "Architect"},
                {"Saurabh Rao", "saurabh.rao@example.com", "Computer Science", "2015", "Stripe", "Backend Engineer"},
                {"Ananya Das", "ananya.das@example.com", "Chemistry", "2020", "BASF", "Chemical Engineer"},
                {"Harsh Agarwal", "harsh.agarwal@example.com", "Computer Science", "2019", "Atlassian", "DevOps Engineer"},
                {"Riya Choudhury", "riya.choudhury@example.com", "Psychology", "2021", "Mindful Corp", "UX Researcher"}
        };

        for (String[] a : alumni) {
            userRepository.save(User.builder()
                    .fullName(a[0]).email(a[1]).password(alumniPass).role(Role.ALUMNI)
                    .department(a[2]).graduationYear(Integer.parseInt(a[3]))
                    .company(a[4]).jobTitle(a[5])
                    .availableForMentorship(true).isApproved(true)
                    .skills(Set.of("Java", "Python", "Leadership")).build());
        }

        // Students
        String[][] students = {
                {"Aarav Sharma", "aarav.sharma@student.com", "Computer Science", "2025"},
                {"Ishaan Patel", "ishaan.patel@student.com", "Electronics", "2025"},
                {"Nisha Gupta", "nisha.gupta@student.com", "MBA", "2024"},
                {"Yash Verma", "yash.verma@student.com", "Computer Science", "2026"},
                {"Tanvi Singh", "tanvi.singh@student.com", "Design", "2025"},
                {"Krish Mehta", "krish.mehta@student.com", "Mechanical", "2025"},
                {"Anika Nair", "anika.nair@student.com", "Biotechnology", "2024"},
                {"Dev Reddy", "dev.reddy@student.com", "Computer Science", "2025"},
                {"Prachi Joshi", "prachi.joshi@student.com", "Finance", "2026"},
                {"Aryan Kumar", "aryan.kumar@student.com", "Computer Science", "2025"},
                {"Sanya Iyer", "sanya.iyer@student.com", "Electronics", "2024"},
                {"Rohit Bansal", "rohit.bansal@student.com", "Civil", "2025"},
                {"Mia Das", "mia.das@student.com", "Psychology", "2026"},
                {"Kabir Rao", "kabir.rao@student.com", "Chemistry", "2025"},
                {"Zara Agarwal", "zara.agarwal@student.com", "Architecture", "2024"},
                {"Om Choudhury", "om.choudhury@student.com", "Computer Science", "2025"},
                {"Sia Pillai", "sia.pillai@student.com", "Biotechnology", "2026"},
                {"Neil Khanna", "neil.khanna@student.com", "MBA", "2025"},
                {"Pari Menon", "pari.menon@student.com", "Design", "2024"},
                {"Samar Mishra", "samar.mishra@student.com", "Electronics", "2025"}
        };

        for (String[] s : students) {
            userRepository.save(User.builder()
                    .fullName(s[0]).email(s[1]).password(studentPass).role(Role.STUDENT)
                    .department(s[2]).graduationYear(Integer.parseInt(s[3]))
                    .isApproved(true).build());
        }
    }

    private void seedJobsAndEvents() {
        User poster = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        if (poster == null) return;

        String[][] jobs = {
                {"Software Engineer", "Google", "Bangalore, India", "Design and build scalable backend systems.", "FULL_TIME"},
                {"Product Manager", "Microsoft", "Hyderabad, India", "Lead product vision and roadmap.", "FULL_TIME"},
                {"Data Scientist", "Flipkart", "Bangalore, India", "Analyze large datasets and build ML models.", "FULL_TIME"},
                {"UX Designer", "Adobe", "Noida, India", "Create beautiful user experiences.", "FULL_TIME"},
                {"DevOps Engineer", "Atlassian", "Remote", "Manage CI/CD pipelines and cloud infrastructure.", "REMOTE"},
                {"Frontend Developer", "Startupland", "Pune, India", "Build React-based web applications.", "FULL_TIME"},
                {"Machine Learning Engineer", "Meta", "Bangalore, India", "Work on AI and recommendation systems.", "FULL_TIME"},
                {"Business Analyst", "McKinsey", "Mumbai, India", "Drive business strategy and data analysis.", "FULL_TIME"},
                {"Mobile Developer", "Paytm", "Noida, India", "Develop iOS and Android apps.", "FULL_TIME"},
                {"Cloud Architect", "Amazon", "Hyderabad, India", "Design AWS cloud solutions.", "FULL_TIME"},
                {"Security Engineer", "Qualcomm", "Bangalore, India", "Implement security protocols and pen testing.", "FULL_TIME"},
                {"Research Scientist", "Biocon", "Bangalore, India", "Conduct pharmaceutical research.", "FULL_TIME"},
                {"Investment Analyst", "Goldman Sachs", "Mumbai, India", "Financial modeling and market analysis.", "FULL_TIME"},
                {"Embedded Engineer", "Tesla", "Remote", "Work on embedded automotive systems.", "REMOTE"},
                {"HR Manager", "Infosys", "Bangalore, India", "Talent acquisition and employee engagement.", "FULL_TIME"}
        };

        for (String[] j : jobs) {
            try {
                JobType type = JobType.valueOf(j[4]);
                jobRepository.save(Job.builder()
                        .title(j[0]).company(j[1]).location(j[2])
                        .description(j[3]).jobType(type).postedBy(poster)
                        .salaryMin(new BigDecimal("800000")).salaryMax(new BigDecimal("2500000"))
                        .requiredSkills(Set.of("Java", "Python", "Communication"))
                        .deadline(LocalDateTime.now().plusDays(30)).build());
            } catch (Exception e) {
                log.warn("Skipping job seed: {}", e.getMessage());
            }
        }

        // Events
        User organizer = userRepository.findByEmail("admin@alumni.com").orElse(poster);
        String[][] events = {
                {"Annual Alumni Reunion 2025", "Come reconnect with old classmates and professors!", "Campus Main Hall", "REUNION"},
                {"Tech Talk: Future of AI", "Industry leaders discuss AI trends and career paths.", "Virtual", "WEBINAR"},
                {"Career Fair 2025", "Meet recruiters from top companies. Bring your resume!", "Campus Convention Center", "CAREER_FAIR"},
                {"Entrepreneurship Summit", "Alumni entrepreneurs share their startup journeys.", "Innovation Hub", "CONFERENCE"},
                {"Mentorship Kickoff Event", "Match students with alumni mentors for the semester.", "Library Auditorium", "NETWORKING"}
        };

        for (String[] e : events) {
            try {
                EventType eventType = EventType.valueOf(e[3]);
                eventRepository.save(Event.builder()
                        .title(e[0]).description(e[1]).location(e[2])
                        .eventType(eventType).organizer(organizer)
                        .startDate(LocalDateTime.now().plusDays(15))
                        .endDate(LocalDateTime.now().plusDays(15).plusHours(4))
                        .maxAttendees(200).published(true).build());
            } catch (Exception ex) {
                log.warn("Skipping event seed: {}", ex.getMessage());
            }
        }
    }

    private void seedDonationCampaigns() {
        User admin = userRepository.findByEmail("admin@alumni.com").orElse(null);
        if (admin == null) return;

        String[][] campaigns = {
                {"Campus Library Renovation Fund", "Help us modernize our campus library with digital resources and comfortable study spaces.", "500000"},
                {"Scholarship Fund for Meritorious Students", "Support bright students who need financial assistance to pursue their dreams.", "1000000"},
                {"Sports Infrastructure Development", "Build world-class sports facilities for current students.", "750000"}
        };

        for (String[] c : campaigns) {
            campaignRepository.save(DonationCampaign.builder()
                    .title(c[0]).description(c[1])
                    .goalAmount(new BigDecimal(c[2]))
                    .raisedAmount(new BigDecimal(c[2]).multiply(new BigDecimal("0.35")))
                    .createdBy(admin).active(true)
                    .endDate(LocalDateTime.now().plusMonths(3)).build());
        }
    }
}
