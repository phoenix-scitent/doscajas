Meteor.subscribe('resources');
Meteor.subscribe('users');

Template.resource_inspect.helpers({
  resource: function() {
    return this;
  },
  title: function() {
    return this.title.substring(0,30);
  },
  owner: function() {
    return Meteor.users.findOne(this.owner);
  },
  tag_list: function() {
    return _.map(this.tags, function(tag){ return Boks.findOne({ _id: tag }) });
  }
});

Template.resource_inspect.rendered = function(){
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');  // optional
  script.setAttribute('src', '//cdn.embedly.com/widgets/platform.js');
  script.setAttribute('charset', 'UTF-8');
  // <script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>
  document.getElementsByTagName('body')[0].appendChild(script);
};