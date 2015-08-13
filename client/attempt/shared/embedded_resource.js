Template.embedded_resource.helpers({
  data: function() {
    return {embedly: {title: "Timothy Johnson"}};
  }
});

Template.embedded_resource.rendered = function(){
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');  // optional
  script.setAttribute('src', '//cdn.embedly.com/widgets/platform.js');
  script.setAttribute('charset', 'UTF-8');
  document.getElementsByTagName('body')[0].appendChild(script);
  $('a.embedly-oembed').embedly({query: {maxwidth:600,luxe:1} });
};