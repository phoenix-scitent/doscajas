// Run this when the meteor app is started (client and server)
Meteor.startup(function () {

  BOK = (function(){
    var getBok = function(){
      return Boks.findOne(Meteor.user().profile.last_bok);
    },
    myBoksNodes = function(options){
      var userId = options.userId || Meteor.user()._id,
          currentBokId = options.currentBokId || BOK.current()._id,
          publicOnly = options.publicOnly || false;

      if(publicOnly){
        return Boks.find({ $or: [{ _id: currentBokId }, { $and: [{ancestors: currentBokId}, {public: true}] }] });
      } else {
        return Boks.find({ $or: [{ _id: currentBokId }, { $and: [{ancestors: currentBokId}] }] });
      }
    },
    myBoksRoots = function(options){
      var userId = options.userId || Meteor.user()._id,
          sort = options.sort || '';

      if(sort === 'desc'){
        return Boks.find({ $and: [{ancestors: []}, {$or: [ { 'permissions.authors': userId }, { 'permissions.editors': userId }, { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}] }, {$sort: {created_at : -1} })
      } else {
        return Boks.find({ $and: [{ancestors: []}, {$or: [ { 'permissions.authors': userId }, { 'permissions.editors': userId }, { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}] });
      }
    };

    return {
      current: getBok,
      getAllNodesByUser: myBoksNodes,
      getAllRootsByUser: myBoksRoots
    }
  }());

  MEASURES = (function(){
    return {
      getAvailable: function(options){
        var bokId = options.bokId || Meteor.user().profile.last_bok,
            userId = options.userId || Meteor.user()._id,
            tags = options.tags || '';

        //TODO: scope to only those 'published'
        var bokPermissions = _.map(Boks.find({$or: [ { 'permissions.authors': userId }, { 'permissions.editors': userId }, { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}).fetch(), function(bok){ return bok._id });

        if(tags !== ''){
          return Measures.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: tags}] });
        } else {
          return Measures.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: bokId} ]});
        }
      }
    }
  }());

  RESOURCES = (function(){
    return {
      getAvailable: function(options){
        var bokId = options.bokId || Meteor.user().profile.last_bok,
            userId = options.userId || Meteor.user()._id,
            tags = options.tags || '';

        //TODO: scope to only those 'published'
        var bokPermissions = _.map(Boks.find({$or: [ { 'permissions.editors': userId }, { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}).fetch(), function(bok){ return bok._id });

        if(tags !== ''){
          console.log(tags, 'there are tags', bokId)
          return Resources.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: tags}] });
        } else {
          console.log(tags, 'no tags', bokId)
          return Resources.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: bokId} ]});
        }
      }
    }
  }());

  COURSES = (function(){
    return {
      getAvailable: function(options){
        var bokId = options.bokId,
            userId = options.userId || Meteor.user()._id,
            tags = options.tags || '';

        //TODO: scope to only those 'published'
        var bokPermissions = _.map(Boks.find({}).fetch(), function(bok){ return bok._id });
        // var bokPermissions = _.map(Boks.find({$or: [ { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}).fetch(), function(bok){ return bok._id });

        if(tags !== ''){
          return Courses.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: tags}] });
        } else {
          return bokId ? Courses.find({$and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: bokId}] }) : Courses.find({ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] });
        }
      }
    }
  }());

  ATTEMPTS  = (function(){
    return {
      passed: function(currentAttempt){
        var completed_at = currentAttempt.attempt.completed_at,
            score = currentAttempt.attempt.score,
            passing_rate = currentAttempt.passing_rate,
            passing_rate_type = currentAttempt.passing_rate_type;

        console.log('PASSED?: ', currentAttempt.name, completed_at, score, passing_rate, passing_rate_type);

        if(completed_at){
          if(passing_rate_type === 'score'){
            console.log('SCORE: ', score, passing_rate);
            return score >= passing_rate;
          } else /* percentage */ {
            return true;
          }
        } else {
          return false;
        }
      }
    }
  }());

  ACTIVITIES = (function(){
    return {
      getAvailable: function(options){
        var bokId = options.bokId || Meteor.user().profile.last_bok,
            userId = options.userId || Meteor.user()._id,
            tags = options.tags || '';

        //TODO: scope to only those 'published'
        var bokPermissions = _.map(Boks.find({$or: [ { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}).fetch(), function(bok){ return bok._id });

        if(tags !== ''){
          return Activities.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {attempt:{"$exists":false}}, {tags: tags}] });
        } else {
          return Activities.find({$and: [{attempt:{"$exists":false}}, { $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: bokId}] });
        }
      }
    }
  }());

  BOK_PERMISSIONS = [
    { name: 'Administrator', slug: 'admin' },
    { name: 'Publisher', slug: 'publisher' },
    { name: 'Editor', slug: 'editor' },
    { name: 'Author', slug: 'author' }
  ];

  // meter on activity excellence, Have you chosen a performance type
  // you also select and state intentions... and get feedback on how close you are to your goal

  // commenting primes -- socratic templates, create your own templates, give link to video.. ask people to read others first and pick on to comment on

  MEASURE_TYPES = [
    { name: 'Multiple Choice', slug: 'multiplechoice' },
    { name: 'Text Input', slug: 'textinput' },
    { name: 'Upload', slug: 'upload' }
  ];

  MEASURE_MEDIA_TYPE = [ // automatically be selected based on the measure
    { name: 'Text'},
    { name: 'Image'},
    { name: 'Audio'},
    { name: 'Video'}
  ];

  PERFORMANCE_TYPES = [ // determine levels based on alg of how many measures of each type
    {
      name: 'Undecided',
      slug: 'undecided',
      explanation: "You have not decided a type.",
      levels: [ ]
    },
    {
      name: 'Remembering & Understanding',
      slug: 'remembering-understanding',
      explanation: "Basic recall and recognition of patterns. Constructing meaning.",
      purpose: "If learners are asked to define, state, identify, list facts... asking them to develop knowledge about the subject matter. Testing proficiency.",
      levels: ['novice', 'proficient']
    },
    {
      name: 'Apply & Analyize',
      slug: 'apply-analyize',
      explanation: "Break things down into parts/bits. Determine relationships, executing and implementing procedures. Do, rather than just recognize.",
      hint: 'These performance types are better done using problem based and project based activities. Mostly outside of the traditional multiple choice measure types.',
      purpose: 'If you are expecting learners to go beyond knowing and remembering, but want them to analyze, explain compare, contrast and interpret.',
      levels: ['proficient', 'expert']
    },
    {
      name: 'Evaluation & Creativity',
      slug: 'evaluation-creativity',
      explanation: "Not only break down, but analyze each part as a whole. Making judgements based on certain criteria. Critique. Create new patterns.",
      purpose: '',
      levels: ['expert']
    }
  ];

  RESOURCE_TYPES = [
    { name: 'Video', slug: 'video' },
    { name: 'PDF', slug: 'pdf' },
    { name: 'Audio', slug: 'audio' },
    { name: 'Image', slug: 'image'},
    { name: 'Webpage', slug: 'webpage'}
  ];

  LEARNING_TYPES = [
    { name: 'Case Study', slug: 'casestudy' },
    { name: 'Social', slug: 'social' },
    { name: 'Problem Based', slug: 'problembased' },
    { name: 'Project Based', slug: 'projectbased' },
    { name: 'Knowledge Based', slug: 'knowledgebased' }
  ];

  ACTIVITY_TYPES = [
    { name: 'Linear', slug: 'linear' }
  ];

});
