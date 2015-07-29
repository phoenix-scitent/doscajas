Meteor.subscribe('boks');

Template.bok.helpers({
  bokRoot: function(){
    var root = _.select(this.fetch(), function(node){ return node.ancestors.length === 0 })[0];

    Session.set('bokRoot', root);

    return root;
  },
  bokNodes: function() {
    var bokData = this.fetch(); /* return of the data function from the router: [ { ... bokNode ... }, { ... bokNode ...}, ...  ] */
    var _childrenFormat = function(bok){
      var roots = [], hashed_children = {};

      if(bok){
        // find the top level nodes and hash the children based on parent
        _.times(bok.length, function (n) {
          var item = bok[n],
              p = _.last(item.ancestors),
              target = !p ? roots : (hashed_children[p] || (hashed_children[p] = []));

          target.push({children: item});
        });

        // function to recursively build the tree
        var findChildren = function (parent) {
          if (hashed_children[parent.children._id]) {
            parent.id = parent.children._id;
            parent.text = parent.children.name;
            parent.type = parent.children.public ? 'public' : 'private';
            parent.children = hashed_children[parent.children._id];
            _.forEach(parent.children, function(node){
              findChildren(node)
            });
            //_.times(parent.children.length, function (n) {
            //  findChildren(parent.children[n]);
            //});
          } else {
            parent.id = parent.children._id;
            parent.text = parent.children.name;
            parent.type = parent.children.public ? 'public' : 'private';
            parent.children = [];
          }
        };

        // enumerate through to handle the case where there are multiple roots
        _.times(roots.length, function (n) {
          findChildren(roots[n]);
        });
      }

      return roots[0].children;
    };

    Session.set('bokNodes', _childrenFormat(bokData).reverse());

    return Session.get('bokNodes');
  }
});

Template.bok.rendered = function(){

  this.autorun(function(){
    Template.currentData(); // autorun reactivity source

    // Set special clsss to wraper to add  margin for right sidebar
    $('#page-wrapper').addClass('sidebar-content');


    // Set the full height of right sidebar
    var heightWithoutNavbar = $("body > #wrapper").height() - 61 - 86;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    console.log(heightWithoutNavbar);

    // Set deta and options ofr main chart
    var lineData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Example dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Example dataset",
                fillColor: "rgba(26,179,148,0.5)",
                strokeColor: "rgba(26,179,148,0.7)",
                pointColor: "rgba(26,179,148,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(26,179,148,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    var lineOptions = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        responsive: true
    };


    var ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx).Line(lineData, lineOptions);


    // Set data and options for peity (small) charts

    $(".line").peity("line",{
        fill: '#1ab394',
        stroke:'#169c81'
    });

    $(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    });

    $(".bar_dashboard").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"],
        width:100
    })

  });
};

Template.bok.destroyed = function(){
    // Remove extra view class
    $('#page-wrapper').removeClass('sidebar-content');
};

Template.bok.events({});