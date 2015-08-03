Meteor.subscribe('measures');
Meteor.subscribe('resources');

Template.sequence_attempt.helpers({
  measures: function() {
    return _.map(Measures.find().fetch(), function(m,i){
      var measure = m;

      measure.position = i+1;
      measure.answers = _.map(measure.answers, function(answer){
        return _.assign(answer, { measure_id: measure._id });
      });

      return measure;
    });
  },
  measure_linked_resources: function(){
    return _.map(this.linked_resources, function(id){ return Resources.findOne({_id: id}) });
  },
  measure_count: function(){
    return Measures.find().count();
  },
  isMultipleChoice: function(){
    return this.type === 'multiplechoice';
  }
});

Template.sequence_attempt.rendered = function(){
  $(document).scrollsnap({
    snaps: '.snap',
    proximity: 200,
    offset: -100,
    onSnap: function(t) {
      t.fadeTo(0,1);
      $('.snap').not(t).fadeTo(200,0.2);
    }
  });

  //{
  //    section : "section",
  //    sectionName: "question-order",
  //    before: function(sectionIndex, sectionElements){
  //      var $el = sectionElements[sectionIndex];
  //      var measureId = $el.data('measure');
  //      var state = $el.data('state');
  //      var stateUpdated = $el.data('state-updated');
  //
  //      console.log('before', measureId, sectionIndex, state, stateUpdated)
  //    },
  //    after: function(sectionIndex, sectionElements){
  //      var $el = sectionElements[sectionIndex];
  //      var measureId = $el.data('measure');
  //      var state = $el.data('state');
  //      var stateUpdated = $el.data('state-updated');
  //
  //      if(state === 'unseen'){
  //        $el.data('state', 'seen');
  //        $el.data('state-updated', Date.now());
  //      }
  //
  //      console.log('after', measureId, sectionIndex, state, stateUpdated);
  //    }
  //}
};

Template.sequence_attempt.events({
  'click .scroll-prev': function() {

  },
  'click .scroll-next': function(){

  }
});