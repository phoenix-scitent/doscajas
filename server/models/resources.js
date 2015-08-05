Meteor.publish('resources', function() {
  return Resources.find();
});

Resources.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  }
});

Meteor.methods({
  extractEmbedly: function(url, cb) {
    var extractBase = 'http://api.embed.ly/1/extract';
    var embedlyKey = '9e68b536c1e4495ba32ea615a83fa676';
      Meteor.http.get(extractBase, {
      params: {
        key: embedlyKey,
        url: url
      }},
      function (error, result) {
        console.log(result);
      }
    );
  }
});