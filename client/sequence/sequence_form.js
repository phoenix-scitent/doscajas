Meteor.subscribe('boks');
Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_form.helpers({
  measures: function(){

    if(Session.get('current_measure_list_filter') === undefined){
      Session.set('current_measure_list_filter', BOK.current()._id);
    }

    return Measures.find({ tags: Session.get('current_measure_list_filter') });
  },
  resources: function(){

    if(Session.get('current_resource_list_filter') === undefined){
      Session.set('current_resource_list_filter', BOK.current()._id);
    }

    return Resources.find({ tags: Session.get('current_resource_list_filter') });
  }
});

Template.sequence_form.rendered = function(){

  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    beforeStop: function( event, ui ) {

      var itemId = $(ui.item).attr('id');
      var sourceId = $(this).attr('id');
      var destinationId = $($(ui.placeholder).parent()[0]).attr('id');

      var movingMeasureResource = itemId === 'measure-item' && destinationId === 'resources-list';
      var movingResourceMeasure = itemId === 'resource-item' && destinationId === 'measures-list';

      if (movingMeasureResource || movingResourceMeasure) {
        $(this).sortable('cancel');
      }
    },
    receive: function( event, ui ) {
      if($(event.target).attr('id') === 'sequence-list'){
        var content = $(this).sortable("toArray", { attribute: "data-content" });

        var elements =_.map(content, function(c){
          var data = c.split('|');
          return { type: data[0], _id: data[1] };
        });

        Session.set('currentSequenceList', elements);
      }
    },
    remove: function( event, ui ) {
      if($(event.target).attr('id') === 'sequence-list'){
        var content = $(this).sortable("toArray", { attribute: "data-content" });

        var elements =_.map(content, function(c){
          var data = c.split('|');
          return { type: data[0], _id: data[1] };
        });

        Session.set('currentSequenceList', elements);
      }
    }
  }).disableSelection();

  var tags = Boks.find({ $or: [{ _id: BOK.current()._id }, { $and: [{ancestors: BOK.current()._id}, {public: true}] }] }).fetch();
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

  $("#measures-list-filter").selectize({
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
    items: [ Session.get('current_measure_filter') ]
  });

  var measureFilterSelectizeAPI = $('#measures-list-filter')[0].selectize;

  measureFilterSelectizeAPI.on("item_add", function(value, $item){
    var _id = value;

    Session.set("current_measure_list_filter", _id);

  });

  $("#resources-list-filter").selectize({
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
    items: [ Session.get('current_measure_filter') ]
  });

  var resourcesFilterSelectizeAPI = $('#resources-list-filter')[0].selectize;

  resourcesFilterSelectizeAPI.on("item_add", function(value, $item){
    var _id = value;

    Session.set("current_resource_list_filter", _id);

  });
};