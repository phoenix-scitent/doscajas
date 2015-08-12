if (Resources.find().count() === 0) {

   ///* CREATE DEPENDENCIES */

   var create_user = function(){
     return Accounts.createUser({
       '__testdata': true,
       username: _.sample(['klingon', 'romulan', 'human', 'bajoran', 'vulcan', 'cardassian']),
       email: _.sample(['frawe@cci.com', 'clemen@cci.com', 'smark@cci.com', 'kale@cci.com', 'solar@cci.com']),
       password: 'notsafe',
       profile: {
         name: 'Daryl Oates'
       }
     });
   };

   var create_tag = function(){
     return Boks.find().fetch()[0]._id;
   };

   var create_measure = function(){
     return Measures.insert({
       '__testdata': true,
       name: 'Correct or not?',
       tags: [],
       type: 'multiplechoice',
       answers: [
         { id: 1, correct: true, text: 'yes' },
         { id: 2, correct: false, text: 'no' }
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

   //type: [video, audio, document, ...]
   //status: [published, draft, submitted, redacted]

   var json = [
     {
       __testdata: true,
       title: 'Lessons In UX',
       description: 'Integrating Meteor and Embedly',
       type: 'document',
       link: 'http://strokeandturn.com',
       moderator: 'moderator@test.com',
       status: 'published',
       learning_type: 'casestudy',
       owner: 'skdfjlskjdflksjd' /*create_user()*/,
       tags: [ create_tag() ],
       additions: [ ],
       comments: [ create_comment(), create_comment(), create_comment() ],
       date_created: Date.now()
     }
   ];

   _.forEach(json, function(resourceJson){
     Resources.insert(resourceJson);
   });
}
