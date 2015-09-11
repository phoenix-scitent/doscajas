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

  SEQUENCES = (function(){
    return {
      getAvailable: function(options){
        var bokId = options.bokId || Meteor.user().profile.last_bok,
            userId = options.userId || Meteor.user()._id,
            tags = options.tags || '';

        //TODO: scope to only those 'published'
        var bokPermissions = _.map(Boks.find({$or: [ { 'permissions.publishers': userId }, { 'permissions.admins': userId } ]}).fetch(), function(bok){ return bok._id });

        if(tags !== ''){
          return Sequences.find({ $and: [{ $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {attempt:{"$exists":false}}, {tags: tags}] });
        } else {
          return Sequences.find({$and: [{attempt:{"$exists":false}}, { $or: [{owner: userId}, {tags: {$in: bokPermissions}}] }, {tags: bokId}] });
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
    { name: 'Audio', slug: 'audio' },
    { name: 'Image', slug: 'image'}
  ];

  LEARNING_TYPES = [
    { name: 'Case Study', slug: 'casestudy' },
    { name: 'Social', slug: 'social' },
    { name: 'Problem Based', slug: 'problembased' },
    { name: 'Project Based', slug: 'projectbased' },
    { name: 'Knowledge Based', slug: 'knowledgebased' }
  ];

  SEQUENCE_TYPES = [
    { name: 'Linear', slug: 'linear' }
  ];

});
