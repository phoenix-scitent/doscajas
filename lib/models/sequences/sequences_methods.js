Meteor.methods({
  buildBlankSequence: function() {
    now = new Date();
    return Sequences.insert(
      { owner: Meteor.userId(), // pass in?
        tags:  [BOK.current()._id], 
        name:  now.toDateString(),
        type:  "linear",
        items: []
      });
  },
  //TODO: set defaults per sequence type creation as seperate create functions, no if statements
  submitSequence: function(id, sequence) {
    console.log("Updating Sequence: " + id + " , " + JSON.stringify(sequence));
    return Sequences.update(id, {$set: sequence});
  },
  createAttempt: function(sequenceId, user){
    var existing = Sequences.findOne({'attempt.parent': sequenceId, 'attempt.user': user._id, 'attempt.completed_at': null});
    if (existing)
      return existing._id;

    var source = Sequences.findOne({ _id: sequenceId });

    attempt = {
      parent: source._id,
      user: user._id,
      count: Sequences.find({ "attempt.parent": source._id, "attempt.user": user._id }).count() + 1,
      score: 0,
      completed_at: null,
      items: _.map(source.items, function(item, i){
        var CAJA = (item.type === 'measure') ? Measures : Resources;
        return CAJA.findOne({ _id: item._id });
      })
    };

    source.attempt = attempt;

    delete source._id;

    return Sequences.insert(source);
  },
  completeAttempt: function(attemptId) {
    Meteor.call("updateScore", attemptId, function(){});
    return Sequences.update(attemptId, {$set: { 'attempt.completed_at': Date.now() }});
  },
  selectAnswer: function(choice, measure_id, attempt_id) {
    var currentAttempt = Sequences.findOne({_id: attempt_id});

    var measure = _.find(currentAttempt.attempt.items, function(item){
      return item._id === measure_id;
    });

    if( measure.allow_multiple_selection !== true ){
      _.each(measure.answers, function(a){
        a.chosen = false;
      });

      measure.is_answered = true;
    }

    measure.answers[choice - 1].chosen = true;

    return Sequences.update(attempt_id, {$set: {'attempt.items': currentAttempt.attempt.items }}, function(){
      Meteor.promise('updateScore', attempt_id).then(function(score){
        return score
      });
    });
  },
  updateScore: function(attempt_id){
    var attempt = Sequences.findOne({_id: attempt_id}).attempt;
    var items = attempt.items;
    var totalScore = 0;

    var scoreMap = _.map(items, function(measure){
      var answers = measure.answers;
      var score = 0;

      _.each(answers, function(answer){
        if(answer.chosen && answer.correct){
          score = answer.points;
        }
      });

      return score;
    });

    totalScore = _.reduce(scoreMap, function(total, n) {
      return total + n;
    });

    Sequences.update(attempt_id, {$set: {'attempt.score': totalScore }});

    return totalScore;
  },
  isAttempt: function(sequence){
    return sequence.attempt ? true : false;
  }
});