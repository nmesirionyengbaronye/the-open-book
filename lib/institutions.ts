export type School = { name: string; departments: string[] };
export type Institution = { code: string; name: string; schools: School[] };

export const INSTITUTIONS: Institution[] = [
  {
    code: "FUTO", name: "Federal University of Technology, Owerri",
    schools: [
      { name: "SEET — Engineering & Engineering Tech", departments: ["Mechanical Eng.", "Electrical Eng.", "Civil Eng.", "Chemical Eng.", "Materials & Metallurgical Eng."] },
      { name: "SOPS — Physical Sciences", departments: ["Mathematics", "Physics", "Statistics", "Computer Science"] },
      { name: "SOBS — Biological Sciences", departments: ["Biochemistry", "Microbiology", "Biotechnology"] },
      { name: "SMAT — Management Technology", departments: ["Project Management", "Information Management", "Transport Management"] },
    ],
  },
  { code: "UNILAG", name: "University of Lagos", schools: [
    { name: "Faculty of Engineering", departments: ["Computer Eng.", "Electrical Eng.", "Civil Eng."] },
    { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Physics"] },
  ]},
  { code: "UI", name: "University of Ibadan", schools: [
    { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Chemistry"] },
    { name: "Faculty of Technology", departments: ["Petroleum Eng.", "Mechanical Eng."] },
  ]},
  { code: "UNN", name: "University of Nigeria, Nsukka", schools: [
    { name: "Faculty of Engineering", departments: ["Electronic Eng.", "Mechanical Eng.", "Civil Eng."] },
    { name: "Faculty of Physical Sciences", departments: ["Computer Science", "Mathematics", "Physics"] },
  ]},
  { code: "ABU", name: "Ahmadu Bello University, Zaria", schools: [
    { name: "Faculty of Engineering", departments: ["Computer Eng.", "Electrical Eng.", "Chemical Eng."] },
    { name: "Faculty of Science", departments: ["Computer Science", "Mathematics"] },
  ]},
  { code: "OAU", name: "Obafemi Awolowo University", schools: [
    { name: "Faculty of Technology", departments: ["Computer Science & Eng.", "Electronic & Electrical Eng."] },
    { name: "Faculty of Science", departments: ["Mathematics", "Physics"] },
  ]},
  { code: "UNIBEN", name: "University of Benin", schools: [
    { name: "Faculty of Engineering", departments: ["Computer Eng.", "Mechanical Eng."] },
    { name: "Faculty of Physical Sciences", departments: ["Computer Science", "Mathematics"] },
  ]},
  { code: "FUTA", name: "Federal University of Technology, Akure", schools: [
    { name: "SEET", departments: ["Computer Eng.", "Mechanical Eng.", "Civil Eng."] },
    { name: "SOS", departments: ["Computer Science", "Mathematics", "Physics"] },
  ]},
  { code: "UNIPORT", name: "University of Port Harcourt", schools: [
    { name: "Faculty of Engineering", departments: ["Petroleum Eng.", "Chemical Eng."] },
    { name: "Faculty of Science", departments: ["Computer Science", "Mathematics"] },
  ]},
];