Meteor.subscribe('boks');

Template.bok.helpers({
  bok: function(){
    var root = _.select(this.fetch(), function(node){ return node.ancestors.length === 0 })[0];

    return root;
  },
  bok_choy: function() {
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
            parent._id = parent.children._id;
            parent.name = parent.children.name;
            parent.children = hashed_children[parent.children._id];
            _.times(parent.children.length, function (n) {
              findChildren(parent.children[n]);
            });
          } else {
            parent._id = parent.children._id;
            parent.name = parent.children.name;
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

    // May want to set a session variable for use elsewhere?
    // Session.set('currentBok', this)

    return _childrenFormat(bokData);
  }
});

Template.bok.rendered = function(){

    // Set white background color for top navbar
    $('body').addClass('light-navbar');

    // Set special clsss to wraper to add  margin for right sidebar
    $('#page-wrapper').addClass('sidebar-content');


    // Set the full height of right sidebar
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

    // Log for nestable list
    var updateOutput = function (e) {
        var list = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    // Activate Nestable for list 2
    $('#nestable2').nestable({
        group: 1
    }).on('change', updateOutput);

    // output initial serialised data
    updateOutput($('#nestable2').data('output', $('#nestable2-output')));

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


};

Template.bok.destroyed = function(){

    // Remove extra view class
    $('body').removeClass('light-navbar');
    $('#page-wrapper').removeClass('sidebar-content');
};

Template.bok.events({

    // Handle for expand and collapse buttons
    'click #nestable-menu' : function(e){
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    }

});