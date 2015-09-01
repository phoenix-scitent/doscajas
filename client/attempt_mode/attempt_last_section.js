Template.attempt_last_section.helpers({
  measuresUnanswered: function(){
    var measures =  _.filter(Template.parentData(1).attempt.items, function(item){ return item.caja_type === 'measure' });

    return _.some(measures, function(measure){ return (measure.is_answered === false || measure.is_answered === undefined) });
  },
  unansweredMeasures: function(){
    var measures = _.filter(Template.parentData(1).attempt.items, function(item){ return item.caja_type === 'measure' });

    return _.filter(measures, function(measure){ return (measure.is_answered === false || measure.is_answered === undefined) });
  }
});

Template.attempt_last_section.events({
  'click .measure-link': function(e){
    var $element = $('[data-position=' + $(e.target).data('measure-position') + ']');

    $('html, body').animate({ scrollTop: $element.offset().top }, 500);
  }
});