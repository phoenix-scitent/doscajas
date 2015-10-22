Meteor.subscribe('activities');
Meteor.subscribe('users');

Template.activities.helpers({

  activity_sections: function() {

    var activities = _.map(ACTIVITIES.getAvailable({ bokId: BOK.current()._id, userId: Meteor.userId(), tags: Session.get("current_activity_filter") }).fetch(), function(activity){
      activity.creator_data = Meteor.users.findOne({ _id: activity.owner });
      activity.tag_data = _.map(activity.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      activity.formatted_date_created = moment(activity.created_at).format('MMMM Do YYYY, h:mm:ss a');

      return activity
    });

    return _.chunk(activities, Math.ceil(activities.length / 3));
  }
});
