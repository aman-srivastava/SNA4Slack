var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10,window.location.href.indexOf("!"));
		document.getElementById("dashboardPageLink").href = "Dashboard.html?teamName="+team;
		document.getElementById("TeamsPageLink").href = "Teams.html?teamName="+team;
		document.getElementById("ChannelsPageLink").href = "ChannelMain.html?teamName="+team;
		document.getElementById("MembersPageLink").href = "MembersMain.html?teamName="+team;
	}

$( document ).ready(function() {
	var teamName;
	var channelName;
	if(window.location.href.includes("?teamName")){
					var splitURL = window.location.href.split("!")
							teamName = splitURL[0].substring(splitURL[0].indexOf("?")+10);
							channelName = splitURL[1].substring(splitURL[1].indexOf("c")+12)

				}
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
		          var row = table.insertRow(0);
							var cell1 = row.insertCell(0);
							var cell2 = row.insertCell(1);
							cell1.innerHTML = i;
							cell2.innerHTML = userMentionPerChannelMap[i];
						}


		      }
			document.getElementById("mostMentionedUser").innerHTML = Object.keys(userMentionPerChannelMap).reduce((a, b) => userMentionPerChannelMap[a] > userMentionPerChannelMap[b] ? a : b);


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

			var messagesPerChannel
      for (var i = 0; i<data.messageCount_channel.length; i++) {
        if(channelName == data.messageCount_channel[i].channelName){
          messagesPerChannel = data.messageCount_channel[i].msgCount
        }
      }


			document.getElementById("HeaderChannelIndividual").innerHTML = teamName+" | "+channelName;
			document.getElementById("ChannelName").innerHTML = teamName+" | "+channelName+" - SNA4SLACK";
			document.getElementById("TotalMessagesPerChannel").innerHTML = messagesPerChannel;

      // console.log('-----------------------------------------------')

      var membersPerChannel
      for (var i = 0; i<data.memberCount_channel.length; i++) {
        if(channelName == data.memberCount_channel[i].channelName){
          membersPerChannel = data.memberCount_channel[i].memberCount
        }
      }

			document.getElementById("TotalMembersPerChannel").innerHTML = membersPerChannel;
      // console.log('-----------------------------------------------')

      var userMessagePerChannelMap = {}
      for (var i = 0; i<data.messageCount_channel_sender.length; i++) {
        if(channelName == data.messageCount_channel_sender[i].channelName){
          userMessagePerChannelMap[data.messageCount_channel_sender[i].messageSender] = data.messageCount_channel_sender[i].msgCount
        }
      }

			var table = document.getElementById("Message-Per-Member-per-Channel")
      for(var i in userMessagePerChannelMap) {
        if (userMessagePerChannelMap.hasOwnProperty(i)) {
          var row = table.insertRow(0);
					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					cell1.innerHTML = i;
					cell2.innerHTML = userMessagePerChannelMap[i];
			}

      }
      // console.log('-----------------------------------------------')
      let arr = Object.values(userMessagePerChannelMap);
      let min = Math.min(...arr);
      let max = Math.max(...arr);

			document.getElementById("TotalMessagesPerChannelSplit").innerHTML = messagesPerChannel;
			document.getElementById("MaxMessagesByUserInChannel").innerHTML = max;
			document.getElementById("LeastMessagesByUserInChannel").innerHTML = min;
      // console.log('-----------------------------------------------')

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
      // console.log('-----------------------------------------------')


			},

	});
});
