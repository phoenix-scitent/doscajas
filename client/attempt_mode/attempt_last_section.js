Template.attempt_last_section.helpers({
  measuresUnanswered: function(){
    var measures = Template.parentData(1).attempt.items;

    return _.some(measures, function(measure){ return (measure.is_answered === false || measure.is_answered === undefined) });
  },
  unansweredMeasures: function(){
    var measures = Template.parentData(1).attempt.items;

    return _.map(_.filter(measures, function(measure){ return (measure.is_answered === false || measure.is_answered === undefined) }), function(measure){ return {position: measure.position, name: measure.question_text} });
  }
});

Template.attempt_last_section.events({
  'click .measure-link': function(e){
    var $element = $('[data-position=' + $(e.target).data('measure-position') + ']');

    $('html, body').animate({ scrollTop: $element.offset().top }, 500);
  }
});