import mongoose, { Schema, Types } from "mongoose";

export const ROLES = ["student", "recruiter", "tpo"] as const;
export type Role = (typeof ROLES)[number];

export const JOB_TYPES = ["full-time", "internship"] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const APPLICATION_STATUSES = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
  "placed",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true },
    college: { type: String, default: "National Institute of Technology, Nagpur" },
    branch: String,
    cgpa: Number,
    graduationYear: Number,
    rollNumber: String,
    skills: { type: [String], default: [] },
    resumeUrl: String,
    bio: String,
    companyName: String,
    designation: String,
  },
  { timestamps: true },
);

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    companyIndustry: String,
    recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    type: { type: String, enum: JOB_TYPES, required: true },
    ctcLpa: Number,
    stipend: String,
    minCgpa: { type: Number, default: 0 },
    branches: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    description: { type: String, required: true },
    openings: { type: Number, default: 1 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true },
);

const applicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "applied",
    },
    coverNote: { type: String, default: "" },
    interviewAt: Date,
    interviewMode: { type: String, enum: ["online", "onsite", ""] , default: "" },
    interviewNotes: String,
    offerCtcLpa: Number,
    timeline: {
      type: [
        {
          status: String,
          at: Date,
          note: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ title: "text", companyName: "text" });

export type UserDoc = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  college?: string;
  branch?: string;
  cgpa?: number;
  graduationYear?: number;
  rollNumber?: string;
  skills: string[];
  resumeUrl?: string;
  bio?: string;
  companyName?: string;
  designation?: string;
};

export type JobDoc = {
  _id: Types.ObjectId;
  title: string;
  companyName: string;
  companyIndustry?: string;
  recruiterId: Types.ObjectId;
  location: string;
  type: JobType;
  ctcLpa?: number;
  stipend?: string;
  minCgpa: number;
  branches: string[];
  skills: string[];
  description: string;
  openings: number;
  deadline: Date;
  status: "open" | "closed";
};

export type ApplicationDoc = {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: ApplicationStatus;
  coverNote: string;
  interviewAt?: Date;
  interviewMode?: string;
  interviewNotes?: string;
  offerCtcLpa?: number;
  timeline: { status: string; at: Date; note?: string }[];
};

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
export const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
