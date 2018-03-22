var optArray4 = []; //place holder for search names
var force4 = d3.layout.force()
  .linkDistance(500)
  .charge(-5000)
  .size([w,h]);
var svg4 = d3.select("#graph4").append("svg");
var zoom4 = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])
var g4 = svg4.append("g");
svg4.style("cursor","move");				
		
$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	d3.json("https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa", function(error, graph) {
	
	for(var j = 0 ; j<graph.length ; j++){
		//console.log(data[j]);
		if(graph[j]['undirected-subscription-graph']!=null){
			graph = graph[j]['undirected-subscription-graph'];
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
    optArray4.push(graph.nodes[i].id);
	}
  optArray4 = optArray4.sort();
  // assign number of total discussions
  
  // calculate total replies
  graph.links.forEach(function(d){totalReplies+=d['weight']});
  
  updateReport();
  
  // align nodes along a diagonal line to minimize number of iterations
  var n = graph.nodes.length;
	
  graph.nodes.forEach(function(d, i) {
  		d.x = d.y = w / n * i;
		});
  
  force4
    .nodes(graph.nodes)
    .links(edges)
    .start();
  // add lines between people
  var link = g4.selectAll(".link")
    .data(edges)
    .enter().append("line")
    	.attr("class", "link")
			.style("stroke-width", function(d){return thickness(d.value);})
			.style("stroke", default_link_color);

  var node = g4.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force4.drag)
  
  // add circle clip
  var clipPath = node.append("clipPath")
  		.attr("id", function(d){return "clipCircle_" + d.id})
  		.append("circle")
    		.attr("r", function(d){return size(d.degree_centrality*10)/2});
	var image = node.append("image")
			 .attr("xlink:href", function(d){return d.senderAvatar + "?width=" + parseInt(2 * size(d.degree_centrality*10)) + "&height=" + parseInt(2 * size(d.degree_centrality*10)) + "&crop=1%3A1"})
      .attr("x", function(d){return -size(d.degree_centrality*10)/2})
      .attr("y", function(d){return -size(d.degree_centrality*10)/2})
      .attr("width", function(d){return size(d.degree_centrality*10)})
      .attr("height", function(d){return size(d.degree_centrality*10)})
  		.attr("clip-path", function(d){return "url(#clipCircle_" + d.id +")"});
  
  var repliesArc = node.append("path")
  		.attr("class", "replyPath")
    	.style("fill", default_replies_color)
    	.attr("d", d3.svg.arc()
     						.innerRadius(function(d){return size(d.degree_centrality*10)/2})
    						.outerRadius(function(d){return size(d.degree_centrality*10)/2 + 7})
            		.startAngle(Math.PI)
    						.endAngle(calculateRepliesAngle4)
           );
  
  var commentsArc = node.append("path")
  		.attr("class", "commentPath")
  		.style("fill", default_comments_color)
  		.attr("d", d3.svg.arc()
        .innerRadius(function(d){return size(d.degree_centrality*10)/2})
        .outerRadius(function(d){return size(d.degree_centrality*10)/2 + 7})
        .startAngle(calculateCommentsAngleStart4)
        .endAngle(calculateCommentsAngleEnd4)
       );
  
  var text = g4.selectAll(".text")
    .data(graph.nodes)
    .enter().append("text")
    	.attr("dy", ".35em")
			.attr("class", "text")
			.style("font-size", nominal_text_size + "px");
	if (text_center)
	 	text.text(function(d) { return d.id; })
			.style("text-anchor", "middle");
	else 
		text.attr("dx", function(d) {return (size(d.degree_centrality*10)/2||nominal_base_node_size);})
    	.text(function(d) { return '\u2002'+d.id; });
  function updateReport(d){
    if (d=== undefined){
      d3.select("#measures4").text('Degree: 0 | Betweenness: 0 | Closeness: 0');
    }else{
      d3.select("#measures4").text('Degree: '+d.degree_centrality.toString().substring(0, 6)+' | Betweenness: '+d.betweenness_centrality.toString().substring(0, 6)+' | Closeness: '+d.closeness_centrality.toString().substring(0, 6));
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
      
      svg4.style("cursor","pointer");
      
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
				svg4.style("cursor","move");
				
        if (highlight_color!="white")
					{
	  				text.style("font-weight", "normal");
	  				link.style("stroke", default_link_color);
 					}
			}
	}
 
  
    
  zoom4.on("zoom", function() {
		g4.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	});
	
  
  svg4.call(zoom4);
  
  resize4();
  
  d3.select(window).on("resize", resize4);
	  
  force4.on("tick", function() {
  	
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
		
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
	});
  
  
  function resize4() {
    
    var width = document.getElementById("graph4").style.width, height = 420;
    
    svg4.attr("width", width).attr("height", height);
    force4.size([force4.size()[0]+(width-w)/zoom4.scale(),force4.size()[1]+(height-h)/zoom4.scale()]).resume();
    
    w = width;
    
    h = height;
  }

});

});
  function calculateRepliesAngle4(d){
    var fraction = d.degree_centrality*10/29;
    return 360;
  }
  
  function calculateCommentsAngleStart4(d){
    return calculateRepliesAngle4(d);
  }
  
  function calculateCommentsAngleEnd4(d){
    var fraction = d.degree_centrality*10/29;
    return 0;
  }
 
  // update for resizing nodes
  d3.select("#circlesize")
  	.on("change", function(d) {
         var sizedBy = d3.select(this).property("weight");
  				resizeNodes4(sizedBy);
  		});
  
	function resizeNodes4(parameter){ 
  
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
            .endAngle(calculateRepliesAngle4));
    nodes.selectAll(".commentPath")
    	.attr("d", d3.svg.arc()
          .innerRadius(function(d){return size(d[parameter])/2})
          .outerRadius(function(d){return size(d[parameter])/2 + 7})
          .startAngle(calculateCommentsAngleStart4)
          .endAngle(calculateCommentsAngleEnd4)
         );
  
  	d3.selectAll(".text")
    	.attr("dx", function(d){return size(d[parameter])/2;});
    
    force4.start();
  }
  
  
  
// assign optArray to search box
// Search box is modified from this post > http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/
$(function () {
    $("#search4").autocomplete({
        source: optArray4
    });
});
function searchNode4() {
    //find the node
    var selectedVal = document.getElementById('search4').value;
    
  		svg4.selectAll(".node")
        .filter(function (d) { return d.id != selectedVal;})
      		.style("opacity", highlight_trans/2)
      		.transition()
        	.duration(5000)
        	.style("opacity", 1);
      
      svg4.selectAll(".link, .text, .replyPath, .commentPath")
        .style("opacity", highlight_trans/2)
        .transition()
        .duration(5000)
        .style("opacity", 1);
    }
function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n);}	
