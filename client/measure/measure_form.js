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
              return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="answer-correct-input checkbox checkbox-success" data-answer-part="correct" data-answer-index='+ index +' checked />'
            } else {
              return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="answer-correct-input checkbox checkbox-success" data-answer-part="correct" data-answer-index='+ index +' />'
            }
          };

      return '<div class="answer-row row">' +
          '<div class="col-lg-1" style="padding-top:30px;">' +
          '<button class="remove-answer btn btn-danger btn-circle" type="button"><i class="fa fa-times"></i></button>' +
          '</div>' +
          '<div class="answer-text col-lg-3">' +
          '<div class="form-group">' +
          '<label class="answer-text-label">Answer #'+ index +'</label>' +
          '<textarea id="answer_'+ index +'" name="answer_'+ index +'" type="text" class="answer-text-textarea form-control" rows="2" data-answer-part="text" data-answer-index='+ index +'>'+ answer.text +'</textarea>' +
          '</div>' +
          '</div>' +
          '<div class="answer-feedback col-lg-6">' +
          '<div class="form-group">' +
          '<label class="answer-feedback-label">Answer #'+ index +' Feedback</label>' +
          '<textarea id="answer_'+ index +'_feedback" name="answer_'+ index +'_feedback" type="text" class="answer-feedback-textarea form-control" rows="2" data-answer-part="feedback" data-answer-index='+ index +'>'+ answer.feedback +'</textarea>' +
          '</div>' +
          '</div>' +
          '<div class="answer-points col-lg-2">' +
          '<div class="form-group">' +
          '<label>Answer Points</label>' +
          '<input type="text" class="answer-points-input form-control" data-answer-part="points" data-answer-index='+ index +' value="'+ (answer.points || '') +'" />' +
          '</div>' +
          '<div class="form-group">' +
          isCorrect(answer.correct) +
          '<label>Correct</label>' +
          '</div>' +
          '</div>'+
          '</div>'
    };
      var $wrapper = $('#answers-wrapper'),
          $answers = $wrapper.children();

      $wrapper.append( answerHtml({ text: '', feedback: '', points: '', correct: false }, $answers.length) );
  },
  'click .remove-answer': function(e){
    var $removeButton = $(e.target),
        $answerRow = $removeButton.closest('.answer-row'),
        $remainingAnswerRows = $answerRow.siblings();

    $answerRow.remove();

    _.forEach($remainingAnswerRows, function(answerRow, index){
      var $answerRow = $(answerRow),
          currentIndex = index + 1;

      $answerRow.children('.answer-text').children('.form-group').children('.answer-text-label').html('Answer #' + currentIndex);
      $answerRow.children('.answer-text').children('.form-group').children('.answer-text-textarea').attr('id', 'answer_' + currentIndex);
      $answerRow.children('.answer-text').children('.form-group').children('.answer-text-textarea').attr('name', 'answer_' + currentIndex);
      $answerRow.children('.answer-text').children('.form-group').children('.answer-text-textarea').attr('data-answer-index', currentIndex);
      $answerRow.children('.answer-feedback').children('.form-group').children('.answer-feedback-label').html('Answer #' + currentIndex + ' Feedback');
      $answerRow.children('.answer-feedback').children('.form-group').children('.answer-feedback-textarea').attr('id', 'answer_' + currentIndex + '_feedback');
      $answerRow.children('.answer-feedback').children('.form-group').children('.answer-feedback-textarea').attr('name', 'answer_' + currentIndex + '_feedback');
      $answerRow.children('.answer-feedback').children('.form-group').children('.answer-feedback-textarea').attr('data-answer-index', currentIndex);
      $answerRow.children('.answer-points').children('.form-group').children('.answer-points-input').attr('data-answer-index', currentIndex);
      $answerRow.children('.answer-points').children('.form-group').children('.answer-correct-input').attr('id', 'answer_' + currentIndex + '_correct');
      $answerRow.children('.answer-points').children('.form-group').children('.answer-correct-input').attr('name', 'answer_' + currentIndex + '_correct');
      $answerRow.children('.answer-points').children('.form-group').children('.answer-correct-input').attr('data-answer-index', currentIndex);

    });
  }
});
