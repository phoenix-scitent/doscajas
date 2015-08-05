Meteor.methods({
  extractEmbedly: function(url, resource_id) {
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
      return Meteor.call("embedlyIntoResource", respJson, resource_id);
    } else {
      console.log("Embedly issue: ", result.statusCode);
      var errorJson = JSON.parse(result.content);
      throw new Meteor.Error(result.statusCode, errorJson.error);
    }
  },
  embedlyIntoResource: function(embed, resource_id) {
    var resource = Resources.findOne(resource_id);
    var title = resource.title || embed.title;
    var image = resource.image_url || embed.images[0].url;
    var desc = resource.description || embed.description;
    return Resources.update(resource_id, {$set: {embedly: embed, title: title, description: desc, image_url: image}});
  },
  refreshEmbedly: function() {
    _.each(Resources.find().fetch(), function(re) {
      Meteor.call("extractEmbedly", re.link, re._id);
    })
  }
});