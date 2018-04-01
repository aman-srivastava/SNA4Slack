$.getScript('https://d3js.org/d3.v4.min.js', function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	d3.json("https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa", function(error, graph) {

	
	var data = [];
	for(var j = 0 ; j<graph.length ; j++){
		//console.log(data[j]);
		if(graph[j]['spark-sub-graph-inv']!=null){
			for(var i = 0 ; i< graph[j]['spark-sub-graph-inv'].children.length ; i++){
				var array = [];
				array.push(graph[j]['spark-sub-graph-inv'].children[i].channelName);
				array.push(graph[j]['spark-sub-graph-inv'].children[i].messageSender);
				array.push(graph[j]['spark-sub-graph-inv'].children[i].msgCount);
				array.push(0);
				if(graph[j]['spark-sub-graph-inv'].children[i].msgCount>0)
				data.push(array);
			}
		}
	}
	var color = {};
	var colors = ["#3366CC","#DC3912","#FF9900", "#109618","#990099","#0099C6"];
	var colorIndex = 0;
	var height;
	for(var j = 0 ; j<graph.length ; j++){
		if(graph[j]['dataAnalytics']!=null){
			height = graph[j]['dataAnalytics'].messageCount_sender.length; 
			for(var i = 0 ; i< graph[j]['dataAnalytics']['messageCount_channel'].length ; i++){
				var id = graph[j]['dataAnalytics']['messageCount_channel'][i].channelName;
				var key = id;	
				color[key] = colors[colorIndex++];
				if(colorIndex==colors.length)
					colorIndex=0;
			}
		}
	}
	var width = window.innerWidth;
	var svg = d3.select("#graph3").append("svg").attr("width", width).attr("height", 4000);
	var g = svg.append("g").attr("transform","translate("+(width/6)+",60)");

	
	var bp=viz.bP()
			.data(data)
			.min(6)
			.pad(1)
			.height(600)
			.width(width/2.5)
			.barSize(35)
			.fill(d=>color[d.primary]);
				
	g.call(bp);

	g.selectAll(".mainBars")
		.on("mouseover",mouseover)
		.on("mouseout",mouseout)

	g.selectAll(".mainBars").append("text").attr("class","label")
		.attr("x",d=>(d.part=="primary"? -20: 20))
		.attr("y",d=>+0)
		.text(d=>d.key)
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
		
	g.selectAll(".mainBars").append("text").attr("class","perc")
		.attr("x",d=>(d.part=="primary"? -150: 150))
		.attr("y",d=>+0)
		.text(function(d){ return d3.format("0.0%")(d.percent)})
		.attr("text-anchor",d=>(d.part=="primary"? "end": "start"));

	g.selectAll(".mainBars").append("title")
		  .text(function(d) {return d.key;});
		
	function mouseover(d){
		bp.mouseover(d);
		g.selectAll(".mainBars")
		.select(".perc")
		.text(function(d){return d3.format("0.0%")(d.percent)})
	}
	function mouseout(d){
		bp.mouseout(d);
		g.selectAll(".mainBars")
			.select(".perc")
		.text(function(d){ return d3.format("0.0%")(d.percent)})
	}
	d3.select(self.frameElement).style("height", "800px");
	
	});
	
});