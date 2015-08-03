//// Load Chance
//var Chance = require('chance');
//
//// Instantiate Chance so it can be used
//var chance = new Chance();

// chance.name()

if (Measures.find().count() === 0) {

  ///* CREATE DEPENDENCIES */
  var create_user = function(){
    return Accounts.createUser({
      '__testdata': true,
      username: _.sample(['salmon', 'trout', 'mackerel', 'smelt', 'bass', 'tuna', 'mahimahi']),
      email: _.sample(['rja@cci.com', 'sil@cci.com', 'nas@cci.com', 'ffe@cci.com', 'feksl@cci.com', 'djks@cci.com']),
      password: 'notsafe',
      profile: {
        name: 'Ricky James'
      }
    });
  };

  var create_tag = function(){
    return Boks.find().fetch()[0]._id;
  };

  var create_measure = function(){
    return Measures.insert({
      '__testdata': true,
      name: 'asdfa',
      tags: [],
      answers: [
        { correct: true, text: 'asdf' }
      ],
      additions: [],
      comments: [],
      date_created: Date.now()
    });
  };

  var create_comment = function(){
    return Comments.insert({
      '__testdata': true,
      name: 'sdwesdf'
    });
  };

  var create_resource = function(){
    return Resources.insert({
      __testdata: true,
      title: _.sample(['Seasonal Depression', 'Clambake', 'Satori', 'Crimea', 'Salty']),
      description: _.sample(['A video displaying the results of seasonal depression.', 'Yummy clams.', 'Sturgeons in the bay.', 'French cuisine.']),
      type: _.sample(['video', 'pdf', 'audio']),
      link: 'http://www.google.com',
      moderator: 'moderator@test.com',
      status: 'published',
      learning_type: _.sample(['problembasedlearning', 'casestudy']),
      owner: null/*create_user()*/,
      tags: [ create_tag() ],
      additions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    });
  };

  //type: [multiplechoice]
  //status: [published, draft, submitted, redacted]

  var json = [
    {
      __testdata: true,
      question_text: 'Which one is the Instructional Designer?',
      description: 'In order to know what to call you, we need a name.',
      type: 'multiplechoice',
      embedded_resource: create_resource(),
      linked_resources: [ create_resource(), create_resource(), create_resource() ],
      weight: 2,
      difficulty: 5,
      moderator: 'moderator@test.com',
      status: 'published',
      performance_type: 'recall',
      owner: null/*create_user()*/,
      send_upload_to: null,
      answers: [
        {
          id: 1,
          text: 'Brian',
          feedback: 'He is the Visual Designer',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        },
        {
          id: 2,
          text: 'Will',
          feedback: 'He is the Instructional Designer',
          correct: true,
          linked_resource: create_resource(),
          points: 0
        },
        {
          id: 3,
          text: 'Tim',
          feedback: 'He is the Architect',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        },
        {
          id: 4,
          text: 'Eric',
          feedback: 'He is the Developer',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        }
      ],
      tags: [ create_tag() ],
      additions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    }
  ];

  _.forEach(json, function(measureJson){
    Measures.insert(measureJson);
  });
}