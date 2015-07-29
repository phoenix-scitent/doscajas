Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('boks');

Template.measure_form.helpers({
  title: function(){
    if (this._id){
      return "Editing: "+ this.question_text;
    } else {
      return "Create a new Measure";
    }
  },
  category: function(){
    if (this._id) {
      return "Measures";
    } else {
      return null;
    }
  }
});

Template.measure_form.events({
  'click #add-answer': function(e){
    var answerHtml = function(answer, index){
      var index = index + 1,
          isCorrect = function(correct){
            if(correct){
              return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="checkbox checkbox-success" data-answer-part="correct" data-answer-index='+ index +' checked />'
            } else {
              return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="checkbox checkbox-success" data-answer-part="correct" data-answer-index='+ index +' />'
            }
          };

      return '<div class="row">' +
          '<div class="col-lg-3">' +
          '<div class="form-group">' +
          '<label>Answer #'+ index +'</label>' +
          '<textarea id="answer_'+ index +'" name="answer_'+ index +'" type="text" class="form-control" rows="2" data-answer-part="text" data-answer-index='+ index +'>'+ answer.text +'</textarea>' +
          '</div>' +
          '</div>' +
          '<div class="col-lg-6">' +
          '<div class="form-group">' +
          '<label>Answer #'+ index +' Feedback</label>' +
          '<textarea id="answer_'+ index +'_feedback" name="answer_'+ index +'_feedback" type="text" class="form-control" rows="2" data-answer-part="feedback" data-answer-index='+ index +'>'+ answer.feedback +'</textarea>' +
          '</div>' +
          '</div>' +
          '<div class="col-lg-3">' +
          '<div class="form-group">' +
          '<label>Answer Points</label>' +
          '<input type="text" class="form-control" data-answer-part="points" data-answer-index='+ index +' value="'+ (answer.points || '') +'" />' +
          '</div>' +
          '<div class="form-group">' +
          isCorrect(answer.correct) +
          '<label>Correct</label>' +
          '</div>' +
          '</div>'+
          '</div>'
    };
      var indeces = [];

      $('#answers-wrapper').children().each(function(){
        $(this).children().each(function(){
          $(this).children().each(function(){
            $(this).children().not('label').each(function(){
              indeces.push({
                index: $(this).data('answer-index')
              });
            })
          })
        })
      });

      var currentIndeces = _.pluck(_.uniq(indeces, 'index'), 'index');

      var currentIndex = (currentIndeces.length === 0) ? 0 : _.max(currentIndeces);

      $('#answers-wrapper').append( answerHtml({ text: '', feedback: '', points: '', correct: false }, currentIndex) );
  }
});