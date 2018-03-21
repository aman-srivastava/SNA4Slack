var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10);
		document.getElementById("dashboardPageLink").href = "Dashboard.html?teamName="+team;
		document.getElementById("TeamsPageLink").href = "Teams.html?teamName="+team;
		document.getElementById("ChannelsPageLink").href = "ChannelMain.html?teamName="+team;
		document.getElementById("MembersPageLink").href = "MembersMain.html?teamName="+team;
	}

$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	document.getElementById("teamNameHeader").innerHTML = "Dashboard | "+teamName;
	document.getElementById("teamNameSidebar").innerHTML = teamName;
	document.getElementById("teamURLTag").innerHTML = teamName+".slackarchive.io";
	document.getElementById("teamURLLink").href = "http://"+teamName+".slackarchive.io";
	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			console.log(data);
			for(var j = 0 ; j<data.length ; j++){
				//console.log(data[j]);
				if(data[j]['dataAnalytics']!=null){
					data = data[j]['dataAnalytics'];
				};
			}
			
			//console.log(data);
			var noOfMessages = 0
			var noOfChannels = []
			var noOfMembers = []
			for(var i = 0 ; i<data.messageCount_channel.length ; i++){
				noOfMessages += parseInt(data.messageCount_channel[i].msgCount);
			}
			
			/*
			for(var i = 0 ; i<data.messageCount_sender.length ; i++){
				if (noOfMembers.indexOf(data.messageCount_sender[i].messageSender) === -1){
				noOfMembers.push(data.messageCount_sender[i].messageSender);
				}				
			}
			*/
			
			document.getElementById("noOfConversations").innerHTML = noOfMessages;
			document.getElementById("noOfUsers").innerHTML = data.messageCount_sender.length;
			document.getElementById("noOfChannels").innerHTML = data['messageCount_channel'].length;

			document.getElementById("conversationCount").innerHTML = noOfMessages;
			document.getElementById("memberCount").innerHTML = data.messageCount_sender.length;
			document.getElementById("channelCount").innerHTML = data['messageCount_channel'].length;
			
			var ctx = $("#column-chart");

			// Chart Options
			var chartOptions = {
				// Elements options apply to all of the options unless overridden in a dataset
				// In this case, we are setting the border of each bar to be 2px wide and green
				elements: {
					rectangle: {
						borderWidth: 2,
						borderColor: 'rgb(0, 255, 0)',
						borderSkipped: 'bottom'
					}
				},
				responsive: true,
				maintainAspectRatio: false,
				responsiveAnimationDuration:500,
				legend: {display: false,
					position: 'bottom',
				},
				scales: {
					xAxes: [{
						display: true,
						gridLines: {
							color: "#D8BFD8",
							drawTicks: false,
						},
						scaleLabel: {
							display: true
						}
					}],
					yAxes: [{
						display: true,
						gridLines: {
							color: "#D8BFD8",
							drawTicks: false,
						},
						scaleLabel: {
							display: true,
							labelString: 'Total Conversations'
						}
					}]
				},
				title: {
					display: false,
					text: 'Chart.js Bar Chart'
				}
			};

			var labels = [];
			var values = [];
			for(var i = 0 ; i<data.messageCount_yearlyDist.length ; i++){
				var month;
				switch (data.messageCount_yearlyDist[i].Month) {
					case 1:
						month = "Jan";
						break;
					case 2:
						month = "Feb";
						break;
					case 3:
						month = "Mar";
						break;
					case 4:
						month = "Apr";
						break;
					case 5:
						month = "May";
						break;
					case 6:
						month = "Jun";
						break;
					case 7:
						month = "Jul";
						break;
					case 8:
						month = "Aug";
						break;
					case 9:
						month = "Sep";
						break;
					case 10:
						month = "Oct";
						break;
					case 11:
						month = "Nov";
						break;
					case 12:
						month = "Dec";
				}
				labels.push(month+", "+data.messageCount_yearlyDist[i].Year);
				values.push(data.messageCount_yearlyDist[i].msgCount)
			}
			
			// Chart Data
			var chartData = {
				labels: labels,
				datasets: [{
					label: "Conversations",
					data: values,
					backgroundColor: "#673AB7",
					hoverBackgroundColor: "rgba(103,58,183,.9)",
					borderColor: "transparent"
				}]
			};

			var config = {
				type: 'bar',

				// Chart Options
				options : chartOptions,

				data : chartData
			};

			// Create the chart
			var lineChart = new Chart(ctx, config);
		  
			var ctx = $("#url-pie-chart");

			// Chart Options
			var chartOptions = {
				legend: {display: true,
					position: 'top',
					labels:{fontSize:12}
				},
				responsive: true,
				maintainAspectRatio: false,
				responsiveAnimationDuration:500,
			};

			
			var labels = [];
			var values = [];
			for(var i = 0 ; i<5 ; i++){
				labels.push(data.sharedURLs[i].url.replace("https://","").replace("http://","").replace("www.",""));
				values.push(data.sharedURLs[i].urlCount)
			}
			
			// Chart Data
			var chartData = {
				labels: labels,
				datasets: [{
					label: "My First dataset",
					data: values,
					backgroundColor: ["#673AB7","#E91E63","#009688","#FF5722","#00BCD4"],
				}]
			};

			var config = {
				type: 'pie',

				// Chart Options
				options : chartOptions,

				data : chartData
			};

			// Create the chart
			var pieSimpleChart = new Chart(ctx, config);
			
			

		  
			var ctx = $("#emoji-pie-chart");

			// Chart Options
			var chartOptions = {
				legend: {display: true,
					position: 'top',
					labels:{fontSize:18}
				},
				responsive: true,
				maintainAspectRatio: false,
				responsiveAnimationDuration:500,
			};

			
			var labels = [];
			var values = [];
			for(var i = 0 ; i<5 ; i++){
				labels.push("  "+decodeURIComponent(data.emojiCount[i].emoji.replace(/\x/g,"%").replace(/\\/g,""))+"  ");
				values.push(data.emojiCount[i].emojiCount)
			}
			
			// Chart Data
			var chartData = {
				labels: labels,
				datasets: [{
					label: "My First dataset",
					data: values,
					backgroundColor: ["#673AB7","#E91E63","#009688","#FF5722","#00BCD4"],
				}]
			};

			var config = {
				type: 'doughnut',

				// Chart Options
				options : chartOptions,

				data : chartData
			};

			// Create the chart
			var pieSimpleChart = new Chart(ctx, config);
			
			},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log('error', errorThrown);
		}      
		
	  
	  

	});
});
$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			for(var j = 0 ; j<data.length ; j++){
				//console.log(data[j]);
				if(data[j]['directed-mention-graph']!=null){
					nodes = data[j]['directed-mention-graph'].nodes;
					data = data[j]['directed-mention-graph'].links;
				};
			}
			//console.log(data);
			var noOfMentions = 0;
			var teamSuperstars = {};
			for(var i = 0 ; i<data.length ; i++){
				noOfMentions += parseInt(data[i].weight);
				if(!(data[i].target in teamSuperstars)){
					teamSuperstars[data[i].target] = parseInt(data[i].weight);
				}
				else{
					teamSuperstars[data[i].target]=teamSuperstars[data[i].target]+parseInt(data[i].weight);
				}
			}
			//console.log(teamSuperstars);
			var items = Object.keys(teamSuperstars).map(function(key) {
				return [key, teamSuperstars[key]];
			});

			items.sort(function(first, second) {
				return second[1] - first[1];
			});
			var max = parseInt(items[0][1]);
			var min = parseInt(items[items.length-1][1]);
			items = items.slice(0, 6);
			
			document.getElementById("noOfMentions").innerHTML = noOfMentions;

			for(var i = 0 ; i<items.length ; i++){
				var username = "superstar"+(i+1)+"username";
				var avatar = "superstar"+(i+1)+"avatar";
				var mentions = "superstar"+(i+1)+"mentions";
				var popularity = "superstar"+(i+1)+"popularity";
				
				document.getElementById(username).innerHTML = items[i][0];
				document.getElementById(avatar).src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[i][0])].senderAvatar;
				document.getElementById(mentions).innerHTML = items[i][1];
				document.getElementById(popularity).max = max;
				document.getElementById(popularity).value = items[i][1];
				
			}
			
			
			},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log('error', errorThrown);
      }
	});
});
