Enrollments = new Mongo.Collection('enrollments');

Schemas.Enrollment = new SimpleSchema({
  course_id: {
    type: String,
    label: "Course Id" // course : enrollment is 1:1, if we want 'packages' of enrollments, there should be a seperate construct to manage this via multiple enrollments per 'package'...
  },
  owner: {
    type: String,
    label: "Owner"
  },
  meta: {
    type: Object,
    label: "Meta Information", // location for all access code, score, state and user specific info regarding the interaction with the course
    optional: true
  },
  created_at: {
    type: Date,
    label: "Date Created",
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    optional: true
  },
  updated_at: {
    type: Date,
    label: "Date Changed",
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  }
});

Enrollments.attachSchema(Schemas.Enrollment);

Meteor.methods({
  findOrCreateEnrollment: function(courseId, user){
    var existing = Enrollments.findOne({ course_id: courseId, owner: user._id /*, 'attempt.completed_at': null */ });
    if (existing)
      return existing._id;

    return Enrollments.insert({ course_id: courseId, owner: user._id });
  }
});
