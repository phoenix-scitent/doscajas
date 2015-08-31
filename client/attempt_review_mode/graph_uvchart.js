Template.graph_uvchart.helpers({
  element_id: function(){
    return this.anchor_element;
  }
});

Template.graph_uvchart.rendered = function() {

  // http://imaginea.github.io/uvCharts/documentation.html

  var attempts;

  var currentAttempt = [Template.parentData(1)];

  if(currentAttempt[0].adaptive_retries){
    attempts = Sequences.find({ 'attempt.original': currentAttempt[0].attempt.original }).fetch();
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
  var config = {
    meta: {
      position: ('#attempt-' + this.data.anchor_element)
    },
    graph: {
      orientation: "Vertical",
      bgcolor: 'none'
    },
    frame: {
      bgcolor: 'none',
      width: '800'
    },
    dimension: {
      width: 800,
      height: 300
    },
    axis: {
      strokecolor: '#999',
      fontfamily: 'open sans',
      fontsize: 13,
      padding: 15
    },
    label: {
      fontfamily: 'open sans',
      fontsize: 11,
      fontweight: 300
    },
    legend: {
      fontfamily: "open sans",
      fontsize: 16
    },
    caption: {
      fontfamily: "open sans"
    },
    tooltip: {
      fontfamily: "open sans"
    },
    bar: {
      fontfamily: "open sans"
    }
  }

  var chart = uv.chart('StackedBar', graphdef, config);
};