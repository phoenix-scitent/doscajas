if (Activities.find().count() === 0) {

  ///* CREATE DEPENDENCIES */
  var create_user = function () {
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

  var create_measure = function () {
    Meteor.call("submitMeasure", {
      question_text: question,
      description: description,
      response_type: questionType,
      embedded_resource: supportingResource,
      linked_resources: linkedResources,
      weight: weighting,
      difficulty: difficulty,
      moderator: moderatorEmail,
      status: 'published', //TODO: implement this
      owner: currentOwner,
      performance_type: performanceType,
      send_upload_to: null, //TODO: implement this
      answers: answers,
      tags: tags,
      additions: [], //TODO: implement this
      comments: [], //TODO: implement this
      date_created: Date.now()
    }, function (err, response) {
      if (err) {
        alert(err);
      } else {

      }
    });
  };

  var create_resource = function () {
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
      tags: [create_tag()],
      additions: [],
      comments: [create_comment(), create_comment(), create_comment()],
      date_created: Date.now()
    });
  };

  // type [ 'linear', 'adaptive' ]
  // passing_rate_type [ 'score', 'percent' ]

  Activities.insert({
    owner: 'sdfsdfsdfsdfd' /*Meteor.users.find().fetch()[0]._id*/,
    tags:  [Boks.find().fetch()[0]._id],
    type:  "linear",
    name: 'Measures Quiz',
    items: _.take(_.map(Measures.find().fetch(), function(measure){ return { _id: measure._id, type: 'measure' } }), 4),
    attempts_allowed: 3,
    total_possible_score: 4,
    passing_rate: 4,
    passing_rate_type: 'score',
    randomize_items: false,
    randomize_answers: false,
    allow_incorrect_answers: true,
    show_linked_resources_during: false,
    show_linked_resources_after: true,
    show_feedback_during: false,
    show_feedback_after: true,
    show_score_after: true,
    allow_skip_ahead: true,
    use_measure_weighting: false,
    allow_score_scaling_on_incorrect_attempts: false
  });

  Activities.insert({
    owner: 'sdfsdfsdfsdfd' /*Meteor.users.find().fetch()[0]._id*/,
    tags:  [Boks.find().fetch()[0]._id],
    type:  "linear",
    name: 'Measures and Resources',
    items: _.union(_.take(_.map(Resources.find().fetch(), function(resource){ return { _id: resource._id, type: 'resource' } }), 3), _.take(_.map(Measures.find().fetch(), function(measure){ return { _id: measure._id, type: 'measure' } }), 3)),
    attempts_allowed: 3,
    total_possible_score: 3,
    passing_rate: 2,
    passing_rate_type: 'score',
    randomize_items: false,
    randomize_answers: false,
    allow_incorrect_answers: true,
    show_linked_resources_during: true,
    show_linked_resources_after: true,
    show_feedback_during: true,
    show_feedback_after: true,
    show_score_after: true,
    allow_skip_ahead: true,
    use_measure_weighting: false,
    allow_score_scaling_on_incorrect_attempts: false
  });

}
