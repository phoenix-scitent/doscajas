// Run this when the meteor app is started
Meteor.startup(function () {

  console.log('BOWER DEPENDENCIES:');
  console.log('LODASH', _.VERSION);
  console.log('MOMENT', moment.version);
  // console.log('BACON', Bacon.version);
  console.log('CHANCE', new Chance().VERSION)

});
