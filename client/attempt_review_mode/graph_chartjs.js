Template.graph_chartjs.rendered = function() {

  //var colors = [
  //  {color:"#F7464A", highlight: "#FF5A5E"},
  //  {color: "#46BFBD", highlight: "#5AD3D1"},
  //  {color: "#FDB45C", highlight: "#FFC870"},
  //  {color: "#949FB1", highlight: "#A8B3C5"},
  //  {color: "#4D5360", highlight: "#616774"}
  //];
  //
  //var data = _.map(this.data.attempt.topic_stats, function(stats, key){
  //  return _.assign({ label: {key: key, possible: stats.total_possible_score, actual: stats.total_actual_score}, value: _.ceil(((stats.total_actual_score / stats.total_possible_score) * 100)) }, colors[_.random(0, 4)])
  //});
  //
  //var options = {
  //  // String - Template string for single tooltips
  //  tooltipTemplate: "<%if (label.key){%><%=label.key%>: <%}%><%= label.actual %> of <%= label.possible %> correct",
  //
  //  // Boolean - Whether to show labels on the scale
  //  scaleShowLabels: false,
  //
  //  //Boolean - Show a backdrop to the scale label
  //  scaleShowLabelBackdrop : true,
  //
  //  //String - The colour of the label backdrop
  //  scaleBackdropColor : "rgba(255,255,255,0.75)",
  //
  //  // Boolean - Whether the scale should begin at zero
  //  scaleBeginAtZero : true,
  //
  //  //Number - The backdrop padding above & below the label in pixels
  //  scaleBackdropPaddingY : 2,
  //
  //  //Number - The backdrop padding to the side of the label in pixels
  //  scaleBackdropPaddingX : 2,
  //
  //  //Boolean - Show line for each value in the scale
  //  scaleShowLine : true,
  //
  //  //Boolean - Stroke a line around each segment in the chart
  //  segmentShowStroke : true,
  //
  //  //String - The colour of the stroke on each segement.
  //  segmentStrokeColor : "#fff",
  //
  //  //Number - The width of the stroke value in pixels
  //  segmentStrokeWidth : 2,
  //
  //  //Number - Amount of animation steps
  //  animationSteps : 100,
  //
  //  //String - Animation easing effect.
  //  animationEasing : "easeOutBounce",
  //
  //  //Boolean - Whether to animate the rotation of the chart
  //  animateRotate : true,
  //
  //  //Boolean - Whether to animate scaling the chart from the centre
  //  animateScale : false,
  //
  //  //String - A legend template
  //  legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  //
  //};

    var data = {
      labels: _.map(this.data.attempt.topic_stats, function(stats, key){ return key; }),
      datasets: _.map(attempts, function(currentAttempt){
        return {
          label: currentAttempt.created_at,
          fillColor: "rgba(220,220,220,0.5)",
          strokeColor: "rgba(220,220,220,0.8)",
          highlightFill: "rgba(220,220,220,0.75)",
          highlightStroke: "rgba(220,220,220,1)",
          data: _.map(currentAttempt.attempt.topic_stats, function(stats){ return _.ceil(((stats.total_actual_score / stats.total_possible_score) * 100)) })
        };
      })
    };

    var options = {

      // Boolean - Determines whether to draw tooltips on the canvas or not
      showTooltips: false,

      // Boolean - Whether to show labels on the scale
      scaleShowLabels: false,

      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero : true,

      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,

      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      scaleGridLineWidth : 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - If there is a stroke on each bar
      barShowStroke : true,

      //Number - Pixel width of the bar stroke
      barStrokeWidth : 2,

      //Number - Spacing between each of the X value sets
      barValueSpacing : 5,

      //Number - Spacing between data sets within X values
      barDatasetSpacing : 1,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

    };

    var ctx = $("#myChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
    var myNewChart = new Chart(ctx).Bar(data, options); //new Chart(ctx).PolarArea(data, options);

};