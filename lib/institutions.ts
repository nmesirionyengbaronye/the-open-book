import { FUTO_FACULTIES_AND_DEPARTMENTS } from "./constants";

export type School = { name: string; departments: string[] };
export type Institution = { code: string; name: string; schools: School[] };

export const INSTITUTIONS: Institution[] = [
  {
    code: "FUTO",
    name: "Federal University of Technology, Owerri",
    schools: [
      { name: "SAAT", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SAAT },
      { name: "SBMS", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SBMS },
      { name: "SOBS", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SOBS },
      { name: "SEET", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SEET },
      { name: "SOES", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SOES },
      { name: "SOHT", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SOHT },
      { name: "SMAT", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SMAT },
      { name: "SICT", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SICT },
      { name: "SOPS", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SOPS },
      { name: "SESET", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SESET },
      { name: "SLIT", departments: FUTO_FACULTIES_AND_DEPARTMENTS.SLIT }
    ]
  },
  {
    code: "UNILAG",
    name: "University of Lagos",
    schools: [
      { name: "Faculty of Engineering", departments: ["Computer Eng.", "Electrical Eng.", "Civil Eng."] },
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Physics"] },
    ]
  },
  {
    code: "UI",
    name: "University of Ibadan",
    schools: [
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics", "Chemistry"] },
      { name: "Faculty of Technology", departments: ["Petroleum Eng.", "Mechanical Eng."] },
    ]
  },
  {
    code: "UNN",
    name: "University of Nigeria, Nsukka",
    schools: [
      { name: "Faculty of Engineering", departments: ["Electronic Eng.", "Mechanical Eng.", "Civil Eng."] },
      { name: "Faculty of Physical Sciences", departments: ["Computer Science", "Mathematics", "Physics"] },
    ]
  },
  {
    code: "ABU",
    name: "Ahmadu Bello University, Zaria",
    schools: [
      { name: "Faculty of Engineering", departments: ["Computer Eng.", "Electrical Eng.", "Chemical Eng."] },
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics"] },
    ]
  },
  {
    code: "OAU",
    name: "Obafemi Awolowo University",
    schools: [
      { name: "Faculty of Technology", departments: ["Computer Science & Eng.", "Electronic & Electrical Eng."] },
      { name: "Faculty of Science", departments: ["Mathematics", "Physics"] },
    ]
  },
  {
    code: "UNIBEN",
    name: "University of Benin",
    schools: [
      { name: "Faculty of Engineering", departments: ["Computer Eng.", "Mechanical Eng."] },
      { name: "Faculty of Physical Sciences", departments: ["Computer Science", "Mathematics"] },
    ]
  },
  {
    code: "FUTA",
    name: "Federal University of Technology, Akure",
    schools: [
      { name: "SEET", departments: ["Computer Eng.", "Mechanical Eng.", "Civil Eng."] },
      { name: "SOS", departments: ["Computer Science", "Mathematics", "Physics"] },
    ]
  },
  {
    code: "UNIPORT",
    name: "University of Port Harcourt",
    schools: [
      { name: "Faculty of Engineering", departments: ["Petroleum Eng.", "Chemical Eng."] },
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics"] },
    ]
  },
];