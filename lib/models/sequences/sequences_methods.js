Meteor.methods({
  buildBlankSequence: function() {
    now = new Date();
    return Sequences.insert(
      { owner: Meteor.userId(), // pass in?
        tags:  [BOK.current()._id], 
        name:  now.toDateString() + ' ' + now.getHours() + now.getMinutes() + now.getSeconds(),
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

    var cajas;

    if(source.randomize_items){
      cajas = _.shuffle(source.items);
    } else {
      cajas = source.items;
    }

    attempt = {
      parent: source._id,
      user: user._id,
      count: Sequences.find({ "attempt.parent": source._id, "attempt.user": user._id }).count() + 1,
      score: 0,
      completed_at: null,
      items: _.map(cajas, function(item, i){
        var CAJA = (item.type === 'measure') ? Measures : Resources;
        var box = CAJA.findOne({ _id: item._id });
        box['caja_type'] = item.type;
        return box;
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
    var currentAttempt = Sequences.findOne({_id: attempt_id});
    var attempt = currentAttempt.attempt;
    var items = attempt.items;
    var totalScore = 0;
    var tagProgress = {};

    var scoreMap = _.map(items, function(measure){
      var currentMeasure = measure;
      var answers = currentMeasure.answers;
      var possibleScore = 0;
      var actualScore = 0;

      _.each(answers, function(answer){
        var points;

        if(currentAttempt.use_measure_weighting){
          //TODO: factor in MEASURE.weight along with MEASURE.answers.$.points (answer.points)
          points = currentMeasure.weight;
        } else {
          points = 1;
        }

        possibleScore = points;

        if(answer.chosen && answer.correct){
          actualScore = points;
        }
      });

      var tagNames = _.map(currentMeasure.tags, function(tagId){ return Boks.findOne({ _id: tagId }) });

      _.forEach(tagNames, function(tag){
        if(tagProgress[tag.name]){
          tagProgress[tag.name]['scores'].push({ measure: currentMeasure._id, possible: possibleScore, actual: actualScore });
          tagProgress[tag.name]['total_possible_score'] = _.reduce(_.map(tagProgress[tag.name]['scores'], function(score){ return score.possible }), function(total, n){ return total + n });
          tagProgress[tag.name]['total_actual_score'] = _.reduce(_.map(tagProgress[tag.name]['scores'], function(score){ return score.actual }), function(total, n){ return total + n });
        } else {
          tagProgress[tag.name] = { _id: tag._id, ancestors: tag.ancestors, scores: [], total_possible_score: 0, total_actual_score: 0 };
          tagProgress[tag.name]['scores'].push({ measure: currentMeasure._id, possible: possibleScore, actual: actualScore });
          tagProgress[tag.name]['total_possible_score'] = _.reduce(_.map(tagProgress[tag.name]['scores'], function(score){ return score.possible }), function(total, n){ return total + n });
          tagProgress[tag.name]['total_actual_score'] = _.reduce(_.map(tagProgress[tag.name]['scores'], function(score){ return score.actual }), function(total, n){ return total + n });
        }
      });

      return actualScore;
    });

    totalScore = _.reduce(scoreMap, function(total, n) {
      return total + n;
    });

    Sequences.update(attempt_id, {$set: { 'attempt.score': totalScore, 'attempt.topic_stats': tagProgress }});

    return totalScore;
  },
  isAttempt: function(sequence){
    return sequence.attempt ? true : false;
  }
});