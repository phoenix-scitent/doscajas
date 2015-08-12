Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound'
});

Router.route('/learners', {
  name: 'learner_login',
  controller: 'LoginController',
  action: 'learner_login'
});

Router.route('/creators', {
  name: 'creator_login',
  controller: 'LoginController',
  action: 'creator_login'
});

Router.route('/all_sequences', {
  name: 'all_sequences',
  controller: 'LearnerSequencesController',
  action: 'action'
});

Router.route('/sequence_test', {
  name: 'sequence_test',
  template: 'sequence_test'
});

Router.route('/bok/:_id', {
   name: 'bok',
   data: function() {
     Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.last_bok': this.params._id }} );
     return Boks.find({ $or: [{ _id: this.params._id }, { $and: [{ancestors: this.params._id}, {public: true}] }] });
   }
});

Router.route('/boks', {
   name: 'boks',
   data: function() { return Boks.find({ancestors: []}); }
});

Router.route('/measures', {
   name: 'measures',
   data: function() { return Measures.find(); }
});

Router.route('/measure/new', {
  name: 'measure_new',
  template: 'measure_form'
});

Router.route('/measure/:_id/edit', {
  name: 'measureEdit',
  template: 'measure_form',
  data: function() {
    return Measures.findOne({ _id: this.params._id });
  }
});

Router.route('/measure/:_id/inspect', {
  name: 'measure_inspect',
  template: 'measure_inspect',
  data: function() {
    return Measures.findOne({ _id: this.params._id });
  }
});

Router.route('/sequences', {
  name: 'sequences',
  data: function() {
    return Sequences.find();
  }
});

Router.route('/sequence/new', {
  name: 'sequence_new',
  template: 'sequence_form'
});

Router.route('/sequence/:_id/edit', {
  name: 'sequenceEdit',
  template: 'sequence_form',
  data: function() {
    return Sequences.findOne({ _id: this.params._id });
  }
});

Router.route('/sequence/:_id/inspect', {
  name: 'sequence_inspect',
  template: 'sequence_inspect',
  data: function() {
    return Sequences.findOne({ _id: this.params._id });
  }
});

Router.route('/sequence/:sequence_id/attempt', {
  name: 'sequence_attempt_create',
  template: 'sequence_attempt',
  layoutTemplate: 'layout2',
  data: function() {
    return {
      currentSequence: Sequences.findOne({ _id: this.params.sequence_id })
    };
  }
});

Router.route('/sequence/:sequence_id/attempt/:attempt_id', {
  name: 'sequence_attempt_show',
  template: 'sequence_attempt',
  layoutTemplate: 'layout2',
  data: function() {
    return {
      currentSequence: Sequences.findOne({ _id: this.params.sequence_id }),
      currentAttempt: Sequences.findOne({ _id: this.params.attempt_id })
    };
  }
});

Router.route('/resources', {
  name: 'resources',
  data: function() { return Resources.find(); }
});

Router.route('/resource/new', {
  name: 'resource_new',
  template: 'resource_form'
});

Router.route('/resource/:_id', {
  name: 'resource_show',
  template: 'resource_show',
  layoutTemplate: 'resource_layout',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/r/:_id', {
  name: 'resource_popup',
  template: 'resource_show',
  layoutTemplate: 'resource_layout',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/resource/:_id/edit', {
  name: 'resourceEdit',
  template: 'resource_form',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/resource/:_id/inspect', {
  name: 'resource_inspect',
  template: 'resource_inspect',
  data: function() {
    return Resources.findOne({ _id: this.params._id });
  }
});

Router.route('/home', function() {
  this.render('boks');
});



Router.route('/sequence', function() {
    this.render('sequence');
});
Router.route('/intro_lesson', function() {
    this.render('intro_lesson');
});
Router.route('/adaptive_quiz', function() {
    this.render('adaptive_quiz');
});
Router.route('/final_quiz', function() {
    this.render('final_quiz');
});


//
// Landing page
//

Router.route('/landing', function () {
    this.render('landing');
    this.layout('blankLayout')
});

//
// Other pages routes
//
Router.route('/notFound', function () {
    this.render('notFound');
});

// Default route
// You can use direct this.render('template')
// We use Router.go method because dashboard1 is our nested view in menu
Router.route('/', function () {
  this.render('root');
  this.layout('layout2');
});


