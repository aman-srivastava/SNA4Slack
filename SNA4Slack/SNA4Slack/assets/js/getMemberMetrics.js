var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10);

	}

// var member;
// if(window.location.href.includes("*memberName")){
//   member = window.location.href.substring(window.location.href.indexOf("!")+13)
// }

$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}

  // var memberName;
  // if(window.location.href.includes("*memberName")){
	// 				memberName = window.location.href.substring(window.location.href.indexOf("!")+12);
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
      var memberName = 'carsten'
			console.log(data);

      console.log('Member Name: '+memberName)

      console.log('---------------------------------------')

      var memberChannels = []

      for(var i = 0; i<data.messageCount_channel_sender.length; i++){
        if(data.messageCount_channel_sender[i].messageSender == memberName){
          memberChannels.push(data.messageCount_channel_sender[i].channelName)
        }
      }

      console.log('Channels part of: '+memberChannels)
      console.log('Number of channels part of: '+memberChannels.length)

      console.log('---------------------------------------')

      var firstMessage, lastActive

      for(var i = 0; i<data.memberActivity.length; i++){
        if(data.memberActivity[i].messageSender == memberName){
        firstMessage = data.memberActivity[i].joinDateTime;
        lastActive = data.memberActivity[i].lastActiveDateTime;
        }
      }

      console.log('FirstMessage: '+firstMessage)
      console.log('LastActive: '+lastActive);

      console.log('---------------------------------------')

      var totalMessagesByMember = 0

      for(var i = 0; i<data.messageCount_channel_sender.length; i++){
        if(data.messageCount_channel_sender[i].messageSender == memberName){
          totalMessagesByMember = totalMessagesByMember + data.messageCount_channel_sender[i].msgCount
        }
      }

      console.log('Total Messages by Member: '+totalMessagesByMember)

      console.log('---------------------------------------')

      var memberChannelMessageMap = {}
      for (var i=0; i<data.messageCount_channel_sender.length; i++){
          if(data.messageCount_channel_sender[i].messageSender == memberName){
            memberChannelMessageMap[data.messageCount_channel_sender[i].channelName] = data.messageCount_channel_sender[i].msgCount
          }
      }

      for(var i in memberChannelMessageMap) {
        if (memberChannelMessageMap.hasOwnProperty(i)) {
          console.log('Channel is: ' + i + ' --- ' +'Number of Messages are ' + memberChannelMessageMap[i]);
        }

      }

      console.log('---------------------------------------')


			},

	});
});
