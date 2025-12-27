import mongoose from "mongoose";
import { themeColors, fontOptions } from "../utils";

const resumeSchema = new mongoose.Schema({
  resumeId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  portfolio: { type: String },
  linkedin: { type: String },
  summary: { type: String },
  experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  templateId: { type: String },
  themeColor: {
    type: String,
    default: themeColors && themeColors.length > 0 ? themeColors[0] : "#FF69B4",
  },
  fontFamily: {
    type: String,
    default: fontOptions && fontOptions.length > 0 ? fontOptions[0] : "Inter",
  },
});

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
