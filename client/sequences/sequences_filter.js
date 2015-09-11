Template.sequences_filter.rendered = function(){

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

  Session.set('current_sequence_filter', BOK.current()._id);

  $("#sequences-filter").selectize({
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
    items: [ Session.get('current_sequence_filter') ]
  });

  var filterSelectizeAPI = $('#sequences-filter')[0].selectize;

  filterSelectizeAPI.on("item_add", function(value, $item){
    var _id = value;

    Session.set("current_sequence_filter", _id);

  });

};
