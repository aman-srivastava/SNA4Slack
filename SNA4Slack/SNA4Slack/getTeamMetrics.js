$( document ).ready(function() {
	d3.json("https://api.mlab.com/api/1/databases/sna4slack/collections/graphs?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa", function(error, graph) {
	graph=graph[0];
	  if (error) throw error;

	  // Make object of all neighboring nodes.
	  var linkedByIndex = {};
	  
	  graph.links.forEach(function(d) {
		  linkedByIndex[d.source + ',' + d.target] = 1;
		  linkedByIndex[d.target + ',' + d.source] = 1;
	  });
	  // A function to test if two nodes are neighboring.
	  function neighboring(a, b) {
		  return linkedByIndex[a.id + ',' + b.id];
	  }

	  // Linear scale for degree centrality.
	  var degreeSize = d3.scaleLinear()
		.domain([d3.min(graph.nodes, function(d) {return d.degree; }),d3.max(graph.nodes, function(d) {return d.degree; })])
		.range([8,25]);

	  // Collision detection based on degree centrality.
	  simulation.force("collide", d3.forceCollide().radius( function (d) { return degreeSize(d.degree); }));
	  var link = container.append("g")
		  .attr("class", "links")
		.selectAll("line")
		.data(graph.links, function(d) { return d.source + "," + d.target;})
		.enter().append("line")
		  .attr('class', 'link');


	  var node = container.append("g")
		  .attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		// Calculate degree centrality within JavaScript.
		//.attr("r", function(d, i) { count = 0; graph.links.forEach(function(l) { if (l.source == i || l.target == i) { count += 1;}; }); return size(count);})
		// Use degree centrality from NetworkX in json.
		.attr('r', function(d, i) { return degreeSize(d.degree*1.5); })
		// Color by group, a result of modularity calculation in NetworkX.
		  .attr("fill", function(d) { return color((d.degree)); })
		  .attr('class', 'node')
		  // On click, toggle ego networks for the selected node.
		  .on('click', function(d, i) {
			  if (toggle == 0) {
				  // Ternary operator restyles links and nodes if they are adjacent.
				  d3.selectAll('.link').style('stroke-opacity', function (l) {
					  return l.target == d || l.source == d ? 1 : 0.1;
				  });
				  d3.selectAll('.node').style('opacity', function (n) {
					  return neighboring(d, n) ? 1 : 0.1;
				  });
				  d3.select(this).style('opacity', 1);
				  toggle = 1;
			  }
			  else {
				  // Restore nodes and links to normal opacity.
				  d3.selectAll('.link').style('stroke-opacity', '0.6');
				  d3.selectAll('.node').style('opacity', '1');
				  toggle = 0;
			  }
		  })
		  .call(d3.drag()
			  .on("start", dragstarted)
			  .on("drag", dragged)
			  .on("end", dragended));

	  node.append("title")
		  .text(function(d) { return "Slack_Username: '"+d.id+"'\nCloseness_Centrality: '"+d.closeness+"'\nBetweenness_Centrality: '"+d.betweenness+"'\nDegree_Centrality: '"+d.degree+"'"; });

	  simulation
		  .nodes(graph.nodes)
		  .on("tick", ticked);

	  simulation.force("link")
		  .links(graph.links);

	  function ticked() {
		link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	  }

		// A slider (using only d3 and HTML5) that removes nodes below the input threshold.
		var slider = d3.select('#controls').append('p').text('Edge Weight Threshold: ');

		slider.append('label')
			.attr('for', 'threshold')
			.attr('id', 'thresholdLabel')
			.text('1');
		slider.append('input')
			.attr('type', 'range')
			.attr('min', d3.min(graph.links, function(d) {return d.weight; }))
			.attr('max', d3.max(graph.links, function(d) {return d.weight; }) / 2)
			.attr('value', d3.min(graph.links, function(d) {return d.weight; }))
			.attr('id', 'threshold')
			.style('width', '100%')
			.style('display', 'block')
			.on('input', function () { 
				var threshold = this.value;

				d3.select('#thresholdLabel').text(threshold);

				// Find the links that are at or above the threshold.
				var newData = [];
				graph.links.forEach( function (d) {
					if (d.weight >= threshold) {newData.push(d); };
				});

				// Data join with only those new links.
				link = link.data(newData, function(d) {return d.source + ', ' + d.target;});
				link.exit().remove();
				var linkEnter = link.enter().append('line').attr('class', 'link');
				link = linkEnter.merge(link);

				node = node.data(graph.nodes);

				// Restart simulation with new link data.
				simulation
					.nodes(graph.nodes).on('tick', ticked)
					.force("link").links(newData);

				simulation.alphaTarget(0.1).restart();

			});

		// A dropdown menu with three different centrality measures, calculated in NetworkX.
		// Accounts for node collision.
		var dropdown = d3.select('#controls').append('div')
			.append('select')
			.on('change', function() { 
				var centrality = this.value;
				var centralitySize = d3.scaleLinear()
					.domain([d3.min(graph.nodes, function(d) { return d[centrality]; }), d3.max(graph.nodes, function(d) { return d[centrality]; })])
					.range([8,25]);
				node.attr('r', function(d) { return centralitySize(d[centrality]); } );  
				// Recalculate collision detection based on selected centrality.
				simulation.force("collide", d3.forceCollide().radius( function (d) { return centralitySize(d[centrality]); }));
				simulation.alphaTarget(0.1).restart();
			});

		dropdown.selectAll('option')
			.data(['Degree Centrality', 'Betweenness Centrality', 'Closeness Centrality'])
			.enter().append('option')
			.attr('value', function(d) { return d.split(' ')[0].toLowerCase(); })
			.text(function(d) { return d; });

	});
	document.getElementById("centrality-svg").style.width = "100%";
	
	
});

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Call zoom for svg container.
svg.call(d3.zoom().on('zoom', zoomed));

var color = d3.scaleThreshold()
    .domain([0, 0.004347826086956522, 0.008695652173913044, 0.013043478260869566, 0.017391304347826087, 0.021739130434782608, 0.026086956521739132, 0.030434782608695653, 0.034782608695652174, 0.0391304347826087, 0.052173913043478265, 0.1391304347826087])
    .range(["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081","#043071","#022061"]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(40))
    .force("charge", d3.forceManyBody().strength([-120]).distanceMax([500]))
    .force("center", d3.forceCenter(width / 2, height / 2));

var container = svg.append('g');

// Create form for search (see function below).
var search = d3.select("#controls").append('form').attr('onsubmit', 'return false;');

var box = search.append('input')
	.attr('type', 'text')
	.attr('id', 'searchTerm')
	.attr('placeholder', 'Type to search...');

var button = search.append('input')
	.attr('type', 'button')
	.attr('value', 'Search')
	.on('click', function () { searchNodes(); });

// Toggle for ego networks on click (below).
var toggle = 0;




function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// Zooming function translates the size of the svg container.
function zoomed() {
	  container.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
}

// Search for nodes by making all unmatched nodes temporarily transparent.
function searchNodes() {
	var term = document.getElementById('searchTerm').value;
	var selected = container.selectAll('.node').filter(function (d, i) {
		return d.id.toLowerCase().search(term.toLowerCase()) == -1;
	});
	selected.style('opacity', '0');
	var link = container.selectAll('.link');
	link.style('stroke-opacity', '0');
	d3.selectAll('.node').transition()
		.duration(6000)
		.style('opacity', '1');
	d3.selectAll('.link').transition().duration(5000).style('stroke-opacity', '0.6');
}
