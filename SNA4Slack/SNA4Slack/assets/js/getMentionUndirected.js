  var optArray = []; //place holder for search names
  
var w = window.innerWidth,
    h = window.innerHeight;
var focus_node = null,
    highlight_node = null;
var text_center = false;
var highlight_color = "#373A3C";
var highlight_trans = 0.1;
  
var size = d3.scale.linear()
  .range([20,120]);
var thickness = d3.scale.linear()
  .range([1, 20]);
var force = d3.layout.force()
  .linkDistance(200)
  .charge(-1000)
  .size([w,h]);
var default_comments_color = "#FFFFFF";
var default_replies_color ="#d62728";
var default_link_color = "#FFFFFF";
var nominal_base_node_size = 8;
var nominal_text_size = 20;
var max_text_size = 24;
var nominal_stroke = 4.86;
var max_stroke = 5.5;
var max_base_node_size = 41;
var min_zoom = .2;
var max_zoom = 7;
var svg = d3.select("#graph1").append("svg");
var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
var g = svg.append("g");
svg.style("cursor","move");


svg.append('defs').append('marker')
        .attr({'id':'arrowhead',
               'viewBox':'-0 -5 10 10',
               'refX':35,
               'refY':0,
               'markerUnits':'userSpaceOnUse',
               'orient':'auto',
               'markerWidth':40,
               'markerHeight':40,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-3 L 10 ,0 L 0,3')
            .attr('fill', '#FFFFFF')
            .attr('stroke','#FFFFFF');
		
		
var totalDiscussions = 0,
    totalReplies = 0,
    totalConnections = 0,
    totalComments = 0;
$( document ).ready(function() {
	d3.json("https://api.mlab.com/api/1/databases/sna4slack/collections/graphs?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa", function(error, graph) {
	var linkedByIndex = {};
  var edges = [];
  graph=graph[0];
  graph.links.forEach(function(e) {
    var sourceNode = graph.nodes.filter(function(n) {
        return n.id === e.source;
    })[0],
        targetNode = graph.nodes.filter(function(n) {
            return n.id === e.target;
        })[0];

    edges.push({
        source: sourceNode,
        target: targetNode,
        value: e.weight
    });
});
  
  graph.links.forEach(function(d) {
		linkedByIndex[d.source + "," + d.target] = true;
    });
	function isConnected(a, b) {

        return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id == b.id;
    }
	function hasConnections(a) {
		for (var property in linkedByIndex) {
				s = property.split(",");
				if ((s[0] == a.id || s[1] == a.id) && linkedByIndex[property]) return true;
		}
	return false;
	}
	
  //set size domain based on input value
  size.domain([1, d3.max(graph.nodes, function(d) { return +29; })]);
  thickness.domain([1, d3.max(graph.links, function(d) { return +d.weight; })]);
  
  // collect all the node names for search auto-complete
  for (var i = 0; i < graph.nodes.length; i++) {
    optArray.push(graph.nodes[i].id);
	}
  optArray = optArray.sort();
  // assign number of total discussions
  totalDiscussions = graph.totalDiscussions;
  totalComments = graph.totalComments;
  
  // calculate total replies
  graph.links.forEach(function(d){totalReplies+=d['weight']});
  
  // calculate total people
  totalConnections = graph.nodes.length;
  
  updateReport();
  
  // align nodes along a diagonal line to minimize number of iterations
  var n = graph.nodes.length;
	
  graph.nodes.forEach(function(d, i) {
  		d.x = d.y = w / n * i;
		});
  
  force
    .nodes(graph.nodes)
    .links(edges)
    .start();
  // add lines between people
  var link = g.selectAll(".link")
    .data(edges)
    .enter().append("line")
    	.attr("class", "link")
			.style("stroke-width", function(d){return thickness(d.value);})
			.style("stroke", default_link_color)
			.attr('marker-end','url(#arrowhead)')


  var node = g.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag)
  
  // add circle clip
  var clipPath = node.append("clipPath")
  		.attr("id", function(d){return "clipCircle_" + d.id})
  		.append("circle")
    		.attr("r", function(d){return size(d.degree*1000)/2});
	var image = node.append("image")
			 .attr("xlink:href", function(d){return d.img + "?width=" + parseInt(2 * size(d.degree*1000)) + "&height=" + parseInt(2 * size(d.degree*1000)) + "&crop=1%3A1"})
      .attr("x", function(d){return -size(d.degree*1000)/2})
      .attr("y", function(d){return -size(d.degree*1000)/2})
      .attr("width", function(d){return size(d.degree*1000)})
      .attr("height", function(d){return size(d.degree*1000)})
  		.attr("clip-path", function(d){return "url(#clipCircle_" + d.id +")"});
  
  var repliesArc = node.append("path")
  		.attr("class", "replyPath")
    	.style("fill", default_replies_color)
    	.attr("d", d3.svg.arc()
     						.innerRadius(function(d){return size(d.degree*1000)/2})
    						.outerRadius(function(d){return size(d.degree*1000)/2 + 7})
            		.startAngle(Math.PI)
    						.endAngle(calculateRepliesAngle)
           );
  
  var commentsArc = node.append("path")
  		.attr("class", "commentPath")
  		.style("fill", default_comments_color)
  		.attr("d", d3.svg.arc()
        .innerRadius(function(d){return size(d.degree*1000)/2})
        .outerRadius(function(d){return size(d.degree*1000)/2 + 7})
        .startAngle(calculateCommentsAngleStart)
        .endAngle(calculateCommentsAngleEnd)
       );
  
  var text = g.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
    	.attr("dy", ".35em")
			.attr("class", "text")
			.style("font-size", nominal_text_size + "px");
	if (text_center)
	 	text.text(function(d) { return d.id; })
			.style("text-anchor", "middle");
	else 
		text.attr("dx", function(d) {return (size(d.degree*1000)/2||nominal_base_node_size);})
    	.text(function(d) { return '\u2002'+d.id; });
  function updateReport(d){
    if (d=== undefined){
      d3.select("#measures1").text('Degree: 0 | Betweenness: 0 | Closeness: 0');
    }else{
      d3.select("#measures1").text('Degree: '+d.degree.toString().substring(0, 6)+' | Betweenness: '+d.betweenness.toString().substring(0, 6)+' | Closeness: '+d.closeness.toString().substring(0, 6));
    }
  }
  
  
  //set events
	node
    .on("mouseover", function(d){set_highlight(d);})	
    .on("mousedown", function(d) {
          d3.event.stopPropagation(); //so user can move the node around
          focus_node = d;
          set_focus(d);
          if (highlight_node === null) set_highlight(d)
			})
    .on("mouseout", function(d) {exit_highlight();});
		d3.select(window).on("mouseup",  
			function() {
				if (focus_node!==null)
      {
        focus_node = null;
        if (highlight_trans<1)
        {
          updateReport();
          commentsArc.style("opacity", 1);
          repliesArc.style("opacity", 1);
					image.style("opacity", 1);
          text.style("opacity", 1);
          link.style("opacity", 1);
        }
      }
	
			if (highlight_node === null) exit_highlight();
		});
	 
	// when user has mouse down on one of the circles
  function set_focus(d){	
		    
    if (highlight_trans <1){
	
      updateReport(d);
			commentsArc.style("opacity", function(o) {
        return isConnected(d, o) ? 1 : highlight_trans;
      });
      
      repliesArc.style("opacity", function(o) {
        return isConnected(d, o) ? 1 : highlight_trans;
      });
      
      image.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : 2 * highlight_trans;
            });
      
			text.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });
			
      link.style("opacity", function(o) {
        return o.source == d || o.target == d ? 1 : highlight_trans;
      });
      
      
			}
	}
	function set_highlight(d)
    {
      
      svg.style("cursor","pointer");
      
      updateReport(d);
      if (focus_node!==null) d = focus_node;
      highlight_node = d;
      if (highlight_color!="white")
      {
          text.style("font-weight", function(o) {
                    return isConnected(d, o) ? "bold" : "normal";});
                link.style("stroke", function(o) {
                    return o.source == d || o.target == d ? highlight_color:default_link_color;
                });
      }
    }
 	
 	function exit_highlight(){
		updateReport();
    highlight_node = null;
		
    if (focus_node===null)
			{
				svg.style("cursor","move");
				
        if (highlight_color!="white")
					{
	  				text.style("font-weight", "normal");
	  				link.style("stroke", default_link_color);
 					}
			}
	}
 
  
    
  zoom.on("zoom", function() {
		g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	});
	
  
  svg.call(zoom);
  
  resize();
  
  d3.select(window).on("resize", resize);
	  
  force.on("tick", function() {
  	
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
		
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
	});
  
  
  function resize() {
    
    var width = document.getElementById("graph1").style.width, height = 420;
    
    svg.attr("width", width).attr("height", height);
    force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
    
    w = width;
    
    h = height;
  }
  
  function resize2() {
    alert("asd");
    //var width = document.getElementById("graph1").style.width, height = 350;
    
    //svg.attr("width", width).attr("height", height);
    //force.size([force.size()[0]+(width-w)/zoom.scale(),force.size()[1]+(height-h)/zoom.scale()]).resume();
    
    //w = width;
    
    //h = height;
  }
});

});
  function calculateRepliesAngle(d){
    var fraction = d.degree*100/29;
    return 360;
  }
  
  function calculateCommentsAngleStart(d){
    return calculateRepliesAngle(d);
  }
  
  function calculateCommentsAngleEnd(d){
    var fraction = d.degree*100/29;
    return 0;
  }
 
  // update for resizing nodes
  d3.select("#circlesize")
  	.on("change", function(d) {
         var sizedBy = d3.select(this).property("weight");
  				resizeNodes(sizedBy);
  		});
  
	function resizeNodes(parameter){ 
  
    // add circle clip
    nodes = d3.selectAll(".node");
    //set size domain based on input value
  	size.domain([1, d3.max(nodes.data(), function(d) { return +d[parameter]; })]);
    
    nodes.selectAll("circle")      
      .attr("r", function(d){return size(d[parameter])/2});
    
    nodes.selectAll("Image")
    		.attr("xlink:href", function(d){return d.img + "?width=" + parseInt(2 * size(d[parameter])) + "&height=" + parseInt(2 * size(d[parameter])) + "&crop=1%3A1"})
        .attr("x", function(d){return -size(d[parameter])/2})
        .attr("y", function(d){return -size(d[parameter])/2})
        .attr("width", function(d){return size(d[parameter])})
        .attr("height", function(d){return size(d[parameter])});
    
    nodes.selectAll(".replyPath")
      .attr("d", d3.svg.arc()
        .innerRadius(function(d){return size(d[parameter])/2})
        .outerRadius(function(d){return size(d[parameter])/2 + 7})
            .startAngle(Math.PI)
            .endAngle(calculateRepliesAngle));
    nodes.selectAll(".commentPath")
    	.attr("d", d3.svg.arc()
          .innerRadius(function(d){return size(d[parameter])/2})
          .outerRadius(function(d){return size(d[parameter])/2 + 7})
          .startAngle(calculateCommentsAngleStart)
          .endAngle(calculateCommentsAngleEnd)
         );
  
  	d3.selectAll(".text")
    	.attr("dx", function(d){return size(d[parameter])/2;});
    
    force.start();
  }
  
  
  
// assign optArray to search box
// Search box is modified from this post > http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
$(function () {
    $("#search1").autocomplete({
        source: optArray
    });
});
function searchNode1() {
    //find the node
    var selectedVal = document.getElementById('search1').value;
    
  		svg.selectAll(".node")
        .filter(function (d) { return d.id != selectedVal;})
      		.style("opacity", highlight_trans/2)
      		.transition()
        	.duration(5000)
        	.style("opacity", 1);
      
      svg.selectAll(".link, .text, .replyPath, .commentPath")
        .style("opacity", highlight_trans/2)
        .transition()
        .duration(5000)
        .style("opacity", 1);
    }
function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n);}	
