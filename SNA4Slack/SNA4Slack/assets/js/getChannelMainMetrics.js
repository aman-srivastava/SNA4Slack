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
	currentURL = window.location.href
	if(window.location.href.includes("?teamName")){
					// console.log(window.location.href)
					// var splitURL = window.location.href.split("?")
					// console.log(splitURL)
					// t = splitURL[1].substring(splitURL[1].indexOf("t")+9)
					// console.log(t)
					// teamName = t
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

			//console.log(data);

			document.getElementById("teamNameSidebar").innerHTML = teamName;
			document.getElementById("teamURLTag").innerHTML = teamName+".slackarchive.io";
			document.getElementById("teamURLLink").href = "http://"+teamName+".slackarchive.io";
			document.getElementById("channelCount").innerHTML = data['messageCount_channel'].length;

			var totalMessages = 0
      for(var i = 0; i<data.messageCount_sender.length; i++){
        totalMessages = totalMessages + data.messageCount_sender[i].msgCount
      }

			document.getElementById("conversationCount").innerHTML = totalMessages;

			var totalMembers = 0
      for(var i = 0; i<data.memberCount_channel.length; i++){
        totalMembers = totalMembers + data.memberCount_channel[i].memberCount
      }

			document.getElementById("memberCount").innerHTML = data.messageCount_sender.length;

			var select = document.getElementById("basicSelect")
			for (var i = 0; i<data.firstMessage.length; i++){
				  var opt = document.createElement('option');
			    opt.value = data.firstMessage[i].channelName;
			    opt.innerHTML = data.firstMessage[i].channelName;
			    select.appendChild(opt);
			}

			$("#basicSelect").change(SelectChannelFunction);

			function SelectChannelFunction(){
// 				<select onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);">
//     <option value="">Select...</option>
//     <option value="http://google.com">Google</option>
//     <option value="http://yahoo.com">Yahoo</option>
// </select>
		// var x = document.getElementById("basicSelect").value;
		// console.log('You selected: '+ x)

			 console.log('insideselectchannelfunction')
			// console.log(currentURL)
			var z = window.location.href

			var a = z.replace("ChannelMain", "channels");
			//console.log(this.selectedIndex)
			//console.log(this.options[this.selectedIndex].value)
			a = a + "!channelName="+this.options[this.selectedIndex].value
			// console.log(a)
			// console.log(this.options[this.selectedIndex].value)
			 // window.location.href = currentURL + "!channelName="+ this.options[this.selectedIndex].value
			// console.log(window.location.href)
			window.location.href = a
			//console.log(z)

			}

			document.getElementById("Header").innerHTML = teamName+" | Channel Main Metrics"
			document.getElementById("Header2").innerHTML = teamName+" | Channel Main Metrics"

      var channelsDateMap = {}
			var table = document.getElementById("Channel-Date-Table")

			//document.getElementById("Channel-Date-Table")


      for(var i = 0 ; i<data.firstMessage.length ; i++){
        //console.log(data[i].firstMessage[i])
				var strSliced = data.firstMessage[i].messageTime.slice(0, 10)
        channelsDateMap[data.firstMessage[i].channelName] = strSliced
      }
      for(var i in channelsDateMap) {
        if (channelsDateMap.hasOwnProperty(i)) {
          //console.log('Channel is: ' + i + ' --- ' +'First Message is on ' + channelsDateMap[i]);
					var row = table.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = i;
					cell2.innerHTML = channelsDateMap[i];
					//cell2.className = "tag tag-danger"; //Edit @Aman
        }
      }




      //console.log('------------------------------------------')

    var channelsMessagesMap = {}
		var table2 = document.getElementById("Channel-Message-Table")

    for(var i = 0 ; i<data.messageCount_channel.length ; i++){
      channelsMessagesMap[data.messageCount_channel[i].channelName] = data.messageCount_channel[i].msgCount
    }
    for(var i in channelsMessagesMap) {
      if (channelsMessagesMap.hasOwnProperty(i)) {
        //console.log('Channel is: ' + i + ' --- ' +'Total Messages are ' + channelsMessagesMap[i]);
				var row = table2.insertRow(0);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				cell1.innerHTML = i;
				cell2.innerHTML = channelsMessagesMap[i];
				//cell2.className = "tag tag-success"; //Edit @Aman
      }

    }

    var messageArray = []
    for (var i = 0; i<data.messageCount_channel.length; i++) {
      messageArray.push(data.messageCount_channel[i].msgCount)
    }

		var emojiCountArray = []
    for (var i = 0; i<data.emojiCount.length; i++) {
      emojiCountArray.push(data.emojiCount[i].emojiCount)
    }

		var urlCountArray = []
    for (var i = 0; i<data.sharedURLs.length; i++) {
      urlCountArray.push(data.sharedURLs[i].urlCount)
    }

    var sumMessages = messageArray.reduce((a, b) => a + b, 0);
		var sumEmoticons = emojiCountArray.reduce((a, b) => a + b, 0);
		var sumURL = urlCountArray.reduce((a, b) => a + b, 0);



    var maxMessages = Math.max.apply(null, messageArray)
    var minMessages = Math.min.apply(null, messageArray)

		document.getElementById("TotalMessages").innerHTML = sumMessages;
		document.getElementById("AverageMessages").innerHTML = Math.round(sumMessages/3);
		document.getElementById("MaxMessages").innerHTML = maxMessages;
		document.getElementById("LeastMessages").innerHTML = minMessages;
		document.getElementById("TotalChannels").innerHTML = data.messageCount_channel.length;
		document.getElementById("TotalEmoticons").innerHTML = sumEmoticons;
		document.getElementById("TotalURLs").innerHTML = sumURL;

    // console.log('Message Array: '+messageArray);
    // console.log('Total Messages: '+sumMessages);
    // console.log('Average Messages: '+sumMessages/3)
    // console.log('Max Messages: '+maxMessages)
    // console.log('Least Messages: '+minMessages)
    // console.log('Total channels: ' +data.messageCount_channel.length)


	//console.log('------------------------------------------')

    var channelMemberMap = {}
    for( var i = 0; i<data.memberCount_channel.length; i++){
      channelMemberMap[data.memberCount_channel[i].channelName] = data.memberCount_channel[i].memberCount
    }

		var table3 = document.getElementById("Channel-Member-Table")

    for(var i in channelMemberMap) {
      if (channelMemberMap.hasOwnProperty(i)) {
        //console.log('Channel is: ' + i + ' --- ' +'Total Members are ' + channelMemberMap[i]);
				var row = table3.insertRow(0);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				cell1.innerHTML = i;
				cell2.innerHTML = channelMemberMap[i];
				//cell2.className = "tag tag-success"; //Edit @Aman
      }

    }

		var channelArray = []

		for(var i = 0; i<data.memberCount_channel.length; i++){
			channelArray.push(data.memberCount_channel[i].channelName)
		}

		//console.log(channelArray)


		var channelMembersListMap = {}

		for(var i=0 ;i<data.messageCount_channel_sender.length; i++){
			channelMembersListMap[data.messageCount_channel_sender[i].channelName] = []
		}

		for(var j = 0; j<channelArray.length; j++){
			var z = []
			for(var i=0 ;i<data.messageCount_channel_sender.length; i++){
				if(channelArray[j] == data.messageCount_channel_sender[i].channelName)
					channelMembersListMap[channelArray[j]] = z.push(" "+data.messageCount_channel_sender[i].messageSender)
			}
			channelMembersListMap[channelArray[j]] = z
		}

		var table4 = document.getElementById("Channel-Memberlist-Table")
		for(var i in channelMembersListMap) {
      if (channelMembersListMap.hasOwnProperty(i)) {
        //console.log('Channel is: ' + i + ' --- ' +'List of Members are ' + channelMembersListMap[i]);
				var row = table4.insertRow(0);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				cell1.innerHTML = i;
				cell2.innerHTML = channelMembersListMap[i];

      }

    }

			},

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

			//document.getElementById("noOfMentions").innerHTML = noOfMentions;


			document.getElementById("superstar1username").innerHTML = items[0][0];
			document.getElementById("superstar1avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[0][0])].senderAvatar;
			document.getElementById("superstar1mentions").innerHTML = items[0][1];
			document.getElementById("superstar1popularity").max = max;
			document.getElementById("superstar1popularity").value = items[0][1];

			document.getElementById("superstar2username").innerHTML = items[1][0];
			document.getElementById("superstar2avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[1][0])].senderAvatar;
			document.getElementById("superstar2mentions").innerHTML = items[1][1];
			document.getElementById("superstar2popularity").max = max;
			document.getElementById("superstar2popularity").value = items[1][1];

			document.getElementById("superstar3username").innerHTML = items[2][0];
			document.getElementById("superstar3avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[2][0])].senderAvatar;
			document.getElementById("superstar3mentions").innerHTML = items[2][1];
			document.getElementById("superstar3popularity").max = max;
			document.getElementById("superstar3popularity").value = items[2][1];

			document.getElementById("superstar4username").innerHTML = items[3][0];
			document.getElementById("superstar4avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[3][0])].senderAvatar;
			document.getElementById("superstar4mentions").innerHTML = items[3][1];
			document.getElementById("superstar4popularity").max = max;
			document.getElementById("superstar4popularity").value = items[3][1];


			document.getElementById("superstar5username").innerHTML = items[4][0];
			document.getElementById("superstar5avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[4][0])].senderAvatar;
			document.getElementById("superstar5mentions").innerHTML = items[4][1];
			document.getElementById("superstar5popularity").max = max;
			document.getElementById("superstar5popularity").value = items[4][1];


			document.getElementById("superstar6username").innerHTML = items[5][0];
			document.getElementById("superstar6avatar").src = nodes[nodes.map(function(x) {return x.id; }).indexOf(items[5][0])].senderAvatar;
			document.getElementById("superstar6mentions").innerHTML = items[5][1];
			document.getElementById("superstar6popularity").max = max;
			document.getElementById("superstar6popularity").value = items[5][1];



			},

	});
});
