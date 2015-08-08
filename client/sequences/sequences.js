Meteor.subscribe('sequences');
Meteor.subscribe('users');

Template.sequences.helpers({

  sequence_sections: function() {
    //TODO: scope this to only those owned by current user

    var sequences = _.map(Sequences.find({ tags: Session.get("current_sequence_filter") }).fetch(), function(sequence){
      sequence.creator_data = Meteor.users.findOne({ _id: sequence.owner });
      sequence.tag_data = _.map(sequence.tags, function(tag){ return Boks.findOne({ _id: tag }) });
      sequence.formatted_date_created = moment(sequence.date_created).format('MMMM Do YYYY, h:mm:ss a');

      return sequence
    });

    return _.chunk(sequences, Math.ceil(sequences.length / 3));
  }
});