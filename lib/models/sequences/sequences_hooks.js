// use Sequences.direct.update(id, {$set: {lastViewedAt: new Date}});
// to get around the hooks



// Sequences.before.insert(function (userId, doc, fieldNames, modifier, options) {
//   // ...
// });


if (Meteor.isServer) {

  // PLACE ALL CASCADING DB CHANGES ON THE SERVER

  // Sequences.after.update(function (userId, doc, fieldNames, modifier, options) {
  //   // ...
  // }, {fetchPrevious: false});

}

