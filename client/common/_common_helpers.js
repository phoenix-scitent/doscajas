UI.registerHelper('trace', function(context, options) {
  if(context)
    console.log(context);
});

UI.registerHelper('addIndex', function (all) {
  return _.map(all, function(val, index) {
    return {index: index + 1, value: val};
  });
});
UI.registerHelper('dat_bok', function(){
  return BOK.current();
});

UI.registerHelper('dat_bok_name', function(){
  return BOK.current().name;
});

UI.registerHelper('dat_bok_url', function(){
  return "/bok/" + BOK.current()._id;
});