var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10);

	}

// var channel;
// if(window.location.href.includes("!channelName")){
//   channel = window.location.href.substring(window.location.href.indexOf("!")+13)
// }

$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}

  // var channelName;
  // if(window.location.href.includes("!channelName")){
	// 				channelName = window.location.href.substring(window.location.href.indexOf("!")+12);
	// 			}

	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			for(var j = 0 ; j<data.length ; j++){
				if(data[j]['dataAnalytics']!=null){
					data = data[j]['dataAnalytics'];
				};
			}
      var channelName = 'general'
			console.log(data);

      var messagesPerChannel
      for (var i = 0; i<data.messageCount_channel.length; i++) {
        if(channelName = data.messageCount_channel[i].channelName){
          messagesPerChannel = data.messageCount_channel[i].msgCount
        }
      }

			document.getElementById("TotalMessagesPerChannel").innerHTML = messagesPerChannel;
      console.log('TotalMessages: '+messagesPerChannel)

      console.log('-----------------------------------------------')

      var membersPerChannel
      for (var i = 0; i<data.memberCount_channel.length; i++) {
        if(channelName = data.memberCount_channel[i].channelName){
          membersPerChannel = data.memberCount_channel[i].memberCount
        }
      }

			document.getElementById("TotalMembersPerChannel").innerHTML = membersPerChannel;
      console.log('Total Members: '+membersPerChannel)

      console.log('-----------------------------------------------')

      var userMessagePerChannelMap = {}
      for (var i = 0; i<data.messageCount_channel_sender.length; i++) {
        if(channelName = data.messageCount_channel_sender[i].channelName){
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

      let obj = { a: 4, b: 0.5 , c: 0.35, d: 5 };

      let arr = Object.values(userMessagePerChannelMap);
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
