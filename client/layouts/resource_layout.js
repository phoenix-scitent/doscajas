Template.resource_layout.rendered = function(){

  $("html, body").animate({ scrollTop:0 },"fast", "swing", function() { window.parent.document.body.style.overflow="hidden"; });

};

Template.resource_layout.events({
  'click #back-to-source': function(event){
    history.back();
  },
  'click #back-to-resource': function(event){

  }
});

Template.resource_top_navbar.helpers({
  resource_title: function(){
    return Session.get('shownResourceTitle');
  }
});