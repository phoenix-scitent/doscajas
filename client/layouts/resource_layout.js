Template.resource_layout.rendered = function(){

  $("html, body").animate({ scrollTop:0 },"fast", "swing", function() { window.parent.document.body.style.overflow="hidden"; });

};

Template.resource_layout.events({
  'click #back-to-source': function(event){
    window.close();
  }
});

Template.resource_top_navbar.helpers({
  resource_title: function(){
    return Session.get('shownResourceTitle');
  },
  resource_has_instructor_notes: function() {
    console.log(this);
    return true;
  }
});