Template.graph_uvchart.helpers({
  element_id: function(){
    return this.anchor_element;
  }
});

Template.graph_uvchart.rendered = function() {

  // http://imaginea.github.io/uvCharts/documentation.html

  var attempts;

  var currentAttempt = Sequences.find({ _id: this.data.attemptId }).fetch();

  if(currentAttempt[0].adaptive_retries){
    attempts = Sequences.find({ 'attempt.original': this.data.sequenceId }).fetch();
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

  var chart = uv.chart('StackedBar', graphdef, { meta: { position: ('#attempt-' + this.data.anchor_element) }, graph: { orientation: 'Vertical' } });
};