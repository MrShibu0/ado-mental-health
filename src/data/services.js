import individualImage from "../Images/Mental Health Counseling Scene.png";
import psychiatricImage from "../Images/Psychiatric Consultation.png";
import familyImage from "../Images/Family Therapy Service.png";
import assessmentImage from "../Images/Psychological Assessments.png";
import groupImage from "../Images/Group Therapy.png";
import crisisImage from "../Images/Crisis Intervention.png";
import substanceImage from "../Images/Substance Use Support.png";
import olderAdultImage from "../Images/Older Adult Mental Health Care.png";

export const services = [
  {
    id: "psychological-assessments",
    title: "Psychological Assessments",
    description: "Comprehensive evaluations to identify emotional, behavioral, developmental, and psychological concerns.",
    icon: "ClipboardCheck",
    image: assessmentImage
  },
  {
    id: "psychiatric-consultations",
    title: "Psychiatric Consultations",
    description: "Professional psychiatric evaluation, diagnosis, treatment planning, and medication management.",
    icon: "Stethoscope",
    image: psychiatricImage
  },
  {
    id: "individual-therapy",
    title: "Individual Therapy",
    description: "Evidence-based counseling for depression, anxiety, trauma, stress, grief, and emotional challenges.",
    icon: "User",
    image: individualImage
  },
  {
    id: "family-therapy",
    title: "Family Therapy",
    description: "Helping families improve communication, relationships, conflict resolution, and support systems.",
    icon: "Users",
    image: familyImage
  },
  {
    id: "group-therapy",
    title: "Group Therapy",
    description: "Structured therapeutic group sessions promoting healing, support, and shared learning.",
    icon: "UsersRound",
    image: groupImage
  },
  {
    id: "crisis-intervention",
    title: "Crisis Intervention",
    description: "Immediate support for emotional crises, acute distress, and urgent mental health situations.",
    icon: "AlertCircle",
    image: crisisImage
  },
  {
    id: "substance-use-support",
    title: "Substance Use Support",
    description: "Recovery-focused services for individuals affected by addiction and substance use disorders.",
    icon: "HeartHandshake",
    image: substanceImage
  },
  {
    id: "older-adult-care",
    title: "Older Adult Mental Health Care",
    description: "Specialized services addressing the psychological and emotional needs of aging populations.",
    icon: "PersonStanding",
    image: olderAdultImage
  }
];
