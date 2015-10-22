Meteor.methods({
  buildBlankActivity: function() {
    now = new Date();
    return Activities.insert(
      { owner: Meteor.userId(), // pass in?
        tags:  [BOK.current()._id],
        name:  now.toDateString() + ' ' + now.getHours() + now.getMinutes() + now.getSeconds(),
        type:  "linear",
        items: [],
        style: {}
      });
  },
  //TODO: set defaults per activity type creation as seperate create functions, no if statements
  submitActivity: function(id, activity) {
    console.log("Updating Activity: " + id + " , " + JSON.stringify(activity));
    return Activities.update(id, {$set: activity});
  },
  createAttempt: function(activityId, user){
    var existing = Activities.findOne({'attempt.parent': activityId, 'attempt.user': user._id, 'attempt.completed_at': null});

    if (existing)
      return existing._id;

    var originalSource = Activities.findOne({ _id: activityId });

    var isAdaptiveAttempt = originalSource.adaptive_retries;

    var source;

    if(isAdaptiveAttempt){
      source = _.last(Activities.find({'attempt.original': activityId, 'attempt.user': user._id}).fetch()) || originalSource;
    } else {
      source = originalSource
    }

    var prepItems = function(items){

      var mapCajas = function(_items){
        return _.map(_items, function(item, i){
          var CAJA = (item.type === 'measure') ? Measures : Resources;
          var box = CAJA.findOne({ _id: item._id });
          box['caja_type'] = item.type;
          return box;
        });
      };

      var mapClear = function(_items){
        return _.map(_items, function(item, i){
          if(item.type === 'measure' && !item.adaptive_completion){
            item.is_answered = false;
            _.each(item.answers, function(answer){
              answer.chosen = false;
            })
          }
          return item;
        });
      };

      if(source.randomize_items){
        return source.attempt ? mapClear(_.shuffle(items)) : mapCajas(_.shuffle(items));
      } else {
        return source.attempt ? mapClear(items) : mapCajas(items);
      }
    };

    attempt = {
      original: originalSource._id,
      parent: source._id,
      user: user._id,
      count: (isAdaptiveAttempt && source.attempt) ? (source.attempt.count + 1) : (Activities.find({ "attempt.parent": source._id, "attempt.user": user._id }).count() + 1),
      score: 0,
      completed_at: null,
      items: prepItems(source.attempt ? source.attempt.items : source.items)
    };

    source.attempt = attempt;

    delete source._id;

    return Activities.insert(source);
  },
  completeAttempt: function(attemptId) {
    Meteor.promise("updateScore", attemptId);
    return Activities.update(attemptId, {$set: { 'attempt.completed_at': Date.now() }});
  },
  selectAnswer: function(choice, measure_id, attempt_id) {
    var current_attempt = Activities.findOne({_id: attempt_id});

    var measure = _.find(current_attempt.attempt.items, function(item){
      return item._id === measure_id;
    });

    if( measure.allow_multiple_selection !== true ){
      _.each(measure.answers, function(a){
        a.chosen = false;
      });
      measure.is_answered = true;
    }

    measure.answers[choice - 1].chosen = true;

    Meteor.promise("measure_events_log", current_attempt.attempt.user, measure._id, current_attempt._id, measure.answers[choice - 1]).then(function(response) {
      // do nothing just be happy that it logged
    });

    return Activities.update(attempt_id, {$set: {'attempt.items': current_attempt.attempt.items }}, function(){
      Meteor.promise('updateScore', attempt_id).then(function(score){
        return score
      });
    });
  },
  updateScore: function(attempt_id){
    var current_attempt = Activities.findOne({_id: attempt_id});
    var attempt = current_attempt.attempt;
    var items = attempt.items;
    var tagProgress = {};

    var scoreItemsMap = _.map(items, function(measure){
      var currentMeasure = measure;
      var answers = currentMeasure.answers;
      var possibleScore = 0;
      var actualScore = 0;

      _.each(answers, function(answer){
        var points;

        if(current_attempt.use_measure_weighting){
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

    var adaptiveItemsMap = _.map(items, function(measure){
      var answers = measure.answers;

      if(measure.adaptive_completion === current_attempt.attempt.count){ measure.adaptive_completion = null; }

      _.each(answers, function(answer){
        if(answer.chosen && answer.correct){
          measure.adaptive_completion = measure.adaptive_completion || attempt.count;
        }
      });

      return measure;
    });

    var totalScore = _.reduce(scoreItemsMap, function(total, n) {
      return total + n;
    });

    Activities.update(attempt_id, {$set: { 'attempt.items': adaptiveItemsMap, 'attempt.score': totalScore, 'attempt.topic_stats': tagProgress }});

    return totalScore;
  },
  removeActivity: function(attemptId){
    return Activities.remove(attemptId);
  },
  isAttempt: function(activity){
    return activity.attempt ? true : false;
  }
});
