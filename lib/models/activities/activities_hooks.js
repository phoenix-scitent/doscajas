// use Activities.direct.update(id, {$set: {lastViewedAt: new Date}});
// to get around the hooks



// Activities.before.insert(function (userId, doc, fieldNames, modifier, options) {
//   // ...
// });


if (Meteor.isServer) {

  // PLACE ALL CASCADING DB CHANGES ON THE SERVER

  // Activities.after.update(function (userId, doc, fieldNames, modifier, options) {
  //   // ...
  // }, {fetchPrevious: false});

}

