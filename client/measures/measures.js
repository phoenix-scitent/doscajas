Meteor.subscribe('measures');
Meteor.subscribe('users');

Template.measures.helpers({

  selected_leaf: function() {
    var leaf = BOK.current()._id;
    if (Session.get("selected_leaf"))
      leaf = Session.get("selected_leaf");
    console.log("selected Leaf: "+ Boks.findOne(leaf));
    return Boks.findOne(leaf);
  },
  measure_sections: function() {
    //TODO: scope this to only those owned by current user

    var measures = _.map(Measures.find({ tags: this.selected_leaf }).fetch(), function(measure){
      measure.creator_data = Meteor.users.findOne({ _id: measure.owner });
      measure.tag_data = _.map(measure.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      measure.correct_answer = _.find(measure.answers, function(answer){ return answer.correct === true });
      measure.formatted_date_created = moment(measure.date_created).format('MMMM Do YYYY, h:mm:ss a');

      var comments_count = measure.comments.length;
      var improvements_count = measure.additions.length;

      measure.comments_count = comments_count + ' ' + (comments_count === 1 ? 'comment' : 'comments');
      measure.improvements_count = improvements_count + ' ' + (improvements_count === 1 ? 'improvement' : 'improvements');
      measure.hasComments = comments_count > 0;
      measure.hasImprovements = improvements_count > 0;

      return measure
    });

    return _.chunk(measures, Math.ceil(measures.length / 3));
  }
});