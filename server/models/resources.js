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
  extractEmbedly: function(url, resourse_id) {
    var extractBase = 'http://api.embed.ly/1/extract';
    var embedlyKey = '9e68b536c1e4495ba32ea615a83fa676';
    console.log("EMBEDLY for: "+url);
    var result = Meteor.http.get(extractBase, {
      params: {
        key: embedlyKey,
        url: url
      }});
    if(result.statusCode==200) {
      var respJson = JSON.parse(result.content);
      var resource = Resources.update(resourse_id, {$set: {embedly: respJson}});
      return respJson;
    } else {
      console.log("Embedly issue: ", result.statusCode);
      var errorJson = JSON.parse(result.content);
      throw new Meteor.Error(result.statusCode, errorJson.error);
    }
  },
  refreshEmbedly: function() {
    _.each(Resources.find().fetch(), function(re) {
      Meteor.call("extractEmbedly", re.link, re._id);
    })
  }
});