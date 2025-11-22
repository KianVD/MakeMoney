export interface StudyGuideSection {
  header: string;
  bullet_points: string[];
  visual_suggestions: string[];
  reminder_tips: string[];
}

export interface StudyGuide {
  title: string;
  summary: string;
  student_benefit_focus: string;
  sections: StudyGuideSection[];
  infographic_style: string;
}

