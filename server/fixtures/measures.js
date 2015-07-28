//// Load Chance
//var Chance = require('chance');
//
//// Instantiate Chance so it can be used
//var chance = new Chance();

// chance.name()

if (Measures.find().count() === 0) {

  ///* CREATE DEPENDENCIES */
  var create_resource = function(){
    return Resources.insert({
      '__testdata': true,
      name: 'sdfasdf'
    });
  };

  var create_user = function(){
    return Accounts.createUser({
      '__testdata': true,
      username: 'rickyj',
      email: 'rj@cci.com',
      password: 'notsafe',
      profile: {
        name: 'Rick James'
      }
    });
  };

  var create_tag = function(){
    return Boks.insert({
      '__testdata': true,
      name: 'kjdkfjs'
    });
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
      owner: create_user(),
      send_upload_to: null,
      answers: [
        {
          text: 'Brian',
          feedback: 'He is the Visual Designer',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        },
        {
          text: 'Will',
          feedback: 'He is the Instructional Designer',
          correct: true,
          linked_resource: create_resource(),
          points: 0
        },
        {
          text: 'Tim',
          feedback: 'He is the Architect',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        },
        {
          text: 'Eric',
          feedback: 'He is the Developer',
          correct: false,
          linked_resource: create_resource(),
          points: 0
        }
      ],
      tags: [ create_tag(), create_tag() ],
      additions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    }
  ];

  _.forEach(json, function(measureJson){
    Measures.insert(measureJson);
  });
}