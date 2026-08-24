import { FUTO_FACULTIES_AND_DEPARTMENTS } from "./constants";

export type School = { name: string; departments: string[] };
export type Institution = {
  code: string;
  name: string;
  schools: School[];
  /** True when the Uni UI app is live today (app.uniui.com.ng). FUTO only.
   *  Omitted/false means students from this school are on the waitlist; the
   *  first wave of 6 universities lands in November 2026, then 3 more go live
   *  each month until full Southern-Nigeria coverage by August 2027
   *  (see WAITLIST_ROADMAP / WAITLIST_TARGET_DATE in lib/links.ts). */
  live?: boolean;
  /** Optional human-readable note (e.g. "First university in Nigeria"). */
  note?: string;
};

export const INSTITUTIONS: Institution[] = [
  // ── LIVE TODAY ──────────────────────────────────────────────────────
  {
    code: "FUTO",
    name: "Federal University of Technology, Owerri",
    live: true,
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

  // ── ABIA / IMO (government-owned, comprehensive) ───────────────────
  {
    code: "ABSU",
    name: "Abia State University, Uturu",
    schools: [
      {
        name: "College of Agriculture",
        departments: [
          "Agricultural Economics",
          "Animal Science and Fisheries",
          "Crop Production and Protection",
          "Food Science and Technology",
          "Soil Science"
        ]
      },
      {
        name: "College of Biological and Physical Sciences",
        departments: [
          "Animal and Environmental Biology",
          "Biochemistry",
          "Biotechnology",
          "Botany",
          "Computer Science",
          "Industrial Chemistry",
          "Industrial Physics",
          "Mathematics",
          "Microbiology",
          "Plant Science and Biotechnology",
          "Statistics"
        ]
      },
      {
        name: "College of Business Administration",
        departments: ["Accountancy", "Banking and Finance", "Economics", "Management", "Marketing"]
      },
      {
        name: "College of Education",
        departments: [
          "Adult Education",
          "Curriculum and Teaching",
          "Educational Administration and Planning",
          "Educational Foundations",
          "Psychological Foundations",
          "Science Education",
          "Vocational Education",
          "Agricultural Education",
          "Art Education",
          "Business Education"
        ]
      },
      {
        name: "College of Engineering",
        departments: [
          "Computer Engineering",
          "Electrical/Electronics Engineering",
          "Information and Communication Technology",
          "Mechanical Engineering",
          "Surveying and Geo-Informatics"
        ]
      },
      {
        name: "College of Environmental Studies",
        departments: [
          "Architecture",
          "Building Technology",
          "Environmental Resource Management",
          "Estate Management",
          "Fine and Applied Arts",
          "Geography and Planning",
          "Urban and Regional Planning"
        ]
      },
      {
        name: "College of Humanities",
        departments: [
          "English Language/Literature",
          "Foreign Languages and Translation Studies",
          "History and International Relations",
          "Linguistics and Communication Studies/Igbo",
          "Mass Communication",
          "Philosophy",
          "Religious Studies"
        ]
      },
      { name: "College of Law", departments: ["Law"] },
      {
        name: "College of Medicine and Health Sciences",
        departments: [
          "Basic Medical Sciences (Anatomy, Physiology)",
          "Clinical Medicine (Medicine and Surgery)",
          "Health Sciences (Nursing, Public Health)"
        ]
      },
      { name: "College of Optometry", departments: ["Optometry"] },
      {
        name: "College of Social Science",
        departments: ["Government", "Library and Information Science", "Political Science", "Public Administration", "Sociology"]
      }
    ]
  },
  {
    code: "MOUAU",
    name: "Michael Okpara University of Agriculture, Umudike",
    schools: [
      {
        name: "College of Agricultural Economics, Rural Sociology and Extension (CAERSE)",
        departments: ["Agricultural Economics", "Agricultural Extension and Rural Sociology", "Agribusiness"]
      },
      { name: "College of Animal Science and Animal Production (CASAP)", departments: ["Animal Production"] },
      {
        name: "College of Applied Food Sciences and Tourism (CAFST)",
        departments: [
          "Food Science and Technology",
          "Human Nutrition and Dietetics",
          "Hotel Management and Tourism",
          "Home Economics"
        ]
      },
      {
        name: "College of Crop and Soil Sciences (CCSS)",
        departments: ["Crop Science", "Soil Science", "Plant Science and Biotechnology"]
      },
      {
        name: "College of Engineering and Engineering Technology (CEET)",
        departments: [
          "Agricultural and Bioresources Engineering",
          "Chemical Engineering",
          "Civil Engineering",
          "Computer Engineering",
          "Electrical/Electronics Engineering",
          "Mechanical Engineering"
        ]
      },
      {
        name: "College of Natural Resources and Environmental Management (CNREM)",
        departments: [
          "Environmental Management and Toxicology",
          "Fisheries and Aquatic Resources Management",
          "Forestry and Environmental Management"
        ]
      },
      {
        name: "College of Education",
        departments: [
          "Agricultural Science and Education",
          "Biology Education",
          "Chemistry Education",
          "Computer Education",
          "Integrated Science Education",
          "Mathematics Education",
          "Physics Education",
          "Home Economics and Education",
          "Industrial Technology Education"
        ]
      },
      { name: "College of Natural Science (CNAS)", departments: ["Biochemistry", "Microbiology", "Zoology and Environmental Biology"] },
      {
        name: "College of Physical and Applied Sciences (CPAS)",
        departments: ["Chemistry", "Computer Science", "Mathematics", "Physics", "Statistics"]
      },
      { name: "College of Management Science", departments: ["Business Administration", "Accountancy", "Economics", "Entrepreneurship"] },
      { name: "College of Veterinary Medicine (CVM)", departments: ["Veterinary Medicine"] }
    ]
  },
  {
    code: "ABIAPOLY",
    name: "Ogbonnaya Onu Polytechnic (Abia State Polytechnic)",
    schools: [
      {
        name: "School of Business Administration",
        departments: [
          "Accountancy (ND/HND)",
          "Business Administration (ND/HND)",
          "Marketing (ND/HND)",
          "Office Management (ND/HND)",
          "Public Administration (ND/HND)"
        ]
      },
      {
        name: "School of Science & Engineering",
        departments: [
          "Computer Science (ND/HND)",
          "Electrical/Electronics Engineering (ND/HND)",
          "Mechanical Engineering (ND/HND)",
          "Civil Engineering (ND/HND)",
          "Information Technology (ND/HND)"
        ]
      },
      { name: "School of General Studies", departments: ["General Education Studies (ND)"] },
      {
        name: "School of Science & Industrial Technology",
        departments: ["Science Technology (ND/HND)", "Industrial Technology (ND/HND)"]
      }
    ]
  },
  {
    code: "ASCETA",
    name: "Abia State College of Education (Technical)",
    schools: [
      {
        name: "College of Education",
        departments: [
          "Agricultural Science Education",
          "Business Education",
          "Fine and Applied Arts Education",
          "Home Economics Education",
          "Industrial Technology Education",
          "Mathematics Education",
          "Science Education"
        ]
      }
    ]
  },
  {
    code: "IMSU",
    name: "Imo State University",
    schools: [
      {
        name: "Faculty of Agriculture & Veterinary Medicine",
        departments: [
          "Agricultural Economics, Extension & Rural Development",
          "Animal Science and Fisheries",
          "Crop Science and Biotechnology",
          "Food Science and Technology",
          "Soil Science and Environment"
        ]
      },
      {
        name: "Faculty of Business Administration (Management Sciences)",
        departments: ["Accountancy", "Banking and Finance", "Business Administration", "Economics", "Marketing", "Public Administration"]
      },
      { name: "Faculty of Arts", departments: ["English Language", "History and International Relations", "Languages and Linguistics", "Philosophy", "Religious Studies"] },
      { name: "Faculty of Education", departments: ["Adult Education", "Curriculum and Teaching", "Educational Administration", "Physical and Health Education", "Science Education"] },
      {
        name: "Faculty of Engineering",
        departments: [
          "Chemical Engineering",
          "Civil Engineering",
          "Computer Engineering",
          "Electrical/Electronics Engineering",
          "Mechanical Engineering"
        ]
      },
      { name: "Faculty of Environmental Sciences", departments: ["Architecture", "Environmental Management", "Urban and Regional Planning"] },
      { name: "Faculty of Law", departments: ["Law"] },
      { name: "Faculty of Medical Sciences", departments: ["Basic Medical Sciences", "Clinical Medicine", "Nursing", "Public Health"] },
      {
        name: "Faculty of Physical Sciences",
        departments: ["Biochemistry", "Chemistry", "Computer Science", "Mathematics", "Microbiology", "Physics"]
      },
      { name: "Faculty of Social Sciences", departments: ["Economics", "Government and Political Science", "Public Administration", "Sociology"] }
    ]
  },
  {
    code: "FPNO",
    name: "Federal Polytechnic, Nekede",
    schools: [
      {
        name: "School of Engineering Technology (SET)",
        departments: [
          "Civil Engineering (ND/HND)",
          "Electrical/Electronics Engineering (ND/HND)",
          "Mechanical Engineering (ND/HND)",
          "Marine Engineering (ND/HND)",
          "Surveying (ND/HND)"
        ]
      },
      {
        name: "School of Industrial and Applied Science (SIAS)",
        departments: ["Chemistry (ND/HND)", "Food Science and Technology (ND/HND)", "Laboratory Science (ND/HND)", "Physics (ND/HND)", "Science Laboratory Technology (ND/HND)"]
      },
      {
        name: "School of Business Management Technology (SBMT)",
        departments: [
          "Accountancy (ND/HND)",
          "Business Studies (ND/HND)",
          "Estate Management and Valuation (ND/HND)",
          "Office Management (ND/HND)",
          "Public Administration (ND/HND)"
        ]
      },
      {
        name: "School of Humanities and Social Science (SHSS)",
        departments: ["English Language (ND/HND)", "History (ND/HND)", "Library and Information Science (ND/HND)", "Mass Communication (ND/HND)"]
      },
      {
        name: "School of Environmental Development Technology (SEDT)",
        departments: ["Agricultural Engineering (ND/HND)", "Environmental Management (ND/HND)", "Horticulture (ND/HND)", "Land Management (ND/HND)"]
      }
    ]
  },
  {
    code: "IMOPOLY",
    name: "Imo State Polytechnic",
    schools: [
      {
        name: "School of Engineering Technology",
        departments: [
          "Agricultural Engineering Technology (ND/HND)",
          "Civil Engineering Technology (ND/HND)",
          "Electrical/Electronics Engineering Technology (ND/HND)",
          "Mechanical Engineering Technology (ND/HND)"
        ]
      },
      {
        name: "School of Business and Financial Management Technology",
        departments: [
          "Accountancy Technology (ND/HND)",
          "Business Administration (ND/HND)",
          "Financial Management (ND/HND)",
          "Office Management (ND/HND)"
        ]
      },
      {
        name: "School of Agriculture",
        departments: [
          "Agricultural Technology (ND/HND)",
          "Animal Health and Production Technology (ND/HND)",
          "Animal Production (ND/HND)",
          "Crop Production Technology (ND/HND)",
          "Crop Production and Soil Science (ND/HND)",
          "Fisheries Technology (ND/HND)",
          "Food Science and Technology (ND/HND)",
          "Soil Science Technology (ND/HND)"
        ]
      },
      {
        name: "School of Natural Resources and Environmental Technology",
        departments: [
          "Building Technology (ND/HND)",
          "Environmental Management Technology (ND/HND)",
          "Environmental Sciences and Management Technology (ND/HND)",
          "Estate Management and Valuation (ND/HND)",
          "Forestry Technology (ND/HND)",
          "Horticulture and Landscape Technology (ND/HND)",
          "Urban and Regional Planning (ND/HND)"
        ]
      },
      {
        name: "School of Science Technology",
        departments: ["Biology (ND/HND)", "Chemistry (ND/HND)", "Computer Science (ND/HND)", "Physics (ND/HND)", "Science Laboratory Technology (ND/HND)"]
      }
    ]
  },
  {
    code: "AIFUE",
    name: "Alvan Ikoku Federal University of Education",
    schools: [
      {
        name: "Faculty of Education",
        departments: [
          "Adult Education",
          "Curriculum Studies and Educational Technology",
          "Educational Administration and Planning",
          "Educational Foundations",
          "Science Education",
          "Social Studies Education"
        ]
      },
      {
        name: "Faculty of Arts",
        departments: [
          "English Language and Literature",
          "History",
          "Languages and Linguistics (French, Igbo)",
          "Philosophy",
          "Religious Studies",
          "Music",
          "Fine Arts"
        ]
      },
      {
        name: "Faculty of Sciences",
        departments: [
          "Biology Education",
          "Chemistry Education",
          "Computer Science Education",
          "Human Kinetics (Health Education, Physical Education)",
          "Mathematics Education",
          "Physics Education"
        ]
      },
      {
        name: "Faculty of Vocational and Technology Education",
        departments: ["Agricultural Education", "Business Education", "Home Economics Education", "Industrial Technology Education", "Technical Education"]
      },
      {
        name: "Faculty of Management and Social Sciences",
        departments: ["Economics Education", "Government and Political Science Education", "Psychology Education", "Sociology Education"]
      },
      {
        name: "Faculty of Specialized Education",
        departments: ["Special Education", "Inclusive Education", "Educational Psychology", "Guidance and Counselling", "Early Childhood Education", "Primary Education"]
      }
    ]
  },

  // ── SOUTHERN NIGERIA — FEDERAL UNIVERSITIES ────────────────────────
  {
    code: "UI",
    name: "University of Ibadan",
    schools: [
      {
        name: "Faculty of Arts",
        departments: [
          "Department of Arabic and Islamic Studies",
          "Department of Archaeology and Anthropology",
          "Department of Classical Studies",
          "Department of Communication and Language Arts",
          "Department of English",
          "Department of European Studies (French, Russian, German)",
          "Department of History",
          "Department of Linguistics and African Languages",
          "Department of Music",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of Theatre Arts"
        ]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Botany",
          "Department of Chemistry",
          "Department of Geology",
          "Department of Microbiology",
          "Department of Physics",
          "Department of Zoology",
          "Department of Mathematics",
          "Department of Statistics"
        ]
      },
      {
        name: "Faculty of Social Sciences",
        departments: [
          "Department of Economics",
          "Department of Geography",
          "Department of Sociology",
          "Department of Psychology",
          "Department of Demography and Social Statistics"
        ]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Adult Education", "Department of Curriculum Studies", "Department of Educational Management", "Department of Science Education"]
      },
      {
        name: "Faculty of Veterinary Medicine",
        departments: [
          "Department of Veterinary Anatomy",
          "Department of Veterinary Parasitology",
          "Department of Veterinary Pathology",
          "Department of Veterinary Physiology",
          "Department of Veterinary Surgery"
        ]
      },
      {
        name: "Faculty of Agriculture and Forestry",
        departments: [
          "Department of Agronomy",
          "Department of Animal Science",
          "Department of Crop Production",
          "Department of Fisheries and Wildlife Management",
          "Department of Forestry and Wood Technology",
          "Department of Soil Science"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: [
          "Department of Anatomy",
          "Department of Biochemistry",
          "Department of Medical Microbiology",
          "Department of Physiology",
          "Department of Pharmacology"
        ]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry",
          "Department of Radiology"
        ]
      },
      {
        name: "Faculty of Dentistry",
        departments: ["Department of Restorative Dentistry", "Department of Preventive Dentistry", "Department of Dental Surgery"]
      },
      {
        name: "Faculty of Pharmacy",
        departments: [
          "Department of Pharmaceutics",
          "Department of Pharmaceutical Chemistry",
          "Department of Pharmacology and Therapeutics",
          "Department of Pharmacognosy"
        ]
      },
      {
        name: "Faculty of Public Health",
        departments: [
          "Department of Epidemiology",
          "Department of Health Promotion and Education",
          "Department of Maternal and Child Health",
          "Department of Occupational Health and Safety"
        ]
      },
      {
        name: "Faculty of Technology",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical Engineering",
          "Department of Mechanical Engineering",
          "Department of Chemical Engineering"
        ]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Economics and Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of Economics", "Department of Finance"]
      },
      {
        name: "Faculty of Renewable Natural Resources",
        departments: ["Department of Forest Conservation and Protection", "Department of Wildlife Conservation"]
      },
      {
        name: "Faculty of Environmental Design and Management",
        departments: ["Department of Urban and Regional Planning", "Department of Landscape Architecture", "Department of Architecture"]
      },
      {
        name: "Faculty of Multidisciplinary Studies",
        departments: ["Department of Basic Studies", "Department of Continuing Education"]
      }
    ]
  },
  {
    code: "UNILAG",
    name: "University of Lagos",
    schools: [
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English Language and Literature",
          "Department of History and Strategic Studies",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of French",
          "Department of African Languages",
          "Department of Creative Arts"
        ]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Geology",
          "Department of Computer Science",
          "Department of Botany"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: [
          "Department of Anatomy",
          "Department of Physiology",
          "Department of Biochemistry",
          "Department of Pathology",
          "Department of Pharmacology"
        ]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry",
          "Department of Radiology"
        ]
      },
      {
        name: "Faculty of Dental Sciences",
        departments: ["Department of Restorative Dentistry", "Department of Preventive Dentistry", "Department of Oral Surgery"]
      },
      {
        name: "Faculty of Business Administration",
        departments: [
          "Department of Accounting",
          "Department of Business Administration",
          "Department of Marketing",
          "Department of Organizational Behaviour"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Curriculum Studies and Instructional Technology",
          "Department of Educational Management",
          "Department of Guidance and Counselling",
          "Department of Science Education"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical and Electronic Engineering",
          "Department of Mechanical Engineering",
          "Department of Materials and Metallurgical Engineering",
          "Department of Chemical Engineering"
        ]
      },
      {
        name: "Faculty of Environmental Sciences",
        departments: [
          "Department of Architecture",
          "Department of Urban and Regional Planning",
          "Department of Estate Management",
          "Department of Surveying and Geoinformatics"
        ]
      },
      {
        name: "Faculty of Law",
        departments: ["Department of Commercial Law", "Department of Jurisprudence and International Law", "Department of Public Law"]
      },
      {
        name: "Faculty of Pharmacy",
        departments: ["Department of Pharmacognosy", "Department of Pharmaceutical Chemistry", "Department of Pharmacology", "Department of Pharmacy Practice"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: [
          "Department of Economics",
          "Department of Geography",
          "Department of Sociology",
          "Department of Psychology",
          "Department of Mass Communication"
        ]
      }
    ]
  },
  {
    code: "UNICAL",
    name: "University of Calabar",
    schools: [
      {
        name: "Faculty of Engineering and Technology",
        departments: [
          "Department of Agricultural and Bioresource Engineering",
          "Department of Chemical Engineering",
          "Department of Civil and Environmental Engineering",
          "Department of Computer Engineering",
          "Department of Electrical and Electronic Engineering",
          "Department of Mechanical Engineering",
          "Department of Petroleum Engineering"
        ]
      },
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Agricultural Economics and Extension", "Department of Soil Science", "Department of Fisheries"]
      },
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English Studies",
          "Department of History and International Studies",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of Theatre Arts",
          "Department of African Languages"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Curriculum Studies",
          "Department of Educational Management",
          "Department of Guidance and Counselling",
          "Department of Science Education"
        ]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Geology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Medicine",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry"
        ]
      },
      {
        name: "Faculty of Allied Medical Sciences",
        departments: [
          "Department of Nursing Science",
          "Department of Medical Laboratory Science",
          "Department of Radiography",
          "Department of Environmental Health"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology"]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: ["Department of Medicine", "Department of Surgery", "Department of Obstetrics and Gynaecology"]
      },
      {
        name: "Faculty of Dentistry",
        departments: ["Department of Restorative Dentistry", "Department of Oral Surgery", "Department of Preventive Dentistry"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Environmental Sciences",
        departments: ["Department of Environmental Management", "Department of Urban and Regional Planning", "Department of Forestry"]
      }
    ]
  },
  {
    code: "UNIPORT",
    name: "University of Port Harcourt",
    schools: [
      {
        name: "Faculty of Humanities",
        departments: [
          "Department of English Language and Literature",
          "Department of History and Diplomatic Studies",
          "Department of Foreign Languages and Literature",
          "Department of Linguistics and Communication Studies",
          "Department of Religious and Cultural Studies",
          "Department of Philosophy",
          "Department of Music",
          "Department of Theatre and Film Studies"
        ]
      },
      {
        name: "Faculty of Social Sciences",
        departments: [
          "Department of Economics",
          "Department of Geography and Environmental Management",
          "Department of Sociology",
          "Department of Political and Administrative Studies",
          "Department of Psychology"
        ]
      },
      {
        name: "Faculty of Management Sciences",
        departments: [
          "Department of Accounting",
          "Department of Business Administration",
          "Department of Finance",
          "Department of Marketing"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Curriculum Studies and Educational Technology",
          "Department of Educational Foundations",
          "Department of Educational Management and Planning",
          "Department of Guidance and Counselling",
          "Department of Human Kinetics and Health Education",
          "Department of Library and Information Science",
          "Department of Adult and Non-Formal Education"
        ]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Animal and Environmental Biology",
          "Department of Microbiology",
          "Department of Plant Science and Biotechnology",
          "Department of Pure and Industrial Chemistry",
          "Department of Computer Science",
          "Department of Geology",
          "Department of Mathematics and Statistics",
          "Department of Physics",
          "Department of Biochemistry"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology", "Department of Pharmacology"]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry",
          "Department of Radiology"
        ]
      },
      {
        name: "Faculty of Dentistry",
        departments: [
          "Department of Restorative Dentistry",
          "Department of Oral and Maxillofacial Surgery",
          "Department of Preventive Dentistry"
        ]
      },
      {
        name: "Faculty of Pharmaceutical Sciences",
        departments: [
          "Department of Pharmacology and Toxicology",
          "Department of Pharmaceutical Chemistry",
          "Department of Pharmacognosy",
          "Department of Pharmacy Practice and Pharmaceutical Services"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Chemical and Petroleum Engineering",
          "Department of Civil Engineering",
          "Department of Electrical and Electronic Engineering",
          "Department of Mechanical Engineering"
        ]
      },
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Agricultural Economics and Extension",
          "Department of Crop Production",
          "Department of Animal Production",
          "Department of Fisheries and Aquaculture"
        ]
      },
      {
        name: "Faculty of Law",
        departments: ["Department of Commercial Law", "Department of International Law", "Department of Public Law", "Department of Jurisprudence"]
      },
      {
        name: "Faculty of Science Laboratory Technology",
        departments: ["Department of Analytical Chemistry", "Department of Microbiology", "Department of Biomedical Science"]
      },
      { name: "Business School", departments: ["MBA Programme", "Executive MBA"] }
    ]
  },
  {
    code: "UNIUYO",
    name: "University of Uyo",
    schools: [
      {
        name: "Faculty of Natural and Applied Sciences",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Geology",
          "Department of Computer Science",
          "Department of Microbiology"
        ]
      },
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Crop Production",
          "Department of Animal Science",
          "Department of Agricultural Economics and Extension",
          "Department of Soil Science",
          "Department of Forestry and Wildlife Management"
        ]
      },
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English Studies",
          "Department of History",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of African Languages",
          "Department of Communication Arts"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Curriculum Studies",
          "Department of Educational Administration",
          "Department of Guidance and Counselling",
          "Department of Science Education"
        ]
      },
      {
        name: "Faculty of Social Sciences",
        departments: [
          "Department of Economics",
          "Department of Sociology",
          "Department of Political Science",
          "Department of Geography and Environmental Management",
          "Department of Psychology"
        ]
      },
      {
        name: "Faculty of Pharmacy",
        departments: [
          "Department of Pharmacology",
          "Department of Pharmaceutical Chemistry",
          "Department of Pharmacognosy",
          "Department of Pharmacy Practice"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical Engineering",
          "Department of Mechanical Engineering",
          "Department of Chemical Engineering"
        ]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Environmental Studies",
        departments: ["Department of Environmental Management", "Department of Urban and Regional Planning", "Department of Architecture"]
      },
      {
        name: "College of Health Sciences",
        departments: [
          "Department of Nursing Science",
          "Department of Medical Laboratory Science",
          "Department of Public Health",
          "Department of Health Education"
        ]
      }
    ]
  },
  {
    code: "FUTA",
    name: "Federal University of Technology, Akure",
    schools: [
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical Engineering",
          "Department of Mechanical Engineering",
          "Department of Chemical Engineering",
          "Department of Mining Engineering",
          "Department of Geotechnical Engineering"
        ]
      },
      {
        name: "Faculty of Technology",
        departments: ["Department of Building Technology", "Department of Estate Management", "Department of Surveying and Geoinformatics"]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Physics",
          "Department of Chemistry",
          "Department of Biology",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Agriculture and Forestry",
        departments: [
          "Department of Crop Production",
          "Department of Animal Science",
          "Department of Agricultural Economics",
          "Department of Forest Resources Management",
          "Department of Horticulture"
        ]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Science Education", "Department of Technology Education", "Department of Mathematics Education"]
      },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration"]
      }
    ]
  },

  // ── SOUTHERN NIGERIA — STATE UNIVERSITIES ──────────────────────────
  {
    code: "UNIOSUN",
    name: "Osun State University",
    schools: [
      {
        name: "Faculty of Law",
        departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law", "Department of International Law"]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Physics",
          "Department of Chemistry",
          "Department of Biology",
          "Department of Mathematics",
          "Department of Geology",
          "Department of Microbiology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Mechanical Engineering", "Department of Electrical Engineering", "Department of Chemical Engineering"]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Curriculum Studies",
          "Department of Educational Administration",
          "Department of Guidance and Counselling",
          "Department of Science Education"
        ]
      },
      {
        name: "Faculty of Humanities and Culture",
        departments: [
          "Department of English Studies",
          "Department of History",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of Language Studies"
        ]
      },
      {
        name: "Faculty of Social Sciences and Management",
        departments: ["Department of Economics", "Department of Sociology", "Department of Business Administration", "Department of Political Science"]
      },
      {
        name: "Faculty of Health Sciences",
        departments: [
          "Department of Nursing Science",
          "Department of Public Health",
          "Department of Health Education",
          "Department of Medical Laboratory Science"
        ]
      },
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Crop Production",
          "Department of Animal Science",
          "Department of Soil Science",
          "Department of Agricultural Economics"
        ]
      }
    ]
  },
  {
    code: "AAUA",
    name: "Adekunle Ajasin University",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Geology",
          "Department of Computer Science",
          "Department of Microbiology"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Science Education",
          "Department of Arts Education",
          "Department of Curriculum Studies",
          "Department of Educational Management"
        ]
      },
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English Studies",
          "Department of History",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of Performing Arts"
        ]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Business Administration", "Department of Accounting", "Department of Finance"]
      }
    ]
  },
  {
    code: "UNIMED",
    name: "University of Medical Sciences",
    schools: [
      {
        name: "Faculty of Medicine",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry",
          "Department of Anaesthesia",
          "Department of Radiology"
        ]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: ["Department of Clinical Pathology", "Department of Radiology", "Department of Anesthesia"]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology", "Department of Pharmacology"]
      },
      {
        name: "Faculty of Nursing Sciences",
        departments: [
          "Department of General Nursing",
          "Department of Midwifery",
          "Department of Psychiatric Nursing",
          "Department of Community Health Nursing"
        ]
      },
      {
        name: "Faculty of Public Health",
        departments: [
          "Department of Epidemiology",
          "Department of Environmental Health",
          "Department of Health Promotion and Education",
          "Department of Community Medicine"
        ]
      }
    ]
  },
  {
    code: "OOU",
    name: "Olabisi Onabanjo University",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Geology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Arts",
        departments: ["Department of English Studies", "Department of History", "Department of Philosophy", "Department of Religious Studies"]
      },
      { name: "Faculty of Education", departments: ["Department of Science Education", "Department of Arts Education", "Department of Curriculum Studies"] },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering"]
      },
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Agricultural Economics", "Department of Soil Science"]
      },
      { name: "Faculty of Social Sciences", departments: ["Department of Economics", "Department of Sociology", "Department of Political Science"] }
    ]
  },
  {
    code: "TASUED",
    name: "Tai Solarin University of Education",
    schools: [
      {
        name: "Faculty of Science Education",
        departments: [
          "Department of Science Education",
          "Department of Physics Education",
          "Department of Chemistry Education",
          "Department of Biology Education",
          "Department of Mathematics Education",
          "Department of Integrated Science Education"
        ]
      },
      {
        name: "Faculty of Arts Education",
        departments: [
          "Department of English Education",
          "Department of Social Studies Education",
          "Department of History Education",
          "Department of Religious Studies Education"
        ]
      },
      {
        name: "Faculty of Vocational Education",
        departments: ["Department of Business Education", "Department of Technical Education", "Department of Home Economics Education"]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Educational Administration",
          "Department of Curriculum Studies",
          "Department of Counselling Psychology",
          "Department of Guidance and Counselling"
        ]
      }
    ]
  },
  {
    code: "LASUSTECH",
    name: "Lagos State University of Science and Technology",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Technology",
        departments: [
          "Department of Electrical and Electronics Engineering",
          "Department of Mechanical Engineering",
          "Department of Civil Engineering",
          "Department of Chemical Engineering"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Computer Engineering", "Department of Biomedical Engineering"]
      },
      {
        name: "Faculty of Applied Sciences",
        departments: ["Department of Applied Chemistry", "Department of Applied Physics", "Department of Environmental Science"]
      }
    ]
  },
  {
    code: "MAUSTECH",
    name: "Moshood Abiola University of Science and Technology",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Technology",
        departments: [
          "Department of Civil Engineering",
          "Department of Mechanical Engineering",
          "Department of Electrical Engineering",
          "Department of Chemical Engineering"
        ]
      },
      { name: "Faculty of Engineering", departments: ["Department of Computer Science", "Department of Software Engineering"] },
      {
        name: "Faculty of Environmental Sciences",
        departments: ["Department of Environmental Science", "Department of Environmental Management", "Department of Urban and Regional Planning"]
      }
    ]
  },
  {
    code: "RSU",
    name: "Rivers State University",
    schools: [
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Crop Production",
          "Department of Animal Science",
          "Department of Soil Science",
          "Department of Agricultural Economics and Extension",
          "Department of Fisheries and Aquaculture",
          "Department of Forestry and Wildlife",
          "Department of Horticulture",
          "Department of Veterinary Science",
          "Department of Agricultural Technology"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical Engineering",
          "Department of Mechanical Engineering",
          "Department of Chemical/Petrochemical Engineering",
          "Department of Marine Engineering",
          "Department of Environmental Engineering",
          "Department of Petroleum Engineering"
        ]
      },
      {
        name: "Faculty of Environmental Sciences",
        departments: [
          "Department of Environmental Management",
          "Department of Urban and Regional Planning",
          "Department of Climate and Environmental Studies",
          "Department of Architecture",
          "Department of Estate Management"
        ]
      },
      {
        name: "Faculty of Law",
        departments: ["Department of Public Law", "Department of Private Law", "Department of Business Law", "Department of International Law"]
      },
      {
        name: "Faculty of Management Sciences",
        departments: [
          "Department of Business Administration",
          "Department of Accounting",
          "Department of Finance",
          "Department of Marketing",
          "Department of Office Management"
        ]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Chemistry",
          "Department of Biochemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Computer Science",
          "Department of Animal and Environmental Biology",
          "Department of Microbiology",
          "Department of Plant Science and Biotechnology",
          "Department of Geology",
          "Department of Maritime Science"
        ]
      },
      {
        name: "Faculty of Technical and Science Education",
        departments: ["Department of Science Education", "Department of Technical Education", "Department of Mathematics Education"]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology", "Department of Pharmacology"]
      },
      {
        name: "Faculty of Basic Clinical Sciences",
        departments: ["Department of Surgery", "Department of Medicine"]
      },
      {
        name: "Faculty of Clinical Sciences",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics"
        ]
      },
      {
        name: "Faculty of Communication and Media Studies",
        departments: [
          "Department of Mass Communication",
          "Department of Broadcasting and Cinematography",
          "Department of Advertising and Public Relations"
        ]
      },
      {
        name: "Faculty of Humanities",
        departments: ["Department of English Language and Literature", "Department of History", "Department of Philosophy", "Department of Religious Studies"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Geography", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Curriculum Studies", "Department of Educational Management", "Department of Guidance and Counselling"]
      }
    ]
  },
  {
    code: "AKSU",
    name: "Akwa Ibom State University",
    schools: [
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Chemical/Petrochemical Engineering",
          "Department of Mechanical/Aerospace Engineering",
          "Department of Civil Engineering",
          "Department of Marine/Naval Architecture Engineering",
          "Department of Agricultural Engineering",
          "Department of Electrical/Electronic Engineering"
        ]
      },
      {
        name: "Faculty of Physical Sciences",
        departments: [
          "Department of Physics Science",
          "Department of Chemistry Science",
          "Department of Mathematics and Statistics",
          "Department of Geology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Biological Sciences",
        departments: [
          "Department of Biological Science",
          "Department of Zoology",
          "Department of Botany",
          "Department of Microbiology",
          "Department of Marine Biology",
          "Department of Genetics and Biotechnology"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Mathematics Education",
          "Department of Chemistry Education",
          "Department of Biology Education",
          "Department of Integrated Science Education",
          "Department of Physics Education"
        ]
      },
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Agricultural Economics and Extension",
          "Department of Soil Science",
          "Department of Crop Science",
          "Department of Animal Science"
        ]
      },
      { name: "Faculty of Social Sciences", departments: ["Department of Economics", "Department of Sociology", "Department of Psychology", "Department of Political Science"] },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Business Administration", "Department of Accounting", "Department of Banking and Finance"]
      },
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English and Literary Studies",
          "Department of Religious and International Studies",
          "Department of Performing Arts"
        ]
      }
    ]
  },
  {
    code: "DELSU",
    name: "Delta State University",
    schools: [
      {
        name: "Faculty of Medicine",
        departments: [
          "Department of Internal Medicine",
          "Department of Surgery",
          "Department of Obstetrics and Gynaecology",
          "Department of Paediatrics",
          "Department of Psychiatry",
          "Department of Radiology"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology", "Department of Pharmacology"]
      },
      {
        name: "Faculty of Science",
        departments: [
          "Department of Biology",
          "Department of Chemistry",
          "Department of Physics",
          "Department of Mathematics",
          "Department of Microbiology",
          "Department of Computer Science"
        ]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Curriculum Studies", "Department of Educational Administration", "Department of Science Education"]
      },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Mechanical Engineering", "Department of Electrical Engineering"]
      },
      { name: "Faculty of Social Sciences", departments: ["Department of Economics", "Department of Sociology", "Department of Political Science"] }
    ]
  },
  {
    code: "DOU",
    name: "Dennis Osadebay University",
    schools: [
      { name: "Faculty of Arts", departments: ["Department of English Studies", "Department of History", "Department of Philosophy", "Department of Religious Studies"] },
      {
        name: "Faculty of Science",
        departments: ["Department of Biology", "Department of Chemistry", "Department of Physics", "Department of Mathematics"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      { name: "Faculty of Education", departments: ["Department of Science Education", "Department of Arts Education"] },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Business Administration", "Department of Accounting"]
      }
    ]
  },
  {
    code: "UNICROSS",
    name: "University of Cross River State",
    schools: [
      {
        name: "Faculty of Biological Sciences",
        departments: ["Department of Microbiology", "Department of Animal Health and Environmental Biology", "Department of Plant Science and Biotechnology"]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Educational Management", "Department of Educational Technology", "Department of Science Education"]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Civil Engineering",
          "Department of Electrical Engineering",
          "Department of Mechanical Engineering",
          "Department of Computer Engineering"
        ]
      },
      {
        name: "Faculty of Science",
        departments: ["Department of Physics", "Department of Chemistry", "Department of Biology", "Department of Mathematics", "Department of Geology"]
      },
      {
        name: "Faculty of Environmental Sciences",
        departments: ["Department of Environmental Management", "Department of Urban Planning"]
      },
      {
        name: "Faculty of Communication Technology",
        departments: ["Department of Mass Communication", "Department of Broadcast Technology"]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry"]
      },
      { name: "Faculty of Management Sciences", departments: ["Department of Business Administration", "Department of Accounting"] },
      {
        name: "Faculty of Agriculture and Forestry",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Forestry"]
      }
    ]
  },

  // ── SOUTHERN NIGERIA — COLLEGES / POLYTECHNICS ─────────────────────
  {
    code: "FCET",
    name: "Federal College of Education, Technical (Ekiadolor)",
    schools: [
      {
        name: "Academic Departments",
        departments: ["Technical Education", "Science Education", "Mathematics Education", "Physics Education", "Chemistry Education", "Vocational Education"]
      }
    ]
  },
  {
    code: "AKSPOLY",
    name: "Akwa Ibom State Polytechnic",
    schools: [
      {
        name: "School of Applied Sciences",
        departments: [
          "Department of Computer Science",
          "Department of Hotel and Catering Management",
          "Department of Science Technology",
          "Department of Statistics"
        ]
      },
      {
        name: "School of Business Management",
        departments: [
          "Department of Accountancy",
          "Department of Business Administration",
          "Department of Office Technology & Management",
          "Department of Marketing",
          "Department of Public Administration"
        ]
      },
      {
        name: "School of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering"]
      },
      {
        name: "School of Communication Arts",
        departments: ["Department of Mass Communication", "Department of Broadcast Technology"]
      },
      {
        name: "School of Environmental Studies",
        departments: ["Department of Environmental Science", "Department of Urban Planning"]
      },
      { name: "School of Legal Studies", departments: ["Department of Law and Legal Studies"] }
    ]
  },
  {
    code: "RIVCOHSMAT",
    name: "Rivers State College of Health Science and Management Technology",
    schools: [
      {
        name: "Academic Programme Departments",
        departments: [
          "Nursing",
          "Medical Laboratory Science",
          "Public Health",
          "Environmental Health",
          "Health Information Management",
          "Health Education",
          "Physiotherapy",
          "Radiography"
        ]
      }
    ]
  },

  // ── SOUTHERN NIGERIA — UNN (full) + 6 missing states ───────────────
  {
    code: "UNN",
    name: "University of Nigeria, Nsukka",
    note: "First university in Nigeria",
    schools: [
      {
        name: "Faculty of Arts",
        departments: [
          "Department of English Language",
          "Department of History",
          "Department of Philosophy",
          "Department of Religious Studies",
          "Department of African Languages",
          "Department of Classics"
        ]
      },
      {
        name: "Faculty of Science",
        departments: ["Department of Physics", "Department of Chemistry", "Department of Biology", "Department of Mathematics", "Department of Geology", "Department of Microbiology", "Department of Computer Science"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology", "Department of Geography"]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Curriculum Studies", "Department of Educational Administration", "Department of Educational Foundations", "Department of Science Education"]
      },
      {
        name: "Faculty of Medicine",
        departments: ["Department of Internal Medicine", "Department of Surgery", "Department of Obstetrics and Gynaecology", "Department of Paediatrics", "Department of Psychiatry", "Department of Anaesthesia"]
      },
      { name: "Faculty of Dentistry", departments: ["Department of Restorative Dentistry", "Department of Oral Surgery", "Department of Preventive Dentistry"] },
      { name: "Faculty of Pharmacy", departments: ["Department of Pharmaceutics", "Department of Pharmaceutical Chemistry", "Department of Pharmacology and Toxicology"] },
      {
        name: "Faculty of Nursing",
        departments: ["Department of Adult Nursing", "Department of Midwifery and Public Health Nursing", "Department of Psychiatric Nursing"]
      },
      {
        name: "Faculty of Veterinary Medicine",
        departments: ["Department of Veterinary Surgery and Reproduction", "Department of Veterinary Pathology", "Department of Veterinary Physiology"]
      },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering", "Department of Chemical Engineering"]
      },
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science", "Department of Agricultural Economics"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Environmental Sciences",
        departments: ["Department of Urban and Regional Planning", "Department of Architecture"]
      },
      {
        name: "Faculty of Technology",
        departments: ["Department of Electronic Engineering", "Department of Metallurgical Engineering"]
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Department of Medical Laboratory Science", "Department of Public Health"]
      }
    ]
  },
  {
    code: "UNIZIK",
    name: "Nnamdi Azikiwe University",
    schools: [
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science", "Department of Agricultural Economics and Extension"]
      },
      {
        name: "Faculty of Arts",
        departments: ["Department of English Language and Literature", "Department of History and Diplomatic Studies", "Department of Philosophy", "Department of Religious Studies", "Department of African Languages"]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pharmacology"]
      },
      {
        name: "Faculty of Biosciences",
        departments: ["Department of Applied Biochemistry", "Department of Applied Microbiology", "Department of Parasitology and Entomology", "Department of Zoology"]
      },
      {
        name: "Faculty of Education",
        departments: ["Department of Educational Administration", "Department of Curriculum Studies", "Department of Teacher Education", "Department of Science Education"]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Agriculture and Bio-resources Engineering",
          "Department of Chemical Engineering",
          "Department of Civil Engineering",
          "Department of Electronic and Computer Engineering",
          "Department of Electrical Engineering",
          "Department of Industrial/Production Engineering",
          "Department of Mechanical Engineering",
          "Department of Metallurgical and Materials Engineering"
        ]
      },
      {
        name: "Faculty of Environmental Sciences",
        departments: ["Department of Environmental Management", "Department of Urban and Regional Planning"]
      },
      {
        name: "Faculty of Health Sciences and Technology",
        departments: ["Department of Nursing Science", "Department of Public Health", "Department of Health Education"]
      },
      {
        name: "Faculty of Law",
        departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial and Industrial Law"]
      },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of Finance", "Department of Marketing"]
      },
      {
        name: "Faculty of Medicine",
        departments: ["Department of Internal Medicine", "Department of Surgery", "Department of Obstetrics and Gynaecology", "Department of Paediatrics", "Department of Psychiatry"]
      },
      {
        name: "Faculty of Medical Laboratory Sciences",
        departments: ["Department of Medical Laboratory Science", "Department of Medical Microbiology"]
      },
      { name: "Faculty of Pharmaceutical Sciences", departments: ["Department of Pharmacognosy", "Department of Pharmaceutical Chemistry", "Department of Pharmacology"] },
      { name: "Faculty of Physical Sciences", departments: ["Department of Physics", "Department of Chemistry", "Department of Mathematics", "Department of Geology"] },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      {
        name: "Faculty of Vocational Education",
        departments: ["Department of Business Education", "Department of Technical Education"]
      }
    ]
  },
  {
    code: "FUOYE",
    name: "Federal University Oye Ekiti",
    schools: [
      {
        name: "Faculty of Agriculture",
        departments: [
          "Department of Agricultural Economics and Extension",
          "Department of Fisheries and Aquaculture",
          "Department of Soil and Land Management",
          "Department of Animal Production and Health",
          "Department of Crop Production and Horticulture",
          "Department of Food Science Technology",
          "Department of Water Resources and Meteorology",
          "Department of Tourism and Hospitality"
        ]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: [
          "Department of Anatomy",
          "Department of Medical Laboratory Science",
          "Department of Physiology",
          "Department of Nursing",
          "Department of Radiography and Radiation Sciences"
        ]
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Department of Agricultural and Bio-Resources Engineering",
          "Department of Civil Engineering",
          "Department of Computer Engineering",
          "Department of Electrical and Electronics Engineering",
          "Department of Mechanical and Production Engineering"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Adult Education",
          "Department of Mathematics Education",
          "Department of English Education",
          "Department of Biology Education",
          "Department of Library and Information Science",
          "Department of Chemistry Education",
          "Department of Business Education",
          "Department of Agricultural Education",
          "Department of Educational Management"
        ]
      },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Finance", "Department of Public Administration", "Department of Business Administration"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law"] },
      { name: "Faculty of Pharmacy", departments: ["Department of Pharmacology", "Department of Pharmaceutical Chemistry"] },
      { name: "Faculty of Medicine", departments: ["Department of Medicine and Surgery"] },
      {
        name: "Faculty of Environmental Sciences",
        departments: [
          "Department of Architecture",
          "Department of Building",
          "Department of Estate Management",
          "Department of Surveying and Geoinformatics",
          "Department of Quantity Surveying",
          "Department of Urban and Regional Planning"
        ]
      }
    ]
  },
  {
    code: "ESUT",
    name: "Enugu State University of Science and Technology",
    schools: [
      {
        name: "Faculty of Science",
        departments: ["Department of Biology", "Department of Chemistry", "Department of Physics", "Department of Mathematics", "Department of Geology", "Department of Microbiology", "Department of Computer Science"]
      },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering", "Department of Chemical Engineering", "Department of Metallurgical Engineering"]
      },
      { name: "Faculty of Technology", departments: ["Department of Building", "Department of Estate Management", "Department of Surveying"] },
      {
        name: "Faculty of Education",
        departments: ["Department of Science Education", "Department of Arts Education", "Department of Curriculum Studies"]
      },
      { name: "Faculty of Arts", departments: ["Department of English Studies", "Department of History", "Department of Philosophy", "Department of Religious Studies"] },
      { name: "Faculty of Social Sciences", departments: ["Department of Economics", "Department of Sociology", "Department of Political Science"] },
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science", "Department of Agricultural Economics"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law"] },
      {
        name: "Faculty of Medicine",
        departments: ["Department of Medicine", "Department of Surgery", "Department of Obstetrics and Gynaecology"]
      }
    ]
  },
  {
    code: "EBSU",
    name: "Ebonyi State University",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Applied Biology",
          "Department of Applied Microbiology",
          "Department of Biochemistry",
          "Department of Biotechnology",
          "Department of Computer Science",
          "Department of Geology/Exploration",
          "Department of Industrial Chemistry",
          "Department of Industrial Mathematics & Statistics",
          "Department of Industrial Physics"
        ]
      },
      {
        name: "Faculty of Agricultural and Natural Resource Management",
        departments: [
          "Department of Agricultural Economics & Extension",
          "Department of Animal Science",
          "Department of Crop Science",
          "Department of Forest Resources"
        ]
      },
      {
        name: "Faculty of Arts and Humanities",
        departments: [
          "Department of English and Literary Studies",
          "Department of Linguistics and French",
          "Department of History and International Relations",
          "Department of Philosophy",
          "Department of Religious Studies"
        ]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of Finance"]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Science Education",
          "Department of Arts Education",
          "Department of Curriculum Studies",
          "Department of Educational Administration"
        ]
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Department of Nursing Science", "Department of Public Health", "Department of Health Sciences"]
      },
      {
        name: "Faculty of Basic Medical Sciences",
        departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pharmacology"]
      }
    ]
  },
  {
    code: "KDUMSM",
    name: "King David Umahi University of Medical Sciences",
    schools: [
      {
        name: "Faculty of Medicine",
        departments: ["Department of Medicine and Surgery", "Department of Obstetrics and Gynaecology", "Department of Paediatrics", "Department of Surgery"]
      },
      { name: "Faculty of Basic Medical Sciences", departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pathology"] },
      {
        name: "Faculty of Nursing Sciences",
        departments: ["Department of General Nursing", "Department of Midwifery", "Department of Public Health Nursing"]
      },
      { name: "Faculty of Medical Laboratory Sciences", departments: ["Department of Medical Laboratory Science", "Department of Immunology"] }
    ]
  },
  {
    code: "NDU",
    name: "Niger Delta University",
    schools: [
      {
        name: "Faculty of Arts",
        departments: ["Department of English Language and Literature", "Department of History", "Department of Philosophy", "Department of Religious Studies", "Department of African Languages"]
      },
      { name: "Faculty of Education", departments: ["Department of Curriculum Studies", "Department of Educational Administration", "Department of Science Education"] },
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering", "Department of Chemical and Petroleum Engineering"]
      },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of Finance", "Department of Management"]
      },
      {
        name: "Faculty of Science",
        departments: ["Department of Physics", "Department of Chemistry", "Department of Biology", "Department of Mathematics", "Department of Geology", "Department of Microbiology"]
      },
      {
        name: "Faculty of Social Sciences",
        departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"]
      },
      {
        name: "Faculty of Agricultural Technology",
        departments: ["Department of Agricultural Economics and Rural Sociology", "Department of Crop and Soil Science", "Department of Animal Production"]
      },
      { name: "Faculty of Basic Medical Sciences", departments: ["Department of Anatomy", "Department of Physiology", "Department of Biochemistry", "Department of Pharmacology"] },
      {
        name: "Faculty of Nursing",
        departments: ["Department of General Nursing", "Department of Midwifery", "Department of Public Health Nursing"]
      },
      { name: "Faculty of Pharmacy", departments: ["Department of Pharmaceutics", "Department of Pharmaceutical Chemistry", "Department of Pharmacology"] },
      {
        name: "College of Health Sciences",
        departments: ["Department of Medical Laboratory Science", "Department of Radiography"]
      }
    ]
  },
  {
    code: "EKSU",
    name: "Ekiti State University",
    schools: [
      {
        name: "Faculty of Science",
        departments: [
          "Department of Physics",
          "Department of Chemistry",
          "Department of Biology",
          "Department of Mathematics",
          "Department of Geology",
          "Department of Microbiology",
          "Department of Botany",
          "Department of Zoology",
          "Department of Computer Science",
          "Department of Industrial Physics",
          "Department of Industrial Chemistry",
          "Department of Biochemistry"
        ]
      },
      {
        name: "Faculty of Education",
        departments: [
          "Department of Educational Administration",
          "Department of Curriculum Studies and Instructional Technology",
          "Department of Science Education",
          "Department of Arts Education"
        ]
      },
      { name: "Faculty of Arts", departments: ["Department of English Language and Literature", "Department of History", "Department of Philosophy", "Department of Religious Studies"] },
      { name: "Faculty of Social Sciences", departments: ["Department of Economics", "Department of Sociology", "Department of Political Science", "Department of Psychology"] },
      { name: "Faculty of Law", departments: ["Department of Public Law", "Department of Private Law", "Department of Commercial Law"] },
      { name: "Faculty of Engineering", departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering"] },
      {
        name: "Faculty of Agricultural Sciences",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science", "Department of Agricultural Economics"]
      },
      {
        name: "Faculty of Management Sciences",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of Banking and Finance"]
      },
      {
        name: "Faculty of Health Sciences",
        departments: ["Department of Nursing Science", "Department of Public Health", "Department of Health Education"]
      },
      {
        name: "Faculty of Medicine",
        departments: ["Department of Medicine and Surgery", "Department of Obstetrics and Gynaecology", "Department of Paediatrics"]
      }
    ]
  },
  {
    code: "OSUTUTECH",
    name: "Oyo State Technical University Ibadan",
    schools: [
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering", "Department of Chemical Engineering"]
      },
      {
        name: "Faculty of Science",
        departments: ["Department of Physics", "Department of Chemistry", "Department of Biology", "Department of Mathematics", "Department of Computer Science"]
      },
      { name: "Faculty of Technology", departments: ["Department of Building", "Department of Estate Management", "Department of Surveying"] },
      {
        name: "Faculty of Education",
        departments: ["Department of Science Education", "Department of Technical Education", "Department of Mathematics Education"]
      },
      { name: "Faculty of Management Sciences", departments: ["Department of Accounting", "Department of Business Administration"] },
      { name: "Faculty of Agriculture", departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science"] },
      {
        name: "Faculty of Environmental Studies",
        departments: ["Department of Environmental Science", "Department of Urban Planning"]
      }
    ]
  },
  {
    code: "EAUC",
    name: "Emmanuel Alayande University of Education",
    schools: [
      {
        name: "Academic Departments",
        departments: ["Science Education", "Arts Education", "Mathematics Education", "English Education", "History Education", "Business Education"]
      }
    ]
  },
  {
    code: "LAUTECH",
    name: "Ladoke Akintola University of Technology",
    schools: [
      {
        name: "Faculty of Engineering",
        departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering", "Department of Chemical Engineering"]
      },
      { name: "Faculty of Science", departments: ["Department of Physics", "Department of Chemistry", "Department of Biology", "Department of Mathematics"] },
      { name: "Faculty of Technology", departments: ["Department of Building", "Department of Estate Management", "Department of Surveying"] },
      { name: "Faculty of Education", departments: ["Department of Science Education", "Department of Arts Education"] },
      {
        name: "Faculty of Agriculture",
        departments: ["Department of Crop Production", "Department of Animal Science", "Department of Soil Science", "Department of Agricultural Economics"]
      },
      {
        name: "Faculty of Pure and Applied Sciences",
        departments: ["Department of Applied Microbiology", "Department of Applied Biochemistry"]
      },
      { name: "Faculty of Clinical Sciences", departments: ["Department of Medicine", "Department of Nursing"] },
      { name: "Faculty of Management Sciences", departments: ["Department of Accounting", "Department of Business Administration"] }
    ]
  },
  {
    code: "ICELAN",
    name: "College of Education, Lanlate",
    schools: [
      {
        name: "Academic Departments",
        departments: ["Science Education", "Arts Education", "Mathematics Education", "Physical Education"]
      }
    ]
  },
  {
    code: "OCKPOLY",
    name: "Oke-Ogun Polytechnic",
    schools: [
      { name: "School of Engineering", departments: ["Department of Civil Engineering", "Department of Electrical Engineering", "Department of Mechanical Engineering"] },
      {
        name: "School of Business and Humanities",
        departments: ["Department of Accounting", "Department of Business Administration", "Department of English"]
      },
      {
        name: "School of Science and Technology",
        departments: ["Department of Science Laboratory Technology", "Department of Computer Science"]
      }
    ]
  },
  {
    code: "IBARAPOLY",
    name: "Ibarapa Polytechnic",
    schools: [
      { name: "School of Engineering", departments: ["Department of Civil Engineering", "Department of Mechanical Engineering"] },
      { name: "School of Business Studies", departments: ["Department of Accounting", "Department of Business Administration"] }
    ]
  },
  {
    code: "OSCATT",
    name: "Oyo State College of Agriculture and Technology",
    schools: [
      {
        name: "Academic Departments",
        departments: ["Crop Production", "Animal Production", "Soil Science", "Agricultural Economics", "Food Science and Technology"]
      }
    ]
  },

  // ── Other planned-expansion schools (stub faculty lists) ───────────
  {
    code: "ABU",
    name: "Ahmadu Bello University, Zaria",
    schools: [
      { name: "Faculty of Engineering", departments: ["Computer Eng.", "Electrical Eng.", "Chemical Eng."] },
      { name: "Faculty of Science", departments: ["Computer Science", "Mathematics"] }
    ]
  },
  {
    code: "OAU",
    name: "Obafemi Awolowo University",
    schools: [
      { name: "Faculty of Technology", departments: ["Computer Science & Eng.", "Electronic & Electrical Eng."] },
      { name: "Faculty of Science", departments: ["Mathematics", "Physics"] }
    ]
  },
  {
    code: "UNIBEN",
    name: "University of Benin",
    schools: [
      { name: "Faculty of Engineering", departments: ["Computer Eng.", "Mechanical Eng."] },
      { name: "Faculty of Physical Sciences", departments: ["Computer Science", "Mathematics"] }
    ]
  }
];

/** Institutions where the app is live today (app.uniui.com.ng). */
export const LIVE_INSTITUTIONS = INSTITUTIONS.filter((i) => i.live).map((i) => i.code);

/** Institutions currently on the waitlist (first wave lands November 2026). */
export const WAITLIST_INSTITUTIONS = INSTITUTIONS.filter((i) => !i.live).map((i) => i.code);

export const isLiveInstitution = (code: string) => LIVE_INSTITUTIONS.includes(code);
