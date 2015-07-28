UI.registerHelper('trace', function(context, options) {
  if(context)
    console.log(context);
});

UI.registerHelper('dat_bok', function(){
  return Boks.findOne(Meteor.user().profile.last_bok);
});

UI.registerHelper('dat_bok_name', function(){
  return Boks.findOne(Meteor.user().profile.last_bok).name;
});

UI.registerHelper('dat_bok_url', function(){
  return "/bok/" + Meteor.user().profile.last_bok;
});