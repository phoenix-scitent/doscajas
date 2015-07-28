Template.measure_form.rendered = function(){

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

    _.forEach(answers, function(answer, index){
      var answerHtml = function(answer, index){
        var index = index + 1,
            isCorrect = function(correct){
              if(correct){
                return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="checkbox checkbox-success" checked />'
              } else {
                return '<input id="answer_'+ index +'_correct" name="answer_'+ index +'_correct" type="checkbox" class="checkbox checkbox-success" />'
              }
            };

        return '<div class="row">' +
          '<div class="col-lg-3">' +
            '<div class="form-group">' +
              '<label>Answer #'+ index +'</label>' +
              '<textarea id="answer_'+ index +'" name="answer_'+ index +'" type="text" class="form-control" rows="2">'+ answer.text +'</textarea>' +
            '</div>' +
          '</div>' +
          '<div class="col-lg-6">' +
            '<div class="form-group">' +
              '<label>Answer #'+ index +' Feedback</label>' +
              '<textarea id="answer_'+ index +'_feedback" name="answer_'+ index +'_feedback" type="text" class="form-control" rows="2">'+ answer.feedback +'</textarea>' +
            '</div>' +
          '</div>' +
          '<div class="col-lg-3">' +
            '<div class="form-group">' +
              '<label>Answer Points</label>' +
              '<input type="text" class="form-control" value="'+ (answer.points || '') +'" />' +
            '</div>' +
            '<div class="form-group">' +
              isCorrect(answer.correct) +
              '<label>Correct</label>' +
            '</div>' +
          '</div>'+
        '</div>'
      };

      $('#answers-wrapper').append( answerHtml(answer, index) );
    });

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
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";

            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
            var form = $(this);

            // Submit form input
            form.submit();
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
    var tags = Boks.find({ ancestors: BOK.current()._id }).fetch();
    var resources = Resources.find().fetch();
    var fetchEmbeddedResource = Resources.findOne({ _id: (this.data && this.data.embedded_resource) });
    var currentEmbeddedResource = fetchEmbeddedResource && fetchEmbeddedResource.name;
    var currentLinkedResources = _.map(Resources.find({ _id: { $in: ((this.data && this.data.linked_resources) || []) } }).fetch(), function(resource){
      return resource.name
    });
    var currentTags = _.map(Boks.find({ _id: { $in: ((this.data && this.data.tags) || []) } }).fetch(), function(tag){
      return tag.name
    });

    $("#question-type").selectize({
      placeholder: "choose the type...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'slug',
      searchField: 'name',
      options: MEASURE_TYPES,
      items: [ (this.data && this.data.type) ]
    });

    $("#supporting-resource").selectize({
      plugins: ['remove_button'],
      allowEmptyOption: true,
      placeholder: "Embed a Resource in the Measure...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'name',
      searchField: 'name',
      options: resources,
      items: [ currentEmbeddedResource ]
    });

    $("#linked-resources").selectize({
      plugins: ['remove_button'],
      placeholder: "Link to Resources...",
      create: false,
      maxItems: null,
      labelField: 'name',
      valueField: 'name',
      searchField: 'name',
      options: resources,
      items: currentLinkedResources
    });

    $("#tags").selectize({
      plugins: ['remove_button'],
      placeholder: "Add tags in the Body of Knowledge...",
      create: false,
      maxItems: null,
      labelField: 'name',
      valueField: 'name',
      searchField: 'name',
      options: tags,
      items: currentTags
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

    $('#weighting-wrapper').prepend('<input id="weighting" name="weighting" type="text" class="form-control" value="'+ ((this.data && this.data.weight) || '') +'">');

    $('#difficulty-wrapper').prepend('<input id="difficulty" name="difficulty" type="text" class="form-control" value="'+ ((this.data && this.data.difficulty) || '') +'">');

    $('#moderator-email-wrapper').prepend('<input id="moderator-email" name="moderator_email" type="text" class="form-control" value="'+ ((this.data && this.data.moderator) || '') +'" placeholder="moderator@school.edu">');
};