Template.resource_show.helpers({
  resource_link: function(){
    Session.set('shownResourceTitle', this.title);
    return this.link;
  }
});