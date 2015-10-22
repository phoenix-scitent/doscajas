Meteor.subscribe('enrollments');
Meteor.subscribe('courses');

Template.enrolled_course.helpers({});

Template.enrolled_course.rendered = function() {

    var enrollment = Enrollments.findOne({ _id: Session.get('currentEnrollmentId') });
    var course = Courses.findOne({ _id: enrollment.course_id });
    var activities = course.items;

    //activities.push({
    //  name: 'Final Test',
    //  isFinal: true
    //});

    var config = _.reduce(activities, function(config, _activity){
      var parameterize = function(string){ return string.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); };
      var activity = _activity.isFinal ? _activity : Activities.findOne({ _id: _activity._id });
      var prerequisite = _activity.prerequisite ? Activities.findOne({ _id: _activity.prerequisite }) : null;
      var previousActivity = config.cache.length >= 1 ? config.cache[config.cache.length-1] : null;

      config.cache.push(activity);

      var currentAttempt = _.last(Activities.find({ 'attempt.original': activity._id, 'attempt.user': Meteor.user()._id}).fetch());
      var hasPassed = (currentAttempt && currentAttempt.attempt) ? ATTEMPTS.passed(currentAttempt) : false;

      config.styles.push({
        selector: '#' + parameterize(activity.name),
        style: {
          'shape': 'roundrectangle', //activity.isFinal ? 'roundrectangle' : 'rectangle',
          'height': 200,
          'width': 300,
          'border-color': hasPassed ? '#0F0' : '#000',
          'background-image': activity.style.background_url ? activity.style.background_url : '',
          'content': activity.name,
          'font-family': 'arial',
          'font-size': 20,
          'color': 'white',
          'text-background-color': 'black',
          'text-background-opacity': 1,
          'text-background-shape': 'roundrectangle',
          'text-halign': 'center',
          'text-valign': 'center'
          //'overlay-color': 'green',
          //'overlay-opacity': 1
        }
      });

      config.elements.nodes.push({ data: { id: parameterize(activity.name), name: activity.name, activity_id: activity._id } });

      if(previousActivity){
        config.elements.edges.push({ data: { id: parameterize(previousActivity.name) + '-' + parameterize(activity.name), source: parameterize(previousActivity.name), target: parameterize(activity.name) } });

        config.styles.push({
          selector: '#' + parameterize(previousActivity.name) + '-' + parameterize(activity.name),
          style: {
            //TODO: deal with prerequisites?

          }
        });
      }

      return config;

    }, {
      cache: [],
      styles: [],
      elements: {
        nodes: [],
        edges: []
      }
    });

    config.styles.push({
      selector: 'node',
      style: {
        'background-fit': 'cover',
        'border-width': 3,
        'border-opacity': 0.5,
        'background-blacken': .5
      }
    });

    //config.styles.push({
    //  selector: 'edge',
    //  style: {
    //    'width': 4,
    //    'target-arrow-shape': 'triangle',
    //    'line-color': '#000',
    //    'target-arrow-color': '#000'
    //  }
    //});

    var cy = cytoscape({
      zoomingEnabled: true,
      userZoomingEnabled: false,
      panningEnabled: true,
      userPanningEnabled: false,
      autoungrabify: false,
      container: document.getElementById('cy'),
      style: config.styles,
      elements: {
        nodes: config.elements.nodes,
        edges: config.elements.edges
      },
      //layout: {
      //  name: 'breadthfirst',
      //  //fit: true,
      //  //directed: true,
      //  padding: 10
      //}
      layout: {
        name: 'grid',
        //fit: true,
        columns: activities.length
      }
      //layout: {
      //  name: 'circle',
      //  fit: true
      //}
    }); // cy init

    cy.on('mouseover', 'node', function(){
      var currentNode = this;

      $('#cy').addClass('is-link');

      currentNode.animate({
        css: {
          //'border-color': '#FFF',
          'background-blacken': 0
        }
      })
    });

    cy.on('mouseout', 'node', function(){
      var currentNode = this;

      $('#cy').removeClass('is-link');

      currentNode.animate({
        css: {
          //'border-color': '#000',
          'background-blacken': .5
        }
      })
    });

    cy.on('tap', 'node', function(){

      Router.go("/begin_activity/"+this._private.data.activity_id);

      //var nodes = this;
      //var tapped = nodes;
      //var food = [];
      //
      //nodes.addClass('eater');
      //
      //for(;;){
      //  var connectedEdges = nodes.connectedEdges(function(){
      //    return !this.target().anySame( nodes );
      //  });
      //
      //  var connectedNodes = connectedEdges.targets();
      //
      //  Array.prototype.push.apply( food, connectedNodes );
      //
      //  nodes = connectedNodes;
      //
      //  if( nodes.empty() ){ break; }
      //}
      //
      //var delay = 0;
      //var duration = 500;
      //for( var i = food.length - 1; i >= 0; i-- ){ (function(){
      //  var thisFood = food[i];
      //  var eater = thisFood.connectedEdges(function(){
      //    return this.target().same(thisFood);
      //  }).source();
      //
      //  thisFood.delay( delay, function(){
      //    eater.addClass('eating');
      //  } ).animate({
      //    position: eater.position(),
      //    css: {
      //      'width': 10,
      //      'height': 10,
      //      'border-width': 0,
      //      'opacity': 0
      //    }
      //  }, {
      //    duration: duration,
      //    complete: function(){
      //      thisFood.remove();
      //    }
      //  });
      //
      //  delay += duration;
      //})(); } // for

    }); // on tap

    function getViewport(){

      var viewPortWidth;
      var viewPortHeight;

      // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
      if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
            viewPortHeight = window.innerHeight
      }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
      else if (typeof document.documentElement != 'undefined'
          && typeof document.documentElement.clientWidth !=
          'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
            viewPortHeight = document.documentElement.clientHeight
      }

      // older versions of IE
      else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
            viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
      }
      return [viewPortWidth, viewPortHeight];
    };

    $( window ).resize(function() {
      var viewport = getViewport();

      console.log('TODO: resize CY instance to fit viewport as it does on load', cy);
    });

}; // END enrolled_course.rendered
