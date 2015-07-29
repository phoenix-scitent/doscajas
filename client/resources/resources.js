Meteor.subscribe('resources');
Meteor.subscribe('users');

Template.resources.helpers({
  resources: function() {
    //TODO: scope this to only those owned by current user

    var resources = Resources.find().fetch();

    return _.map(resources, function(resource){
      resource.creator_data = Meteor.users.findOne({ _id: resource.owner });
      resource.tag_data = _.map(resource.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      resource.formatted_date_created = moment(resource.date_created).format('MMMM Do YYYY, h:mm:ss a');

      var comments_count = resource.comments.length;
      var improvements_count = resource.additions.length;

      resource.comments_count = comments_count + ' ' + (comments_count === 1 ? 'comment' : 'comments');
      resource.improvements_count = improvements_count + ' ' + (improvements_count === 1 ? 'improvement' : 'improvements');
      resource.hasComments = comments_count > 0;
      resource.hasImprovements = improvements_count > 0;

      return resource
    });
  }
});