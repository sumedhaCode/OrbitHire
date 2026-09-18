import bcrypt from "bcryptjs";
import { connectDb } from "./db";
import { Application, Job, User } from "./models";

const DEMO_PASSWORD = "Campus@2026";

export async function ensureSeeded() {
  await connectDb();
  const count = await User.countDocuments();
  if (count > 0) return { seeded: false };
  await seedDatabase();
  return { seeded: true };
}

export async function seedDatabase() {
  await connectDb();
  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const [tpo, recruiterPay, recruiterCloud, recruiterLabs, ...students] =
    await User.create([
      {
        name: "Ananya Deshmukh",
        email: "tpo@orbithire.dev",
        passwordHash,
        role: "tpo",
        college: "National Institute of Technology, Nagpur",
        designation: "Training & Placement Officer",
      },
      {
        name: "Rahul Iyer",
        email: "recruiter@orbithire.dev",
        passwordHash,
        role: "recruiter",
        companyName: "HelixPay",
        designation: "University Hiring Lead",
      },
      {
        name: "Priya Raman",
        email: "cloud@orbithire.dev",
        passwordHash,
        role: "recruiter",
        companyName: "Vertex Cloud",
        designation: "Campus Recruiter",
      },
      {
        name: "Arjun Mehta",
        email: "labs@orbithire.dev",
        passwordHash,
        role: "recruiter",
        companyName: "Northstar Labs",
        designation: "Engineering Manager",
      },
      {
        name: "Sumedha Dehankar",
        email: "student@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "CSE",
        cgpa: 8.7,
        graduationYear: 2026,
        rollNumber: "BT21CSE042",
        skills: ["TypeScript", "Next.js", "MongoDB", "System Design"],
        bio: "Full-stack internships at two product startups. Building placement tooling for the TPO cell.",
        resumeUrl: "https://example.com/resume-sumedha.pdf",
      },
      {
        name: "Ishaan Kapoor",
        email: "ishaan@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "CSE",
        cgpa: 9.1,
        graduationYear: 2026,
        rollNumber: "BT21CSE011",
        skills: ["Java", "Spring", "Kafka", "SQL"],
        bio: "Backend-heavy profile. Open-source contributor to a JVM metrics library.",
      },
      {
        name: "Meera Nair",
        email: "meera@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "ECE",
        cgpa: 8.2,
        graduationYear: 2026,
        rollNumber: "BT21ECE028",
        skills: ["Python", "DSP", "C++", "ML"],
        bio: "Signal processing + applied ML. Looking at embedded and silicon roles.",
      },
      {
        name: "Kabir Shah",
        email: "kabir@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "IT",
        cgpa: 7.8,
        graduationYear: 2026,
        rollNumber: "BT21IT019",
        skills: ["React", "Node.js", "AWS"],
        bio: "Shipped the college fest app used by 4,000 students.",
      },
      {
        name: "Diya Banerjee",
        email: "diya@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "AI & DS",
        cgpa: 8.9,
        graduationYear: 2026,
        rollNumber: "BT21AIDS007",
        skills: ["PyTorch", "NLP", "Python", "SQL"],
        bio: "Research intern — information retrieval on noisy campus datasets.",
      },
      {
        name: "Rohan Patel",
        email: "rohan@orbithire.dev",
        passwordHash,
        role: "student",
        branch: "EE",
        cgpa: 8.0,
        graduationYear: 2026,
        rollNumber: "BT21EE033",
        skills: ["C", "MATLAB", "Power Systems"],
        bio: "Core electrical with a software minor. Targeting grid + product hybrids.",
      },
    ]);

  const inDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const jobs = await Job.create([
    {
      title: "Software Engineer, Graduate",
      companyName: "HelixPay",
      companyIndustry: "Fintech",
      recruiterId: recruiterPay._id,
      location: "Bengaluru · Hybrid",
      type: "full-time",
      ctcLpa: 18,
      minCgpa: 7.5,
      branches: ["CSE", "IT", "ECE"],
      skills: ["TypeScript", "Java", "System Design", "SQL"],
      description:
        "Build ledger-safe payment APIs used by 2M merchants. You will own a slice of checkout reliability, write design docs, and sit with fraud analysts once a week.\n\nWhat you will do\n• Ship production services in TypeScript/Java\n• On-call for your team's APIs after a 6-week ramp\n• Pair with seniors on capacity planning before festive traffic\n\nEligibility\n• 2026 batch, CGPA ≥ 7.5\n• At least one internship or substantial project with real users",
      openings: 8,
      deadline: inDays(18),
      status: "open",
    },
    {
      title: "SDE Intern — Platform",
      companyName: "HelixPay",
      companyIndustry: "Fintech",
      recruiterId: recruiterPay._id,
      location: "Pune · Onsite",
      type: "internship",
      stipend: "₹80,000 / month",
      minCgpa: 7.0,
      branches: ["CSE", "IT"],
      skills: ["Next.js", "MongoDB", "Node.js"],
      description:
        "8-week internship on the internal merchant dashboard. You will add audit trails, role-based views, and a query layer over MongoDB change streams.\n\nPPO is on the table for interns who land a measurable latency or reliability win.",
      openings: 6,
      deadline: inDays(12),
      status: "open",
    },
    {
      title: "Cloud Engineer",
      companyName: "Vertex Cloud",
      companyIndustry: "Infrastructure",
      recruiterId: recruiterCloud._id,
      location: "Hyderabad · Hybrid",
      type: "full-time",
      ctcLpa: 22,
      minCgpa: 8.0,
      branches: ["CSE", "IT", "EE"],
      skills: ["AWS", "Linux", "Networking", "Python"],
      description:
        "Operate the control plane for a multi-tenant Kubernetes product. First six months: observability, IAM reviews, and a production incident simulation every sprint.",
      openings: 4,
      deadline: inDays(21),
      status: "open",
    },
    {
      title: "Product Engineer",
      companyName: "Northstar Labs",
      companyIndustry: "B2B SaaS",
      recruiterId: recruiterLabs._id,
      location: "Remote (India)",
      type: "full-time",
      ctcLpa: 16,
      minCgpa: 7.0,
      branches: ["CSE", "IT", "AI & DS"],
      skills: ["React", "TypeScript", "System Design"],
      description:
        "Small product squad. You will talk to design, write the API, and ship the UI for workflow automation used by mid-market ops teams.",
      openings: 5,
      deadline: inDays(9),
      status: "open",
    },
    {
      title: "ML Engineer, New Grad",
      companyName: "Northstar Labs",
      companyIndustry: "B2B SaaS",
      recruiterId: recruiterLabs._id,
      location: "Bengaluru · Onsite",
      type: "full-time",
      ctcLpa: 20,
      minCgpa: 8.5,
      branches: ["CSE", "AI & DS"],
      skills: ["PyTorch", "NLP", "Python"],
      description:
        "Train and evaluate ranking models that sit behind search in the product. Strong math + a public write-up of a project beats a laundry list of courses.",
      openings: 2,
      deadline: inDays(14),
      status: "open",
    },
    {
      title: "Firmware Intern",
      companyName: "Vertex Cloud",
      companyIndustry: "Infrastructure",
      recruiterId: recruiterCloud._id,
      location: "Chennai · Onsite",
      type: "internship",
      stipend: "₹45,000 / month",
      minCgpa: 7.5,
      branches: ["ECE", "EE"],
      skills: ["C", "C++", "Embedded"],
      description:
        "Bring-up work on BMC firmware for a new rack SKU. You will write C, read schematics with a mentor, and present a boot-time reduction at intern showcase.",
      openings: 3,
      deadline: inDays(6),
      status: "open",
    },
  ]);

  const studentByEmail = Object.fromEntries(
    students.map((s) => [s.email, s]),
  );
  const sumedha = studentByEmail["student@orbithire.dev"];
  const ishaan = studentByEmail["ishaan@orbithire.dev"];
  const meera = studentByEmail["meera@orbithire.dev"];
  const kabir = studentByEmail["kabir@orbithire.dev"];
  const diya = studentByEmail["diya@orbithire.dev"];
  const rohan = studentByEmail["rohan@orbithire.dev"];

  const helixFte = jobs[0];
  const helixIntern = jobs[1];
  const vertexCloud = jobs[2];
  const northstarPe = jobs[3];
  const northstarMl = jobs[4];
  const firmware = jobs[5];

  const stamp = (status: string, daysAgo: number, note: string) => ({
    status,
    at: new Date(Date.now() - daysAgo * 86400000),
    note,
  });

  await Application.create([
    {
      jobId: helixFte._id,
      studentId: sumedha._id,
      status: "interview",
      coverNote:
        "I rebuilt NIT-N's placement tracker last summer — MongoDB change streams for live application status. Happy to walk through the schema.",
      interviewAt: inDays(3),
      interviewMode: "online",
      interviewNotes: "Loop with hiring manager + 45 min system design.",
      timeline: [
        stamp("applied", 12, "Application received"),
        stamp("shortlisted", 7, "Resume screen cleared"),
        stamp("interview", 2, "Interview scheduled"),
      ],
    },
    {
      jobId: northstarPe._id,
      studentId: sumedha._id,
      status: "shortlisted",
      coverNote: "Shipped two Next.js products with real users. Looking for a product-engineering seat.",
      timeline: [
        stamp("applied", 8, "Application received"),
        stamp("shortlisted", 3, "Recruiter screen"),
      ],
    },
    {
      jobId: helixFte._id,
      studentId: ishaan._id,
      status: "offer",
      coverNote: "Kafka + Spring intern at a payments processor. I care about exactly-once more than buzzwords.",
      offerCtcLpa: 18,
      timeline: [
        stamp("applied", 20, "Application received"),
        stamp("shortlisted", 16, "Resume screen"),
        stamp("interview", 10, "Onsite loop"),
        stamp("offer", 2, "Offer released"),
      ],
    },
    {
      jobId: vertexCloud._id,
      studentId: ishaan._id,
      status: "applied",
      coverNote: "Comfortable with Linux internals from running the college cluster.",
      timeline: [stamp("applied", 4, "Application received")],
    },
    {
      jobId: northstarMl._id,
      studentId: diya._id,
      status: "placed",
      coverNote: "IR internship + a public write-up on BM25 vs dense retrieval for noisy PDFs.",
      offerCtcLpa: 20,
      timeline: [
        stamp("applied", 25, "Application received"),
        stamp("shortlisted", 21, "Assignment"),
        stamp("interview", 14, "Research talk"),
        stamp("offer", 6, "Offer released"),
        stamp("placed", 1, "Offer accepted — TPO recorded"),
      ],
    },
    {
      jobId: helixIntern._id,
      studentId: kabir._id,
      status: "applied",
      coverNote: "Built the fest app (Next.js) used by 4,000 students. I want to work on dashboards with real money behind them.",
      timeline: [stamp("applied", 1, "Application received")],
    },
    {
      jobId: firmware._id,
      studentId: meera._id,
      status: "shortlisted",
      coverNote: "DSP coursework + a C firmware hobby project on STM32.",
      timeline: [
        stamp("applied", 5, "Application received"),
        stamp("shortlisted", 1, "Department shortlist"),
      ],
    },
    {
      jobId: vertexCloud._id,
      studentId: rohan._id,
      status: "rejected",
      coverNote: "Power systems + a software minor. Interested in the grid-adjacent cloud work.",
      timeline: [
        stamp("applied", 15, "Application received"),
        stamp("rejected", 6, "CGPA/branch mix below bar for this cycle"),
      ],
    },
    {
      jobId: northstarPe._id,
      studentId: kabir._id,
      status: "interview",
      coverNote: "I like owning UI and API together. Portfolio linked in resume.",
      interviewAt: inDays(1),
      interviewMode: "online",
      timeline: [
        stamp("applied", 9, "Application received"),
        stamp("shortlisted", 5, "Take-home"),
        stamp("interview", 2, "Interview scheduled"),
      ],
    },
  ]);

  void tpo;
}
