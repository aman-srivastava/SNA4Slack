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
	var memberName;
	if(window.location.href.includes("?teamName")){
					var splitURL = window.location.href.split("!")
							teamName = splitURL[0].substring(splitURL[0].indexOf("?")+10);
							memberName = splitURL[1].substring(splitURL[1].indexOf("m")+11)
				}

	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			var friendData;
			for(var j = 0 ; j<data.length ; j++){
				if(data[j]['directed-mention-graph']!=null){
					friendData = data[j]['directed-mention-graph'];
				}
			}
			for(var j = 0 ; j<data.length ; j++){
				if(data[j]['dataAnalytics']!=null){
					data = data[j]['dataAnalytics'];
				}
			}
			var mentionCount = 0;
			document.getElementById("mMentions").innerHTML = mentionCount;


			for(var j = 0 ; j<friendData.nodes.length ; j++){
				if(friendData.nodes[j].id===memberName)
				{
					document.getElementById("memberAvatar").src = friendData.nodes[j].senderAvatar;
					if(friendData.nodes[j].mention_count.length==0)
						document.getElementById("mMentions").innerHTML = mentionCount;

					else{
						document.getElementById("mMentions").innerHTML = Object.values(friendData.nodes[j].mention_count).reduce(function(a, b) { return a + b; }, 0);
            document.getElementById("mmMentions").innerHTML = Object.values(friendData.nodes[j].mention_count).reduce(function(a, b) { return a + b; }, 0);

					}
				}

			}
			document.getElementById("memberNameHeader").innerHTML = "@"+memberName;



      for(var j = 0 ; j<friendData.nodes.length ; j++){
				if(friendData.nodes[j].id===memberName)
				{
					if(friendData.nodes[j].top_friends[0])
						document.getElementById("bf1").innerHTML = friendData.nodes[j].top_friends[0];
            if(friendData.nodes[j].top_friends[1])
            document.getElementById("bf2").innerHTML = friendData.nodes[j].top_friends[1];
            if(friendData.nodes[j].top_friends[2])
            document.getElementById("bf3").innerHTML = friendData.nodes[j].top_friends[2];
				}

			}



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

			document.getElementById("Header").innerHTML = teamName+" | " +memberName + " SNA4SLACK";


			document.getElementById("MemberName").innerHTML = memberName;

      // console.log('---------------------------------------')

      var memberChannels = []

      for(var i = 0; i<data.messageCount_channel_sender.length; i++){
        if(data.messageCount_channel_sender[i].messageSender == memberName){
          memberChannels.push(data.messageCount_channel_sender[i].channelName)
        }
      }


			document.getElementById("NumberOfChannels").innerHTML = memberChannels.length;
  		document.getElementById("mChannels").innerHTML = memberChannels.length;

      // console.log('---------------------------------------')

      var firstMessage, lastActive

      for(var i = 0; i<data.memberActivity.length; i++){
        if(data.memberActivity[i].messageSender == memberName){
        firstMessage = data.memberActivity[i].joinDateTime;
        lastActive = data.memberActivity[i].lastActiveDateTime;
        }
      }

			document.getElementById("LastActiveStamp").innerHTML = lastActive;
			document.getElementById("FirstMessageStamp").innerHTML = firstMessage;

      // console.log('---------------------------------------')

      var totalMessagesByMember = 0

      for(var i = 0; i<data.messageCount_channel_sender.length; i++){
        if(data.messageCount_channel_sender[i].messageSender == memberName){
          totalMessagesByMember = totalMessagesByMember + data.messageCount_channel_sender[i].msgCount
        }
      }

			document.getElementById("mMessages").innerHTML = totalMessagesByMember;

      // console.log('---------------------------------------')

      var memberChannelMessageMap = {}
      for (var i=0; i<data.messageCount_channel_sender.length; i++){
          if(data.messageCount_channel_sender[i].messageSender == memberName){
            memberChannelMessageMap[data.messageCount_channel_sender[i].channelName] = data.messageCount_channel_sender[i].msgCount
          }
      }

			var popoverDiv = document.getElementById("PopoverTriggers")

      for(var i in memberChannelMessageMap) {
        if (memberChannelMessageMap.hasOwnProperty(i)) {
  				var newButton = document.createElement("button")

					newButton.setAttribute("type", "button")
					newButton.setAttribute("class", "btn btn-info")
					newButton.setAttribute("data-toggle", "popover")
					newButton.setAttribute("data-content","Total Number of Messages: 4563")
					newButton.setAttribute("data-original-title", "Number of Messages")
					newButton.setAttribute("data-placement","bottom")

					newButton.style.border = "solid #000"
				newButton.innerHTML = i + "-->" + memberChannelMessageMap[i];
					popoverDiv.appendChild(newButton);

        }

      }

      // console.log('---------------------------------------')


			},

	});
});
