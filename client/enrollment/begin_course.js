Template.begin_course.rendered = function(){

  Meteor.promise('findOrCreateEnrollment', this.data._id, Meteor.user()).then(function(enrollmentId){
    Session.set('currentEnrollmentId', enrollmentId);
  });
};
