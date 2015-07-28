// Run this when the meteor app is started (client and server)
Meteor.startup(function () {

  MEASURE_TYPES = [
    { name: 'Multiple Choice' },
    { name: 'Text Input' },
    { name: 'Upload' }
  ]

});