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

      console.log('TotalMessages: '+messagesPerChannel)

      console.log('-----------------------------------------------')

      var membersPerChannel
      for (var i = 0; i<data.memberCount_channel.length; i++) {
        if(channelName = data.memberCount_channel[i].channelName){
          membersPerChannel = data.memberCount_channel[i].memberCount
        }
      }

      console.log('Total Members: '+membersPerChannel)

      console.log('-----------------------------------------------')

      var userMessagePerChannelMap = {}
      for (var i = 0; i<data.messageCount_channel_sender.length; i++) {
        if(channelName = data.messageCount_channel_sender[i].channelName){
          userMessagePerChannelMap[data.messageCount_channel_sender[i].messageSender] = data.messageCount_channel_sender[i].msgCount
        }
      }

      for(var i in userMessagePerChannelMap) {
        if (userMessagePerChannelMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'Number of Messages are ' + userMessagePerChannelMap[i]);
        }

      }

      console.log('-----------------------------------------------')

      let obj = { a: 4, b: 0.5 , c: 0.35, d: 5 };

      let arr = Object.values(userMessagePerChannelMap);
      let min = Math.min(...arr);
      let max = Math.max(...arr);

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
      console.log('LeastActiveMember: '+leastActiveMember)
      console.log('mostActiveMember: '+mostActiveMember)

      console.log('-----------------------------------------------')


			},

	});
});
