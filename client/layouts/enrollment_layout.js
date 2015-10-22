Template.enrollment_layout.rendered = function(){

  // Add special class for handel top navigation layout
  $('body').addClass('top-navigation');

}

Template.enrollment_layout.destroyed = function(){

  // Remove special top navigation class
  $('body').removeClass('top-navigation');
};
