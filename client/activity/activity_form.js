Meteor.subscribe('boks');
Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('activities');

Template.activity_form.helpers({
  page_title: function(){
    if (this._id){
      return "Editing: "+ this.name;
    } else {
      return "Create a new Activity";
    }
  },
  category: function(){
    if (this._id) {
      return "Activities";
    } else {
      return null;
    }
  },
  itemClass: function(item){

    var tags = item.hash.item.tags.join(' ');

    if(item.hash.item.answers){
      return "warning-element " + tags;
    } else {
      return "success-element " + tags;
    }
  },
  itemType: function(item){
    if(item.hash.item.answers){
      return "measure";
    } else {
      return "resource";
    }
  },
  measures: function(){
    return MEASURES.getAvailable({ userId: Meteor.userId() }).fetch();
  },
  resources: function(){
    return RESOURCES.getAvailable({ userId: Meteor.userId() }).fetch()
  }
});

Template.activity_form.rendered = function(){

  var templateData = this.data;
  var activity_id = templateData ? templateData._id : null;

  if(activity_id){
    Session.set('currentActivityId', activity_id);
  }

  if(Session.get('current_list_filter') === undefined){
    Session.set('current_list_filter', BOK.current()._id);
  }

  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    create: function( event, ui ) {
      var activity = Activities.findOne({ _id: Session.get('currentActivityId') });
      var items = activity && activity.items;

      if(items){
        _.forEach(items, function(item){
          $(document).find("[data-id='" + item._id + "']").appendTo('#activity-list');
        });
      }
    },
    stop: function( event, ui ) {
      var $element = $(event.target);
      var content = $(this).sortable("toArray", {attribute: "data-content"});
      var sourceId = $(this).attr('id');
      var destinationId = $(ui.item).parent().attr('id');

      if(sourceId === 'activity-list' && destinationId === 'activity-list'){
        var elements = _.map(content, function (c) {
          var data = c.split('|');
          return {type: data[0], _id: data[1]};
        });

        var measures = _.filter(elements, function(element){ return element.type === 'measure' });
        var useMeasureWeighting = Activities.findOne({ _id: activity_id }).use_measure_weighting;
        var possibleScore;

        if(useMeasureWeighting){
          possibleScore = _.reduce(_.map(measures, function(measure){ return Measures.findOne({ _id: measure._id }).weight }), function(total, n) { return total + n; });
        } else {
          possibleScore = measures.length;
        }

        Meteor.call("submitActivity", activity_id, {
          total_possible_score: possibleScore,
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

      if($element.attr('id') === 'activity-list') {
        var elements = _.map(content, function (c) {
          var data = c.split('|');
          return {type: data[0], _id: data[1]};
        });

        var measures = _.filter(elements, function(element){ return element.type === 'measure' });
        var useMeasureWeighting = Activities.findOne({ _id: activity_id }).use_measure_weighting;
        var possibleScore;

        if(useMeasureWeighting){
          possibleScore = _.reduce(_.map(measures, function(measure){ return Measures.findOne({ _id: measure._id }).weight }), function(total, n) { return total + n; });
        } else {
          possibleScore = measures.length;
        }

        Meteor.call("submitActivity", activity_id, {
          total_possible_score: possibleScore,
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });

        //TODO: tried to dry up (between receive and remove), but got circular JSON errors for DDP
        //Meteor.call("updateActivityElements", $element, elements, Session.get('currentActivityId'));
      }
    },
    remove: function( event, ui ) {
      var $element = $(event.target);
      var content = $(this).sortable("toArray", {attribute: "data-content"});

      if($element.attr('id') === 'activity-list') {
        var elements = _.map(content, function (c) {
          var data = c.split('|');
          return {type: data[0], _id: data[1]};
        });

        var measures = _.filter(elements, function(element){ return element.type === 'measure' });
        var useMeasureWeighting = Activities.findOne({ _id: activity_id }).use_measure_weighting;
        var possibleScore;

        if(useMeasureWeighting){
          possibleScore = _.reduce(_.map(measures, function(measure){ return Measures.findOne({ _id: measure._id }).weight }), function(total, n) { return total + n; });
        } else {
          possibleScore = measures.length;
        }

        Meteor.call("submitActivity", activity_id, {
          total_possible_score: possibleScore,
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });

        //TODO: tried to dry up (between receive and remove), but got circular JSON errors for DDP
        //Meteor.call("updateActivityElements", $element, elements, Session.get('currentActivityId'));
      }
    }
  }).disableSelection();

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

    $('#measures-list').children('.' + _id).each(function(){
      $(this).show()
    });

    $('#measures-list').children().not('.' + _id).each(function(){
      $(this).hide()
    });

    $('#resources-list').children('.' + _id).each(function(){
      $(this).show()
    });

    $('#resources-list').children().not('.' + _id).each(function(){
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
