import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  technologies: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project; 