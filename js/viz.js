tip = d3.tip()
  .attr('class', 'd3-tip n')
  .offset([-10, 0])
  .html(function(d) { return (
    '<em class="label">Name:</em> ' + d['name'] + '<br>' + 
    '<em class="label">Team:</em> ' + d['team'] + '<br>' +
    '<em class="label">Exp:</em>  ' + d['experience'] + ' yrs<br>' +
    '<em class="label">EWA:</em>  ' + d['ewa']
  ) });

d3.csv("data/data.clean.csv")
  .row(function(d, i) { 
    return { 
      'name': d['name'], 'team': d['team'], 
      'experience': +d['experience'], 'ewa': +d['ewa'],
      'salary': +d['salary'] / 1000000
      }
  })
  .get(function(err, data) {

      if (err) console.log(err)
      var margin = { top: 30, right: 30, bottom: 30, left: 30 }
      var height = 600 - margin.top - margin.bottom;
      var width = 800 - margin.left - margin.right;

      var x_extent = d3.extent(data, function(d) { return d["salary"]; }); 
      var x_scale = d3.scale.linear()
        .domain(x_extent)
        .range([margin.left, width])

      var y_extent = d3.extent(data, function(d) { return d["ewa"]; }); 
      var y_scale = d3.scale.linear()
        .domain(y_extent)
        .range([height - margin.bottom, margin.top])

      var viz = d3.select("#viz").append("svg")
        .attr("height", height)
        .attr("width", width)

      viz.call(tip)

      viz.selectAll("circle")
        .data(data)
        .enter().append("circle")
          .attr("cx", function(d, i) { return x_scale(d['salary']) })
          .attr("cy", function(d, i) { return y_scale(d['ewa']) })
          .attr("r", 3)
          .attr("class", "player")
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)

      viz.append('path')
        .attr('class', 'trend')
        .attr('d', ' M ' + x_scale(0) + ' ' + y_scale(0.0725954) + 
                   ' L ' + x_scale(26) + ' ' + y_scale(13.07043))

      var x_axis = d3.svg.axis().scale(x_scale)
        .innerTickSize(-height)
        .outerTickSize(0)

      viz.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
          .call(x_axis)

      var y_axis = d3.svg.axis().scale(y_scale).orient('left')
        .innerTickSize(-width)
        .outerTickSize(0)

      viz.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ', 0)')
          .call(y_axis)

      d3.select('.x.axis')
        .append('text')
          .text('Average Annual Salary ($ Million)')
          .attr('x', (width/2) - margin.left)
          .attr('y', margin.bottom / 1.5);

      d3.select('.y.axis')
        .append('text')
          .text('EWA 2014-2015 Season')
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left)
          .attr("x", -(height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
})
