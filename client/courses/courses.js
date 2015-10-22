Meteor.subscribe('courses');
Meteor.subscribe('users');

Template.courses.helpers({

  course_sections: function() {

    var courses = _.map(COURSES.getAvailable({ bokId: BOK.current()._id, userId: Meteor.userId(), tags: Session.get("current_course_filter") }).fetch(), function(course){
      course.creator_data = Meteor.users.findOne({ _id: course.owner });
      course.tag_data = _.map(course.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      course.formatted_date_created = moment(course.created_at).format('MMMM Do YYYY, h:mm:ss a');

      return course
    });

    return _.chunk(courses, Math.ceil(courses.length / 3));
  }
});
