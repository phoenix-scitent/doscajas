Template.graph_uvchart.rendered = function() {
  var attempts;

  var currentAttempt = Sequences.find({ _id: Session.get('currentAttemptId') }).fetch();

  if(currentAttempt[0].adaptive_retries){
    attempts = Sequences.find({ 'attempt.original': Session.get('currentSequenceId') }).fetch();
  } else {
    attempts = currentAttempt;
  }

  var graphdef = {
    categories : _.map(attempts, function(currentAttempt){ return moment(currentAttempt.attempt.completed_at).format("MMMDo hhmmss"); }),
    dataset : _.reduce(attempts, function(bars, currentAttempt){
      bars[moment(currentAttempt.attempt.completed_at).format("MMMDo hhmmss")] = _.map(currentAttempt.attempt.topic_stats, function(stats, key){

        var all = _.map(attempts, function(currentAttempt){ return { key: currentAttempt.attempt.completed_at, scores: _.map(currentAttempt.attempt.topic_stats, function(stats, key){ return { key: key, value: _.ceil(((stats.total_actual_score / stats.total_possible_score) * 100)) } }) } });
        var currentKey = _.findKey(all, function(attempt){ return attempt.key === currentAttempt.attempt.completed_at });
        var lastKey = currentKey - 1;

        var lastScore = lastKey>=0 ? _.find(all[lastKey]['scores'], function(scores){ return scores.key === key })['value'] : 0;

        return {
          name: key,
          value: _.ceil(((stats.total_actual_score / stats.total_possible_score) * 100)) - lastScore
        }
      });
      return bars;
    }, {})
  };

  var chart = uv.chart('StackedBar', graphdef, { graph: { orientation: 'Vertical' } });
};