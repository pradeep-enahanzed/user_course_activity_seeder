const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
const userCourseActivitySchema = new Schema({
    course_id: { type: ObjectId, ref: 'courses' },
    cohort_id: { type: ObjectId, ref: 'cohorts_v2' },
    user_id: { type: ObjectId, ref: 'users' },
    type: { type: String, enum: ['learner', 'viewer'] },
    progress: { type: String, enum: ['started', 'active', 'completed', 'uncertified', 'certified', 'in_progress'] },
    isCertificateGenerated: { type: Boolean, default: false },
    certificateURL: String,
    certificateDate: String,
    certificateDateISO: { type: Date, default: Date.now() },
    certificateVerificationCode: String,
    nameOnCertificate: {type: String},
    containers: { type: ObjectId, ref: 'Block' },
    failedContainers: { type: ObjectId, ref: 'Block' },
    created_at: { type: Date, default: Date.now },
    updated_at: Date,
    started_at: Date,
    status: { type: String, enum: ['enrolled', 'inactive'] },
    modules:[{
        module_id: { type : ObjectId, ref : 'blocks'},
        score: [{
            domain:
                {
                  type: mongoose.Schema.Types.Mixed,
                  String,
                  ObjectId,
                  ref: 'assessmentdashboards'
                }
            ,
            aggregate_score: {type: Number}
        }],
        attempt: {type: Number, default: 1},
        created_at: { type: Date, default: Date.now },
        updated_at: Date,
        status: {type : String,enum : ['locked','unlocked'], default: 'unlocked'}
    }],
});
/*
check if module_id exist, if not 
*/ 
module.exports.UserCourseActivity = mongoose.model('usercourseactivities_v2', userCourseActivitySchema);

