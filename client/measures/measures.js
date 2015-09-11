Meteor.subscribe('measures');
Meteor.subscribe('users');

Template.measures.helpers({

  measure_sections: function() {

    var measures = _.map(MEASURES.getAvailable({ bokId: BOK.current()._id, userId: Meteor.userId(), tags: Session.get('current_cajas_filter') }).fetch(), function(measure){
      measure.creator_data = Meteor.users.findOne({ _id: measure.owner });
      measure.tag_data = _.map(measure.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      measure.correct_answer = _.find(measure.answers, function(answer){ return answer.correct === true });
      measure.formatted_date_created = moment(measure.date_created).format('MMMM Do YYYY, h:mm:ss a');

      // var comments_count = measure.comments.length;
      // var suggestions_count = measure.suggestions.length;

      // measure.comments_count = comments_count + ' ' + (comments_count === 1 ? 'comment' : 'comments');
      // measure.suggestions_count = suggestions_count + ' ' + (suggestions_count === 1 ? 'suggestion' : 'suggestions');
      // measure.hasComments = comments_count > 0;
      // measure.hasSuggestions = suggestions_count > 0;

      return measure
    });

    return _.chunk(measures, Math.ceil(measures.length / 3));
  }
});
