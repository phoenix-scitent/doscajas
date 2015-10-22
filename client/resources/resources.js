Meteor.subscribe('resources');
Meteor.subscribe('users');

Template.resources.helpers({
  resource_sections: function() {

    var resources = _.map(RESOURCES.getAvailable({ bokId: BOK.current()._id, userId: Meteor.userId(), tags: Session.get('current_cajas_filter') }).fetch(), function(resource){
      resource.creator_data = Meteor.users.findOne({ _id: resource.owner });
      resource.tag_data = _.map(resource.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      resource.formatted_date_created = moment(resource.created_at).format('MMMM Do YYYY, h:mm:ss a');

      // var comments_count = resource.comments.length;
      // var suggestions_count = resource.suggestions.length;

      // resource.comments_count = comments_count + ' ' + (comments_count === 1 ? 'comment' : 'comments');
      // resource.suggestions_count = suggestions_count + ' ' + (suggestions_count === 1 ? 'suggestion' : 'suggestions');
      // resource.hasComments = comments_count > 0;
      // resource.hasSuggestions = suggestions_count > 0;

      return resource
    });

    return _.chunk(resources, Math.ceil(Resources.find({ tags: Session.get("current_resource_filter") }).count() / 3));
  }
});
