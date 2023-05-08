const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.log("Unable to connect to the server");
  else console.log("mongoDB is connected");
});

// Loads models
const Course = require("./models/course");
const UserCourseActivity = require("./models/userCourseActivity");
const  {Cohort}  = require("./models/cohort");

// Creates default cohorts for each course.
const userCourseActivityCollection = async () => {
  try {
    // Use the Aggregation Pipeline to transform the data in the original collection to match the new schema
    const courseAggregationPipeline = [
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          course_id: "$_id",
          cohort_id: "",
          data: "$learners",
        },
      },
      {
        $unwind: "$data",
      },
      {
        $set: {
          // Transform fields from old schema to new schema
          user_id: "$data.user",
          type: "learner",
          progress: "$data.progress",
          status: "enrolled",
          isCertificateGererated: "$data.isCertificateGererated",
          certificateURL: "$data.certificateURL",
          certificateDate: "$data.certificateDate",
          certificateDateISO: {
            $toDate: "$data.certificateDate",
          },
          certificateVerificationCode: "$data.certificateVerificationCode",
          nameOnCertificate: "$data.nameOnCertificate",
          containers: "$data.containers",
          failedContainers: "$data.failedContainers",
          created_at: "$data.created_at",
          updated_at: "$data.updated_at",
        },
      },
      {
        $unset: ["data"],
      },
      {
        $out: "usercourseactivities_v2", // Write the transformed data to a new collection
      },
    ];

    // first creating default cohorts for all the courses.
    await Course.aggregate(courseAggregationPipeline);

    // Use the Aggregation Pipeline to transform the data in the original collection to match the new schema
    const cohortAggregationPipeline = [
      {
        $project: {
          // Transform fields from old schema to new schema
          _id: 0,
          cohort_id: "$_id",
          course_id: "$courseId",
          data: "$learners",
        },
      },
      {
        $unwind: "$data",
      },
      {
        $set: {
          // Transform fields from old schema to new schema
          user_id: "$data.user",
          type: "learner",
          progress: "$data.progress",
          status: "enrolled",
          isCertificateGererated: "$data.isCertificateGererated",
          certificateURL: "$data.certificateURL",
          certificateDate: "$data.certificateDate",
          certificateDateISO: {
            $toDate: "$data.certificateDate",
          },
          certificateVerificationCode: "$data.certificateVerificationCode",
          nameOnCertificate: "$data.nameOnCertificate",
          containers: "$data.containers",
          failedContainers: "$data.failedContainers",
          created_at: "$data.created_at",
          updated_at: "$data.updated_at",
        },
      },
      {
        $unset: ["data"],
      },
      {
        $merge: {
          into: "usercourseactivities_v2",
        },
      },
    ];

    await Cohort.aggregate(cohortAggregationPipeline);
    // console.log("Data Imported...", data);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    const res = await UserCourseActivity.deleteMany();
    console.log(res);
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  userCourseActivityCollection();
} else if (process.argv[2] === "-d") {
  deleteData();
}