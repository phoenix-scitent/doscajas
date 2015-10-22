Meteor.subscribe('boks');
Meteor.subscribe('courses');
Meteor.subscribe('activities');

Template.course_form.helpers({
  page_title: function(){
    if (this._id){
      return "Editing: "+ this.name;
    } else {
      return "Create a new Course";
    }
  },
  category: function(){
    if (this._id) {
      return "Courses";
    } else {
      return null;
    }
  },
  itemClass: function(item){
    var tags = item.hash.item.tags.join(' ');

    return "success-element " + tags;
  },
  itemType: function(item){
    return "activity";
  },
  activities: function(){
    return ACTIVITIES.getAvailable({ userId: Meteor.userId() }).fetch();
  },
  activityItemCount: function(activity){
    var plural = function(singular, plural, count){
      if(count === 1){
        return singular;
      } else {
        return plural;
      }
    };
    var counts = _.partition(activity.items, function(item){ return item.type === 'measure' });
    return '<span style="font-style:italic;font-size:10px;">(' + counts[0].length + ' ' + plural('measure', 'measures', counts[0].length) + ', ' + counts[1].length + ' ' + plural('resource', 'resources', counts[1].length)  + ')';
  }
});

Template.course_form.rendered = function(){

  var templateData = this.data;
  var course_id = templateData ? templateData._id : null;

  if(course_id){
    Session.set('currentCourseId', course_id);
  }

  if(Session.get('current_list_filter') === undefined){
    Session.set('current_list_filter', BOK.current()._id);
  }

  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    create: function( event, ui ) {
      var course = Courses.findOne({ _id: Session.get('currentCourseId') });
      var items = course && course.items;

      if(items){
        _.forEach(items, function(item){
          $(document).find("[data-id='" + item._id + "']").appendTo('#course-list');
        });
      }
    },
    stop: function( event, ui ) {
      var $element = $(event.target);
      var content = $(this).sortable("toArray", {attribute: "data-content"});
      var sourceId = $(this).attr('id');
      var destinationId = $(ui.item).parent().attr('id');

      if(sourceId === 'course-list' && destinationId === 'course-list'){

        var elements = [];

        $('#course-list > .activity-item').each(function(index, element){
          var data = $(element).data('content').split('|');
          var selectize = $(element).children('select.prerequisite')[0].selectize;

          elements.push({type: data[0], _id: data[1], prerequisite: selectize.getValue()});
        });

        Meteor.call("submitCourse", course_id, {
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });
      }
    },
    receive: function( event, ui ) {
      var $element = $(event.target);
      var content = $(this).sortable("toArray", {attribute: "data-content"});

      if($element.attr('id') === 'course-list') {

        var prerequisites = _.map(content, function(c){
          var data = c.split('|');
          return { _id: data[1], name: data[2] }
        });

        $('select.prerequisite').each(function(index, element){
          var selectize = $(element)[0].selectize;
          var currentValue = selectize.getValue();

          selectize.clearOptions();
          selectize.addOption(prerequisites);

          selectize.addItem(currentValue, true /* no change event fired */)
        });

        var elements = [];

        $('#course-list > .activity-item').each(function(index, element){
          var data = $(element).data('content').split('|');
          var selectize = $(element).children('select.prerequisite')[0].selectize;

          elements.push({type: data[0], _id: data[1], prerequisite: selectize.getValue()});
        });

        Meteor.call("submitCourse", course_id, {
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });

        //TODO: tried to dry up (between receive and remove), but got circular JSON errors for DDP
        //Meteor.call("updateCourseElements", $element, elements, Session.get('currentCourseId'));
      }
    },
    remove: function( event, ui ) {
      var $element = $(event.target);
      var content = $(this).sortable("toArray", {attribute: "data-content"});
      var prerequisiteSelectize = $(ui.item).children('.prerequisite')[0].selectize;


      if($element.attr('id') === 'course-list') {

        var prerequisites = _.map(content, function(c){
          var data = c.split('|');
          return { _id: data[1], name: data[2] }
        });

        $('select.prerequisite').each(function(index, element){
          var selectize = $(element)[0].selectize;
          var currentValue = selectize.getValue();

          selectize.clearOptions();
          selectize.addOption(prerequisites);

          selectize.addItem(currentValue, true /* no change event fired */)
        });

        prerequisiteSelectize.clear(true /* no change event fired */);

        var elements = [];

        $('#course-list > .activity-item').each(function(index, element){
          var data = $(element).data('content').split('|');
          var selectize = $(element).children('select.prerequisite')[0].selectize;

          elements.push({type: data[0], _id: data[1], prerequisite: selectize.getValue()});
        });

        Meteor.call("submitCourse", course_id, {
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });

        //TODO: tried to dry up (between receive and remove), but got circular JSON errors for DDP
        //Meteor.call("updateCourseElements", $element, elements, Session.get('currentCourseId'));
      }
    }
  }).disableSelection();

  var initialPrerequisites = [];

  $('#course-list > .activity-item').each(function(index, element){
    var data = $(element).data('content').split('|');

    initialPrerequisites.push({ _id: data[1], name: data[2] });
  });

  $('select.prerequisite').each(function(index, element){
    var activityId = $(element).data('activity-id');
    var item = _.find(Courses.findOne({ _id: Session.get('currentCourseId') }).items, function(item){ return item._id === activityId });

    $(element).selectize({
      plugins: ['remove_button'],
      placeholder: "Choose prerequisite...",
      create: false,
      maxItems: 1,
      labelField: 'name',
      valueField: '_id',
      searchField: 'name',
      render: {
        option: function(data, escape) {
          return '<div class="option"><span class="type">' + escape(data.name) + '</span></div>';
        },
        item: function(data, escape) {
          return '<div class="item">' + escape(data.name) + '</div>';
        }
      },
      options: initialPrerequisites,
      items: [ (item && item.prerequisite) || '' ]
    });

    var prerequisiteSelectizeAPI = $(element)[0].selectize;

    prerequisiteSelectizeAPI.on("change", function(value, $item){

      var elements = [];

      $('.activity-item').each(function(index, element){
        var data = $(element).data('content').split('|');
        var selectize = $(element).children('select.prerequisite')[0].selectize;

        elements.push({type: data[0], _id: data[1], prerequisite: selectize.getValue()});
      });

      Meteor.call("submitCourse", course_id, {
        items: elements
      }, function(err, response) {
        if (err){
          console.log(err);
        } else {
          // success
        }
      });


    });

  });

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

  $("#list-filter").selectize({
    plugins: ['remove_button'],
    placeholder: "Filter by tag...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: '_id',
    searchField: 'name',
    render: {
      option: function(data, escape) {
        return '<div class="option"><span class="type">' + escape(data.path) + '<strong>' + escape(data.name) + '</strong></span></div>';
      },
      item: function(data, escape) {
        return '<div class="item">' + escape(data.path) + '<strong>' + escape(data.name) + '</strong></div>';
      }
    },
    options: formattedTags,
    items: [ Session.get('current_list_filter') || BOK.current()._id ]
  });

  var listFilterSelectizeAPI = $('#list-filter')[0].selectize;

  listFilterSelectizeAPI.on("item_add", function(value, $item){
    var _id = value;

    $('#activities-list').children('.' + _id).each(function(){
      $(this).show()
    });

    $('#activities-list').children().not('.' + _id).each(function(){
      $(this).hide()
    });

    function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    }

    $('#accordion').on('hidden.bs.collapse', toggleChevron);
    $('#accordion').on('shown.bs.collapse', toggleChevron);
  });
};
