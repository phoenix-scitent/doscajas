Meteor.subscribe('boks');
Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_form.helpers({
  itemClass: function(item){
    if(item.hash.item.answers){
      return "warning-element";
    } else {
      return "success-element";
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
    if(Session.get('current_measure_list_filter') === undefined){
      Session.set('current_measure_list_filter', BOK.current()._id);
    }

    var sequenceMeasures = new ReactiveArray(Measures.find().fetch());

    return _.filter(sequenceMeasures, function(measure){
      return _.includes(measure.tags, Session.get('current_measure_list_filter'))
    });
  },
  resources: function(){
    if(Session.get('current_resource_list_filter') === undefined){
      Session.set('current_resource_list_filter', BOK.current()._id);
    }

    var sequenceResources = new ReactiveArray(Resources.find().fetch());

    return _.filter(sequenceResources, function(resource){
      return _.includes(resource.tags, Session.get('current_resource_list_filter'))
    });
  },
  sequences: function(){
    var sequenceItems = new ReactiveArray();

    return sequenceItems;
  }
});

Template.sequence_form.rendered = function(){

  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    beforeStop: function( event, ui ) {

      var item = $(ui.item).data('content').split('|')[1];
      var itemType = $(ui.item).data('content').split('|')[0];
      var itemId = $(ui.item).attr('id');
      var sourceId = $(this).attr('id');
      var destinationId = $($(ui.placeholder).parent()[0]).attr('id');

      var movingMeasureResource = itemId === 'measure-item' && destinationId === 'resources-list';
      var movingResourceMeasure = itemId === 'resource-item' && destinationId === 'measures-list';

      if(movingMeasureResource || movingResourceMeasure) {
        $(this).sortable('cancel');
      } else {
        if(sourceId === 'sequence-list'){
          //remove
          if(itemType === 'measure'){
            (function(){

              jQuery.trigger('removeSequenceMeasures', [ item ]);


              sequenceMeasures.push(_.filter(sequenceItems, function(measure){ return measure._id === item; }));
              sequenceItems.remove(_.find(sequenceItems, function(measure){ return measure._id === item; }));


              console.log('MEASURES: ', sequenceMeasures, "ITEMS: ", sequenceItems);
            }());
          }

          if(itemType === 'resource'){
            (function(){

              jQuery.trigger('removeSequenceResources', [ item ]);

              sequenceResources.push(_.filter(sequenceItems, function(resource){ return resource._id === item; }));
              sequenceItems.remove(_.find(sequenceItems, function(resource){ return resource._id === item; }));


              console.log('RESOURCES: ', sequenceResources, "ITEMS: ", sequenceItems);
            }())
          }

        }

        if(destinationId === 'sequence-list'){
          //add
          if(itemType === 'measure'){
            (function(){

              jQuery.trigger('addSequenceMeasures', [ item ]);

              sequenceItems.push(_.filter(sequenceMeasures, function(measure){ return measure._id === item; }));
              sequenceMeasures.remove(_.find(sequenceMeasures, function(measure){ return measure._id === item; }));


              console.log('MEASURES: ', sequenceMeasures, "ITEMS: ", sequenceItems);
            }())
          }

          if(itemType === 'resource'){
            (function(){

              jQuery.trigger('addSequenceResources', [ item ]);

              sequenceItems.push(_.filter(sequenceResources, function(resource){ return resource._id === item; }));
              sequenceResources.remove(_.find(sequenceResources, function(resource){ return resource._id === item; }));


              console.log('RESOURCES: ', sequenceResources, "ITEMS: ", sequenceItems);
            }())
          }
        }
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
    items: [ Session.get('current_measure_list_filter') ]
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
    items: [ Session.get('current_resource_list_filter') ]
  });

  var resourcesFilterSelectizeAPI = $('#resources-list-filter')[0].selectize;

  resourcesFilterSelectizeAPI.on("item_add", function(value, $item){
    var _id = value;

    Session.set("current_resource_list_filter", _id);

  });
};