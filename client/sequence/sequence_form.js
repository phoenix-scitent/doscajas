Meteor.subscribe('boks');
Meteor.subscribe('measures');
Meteor.subscribe('resources');
Meteor.subscribe('sequences');

Template.sequence_form.helpers({
  page_title: function(){
    if (this._id){
      return "Editing: "+ this.name;
    } else {
      return "Create a new Sequence";
    }
  },
  category: function(){
    if (this._id) {
      return "Sequences";
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
    return Measures.find().fetch();
  },
  resources: function(){
    return Resources.find().fetch()
  }
});

Template.sequence_form.rendered = function(){

  var templateData = this.data;
  var sequence_id = templateData ? templateData._id : null;

  if(sequence_id){
    Session.set('currentSequenceId', sequence_id);
  }

  if(Session.get('current_list_filter') === undefined){
    Session.set('current_list_filter', BOK.current()._id);
  }

  // Initialize sortable
  $(".sortable-list").sortable({
    connectWith: ".connectList",
    create: function( event, ui ) {
      var sequence = Sequences.findOne({ _id: Session.get('currentSequenceId') });
      var items = sequence && sequence.items;

      if(items){
        _.forEach(items, function(item){
          $(document).find("[data-id='" + item._id + "']").appendTo('#sequence-list');
        });
      }
    },
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

          }

          if(itemType === 'resource'){

          }

        }

        if(destinationId === 'sequence-list'){
          //add
          if(itemType === 'measure'){

          }

          if(itemType === 'resource'){

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

        Meteor.call("submitSequence", this._id, {
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
    remove: function( event, ui ) {
      if($(event.target).attr('id') === 'sequence-list'){
        var content = $(this).sortable("toArray", { attribute: "data-content" });

        var elements =_.map(content, function(c){
          var data = c.split('|');
          return { type: data[0], _id: data[1] };
        });

        Meteor.call("submitSequence", this._id, {
          items: elements
        }, function(err, response) {
          if (err){
            console.log(err);
          } else {
            // success
          }
        });
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