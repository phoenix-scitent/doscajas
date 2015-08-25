// //// Load Chance
// //var Chance = require('chance');
// //
// //// Instantiate Chance so it can be used
// //var chance = new Chance();

// // chance.name()

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

   var create_tag = function(_id){
     return _id;
   };

   var create_measure = function(){
     return Measures.insert({
       '__testdata': true,
       name: 'asdfa',
       response_type: 'multiplechoice',
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

  var create_resource = function(title, description, media, link){
    return Resources.insert({
      __testdata: true,
      title: title ? title : _.sample(['Seasonal Depression', 'Clambake', 'Satori', 'Crimea', 'Salty']),
      description: description ? description : _.sample(['A video displaying the results of seasonal depression.', 'Yummy clams.', 'Sturgeons in the bay.', 'French cuisine.']),
      media_type: media ? media : _.sample(['video', 'pdf', 'audio']),
      link: link ? link : 'http://strokeandturn.com',
      moderator: 'moderator@test.com',
      status: 'published',
      learning_type: _.sample(['problembasedlearning', 'casestudy']),
      owner: 'sdfasdkljskdjflksjdf' /*Meteor.users.find().fetch()[0]._id*/,
      tags: [ create_tag(Boks.find().fetch()[0]._id) ],
      suggestions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    });
  };

  var json = [
    {
      __testdata: true,
      question_text: 'Which one is the Instructional Designer?',
      description: 'In order to know what to call you, we need a name.',
      response_type: 'multiplechoice',
      linked_resources: [ create_resource(), create_resource(), create_resource() ],
      weight: 2,
      difficulty: 5,
      moderator: 'moderator@test.com',
      status: 'published',
      performance_type: 'recall',
      owner: 'afjsdlfkjlkjsdf'/*Meteor.users.find().fetch()[0]._id*/,
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
      tags: [ create_tag(Boks.find().fetch()[0]._id) ],
      suggestions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    },
    {
      __testdata: true,
      question_text: 'What color is the sun?',
      description: 'Using nature to learn about colors.',
      response_type: 'multiplechoice',
      embedded_resource: create_resource('The Sun', 'Image of the sun.', 'image', 'http://drawception.com/pub/panels/2012/4-8/7njyw5NhtD-4.png'),
      linked_resources: [ create_resource(), create_resource(), create_resource() ],
      weight: 2,
      difficulty: 1,
      moderator: 'moderator@test.com',
      status: 'published',
      performance_type: 'analysis',
      owner: 'afjsdlfkjlkjsdf'/*Meteor.users.find().fetch()[0]._id*/,
      send_upload_to: null,
      answers: [
        {
          id: 1,
          text: 'Blue',
          feedback: 'The sky is blue, not the sun.',
          correct: false,
          points: 0
        },
        {
          id: 2,
          text: 'Green',
          feedback: 'The grass is green, not the sun.',
          correct: false,
          points: 0
        },
        {
          id: 3,
          text: 'Yellow',
          feedback: 'The sun appears yellow to most.',
          correct: true,
          points: 0
        }
      ],
      tags: [ create_tag(Boks.find().fetch()[0]._id), create_tag(Boks.find().fetch()[1]._id) ],
      suggestions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    },
    {
      __testdata: true,
      question_text: 'What does the word Thorasic mean',
      description: 'Medical terminology.',
      response_type: 'multiplechoice',
      embedded_resource: create_resource('Thorasic Surgery', 'Example of surgery.', 'video', 'https://www.youtube.com/watch?v=GE9OV5rNiSU'),
      linked_resources: [create_resource(), create_resource() ],
      weight: 2,
      difficulty: 1,
      moderator: 'moderator@test.com',
      status: 'published',
      performance_type: 'analysis',
      owner: 'afjsdlfkjlkjsdf'/*Meteor.users.find().fetch()[0]._id*/,
      send_upload_to: null,
      answers: [
        {
          id: 1,
          text: 'of or relating to the thorax',
          feedback: 'This is the correct definition.',
          correct: true,
          points: 0
        },
        {
          id: 2,
          text: 'a nonsurgical procedure used to examine a digestive tract',
          feedback: 'This is an endoscopy.',
          correct: false,
          points: 0
        },
        {
          id: 3,
          text: 'the kneecap',
          feedback: 'This is the patella.',
          correct: false,
          points: 0
        }
      ],
      tags: [ create_tag(Boks.find().fetch()[0]._id), create_tag(Boks.find().fetch()[2]._id) ],
      suggestions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    },
    {
      __testdata: true,
      question_text: 'What is the best example of a heterotopia?',
      description: 'Please choose the best option.',
      response_type: 'multiplechoice',
      embedded_resource: create_resource('Of Other Spaces: Utopias and Heterotopias', 'Paper to explain heterotopias.', 'pdf', 'http://web.mit.edu/allanmc/www/foucault1.pdf'),
      linked_resources: [create_resource(), create_resource() ],
      weight: 2,
      difficulty: 3,
      moderator: 'moderator@test.com',
      status: 'published',
      performance_type: 'analysis',
      owner: 'afjsdlfkjlkjsdf'/*Meteor.users.find().fetch()[0]._id*/,
      send_upload_to: null,
      answers: [
        {
          id: 1,
          text: 'Cabinet',
          feedback: 'This is not a good representation.',
          correct: false,
          points: 0
        },
        {
          id: 2,
          text: 'Fork',
          feedback: 'This is not a good representation.',
          correct: false,
          points: 0
        },
        {
          id: 3,
          text: 'Mirror',
          feedback: 'This is the best representation.',
          correct: true,
          points: 0
        }
      ],
      tags: [ create_tag(Boks.find().fetch()[0]._id), create_tag(Boks.find().fetch()[1]._id) ],
      suggestions: [ ],
      comments: [ create_comment(), create_comment(), create_comment() ],
      date_created: Date.now()
    }
  ];

   _.forEach(json, function(measureJson){
     Measures.insert(measureJson);
   });
}
