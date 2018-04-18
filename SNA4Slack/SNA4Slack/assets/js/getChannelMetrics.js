var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10,window.location.href.indexOf("!"));
		document.getElementById("dashboardPageLink").href = "Dashboard.html?teamName="+team;
		document.getElementById("TeamsPageLink").href = "Teams.html?teamName="+team;
		document.getElementById("ChannelsPageLink").href = "ChannelMain.html?teamName="+team;
		document.getElementById("MembersPageLink").href = "MembersMain.html?teamName="+team;
	}

// var channel;
// if(window.location.href.includes("!channelName")){
//   channel = window.location.href.substring(window.location.href.indexOf("!")+13)
// }

$( document ).ready(function() {
	var teamName;
	var channelName;
	if(window.location.href.includes("?teamName")){
							console.log(window.location.href)
					var splitURL = window.location.href.split("!")
					console.log('URL 0 IS: '+ splitURL[0])
					console.log('URL 1 IS: '+ splitURL[1])
					//  console.log(splitURL)
					//  t = splitURL[1].substring(splitURL[1].indexOf("t")+9)
					//  console.log(t)
					//  teamName = t

							teamName = splitURL[0].substring(splitURL[0].indexOf("?")+10);
							console.log(teamName)
							channelName = splitURL[1].substring(splitURL[1].indexOf("c")+12)
							console.log(channelName)
				}

  // var channelName;
  // if(window.location.href.includes("!channelName")){
	// 				channelName = window.location.href.substring(window.location.href.indexOf("!")+12);
	// 			}

	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
					 var newData;
		 			for(var j = 0 ; j<data.length ; j++){
		 				if(data[j]['directed-mention-graph']!=null){
		 					newData = data[j]['directed-mention-graph'];
		 				}
		 			}
		 			for(var j = 0 ; j<data.length ; j++){
		 				if(data[j]['dataAnalytics']!=null){
		 					data = data[j]['dataAnalytics'];
		 				}
		 			}


					var userMentionPerChannelMap = {}
		      for (var i = 0; i<newData.nodes.length; i++) {
						console.log(newData.nodes[i].mention_count)
						var channelArray = Object.keys(newData.nodes[i].mention_count);

						for (var j=0; j<channelArray.length; j++){
			        if(channelName == channelArray[j]){
			          userMentionPerChannelMap[newData.nodes[i].id] = newData.nodes[i].mention_count[channelName]
			        }
			      }
				}

					var table = document.getElementById("Mentions-Per-Member-per-Channel")
		      for(var i in userMentionPerChannelMap) {
		        if (userMentionPerChannelMap.hasOwnProperty(i)) {
		          console.log('User is: ' + i + ' --- ' +'Number of Mentions are ' + userMentionPerChannelMap[i]);
							var row = table.insertRow(0);
							var cell1 = row.insertCell(0);
							var cell2 = row.insertCell(1);
							cell1.innerHTML = i;
							cell2.innerHTML = userMentionPerChannelMap[i];
							// cell2.className = "tag tag-danger";
		        }

		      }
			console.log("Graph Object -------> : "+newData);


      //var channelName = 'random'
			console.log(data);
			console.log(channelName)

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
			//console.log(channelName)

      var messagesPerChannel
      for (var i = 0; i<data.messageCount_channel.length; i++) {
        if(channelName == data.messageCount_channel[i].channelName){
          messagesPerChannel = data.messageCount_channel[i].msgCount
        }
      }


			document.getElementById("HeaderChannelIndividual").innerHTML = teamName+" | "+channelName;
			document.getElementById("ChannelName").innerHTML = teamName+" | "+channelName+" - SNA4SLACK";
			document.getElementById("TotalMessagesPerChannel").innerHTML = messagesPerChannel;
      console.log('TotalMessages: '+messagesPerChannel)

      console.log('-----------------------------------------------')

      var membersPerChannel
      for (var i = 0; i<data.memberCount_channel.length; i++) {
        if(channelName == data.memberCount_channel[i].channelName){
          membersPerChannel = data.memberCount_channel[i].memberCount
        }
      }

			document.getElementById("TotalMembersPerChannel").innerHTML = membersPerChannel;
      console.log('Total Members: '+membersPerChannel)

      console.log('-----------------------------------------------')

      var userMessagePerChannelMap = {}
      for (var i = 0; i<data.messageCount_channel_sender.length; i++) {
        if(channelName == data.messageCount_channel_sender[i].channelName){
          userMessagePerChannelMap[data.messageCount_channel_sender[i].messageSender] = data.messageCount_channel_sender[i].msgCount
        }
      }

			var table = document.getElementById("Message-Per-Member-per-Channel")
      for(var i in userMessagePerChannelMap) {
        if (userMessagePerChannelMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'Number of Messages are ' + userMessagePerChannelMap[i]);
					var row = table.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = i;
					cell2.innerHTML = userMessagePerChannelMap[i];
					// cell2.className = "tag tag-danger";
        }

      }

      console.log('-----------------------------------------------')

      //let obj = { a: 4, b: 0.5 , c: 0.35, d: 5 };

      let arr = Object.values(userMessagePerChannelMap);
			console.log(arr)
      let min = Math.min(...arr);
      let max = Math.max(...arr);

			document.getElementById("TotalMessagesPerChannelSplit").innerHTML = messagesPerChannel;
			document.getElementById("MaxMessagesByUserInChannel").innerHTML = max;
			document.getElementById("LeastMessagesByUserInChannel").innerHTML = min;

      console.log( `Min messages by user: ${min}, Max messages by user: ${max}` );

      console.log('-----------------------------------------------')

      var leastActiveMember, mostActiveMember
      for(var i in userMessagePerChannelMap) {
        if (userMessagePerChannelMap.hasOwnProperty(i)) {
          if(userMessagePerChannelMap[i] == min){
            leastActiveMember = i
          }
          if(userMessagePerChannelMap[i] == max) {
            mostActiveMember = i
          }

        }


      }

			document.getElementById("MostActiveMember").innerHTML = mostActiveMember;
			document.getElementById("LeastActiveMember").innerHTML = leastActiveMember;
      console.log('LeastActiveMember: '+leastActiveMember)
      console.log('mostActiveMember: '+mostActiveMember)

      console.log('-----------------------------------------------')


			},

	});
});
