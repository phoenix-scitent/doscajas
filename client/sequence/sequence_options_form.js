Template.sequence_options_form.rendered = function(){

  $("#sequence-type").selectize({
    placeholder: "choose the type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'slug',
    searchField: 'name',
    options: SEQUENCE_TYPES,
    items: [ (this.data && this.data.type) ] //TODO: add this in from sequence form
  });

  $("#current-owner").selectize({
    plugins: ['remove_button'],
    placeholder: "Choose the current owner...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'name',
    searchField: 'name',
    options: [],
    items: []
  });

  $("#passing-rate-type").selectize({
    plugins: ['remove_button'],
    placeholder: "Choose passing rate type...",
    create: false,
    maxItems: 1,
    labelField: 'name',
    valueField: 'name',
    searchField: 'name',
    options: [{ name: 'Score' }, { name: 'Percent' }],
    items: []
  });

};