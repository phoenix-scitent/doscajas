Meteor.subscribe('measures');

Template.measure_form.helpers({
  title: function(){

    Session.set('currentMeasure', this);

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

    $('#question-wrapper').prepend('<label>Question *</label><textarea id="question_text" name="question_text" type="text" class="form-control required" rows="4">'+ Session.get('currentMeasure').question_text +'</textarea>');

    $("#form").steps({
        bodyTag: "fieldset",
        onStepChanging: function (event, currentIndex, newIndex)
        {
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
            if (currentIndex === 3) {
              $(".wizard-big.wizard > .content").addClass("deep");
            } else {
              $(".wizard-big.wizard > .content").removeClass("deep");              
            }
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

};