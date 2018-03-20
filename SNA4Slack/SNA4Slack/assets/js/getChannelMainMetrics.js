var team;
if(window.location.href.includes("?teamName")){
		team = window.location.href.substring(window.location.href.indexOf("?")+10);

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

      var channelsDateMap = {}


      for(var i = 0 ; i<data.firstMessage.length ; i++){
        //console.log(data[i].firstMessage[i])
        channelsDateMap[data.firstMessage[i].channelName] = data.firstMessage[i].messageTime
      }
      for(var i in channelsDateMap) {
        if (channelsDateMap.hasOwnProperty(i)) {
          console.log('Channel is: ' + i + ' --- ' +'First Message is on ' + channelsDateMap[i]);
        }
      }

      console.log('------------------------------------------')

    var channelsMessagesMap = {}

    for(var i = 0 ; i<data.messageCount_channel.length ; i++){
      channelsMessagesMap[data.messageCount_channel[i].channelName] = data.messageCount_channel[i].msgCount
    }
    for(var i in channelsMessagesMap) {
      if (channelsMessagesMap.hasOwnProperty(i)) {
        console.log('Channel is: ' + i + ' --- ' +'Total Messages are ' + channelsMessagesMap[i]);
      }

    }

    var messageArray = []
    for (var i = 0; i<data.messageCount_channel.length; i++) {
      messageArray.push(data.messageCount_channel[i].msgCount)
    }

    var sumMessages = messageArray.reduce((a, b) => a + b, 0);

    var maxMessages = Math.max.apply(null, messageArray)
    var minMessages = Math.min.apply(null, messageArray)

    console.log('Message Array: '+messageArray);
    console.log('Total Messages: '+sumMessages);
    console.log('Average Messages: '+sumMessages/3)
    console.log('Max Messages: '+maxMessages)
    console.log('Least Messages: '+minMessages)
    console.log('Total channels: ' +data.messageCount_channel.length)
		 
		 
	console.log('------------------------------------------')

    var channelMemberMap = {}
    for( var i = 0; i<data.memberCount_channel.length; i++){
      channelMemberMap[data.memberCount_channel[i].channelName] = data.memberCount_channel[i].memberCount
    }

    for(var i in channelMemberMap) {
      if (channelMemberMap.hasOwnProperty(i)) {
        console.log('Channel is: ' + i + ' --- ' +'Total Members are ' + channelMemberMap[i]);
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
			console.log(teamSuperstars);
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
