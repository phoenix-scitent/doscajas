Template.bokNestable.rendered = function(){

  var $nestable = $('#nestable2');

  $nestable.nestable({
    group: 1
  });

  Session.set('nestableSerialized', $nestable.nestable('serialize'));

  $nestable.on('change', function(){
    Session.set('nestableSerialized', $( '#nestable2' ).nestable('serialize') );
    $( document ).trigger('nestableChanged');
  });

  this.autorun(function(){
    Template.currentData(); // autorun reactivity source

    // Log for nestable list
    var updateOutput = function (e) {
      var list = e.length ? e : $(e.target),
          output = list.data('output');
      if (window.JSON) {
        output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
      } else {
        output.val('JSON browser support required for this demo.');
      }
    };

    //console.log('rendered');
    //$( document ).ready(function(){
    //  console.log('doc ready!');
    //  $('#nestable2').nestable('init');
    //});

    //// output initial serialised data
    //updateOutput($('#nestable2').data('output', $('#nestable2-output')));

  });
};

Template.bokNestable.events({

});