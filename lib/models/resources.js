Resources = new Mongo.Collection('resources');


// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.Resource = new SimpleSchema({
    title: {
      type: String,
      label: "Title",
      index: true
    },
    link: {
      type: String,
      label: "URL",
      index: true
    },
    type: {
      type: String,
      label: "Resource Type",
      optional: true
    },
    description: {
      type: String,
      label: "Description",
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
        if (this.isInsert) {
          return "draft";
        }
      }
    },
    owner: {
      type: String,
      label: "Owner"
    },
    tags: {
      type: [String],
      label: "Tags",
    },
    comments: {
      type: [String],
      label: "Comments",
      optional: true
    },
    suggestions: {
      type: [String],
      label: "Suggestions",
      optional: true
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
    }
});

Resources.attachSchema(Schemas.Resource);

Meteor.methods({
  submitResource: function(id, resource) {
    if (id) {
      console.log("Updating Resource: " + JSON.stringify(resource));
      Resources.update(id, {$set: resource});
      return id;
    } else {
      console.log("Inserting Resource: " + JSON.stringify(resource));
      return Resources.insert(resource);
    }
  }
});