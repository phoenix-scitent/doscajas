Template.resource_form.rendered = function(){

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

    $('#resource-wrapper').prepend('<label>Title *</label><input id="resource_text" name="resource_text" type="text" class="form-control required" value="'+ ((this.data && this.data.title) || '') + '"/>');

    $('#link-wrapper').prepend('<label>Link *</label><input id="resource_link" name="resource_link" type="text" class="form-control required" rows="4" value="'+ ((this.data && this.data.link) || '') + '"/>');

    $('#description-wrapper').prepend('<label>Description</label><textarea id="description" name="description" type="text" class="form-control" rows="4">'+ ((this.data && this.data.description) || '') +'</textarea>');

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

        },
        onFinishing: function (event, currentIndex)
        {

          //////////////////
          // persist data //
          //////////////////

          var title = $('#resource_text').val();
          var link = $('#resource_link').val();
          var resourceTypeSelectize = $('#resource-type')[0].selectize;
          var resourceType = resourceTypeSelectize.getValue();
          var description = $('#description').val();
          var tagsSelectize = $('#tags')[0].selectize;
          var tagAncestors = _.flatten(_.map(tagsSelectize.getValue(), function(tag){ return Boks.findOne({ _id: tag }).ancestors }));
          var tags = _.union(tagsSelectize.getValue(), tagAncestors, [BOK.current()._id]);

          var currentOwnerSelectize = $('#current-owner')[0].selectize;
          var currentOwner = currentOwnerSelectize.getValue();

          var learningTypeSelectize = $('#learning-type')[0].selectize;
          var learningType = learningTypeSelectize.getValue();

          if(templateData && templateData._id){
            Resources.update(templateData._id, {
              $set: {
                title: title,
                description: description,
                type: resourceType,
                link: link,
                status: 'published', //TODO: implement this
                learning_type: learningType,
                owner: currentOwner,
                tags: tags,
                additions: [ ], //TODO: implement this
                comments: [ ]  //TODO: implement this
                //date_created: Date.now()
              }
            }, function(error, docId){
              Router.go('/resource/'+ templateData._id +'/inspect')
            });
          } else {
            Resources.insert({
              title: title,
              description: description,
              type: resourceType,
              link: link,
              status: 'published', //TODO: implement this
              learning_type: learningType,
              owner: currentOwner,
              tags: tags,
              additions: [ ], //TODO: implement this
              comments: [ ], //TODO: implement this
              date_created: Date.now()
            }, function(error, docId){
              Router.go('/resource/'+ docId +'/inspect')
            })
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
    var tags = Boks.find({ $or: [{ _id: BOK.current()._id }, { $and: [{ancestors: BOK.current()._id}] }] }).fetch();
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
    var currentTags = _.map(Boks.find({ _id: { $in: ((this.data && this.data.tags) || []) } }).fetch(), function(tag){
      return tag._id
    });

    $("#resource-type").selectize({
      placeholder: "choose the type...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'slug',
      searchField: 'name',
      options: RESOURCE_TYPES,
      items: [ (this.data && this.data.type) ]
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

    $("#learning-type").selectize({
      plugins: ['remove_button'],
      placeholder: "Choose the learning type...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: 'slug',
      searchField: 'name',
      options: LEARNING_TYPES,
      items: [ (this.data && this.data.learning_type) ]
    });

};