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
	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			for(var j = 0 ; j<data.length ; j++){
				if(data[j]['dataAnalytics']!=null){
					data = data[j]['dataAnalytics'];
				};
			}

			console.log(data);

			document.getElementById("teamNameSidebar").innerHTML = teamName;
			document.getElementById("teamURLTag").innerHTML = teamName+".slackarchive.io";
			document.getElementById("teamURLLink").href = "http://"+teamName+".slackarchive.io";
			document.getElementById("channelCount").innerHTML = data['messageCount_channel'].length;


			var select = document.getElementById("basicSelectMember")
			for (var i = 0; i<data.messageCount_sender.length; i++){
				  var opt = document.createElement('option');
			    opt.value = data.messageCount_sender[i].messageSender;
			    opt.innerHTML = data.messageCount_sender[i].messageSender;
			    select.appendChild(opt);
			}

			$("#basicSelectMember").change(SelectMemberFunction);

			function SelectMemberFunction(){

			 console.log('insideselectchannelfunction')
			var z = window.location.href

			var a = z.replace("MembersMain", "members");
			console.log(this.selectedIndex)
			console.log(this.options[this.selectedIndex].value)
			a = a + "!memberName="+this.options[this.selectedIndex].value
			window.location.href = a

			}

			document.getElementById("Header").innerHTML = teamName+" | Member Main Metrics"
			document.getElementById("Header2").innerHTML = teamName+" | Member Main Metrics"

      var users = []

      for (var i = 0; i<data.messageCount_sender.length; i++) {
        users.push(data.messageCount_sender[i].messageSender)
      }

      var uniqueUsers = [... new Set(users)]
      console.log('UniqueUsers: '+uniqueUsers)

      var userFirstMessageStampMap = {}
      var userLastActiveStampMap = {}

			var table2 = document.getElementById("Member-FirstMessage-Table")
      for(var i = 0 ; i<data.memberActivity.length ; i++){
        userFirstMessageStampMap[data.memberActivity[i].messageSender] = data.memberActivity[i].joinDateTime
      }
      for(var i in userFirstMessageStampMap) {
        if (userFirstMessageStampMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'FirstMessage Time Stamp is ' + userFirstMessageStampMap[i]);
					var row = table2.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = i;
					cell2.innerHTML = userFirstMessageStampMap[i];
        }

      }

      console.log('---------------------------------------------------------------')

			var table = document.getElementById("Member-LastActive-Table")
      for(var i = 0 ; i<data.memberActivity.length ; i++){
        userLastActiveStampMap[data.memberActivity[i].messageSender] = data.memberActivity[i].lastActiveDateTime
      }
      for(var i in userLastActiveStampMap) {
        if (userLastActiveStampMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'Last Active Time Stamp is ' + userLastActiveStampMap[i]);
					var row = table.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = i;
					cell2.innerHTML = userLastActiveStampMap[i];

        }

      }

      console.log('---------------------------------------------------------------')

      var yearsArray = []
      for(var i = 0 ; i<data.messageCount_yearlyDist.length ; i++){
        yearsArray.push(data.messageCount_yearlyDist[i].Year)
      }

      var uniqueYears = [... new Set(yearsArray)]
      console.log('UniqueYears: '+uniqueYears)

      console.log('---------------------------------------------------------------')

      var yearMessageMap = {}
      for(var i = 0; i<uniqueYears.length; i++){
        yearMessageMap[uniqueYears[i]] = 0;
      }


			var popoverDiv = document.getElementById("PopoverTriggers")

      for(var i = 0; i<uniqueYears.length; i++){
        for(var j =0; j<data.messageCount_yearlyDist.length; j++){
          if(uniqueYears[i] == data.messageCount_yearlyDist[j].Year){
            yearMessageMap[uniqueYears[i]] = yearMessageMap[uniqueYears[i]] + data.messageCount_yearlyDist[j].msgCount
          }
        }
      }
			var temp = 0
      for (var key in yearMessageMap) {
        if (yearMessageMap.hasOwnProperty(key)) {
          console.log('Year: '+key + " -> Messages " + yearMessageMap[key]);
					var newButton = document.createElement("button")

					newButton.setAttribute("type", "button")
					newButton.setAttribute("class", "btn btn-info")
					newButton.setAttribute("data-toggle", "popover")
					newButton.setAttribute("data-content","Total Number of Messages: 4563")
					newButton.setAttribute("data-original-title", "Number of Messages")
					newButton.setAttribute("data-placement","bottom")
					//newButton.style.padding = "50px 10px 20px 30px"
					//newButton.setAttribute("onClick","myFunction()")
					newButton.style.border = "solid #000"

					// function myFunction(){
					// 	alert(temp)
					// }

					newButton.innerHTML = key + "-->" + yearMessageMap[key];
					popoverDiv.appendChild(newButton);

        }
      }




      console.log('---------------------------------------------------------------')

      var totalMessages = 0
      for(var i = 0; i<data.messageCount_sender.length; i++){
        totalMessages = totalMessages + data.messageCount_sender[i].msgCount
      }

			document.getElementById("conversationCount").innerHTML = totalMessages;

			document.getElementById("TotalMessages").innerHTML = totalMessages;
      console.log('Total Messages: '+totalMessages)

      var totalMembers = 0
      for(var i = 0; i<data.memberCount_channel.length; i++){
        totalMembers = totalMembers + data.memberCount_channel[i].memberCount
      }

			document.getElementById("memberCount").innerHTML = data.messageCount_sender.length;

			document.getElementById("TotalMembers").innerHTML = data.messageCount_sender.length;
      console.log('Total Members: '+totalMembers)

      var totalEmoticons = 0
      for(var i = 0; i<data.emojiCount.length; i++){
        totalEmoticons = totalEmoticons + data.emojiCount[i].emojiCount
      }

			document.getElementById("TotalEmoticons").innerHTML = totalEmoticons;
      console.log('Total Emoticons: '+totalEmoticons)


      var totalURLs = 0
      for(var i = 0; i<data.sharedURLs.length; i++){
        totalURLs = totalURLs + data.sharedURLs[i].urlCount
      }

			document.getElementById("TotalURLs").innerHTML = totalURLs;
      console.log('Total URLs: '+totalURLs)

      console.log('---------------------------------------------------------------')


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
							color: "#ff9999",
							drawTicks: false,
						},
						scaleLabel: {
							display: true
						}
					}],
					yAxes: [{
						display: true,
						gridLines: {
							color: "#ff9999",
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
			for(var i = 0 ; i<data.messageCount_sender.length ; i++){

				labels.push(data.messageCount_sender[i].messageSender);
				values.push(data.messageCount_sender[i].msgCount)
			}

			// Chart Data
			var chartData = {
				labels: labels,
				datasets: [{
					label: "Messages per Member",
					data: values,
					backgroundColor: "#990000",
					hoverBackgroundColor: "#ff6666",
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



			var ctx = $("#column-hour-chart");


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
							color: "#008000",
							drawTicks: false,
						},
						scaleLabel: {
							display: true
						}
					}],
					yAxes: [{
						display: true,
						gridLines: {
							color: "#008000",
							drawTicks: false,
						},
						scaleLabel: {
							display: true,
							labelString: 'Messages per Hour Count'
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
			for(var i = 0 ; i<data.mostActiveHours.length ; i++){

				labels.push(data.mostActiveHours[i].hour);
				values.push(data.mostActiveHours[i].msgCount)
			}

			// Chart Data
			var chartData = {
				labels: labels,
				datasets: [{
					label: "Messages per Hour Count",
					data: values,
					backgroundColor: "#006400",
					hoverBackgroundColor: "#ff6666",
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

			},

	});
});
