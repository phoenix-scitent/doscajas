Boks = new Mongo.Collection('boks');

// Help exists here:  https://github.com/aldeed/meteor-collection2
Schemas.Bok = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    index: true
  },
  position: {
    type: Number,
    label: "Position",
    optional: true
  },
  ancestors: {
    type: [String],
    label: "Ancestors"
  },
  permissions: {
    type: Object, // { admins: [], publishers: [], editors: [], authors: [] }
    label: "Permissions",
    optional: true,
    blackbox: true
  },
  public: {
    type: Boolean,
    label: "Public",
    defaultValue: true
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

Boks.attachSchema(Schemas.Bok);

Meteor.methods({
  addNode: function(node) {
      console.log("Inserting Bok Node: " + JSON.stringify(node));
      return Boks.insert(node);
  }
});
