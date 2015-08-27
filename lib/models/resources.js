Resources = new Mongo.Collection('resources');

// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.Resource = new SimpleSchema({
    title: {
      type: String,
      label: "Title",
      index: true,
      optional: true
    },
    link: {
      type: String,
      label: "URL",
      index: true
    },
    type: {
      type: String,
      label: "Caja Type",
      autoValue: function(){
        return 'resource'
      }
    },
    media_type: {
      type: String,
      label: "Media Type",
      optional: true
    },
    description: {
      type: String,
      label: "Description",
      optional: true
    },
    image_url: {
      type: String,
      label: "Image URL",
      optional: true
    },
    learning_type: {
      type: String,
      label: "Learning Type",
      optional: true
    },
    status: {
      type: String,
      label: "Status",
      optional: true,
      autoValue: function() {
        if(!this.value){
          if (this.isInsert) {
            return "draft";
          }
        } else {
          return this.value;
        }
      }
    },
    owner: {
      type: String,
      label: "Owner",
      autoValue: function() {
        if(!this.value){
          return this.userId;
        } else {
          return this.value;
        }
      },
      optional: true
    },
    tags: {
      type: [String],
      label: "Tags"
    },
    comments: {
      type: [String],
      label: "Comments",
      optional: true
    },
    suggestions: {
      type: [String],
      label: "Suggestions",
      autoValue: function() {
        if(!this.value){
          return [];
        } else {
          return this.value;
        }
      }
    },
    instructor_notes: {
      type: Object,
      label: "Instructor Notes",
      optional: true,
      blackbox: true
    },
    created_at: {
      type: Date,
      label: "Date Created",
      autoValue: function() {
        if (this.isInsert) {
          return new Date;
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date};
        } else {
          this.unset();
        }
      },
      optional: true
    },
    updated_at: {
      type: Date,
      label: "Date Changed",
      autoValue: function() {
        if (this.isUpdate) {
          return new Date();
        }
      },
      optional: true
    },
    frame_embeddable: {
      type: Boolean,
      label: "Embeddable",
      defaultValue: false
    },
    embedly: {
      type: Object,
      label: "Embedly",
      blackbox: true,
      optional: true
    }
});

Resources.attachSchema(Schemas.Resource);

Meteor.methods({
  submitResource: function(id, resource) {
    var result;
    if (id) {
      console.log("Updating Resource: " + JSON.stringify(resource));
      Resources.update(id, {$set: resource});
      result = id;
    } else {
      console.log("Inserting Resource: " + JSON.stringify(resource));
      result = Resources.insert(resource);
    }
    Meteor.promise("extractEmbedly", resource.link, result);
    return result;
  }
});