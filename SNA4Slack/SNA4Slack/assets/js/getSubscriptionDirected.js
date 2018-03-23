var optArray3 = []; //place holder for search names
var force3 = d3.layout.force()
  .linkDistance(5000)
  .charge(-5000)
  .size([w,h]);
var svg3 = d3.select("#graph3").append("svg");
var zoom3 = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
var g3 = svg3.append("g");
svg3.style("cursor","move");
svg3.append('defs').append('marker')
        .attr({'id':'arrowhead3',
               'viewBox':'-0 -5 10 10',
               'refX':250,
               'refY':0,
               'markerUnits':'userSpaceOnUse',
               'orient':'auto',
               'markerWidth':40,
               'markerHeight':40,
               'xoverflow':'visible'})
        .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#FFFFFF')
            .attr('stroke','#FFFFFF');
				
		
$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	d3.json("https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa", function(error, graph) {
	
	for(var j = 0 ; j<graph.length ; j++){
		//console.log(data[j]);
		if(graph[j]['directed-subscription-graph']!=null){
			graph = graph[j]['directed-subscription-graph'];
		};
	}
	//console.log(graph);
	var linkedByIndex = {};
	var edges = [];
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
    optArray3.push(graph.nodes[i].id);
	}
  optArray3 = optArray3.sort();
  // assign number of total discussions
  
  // calculate total replies
  graph.links.forEach(function(d){totalReplies+=d['weight']});
  
  updateReport();
  
  // align nodes along a diagonal line to minimize number of iterations
  var n = graph.nodes.length;
	
  graph.nodes.forEach(function(d, i) {
  		d.x = d.y = w / n * i;
		});
  
  force3
    .nodes(graph.nodes)
    .links(edges)
    .start();
  // add lines between people
  var link = g3.selectAll(".link")
    .data(edges)
    .enter().append("line")
    	.attr("class", "link")
			.style("stroke-width", function(d){return thickness(d.value);})
			.style("stroke", default_link_color)
			.attr('marker-end','url(#arrowhead3)');

  var node = g3.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force3.drag)
  
  // add circle clip
  var clipPath = node.append("clipPath")
  		.attr("id", function(d){return "clipCircle_" + d.id})
  		.append("circle")
    		.attr("r", function(d){return size(d.degree_centrality*1000)/2});
	var image = node.append("image")
			 .attr("xlink:href", function(d){return d.senderAvatar + "?width=" + parseInt(2 * size(d.degree_centrality*1000)) + "&height=" + parseInt(2 * size(d.degree_centrality*1000)) + "&crop=1%3A1"})
      .attr("x", function(d){return -size(d.degree_centrality*1000)/2})
      .attr("y", function(d){return -size(d.degree_centrality*1000)/2})
      .attr("width", function(d){return size(d.degree_centrality*1000)})
      .attr("height", function(d){return size(d.degree_centrality*1000)})
  		.attr("clip-path", function(d){return "url(#clipCircle_" + d.id +")"});
  
  var repliesArc = node.append("path")
  		.attr("class", "replyPath")
    	.style("fill", default_replies_color)
    	.attr("d", d3.svg.arc()
     						.innerRadius(function(d){return size(d.degree_centrality*1000)/2})
    						.outerRadius(function(d){return size(d.degree_centrality*1000)/2 + 7})
            		.startAngle(Math.PI)
    						.endAngle(calculateRepliesAngle3)
           );
  
  var commentsArc = node.append("path")
  		.attr("class", "commentPath")
  		.style("fill", default_comments_color)
  		.attr("d", d3.svg.arc()
        .innerRadius(function(d){return size(d.degree_centrality*1000)/2})
        .outerRadius(function(d){return size(d.degree_centrality*1000)/2 + 7})
        .startAngle(calculateCommentsAngleStart3)
        .endAngle(calculateCommentsAngleEnd3)
       );
  
  var text = g3.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
    	.attr("dy", ".35em")
			.attr("class", "text")
			.style("font-size", nominal_text_size + "px");
	if (text_center)
	 	text.text(function(d) { return d.id; })
			.style("text-anchor", "middle");
	else 
		text.attr("dx", function(d) {return (size(d.degree_centrality*1000)/2||nominal_base_node_size);})
    	.text(function(d) { return '\u2002'+d.id; });
  function updateReport(d){
    if (d=== undefined){
      d3.select("#measures3").text('Degree: 0 | Betweenness: 0 | Closeness: 0');
    }else{
      d3.select("#measures3").text('Degree: '+d.degree_centrality.toString().substring(0, 6)+' | Betweenness: '+d.betweenness_centrality.toString().substring(0, 6)+' | Closeness: '+d.closeness_centrality.toString().substring(0, 6));
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
    .on("mouseout", function(d) {exit_highlight();})
	.on("mouseup",  
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
      
      svg3.style("cursor","pointer");
      
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
				svg3.style("cursor","move");
				
        if (highlight_color!="white")
					{
	  				text.style("font-weight", "normal");
	  				link.style("stroke", default_link_color);
 					}
			}
	}
 
  
    
  zoom3.on("zoom", function() {
		g3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	});
	
  
  svg3.call(zoom3);
  
  resize3();
  
  d3.select(window).on("resize", resize3);
	  
  force3.on("tick", function() {
  	
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
		
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
	});
  
  
  function resize3() {
    
    var width = document.getElementById("graph3").style.width, height = 420;
    
    svg3.attr("width", width).attr("height", height);
    force3.size([force3.size()[0]+(width-w)/zoom3.scale(),force3.size()[1]+(height-h)/zoom3.scale()]).resume();
    
    w = width;
    
    h = height;
  }

});

});
  function calculateRepliesAngle3(d){
    var fraction = d.degree_centrality*1000/29;
    return 360;
  }
  
  function calculateCommentsAngleStart3(d){
    return calculateRepliesAngle3(d);
  }
  
  function calculateCommentsAngleEnd3(d){
    var fraction = d.degree_centrality*1000/29;
    return 0;
  }
 
  // update for resizing nodes
  d3.select("#circlesize")
  	.on("change", function(d) {
         var sizedBy = d3.select(this).property("weight");
  				resizeNodes3(sizedBy);
  		});
  
	function resizeNodes3(parameter){ 
  
    // add circle clip
    nodes = d3.selectAll(".node");
    //set size domain based on input value
  	size.domain([1, d3.max(nodes.data(), function(d) { return +d[parameter]; })]);
    
    nodes.selectAll("circle")      
      .attr("r", function(d){return size(d[parameter])/2});
    
    nodes.selectAll("Image")
    		.attr("xlink:href", function(d){return d.senderAvatar + "?width=" + parseInt(2 * size(d[parameter])) + "&height=" + parseInt(2 * size(d[parameter])) + "&crop=1%3A1"})
        .attr("x", function(d){return -size(d[parameter])/2})
        .attr("y", function(d){return -size(d[parameter])/2})
        .attr("width", function(d){return size(d[parameter])})
        .attr("height", function(d){return size(d[parameter])});
    
    nodes.selectAll(".replyPath")
      .attr("d", d3.svg.arc()
        .innerRadius(function(d){return size(d[parameter])/2})
        .outerRadius(function(d){return size(d[parameter])/2 + 7})
            .startAngle(Math.PI)
            .endAngle(calculateRepliesAngle3));
    nodes.selectAll(".commentPath")
    	.attr("d", d3.svg.arc()
          .innerRadius(function(d){return size(d[parameter])/2})
          .outerRadius(function(d){return size(d[parameter])/2 + 7})
          .startAngle(calculateCommentsAngleStart3)
          .endAngle(calculateCommentsAngleEnd3)
         );
  
  	d3.selectAll(".text")
    	.attr("dx", function(d){return size(d[parameter])/2;});
    
    force3.start();
  }
  
  
  
// assign optArray to search box
// Search box is modified from this post > http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
$(function () {
    $("#search3").autocomplete({
        source: optArray3
    });
});
function searchNode3() {
    //find the node
    var selectedVal = document.getElementById('search3').value;
    
  		svg3.selectAll(".node")
        .filter(function (d) { return d.id != selectedVal;})
      		.style("opacity", highlight_trans/2)
      		.transition()
        	.duration(5000)
        	.style("opacity", 1);
      
      svg3.selectAll(".link, .text, .replyPath, .commentPath")
        .style("opacity", highlight_trans/2)
        .transition()
        .duration(5000)
        .style("opacity", 1);
    }
function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n);}	
