from students.models import StudentProfile
from accounts.models import User

class EligibilityEngine:
    @staticmethod
    def evaluate_student(student_profile, criteria):
        """
        Evaluates a single student against criteria dictionary:
        criteria: {
            "min_cgpa": float,
            "max_backlogs": int,
            "branches": list of branch codes,
            "required_skills": list of skills (optional)
        }
        Returns (is_eligible, reasons_dict)
        """
        reasons = []
        is_eligible = True

        if not student_profile:
            return False, ["No student profile found"]

        # 1. CGPA check
        min_cgpa = criteria.get('min_cgpa')
        if min_cgpa is not None:
            try:
                min_cgpa = float(min_cgpa)
                if float(student_profile.cgpa) < min_cgpa:
                    is_eligible = False
                    reasons.append(f"CGPA {student_profile.cgpa} is below minimum requirement of {min_cgpa}")
            except (ValueError, TypeError):
                pass

        # 2. Backlogs check
        max_backlogs = criteria.get('max_backlogs')
        if max_backlogs is not None:
            try:
                max_backlogs = int(max_backlogs)
                if student_profile.backlog_count > max_backlogs:
                    is_eligible = False
                    reasons.append(f"Backlogs ({student_profile.backlog_count}) exceed allowed limit ({max_backlogs})")
            except (ValueError, TypeError):
                pass

        # 3. Branch check
        branches = criteria.get('branches')
        if branches and isinstance(branches, list) and len(branches) > 0 and 'ALL' not in branches:
            if student_profile.branch not in branches:
                is_eligible = False
                reasons.append(f"Branch '{student_profile.branch}' is not in eligible branches ({', '.join(branches)})")

        # 4. Skills match (soft or hard check)
        req_skills = criteria.get('required_skills')
        if req_skills and isinstance(req_skills, list) and len(req_skills) > 0:
            student_skills = [s.strip().lower() for s in (student_profile.skills or [])]
            missing_skills = [rs for rs in req_skills if rs.strip().lower() not in student_skills]
            if missing_skills:
                reasons.append(f"Missing recommended skills: {', '.join(missing_skills)}")
                # We can either make skills advisory or required.

        return is_eligible, reasons

    @classmethod
    def get_eligible_students_for_drive(cls, drive):
        """
        Returns a list of student profiles for the college who meet the drive's eligibility criteria.
        """
        criteria = drive.eligibility_criteria or {}
        college = drive.college

        # Query all student users in this college
        students_qs = User.objects.filter(role='student', college=college).select_related('student_profile')
        
        eligible_students = []
        for user in students_qs:
            profile = getattr(user, 'student_profile', None)
            if profile:
                is_eligible, reasons = cls.evaluate_student(profile, criteria)
                eligible_students.append({
                    'user_id': user.id,
                    'full_name': user.full_name,
                    'email': user.email,
                    'phone': user.phone,
                    'roll_number': profile.roll_number,
                    'branch': profile.branch,
                    'cgpa': float(profile.cgpa),
                    'backlog_count': profile.backlog_count,
                    'skills': profile.skills,
                    'resume_url': profile.resume_url,
                    'is_eligible': is_eligible,
                    'reasons': reasons
                })
        return eligible_students
