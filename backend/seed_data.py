import os
import django
import sys
from datetime import date, timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User, PasswordResetToken
from colleges.models import College
from students.models import StudentProfile
from companies.models import Company
from drives.models import Drive, Application, Round, RoundResult
from placements.models import PlacementRecord
from notifications.models import Notification

def seed():
    print("[*] Starting database seeding...")

    # Clear existing data
    PlacementRecord.objects.all().delete()
    RoundResult.objects.all().delete()
    Round.objects.all().delete()
    Application.objects.all().delete()
    Drive.objects.all().delete()
    Company.objects.all().delete()
    StudentProfile.objects.all().delete()
    Notification.objects.all().delete()
    PasswordResetToken.objects.all().delete()
    User.objects.all().delete()
    College.objects.all().delete()

    # 1. Colleges
    c1 = College.objects.create(
        name="Apex Institute of Technology & Science",
        code="AITS-2026",
        affiliation_number="AICTE/SOUTH-WEST/1-931829101",
        address="Knowledge Corridor, Silicon Valley Expressway",
        city="Bengaluru",
        state="Karnataka",
        contact_email="tpo@apextech.edu",
        contact_phone="+91-9876543210",
        website="https://apextech.edu",
        verification_document="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_name="AITS_AICTE_Accreditation_Certificate_2026.pdf",
        status="approved",
        approved_at=timezone.now()
    )

    c2 = College.objects.create(
        name="National Institute of Engineering & Management",
        code="NIEM-104",
        affiliation_number="UGC-NAAC-A++-2025/441",
        address="University Road, Tech Hub",
        city="Hyderabad",
        state="Telangana",
        contact_email="placements@niem.edu",
        contact_phone="+91-9876543211",
        website="https://niem.edu",
        verification_document="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_name="NIEM_UGC_Approval_Letter.pdf",
        status="approved",
        approved_at=timezone.now()
    )

    c3 = College.objects.create(
        name="Metropolitan College of Engineering",
        code="MCE-77",
        affiliation_number="AICTE/WEST/2026/088",
        address="Sector 18, Institutional Area",
        city="Pune",
        state="Maharashtra",
        contact_email="admin@mcepune.edu",
        contact_phone="+91-9876543212",
        website="https://mcepune.edu",
        verification_document="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        document_name="MCE_Govt_Recognition_and_AICTE_Approval.pdf",
        status="pending"
    )

    print("[+] Created colleges")

    # 2. Users with explicit passwords
    # Super Admin
    super_admin = User.objects.create_user(
        email='admin@gmail.com',
        phone='+91-9000000001',
        full_name='System Administrator (Master Admin)',
        role='superadmin',
        password='admin@123',
        is_staff=True,
        is_superuser=True
    )

    # TPO for College 1
    tpo_user = User.objects.create_user(
        email='tpo.apex@gmail.com',
        phone='+91-9000000002',
        full_name='Prof. Ramesh Sharma (Training & Placement Officer)',
        role='tpo',
        college=c1,
        password='tpo123'
    )

    # TPO for College 2
    tpo_user2 = User.objects.create_user(
        email='tpo.niem@gmail.com',
        phone='+91-9000000005',
        full_name='Dr. Priya Nair (Dean of Corporate Relations)',
        role='tpo',
        college=c2,
        password='tpo123'
    )

    # Company Recruiters
    recruiter_google = User.objects.create_user(
        email='recruiter@google.com',
        phone='+91-9000000003',
        full_name='Marcus Wright (Google University Talent Lead)',
        role='company',
        college=c1,
        password='recruiter123'
    )

    recruiter_msft = User.objects.create_user(
        email='recruiter@microsoft.com',
        phone='+91-9000000006',
        full_name='Samantha Lee (Microsoft Campus Relations)',
        role='company',
        college=c1,
        password='recruiter123'
    )

    # 3. Companies
    comp_google = Company.objects.create(
        user=recruiter_google,
        college=c1,
        name="Google Cloud & Platforms",
        website="https://careers.google.com",
        industry="Cloud & Artificial Intelligence",
        description="Global pioneer in scalable distributed computing, machine learning, and developer platforms.",
        location="Bengaluru / Hyderabad",
        logo_url="https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
        hr_contact_name="Marcus Wright",
        hr_contact_email="recruiter@google.com",
        hr_contact_phone="+91-9000000003",
        verified_status="verified"
    )

    comp_msft = Company.objects.create(
        user=recruiter_msft,
        college=c1,
        name="Microsoft Corporation",
        website="https://careers.microsoft.com",
        industry="Software Products & Enterprise Services",
        description="Empowering every person and organization on the planet to achieve more through software innovation.",
        location="Hyderabad / Bengaluru / Noida",
        logo_url="https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=150&auto=format&fit=crop&q=80",
        hr_contact_name="Samantha Lee",
        hr_contact_email="recruiter@microsoft.com",
        hr_contact_phone="+91-9000000006",
        verified_status="verified"
    )

    comp_amazon = Company.objects.create(
        college=c1,
        name="Amazon Web Services (AWS)",
        website="https://amazon.jobs",
        industry="E-Commerce & Cloud Infrastructure",
        description="World leading e-commerce and cloud services infrastructure.",
        location="Bengaluru / Chennai",
        logo_url="https://images.unsplash.com/photo-1523474255658-4af61b1c5d56?w=150&auto=format&fit=crop&q=80",
        hr_contact_name="Vikram Seth",
        hr_contact_email="vikram@amazon.com",
        hr_contact_phone="+91-9000000010",
        verified_status="verified"
    )

    comp_tcs = Company.objects.create(
        college=c1,
        name="Tata Consultancy Services (Digital)",
        website="https://tcs.com",
        industry="IT Consulting & Digital Transformation",
        description="Global IT services and digital solutions consulting powerhouse.",
        location="Pan India",
        logo_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
        hr_contact_name="Ananya Roy",
        hr_contact_email="ananya.roy@tcs.com",
        hr_contact_phone="+91-9000000011",
        verified_status="verified"
    )

    comp_startup = Company.objects.create(
        college=c1,
        name="NexScale AI Labs",
        website="https://nexscale.ai",
        industry="Generative AI & LLMOps",
        description="High-growth YC-backed startup building autonomous agent infrastructure.",
        location="Bengaluru (Hybrid)",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        hr_contact_name="Devansh Patel",
        hr_contact_email="devansh@nexscale.ai",
        hr_contact_phone="+91-9000000012",
        verified_status="pending"
    )

    print("[+] Created companies")

    # 4. Students with diverse profiles for eligibility test cases
    student_data = [
        {
            'name': 'Aarav Sharma',
            'email': 'aarav.sharma@apex.edu',
            'phone': '+91-9111111101',
            'roll': '2026-CSE-001',
            'branch': 'CSE',
            'cgpa': 9.25,
            'backlogs': 0,
            'skills': ['Python', 'Django', 'React', 'Docker', 'PostgreSQL', 'DSA'],
            'bio': 'Full Stack Developer with a passion for scalable backend architectures and distributed systems.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            'name': 'Sneha Patel',
            'email': 'sneha.patel@apex.edu',
            'phone': '+91-9111111102',
            'roll': '2026-IT-015',
            'branch': 'IT',
            'cgpa': 8.60,
            'backlogs': 0,
            'skills': ['Java', 'Spring Boot', 'React', 'AWS', 'Kubernetes'],
            'bio': 'Cloud enthusiast and certified AWS Solutions Architect Associate.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            'name': 'Rohan Gupta',
            'email': 'rohan.gupta@apex.edu',
            'phone': '+91-9111111103',
            'roll': '2026-AI-008',
            'branch': 'AI_DS',
            'cgpa': 8.90,
            'backlogs': 0,
            'skills': ['Python', 'PyTorch', 'FastAPI', 'Machine Learning', 'Computer Vision'],
            'bio': 'AI Research intern published at IEEE student conference.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            'name': 'Kavya Reddy',
            'email': 'kavya.reddy@apex.edu',
            'phone': '+91-9111111104',
            'roll': '2026-ECE-022',
            'branch': 'ECE',
            'cgpa': 7.80,
            'backlogs': 0,
            'skills': ['C++', 'Embedded Systems', 'IoT', 'Python'],
            'bio': 'Passionate about firmware design and robotics.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            'name': 'Vikram Mehra',
            'email': 'vikram.mehra@apex.edu',
            'phone': '+91-9111111105',
            'roll': '2026-MECH-041',
            'branch': 'MECH',
            'cgpa': 6.90,
            'backlogs': 1,
            'skills': ['AutoCAD', 'SolidWorks', 'MATLAB', 'Python'],
            'bio': 'Mechanical engineering lead at SAE BAJA team.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
            'name': 'Ananya Sen',
            'email': 'ananya.sen@apex.edu',
            'phone': '+91-9111111106',
            'roll': '2026-CSE-089',
            'branch': 'CSE',
            'cgpa': 7.20,
            'backlogs': 0,
            'skills': ['JavaScript', 'Node.js', 'React', 'MongoDB'],
            'bio': 'Frontend developer and UI/UX designer with 3 live freelance apps.',
            'resume': 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        }
    ]

    student_users = []
    for sd in student_data:
        u = User.objects.create_user(
            email=sd['email'],
            phone=sd['phone'],
            full_name=sd['name'],
            role='student',
            college=c1,
            password='student123'
        )
        StudentProfile.objects.create(
            user=u,
            roll_number=sd['roll'],
            branch=sd['branch'],
            cgpa=sd['cgpa'],
            backlog_count=sd['backlogs'],
            skills=sd['skills'],
            bio=sd['bio'],
            resume_url=sd['resume'],
            github_url=f"https://github.com/{sd['name'].lower().replace(' ', '')}",
            linkedin_url=f"https://linkedin.com/in/{sd['name'].lower().replace(' ', '-')}"
        )
        student_users.append(u)

    print("[+] Created student profiles")

    # 5. Drives & Eligibility Criteria
    # Drive 1: Google Software Engineer (high CGPA, CSE/IT/AI_DS only, 0 backlogs)
    drive_google = Drive.objects.create(
        company=comp_google,
        college=c1,
        job_title="Software Development Engineer - I (Cloud)",
        job_role="Software Engineer (Backend & Distributed Systems)",
        job_description="Join Google Cloud core infrastructure team building next-gen distributed databases and high-throughput microservices. Responsibilities include architecture design, coding in C++/Go/Python, and optimizing low-latency systems.",
        package_ctc="28.5 LPA",
        package_numeric=28.5,
        location="Bengaluru, Karnataka",
        drive_date=date.today() + timedelta(days=5),
        deadline=timezone.now() + timedelta(days=3),
        eligibility_criteria={
            "min_cgpa": 8.0,
            "max_backlogs": 0,
            "branches": ["CSE", "IT", "AI_DS"],
            "required_skills": ["Python", "DSA"]
        },
        status="open"
    )

    r1_g = Round.objects.create(drive=drive_google, name="Round 1: Online Coding & Aptitude Challenge", round_type="Aptitude", order=1, status="completed", location_or_link="Google Meet Assessment Portal", instructions="90 mins - 3 algorithmic problems + 20 CS fundamentals MCQs")
    r2_g = Round.objects.create(drive=drive_google, name="Round 2: Core Data Structures & System Design", round_type="Technical", order=2, status="ongoing", location_or_link="Google Meet Link #A4", instructions="45 mins live whiteboard coding")
    r3_g = Round.objects.create(drive=drive_google, name="Round 3: Googliness & Behavioral Leadership Interview", round_type="HR", order=3, status="upcoming", location_or_link="Google Meet Link #B1", instructions="30 mins culture & values fit")

    # Drive 2: Microsoft SDE (open to CSE, IT, AI_DS, ECE, min CGPA 7.5)
    drive_msft = Drive.objects.create(
        company=comp_msft,
        college=c1,
        job_title="Associate Software Engineer (Azure)",
        job_role="Full Stack Engineer",
        job_description="Work on Microsoft Azure developer toolchains and AI cloud services. Excellent foundation in algorithms, OOP principles, and modern web frameworks required.",
        package_ctc="22.0 LPA",
        package_numeric=22.0,
        location="Hyderabad, Telangana",
        drive_date=date.today() - timedelta(days=10),
        deadline=timezone.now() - timedelta(days=12),
        eligibility_criteria={
            "min_cgpa": 7.5,
            "max_backlogs": 0,
            "branches": ["CSE", "IT", "AI_DS", "ECE"],
            "required_skills": ["Java", "React"]
        },
        status="completed"
    )

    r1_m = Round.objects.create(drive=drive_msft, name="Round 1: Codility Online Assessment", round_type="Aptitude", order=1, status="completed")
    r2_m = Round.objects.create(drive=drive_msft, name="Round 2: Technical Interview", round_type="Technical", order=2, status="completed")
    r3_m = Round.objects.create(drive=drive_msft, name="Round 3: Techno-Managerial & HR", round_type="HR", order=3, status="completed")

    # Drive 3: Amazon Web Services AWS Support & Cloud Assoc
    drive_aws = Drive.objects.create(
        company=comp_amazon,
        college=c1,
        job_title="Cloud Support Associate & DevOps Engineer",
        job_role="Cloud Engineer",
        job_description="Provide technical guidance to AWS enterprise customers, architect cloud deployments, and automate operational workflows.",
        package_ctc="16.5 LPA",
        package_numeric=16.5,
        location="Bengaluru, Karnataka",
        drive_date=date.today() + timedelta(days=12),
        deadline=timezone.now() + timedelta(days=8),
        eligibility_criteria={
            "min_cgpa": 7.0,
            "max_backlogs": 0,
            "branches": ["CSE", "IT", "ECE", "AI_DS"],
            "required_skills": ["Linux", "Networking"]
        },
        status="open"
    )

    Round.objects.create(drive=drive_aws, name="Round 1: AWS Online Technical & Linux Assessment", round_type="Aptitude", order=1, status="upcoming")
    Round.objects.create(drive=drive_aws, name="Round 2: Cloud Architecture & Troubleshooting", round_type="Technical", order=2, status="upcoming")
    Round.objects.create(drive=drive_aws, name="Round 3: Amazon Leadership Principles (Bar Raiser)", round_type="HR", order=3, status="upcoming")

    # Drive 4: TCS Digital (Mass Hiring - All branches, min CGPA 6.5, up to 1 backlog)
    drive_tcs = Drive.objects.create(
        company=comp_tcs,
        college=c1,
        job_title="Digital Systems Engineer (Specialist)",
        job_role="Associate Consultant",
        job_description="Fast-track leadership development program across AI, IoT, Enterprise Cloud, and Cybersecurity practices.",
        package_ctc="7.5 LPA",
        package_numeric=7.5,
        location="Pan India",
        drive_date=date.today() + timedelta(days=20),
        deadline=timezone.now() + timedelta(days=15),
        eligibility_criteria={
            "min_cgpa": 6.5,
            "max_backlogs": 1,
            "branches": ["ALL"],
            "required_skills": []
        },
        status="open"
    )

    Round.objects.create(drive=drive_tcs, name="Round 1: TCS National Qualifier Test (NQT)", round_type="Aptitude", order=1, status="upcoming")
    Round.objects.create(drive=drive_tcs, name="Round 2: Technical Interview", round_type="Technical", order=2, status="upcoming")
    Round.objects.create(drive=drive_tcs, name="Round 3: Managerial & HR Interview", round_type="HR", order=3, status="upcoming")

    print("[+] Created drives and recruitment rounds")

    # 6. Applications & Round Results
    # Google Applications
    # Aarav Sharma (Eligible & Passed Round 1, in Round 2)
    app1 = Application.objects.create(drive=drive_google, student=student_users[0], status='in_process', current_round_name=r2_g.name)
    RoundResult.objects.create(round=r1_g, student=student_users[0], status='Pass', score='92/100', remarks='Fast algorithmic solution with optimal Big-O complexity.')
    RoundResult.objects.create(round=r2_g, student=student_users[0], status='Hold', score='Evaluation in progress', remarks='Technical interview scheduled at 2:00 PM.')

    # Sneha Patel (Eligible & in Round 2)
    app2 = Application.objects.create(drive=drive_google, student=student_users[1], status='in_process', current_round_name=r2_g.name)
    RoundResult.objects.create(round=r1_g, student=student_users[1], status='Pass', score='88/100', remarks='Strong object-oriented design and clean code.')
    RoundResult.objects.create(round=r2_g, student=student_users[1], status='Hold', score='', remarks='Scheduled for technical round.')

    # Rohan Gupta (Eligible, passed Round 1)
    app3 = Application.objects.create(drive=drive_google, student=student_users[2], status='in_process', current_round_name=r2_g.name)
    RoundResult.objects.create(round=r1_g, student=student_users[2], status='Pass', score='96/100', remarks='Top scorer in machine learning and algorithmic test.')

    # Microsoft Applications & Final Placements
    # Sneha Patel was Selected for Microsoft
    app_m1 = Application.objects.create(drive=drive_msft, student=student_users[1], status='selected', current_round_name='Offer Extended')
    RoundResult.objects.create(round=r1_m, student=student_users[1], status='Pass', score='90/100')
    RoundResult.objects.create(round=r2_m, student=student_users[1], status='Pass', score='Strong System Design')
    RoundResult.objects.create(round=r3_m, student=student_users[1], status='Pass', score='Excellent Culture Fit')
    
    student_users[1].student_profile.is_placed = True
    student_users[1].student_profile.save()

    p1 = PlacementRecord.objects.create(
        student=student_users[1],
        company=comp_msft,
        drive=drive_msft,
        college=c1,
        package_offered="22.0 LPA",
        package_numeric=22.0,
        designation="Associate Software Engineer (Azure)",
        final_status="Accepted",
        offer_letter_url="https://example.com/offers/msft-sneha-patel.pdf"
    )

    # Kavya Reddy was also selected for Microsoft
    app_m2 = Application.objects.create(drive=drive_msft, student=student_users[3], status='selected', current_round_name='Offer Extended')
    RoundResult.objects.create(round=r1_m, student=student_users[3], status='Pass', score='86/100')
    RoundResult.objects.create(round=r2_m, student=student_users[3], status='Pass', score='Pass')
    RoundResult.objects.create(round=r3_m, student=student_users[3], status='Pass', score='Pass')
    
    student_users[3].student_profile.is_placed = True
    student_users[3].student_profile.save()

    p2 = PlacementRecord.objects.create(
        student=student_users[3],
        company=comp_msft,
        drive=drive_msft,
        college=c1,
        package_offered="22.0 LPA",
        package_numeric=22.0,
        designation="Software Engineer (Hardware Systems)",
        final_status="Accepted",
        offer_letter_url="https://example.com/offers/msft-kavya-reddy.pdf"
    )

    # 7. Notifications
    Notification.objects.create(
        user=student_users[0],
        title="Round 2 Interview Scheduled",
        message="Your Technical Interview for Google Cloud SDE is confirmed for today at 2:00 PM via Google Meet.",
        notification_type="round_schedule",
        link_url="/student/tracker"
    )
    Notification.objects.create(
        user=student_users[0],
        title="New Drive Alert: Amazon Web Services",
        message="You meet all eligibility criteria for AWS Cloud Support Associate (16.5 LPA). Applications close in 8 days.",
        notification_type="drive_alert",
        link_url="/student/drives"
    )
    Notification.objects.create(
        user=student_users[1],
        title="Offer Letter Generated: Microsoft Corporation",
        message="Congratulations Sneha! Your official offer letter for 22.0 LPA is now available in your Placement History.",
        notification_type="offer_alert",
        link_url="/student/history"
    )

    print("[+] Seeded applications, round results, final placements, and notifications")
    print("[>>>] Seeding completed successfully!")


if __name__ == '__main__':
    seed()
