const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

const UserCourseActivitySchema = new mongoose.Schema({
  course_id: { type: ObjectId, required: true, ref: "Course" },
  cohort_id: { type: ObjectId, required: true, ref: "Cohort" },
  user_id: { type: ObjectId, required: true, ref: "User" },
  type: {
    type: String,
    enum: ["learner", "viewer"],
  },
  progress: {
    type: String,
    enum: ["started", "active", "completed", "uncertified", "certified"],
  },
  isCertificateGererated: {
    type: Boolean,
    default: false,
  },
  certificateURL: {
    type: String,
  },
  certificateDate: {
    type: String,
  },
  certificateDateISO: {
    type: Date,
    default: Date.now,
  },
  certificateVerificationCode: {
    type: String,
  },
  containers: {
    type: ObjectId,
    ref: "Block",
  },
  failedContainers: {
    type: ObjectId,
    ref: "Block",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  started_at: {
    type: Date,
  },
});
module.exports = mongoose.model("UserCourseActivity", UserCourseActivitySchema);
