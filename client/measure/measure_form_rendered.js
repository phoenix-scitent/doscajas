Template.measure_form.rendered = function(){

    var templateData = this.data;

    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    };

    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    $('#question-wrapper').prepend('<label>Question *</label><textarea id="question_text" name="question_text" type="text" class="form-control required" rows="4">'+ ((this.data && this.data.question_text) || '') + '</textarea>');

    $('#description-wrapper').prepend('<label>Description</label><textarea id="description" name="description" type="text" class="form-control" rows="4">'+ ((this.data && this.data.description) || '') +'</textarea>');

    var answers = this.data && this.data.answers;

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
          '<textarea id="answer_'+ index +'_feedback" name="answer_'+ index +'_feedback" type="text" class="answer-feedback-textarea form-control" rows="2" data-answer-part="feedback" data-answer-index='+ index +'>'+ (answer.feedback || '') +'</textarea>' +
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

    _.forEach(answers, function(answer, index){
      $('#answers-wrapper').append( answerHtml(answer, index) );
    });

    $('#answers-add-wrapper').append('<span class="input-group-btn"><button id="add-answer" type="button" class="btn btn-primary"><i class="fa fa-plus"></i> Add Answer</button></span>');

    $("#form").steps({
        bodyTag: "fieldset",
        onStepChanging: function (event, currentIndex, newIndex)
        {
            if (newIndex === 3) {
              $(".wizard-big.wizard > .content").addClass("deep");
            } else {
              $(".wizard-big.wizard > .content").removeClass("deep");
            }
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex)
            {
                return true;
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex)
            {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";

            // Start validation; Prevent going forward if false
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {

        },
        onFinishing: function (event, currentIndex)
        {

          //////////////////
          // persist data //
          //////////////////

          var question = $('#question_text').val();
          var questionTypeSelectize = $('#question-type')[0].selectize;
          var questionType = questionTypeSelectize.getValue();
          var description = $('#description').val();
          var supportingResourceSelectize = $('#supporting-resource')[0].selectize;
          var supportingResource = supportingResourceSelectize.getValue();
          var linkedResourcesSelectize = $('#linked-resources')[0].selectize;
          var linkedResources = linkedResourcesSelectize.getValue();
          var tagsSelectize = $('#tags')[0].selectize;
          var tagAncestors = _.flatten(_.map(tagsSelectize.getValue(), function(tag){ return Boks.findOne({ _id: tag }).ancestors }));
          var tags = _.union(tagsSelectize.getValue(), tagAncestors, [BOK.current()._id]);

          var rawAnswers = [];
          var answers = [];

          $('#answers-wrapper').children().each(function(){
            $(this).children().each(function(){
              $(this).children().each(function(){
                $(this).children().not('label').each(function(){
                  if($(this).data('answer-index')){
                    rawAnswers.push({
                      index: $(this).data('answer-index'),
                      value: ($(this).data('answer-part') === 'correct' ? $(this).prop('checked') : $(this).val()),
                      part: $(this).data('answer-part')
                    });
                  }
                  })
                })
              })
            });

          _.forEach(_.uniq(rawAnswers, 'index'), function(uniq){
            var answerParts = _.filter(rawAnswers, function(answer){
              return answer.index === uniq.index;
            });

            var singleAnswer = {};

            _.forEach(answerParts, function(p){
              singleAnswer['id'] = p.index;
              singleAnswer[p.part] = p.value;
            });

            answers.push(singleAnswer);
          });

          var currentOwnerSelectize = $('#current-owner')[0].selectize;
          var currentOwner = currentOwnerSelectize.getValue();
          if (currentOwner === "") {
            currentOwner = Meteor.user()._id;
          }

          var performanceTypeSelectize = $('#performance-type')[0].selectize;
          var performanceType = performanceTypeSelectize.getValue();

          var weighting = $('#weighting').val();
          var difficulty = $('#difficulty').val();
          var moderatorEmail = $('#moderator-email').val();

          var measure = {
            question_text: question,
            description: description,
            type: 'measure',
            response_type: questionType,
            embedded_resource: supportingResource,
            linked_resources: linkedResources,
            weight: weighting,
            difficulty: difficulty,
            moderator: moderatorEmail,
            status: 'published', //TODO: implement this
            owner: currentOwner,
            performance_type: performanceType,
            send_upload_to: null, //TODO: implement this
            answers: _.reject(answers, function(answer){ return answer.text === "" }),
            tags: tags,
            additions: [ ], //TODO: implement this
            comments: [ ] //TODO: implement this
          };

          if(templateData && templateData._id){
            Meteor.call('submitMeasure', templateData._id, measure, function(err, docId) {
              if (err){
                console.log(err);
              } else {
                Router.go('/measure/'+ templateData._id +'/inspect');
              }
            });
          } else {
            Meteor.call('submitMeasure', null, _.extend(measure, { date_created: Date.now() }), function(err, docId) {
              if (err){
                console.log(err);
              } else {
                Router.go('/measure/'+ docId +'/inspect');
              }
            });
          }

          ////////////////////
          // deal with form //
          ////////////////////

          var form = $(this);
          //
          //// Disable validation on fields that are disabled.
          //// At this point it's recommended to do an overall check (mean ignoring only disabled fields)
          form.validate().settings.ignore = ":disabled";
          //
          //// Start validation; Prevent form submission if false
          return form.valid();

        },
        onFinished: function (event, currentIndex)
        {
            var form = $(this);

            // Submit form input
            // form.submit();

        }
    }).validate({
        errorPlacement: function (error, element)
        {
            element.before(error);
        },
        rules: {
            confirm: {
                equalTo: "#password"
            }
        }
    });

    //TODO: scope these to this user, pull data source out of here and into router?
    var tags = BOK.getAllNodesByUser({ userId: Meteor.userId(), currentBokId: BOK.current()._id, publicOnly: true }).fetch();
    var formattedTags = _.map(tags, function(tag){
      var getTagName = function(tagId){
        return _.filter(tags, function(tag){ return tag._id === tagId })[0].name
      };
      var formatAncestors = _.map(tag.ancestors, function(ancestor){
        var path = [];

        path.push(getTagName(ancestor) + ' > ');

        return path.join('')
      }).join('');

      tag['path'] = formatAncestors;

      return tag;
    });
    var resources = RESOURCES.getAvailable({ userId: Meteor.userId(), tags: BOK.current()._id }).fetch();
    var fetchEmbeddedResource = Resources.findOne({ _id: (this.data && this.data.embedded_resource) });
    var currentEmbeddedResource = fetchEmbeddedResource && fetchEmbeddedResource._id;
    var currentLinkedResources = _.map(Resources.find({ _id: { $in: ((this.data && this.data.linked_resources) || []) } }).fetch(), function(resource){
      return resource._id;
    });
    var currentTags = _.map(Boks.find({ _id: { $in: ((this.data && this.data.tags) || []) } }).fetch(), function(tag){
      return tag._id;
    });

    $("#question-type").selectize({
      placeholder: "choose the type...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'slug',
      searchField: 'name',
      options: MEASURE_TYPES,
      items: [ (this.data && this.data.response_type) ]
    });

    $("#supporting-resource").selectize({
      plugins: ['remove_button'],
      allowEmptyOption: true,
      placeholder: "Embed a Resource in the Measure...",
      create: false,
      maxItems: 1,
      labelField: 'title',
      valueField: '_id',
      searchField: 'title',
      options: resources,
      items: [ currentEmbeddedResource ]
    });

    $("#linked-resources").selectize({
      plugins: ['remove_button'],
      placeholder: "Link to Resources...",
      create: false,
      maxItems: null,
      labelField: 'title',
      valueField: '_id',
      searchField: 'title',
      options: resources,
      items: currentLinkedResources
    });

    $("#tags").selectize({
      plugins: ['remove_button'],
      placeholder: "Add tags in the Body of Knowledge...",
      create: false,
      maxItems: null,
      labelField: 'name',
      valueField: '_id',
      searchField: 'name',
      render: {
        option: function(data, escape) {
          return '<div class="option"><span class="type">' + escape(data.path) + '<strong>' + escape(data.name) + '</strong></span></div>';
        },
        item: function(data, escape) {
          return '<div class="item">' + escape(data.name) + '</div>';
        }
      },
      options: formattedTags,
      items: currentTags
    });

    var tagsSelectizeAPI = $('#tags')[0].selectize;

    tagsSelectizeAPI.on("item_add", function(value, $item){
      var _id = value,
          tag = Boks.findOne({ _id: value });
      _.each(tag.ancestors, function(item){
        tagsSelectizeAPI.addItem(item, function(){return true} /* no change event will be fired on the original input */)
      });
    });

    $("#current-owner").selectize({
      plugins: ['remove_button'],
      placeholder: "Choose the current owner...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'name',
      searchField: 'name',
      options: [],
      items: []
    });

    $("#performance-type").selectize({
      plugins: ['remove_button'],
      placeholder: "Choose the performance type...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'slug',
      searchField: 'name',
      options: PERFORMANCE_TYPES,
      items: [ (this.data && this.data.performance_type) || 'undecided' ]
    });

    $('#weighting-wrapper').prepend('<input id="weighting" name="weighting" type="text" class="form-control" value="'+ ((this.data && this.data.weight) || '') +'">');

    $('#difficulty-wrapper').prepend('<input id="difficulty" name="difficulty" type="text" class="form-control" value="'+ ((this.data && this.data.difficulty) || '') +'">');

    $('#moderator-email-wrapper').prepend('<input id="moderator-email" name="moderator_email" type="text" class="form-control" value="'+ ((this.data && this.data.moderator) || '') +'" placeholder="moderator@school.edu">');
};
