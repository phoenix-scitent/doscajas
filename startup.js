// Run this when the meteor app is started (client and server)
Meteor.startup(function () {

  BOK = (function(){
    var getBok = function(){
      return Boks.findOne(Meteor.user().profile.last_bok);
    };

    return {
      current: getBok
    }
  }());

  MEASURE_TYPES = [
    { name: 'Multiple Choice', slug: 'multiplechoice' },
    { name: 'Text Input', slug: 'textinput' },
    { name: 'Upload', slug: 'upload' }
  ];

  PERFORMANCE_TYPES = [
    { name: 'Recall', slug: 'recall' },
    { name: 'Understanding', slug: 'understanding' },
    { name: 'Application', slug: 'application' },
    { name: 'Analysis', slug: 'analysis' },
    { name: 'Evaluation', slug: 'evaluation' },
    { name: 'Creativity', slug: 'creativity' }
  ];

  RESOURCE_TYPES = [
    { name: 'Video', slug: 'video' },
    { name: 'PDF', slug: 'pdf' },
    { name: 'Audio', slug: 'audio' }
  ];

  LEARNING_TYPES = [
    { name: 'Case Study', slug: 'casestudy' },
    { name: 'Problem Based Learning', slug: 'problembasedlearning' }
  ];

});