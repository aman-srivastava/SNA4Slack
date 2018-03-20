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

      var users = []

      for (var i = 0; i<data.messageCount_sender.length; i++) {
        users.push(data.messageCount_sender[i].messageSender)
      }

      var uniqueUsers = [... new Set(users)]
      console.log('UniqueUsers: '+uniqueUsers)

      var userFirstMessageStampMap = {}
      var userLastActiveStampMap = {}

      for(var i = 0 ; i<data.memberActivity.length ; i++){
        userFirstMessageStampMap[data.memberActivity[i].messageSender] = data.memberActivity[i].joinDateTime
      }
      for(var i in userFirstMessageStampMap) {
        if (userFirstMessageStampMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'FirstMessage Time Stamp is ' + userFirstMessageStampMap[i]);
        }

      }

      console.log('---------------------------------------------------------------')

      for(var i = 0 ; i<data.memberActivity.length ; i++){
        userLastActiveStampMap[data.memberActivity[i].messageSender] = data.memberActivity[i].lastActiveDateTime
      }
      for(var i in userLastActiveStampMap) {
        if (userLastActiveStampMap.hasOwnProperty(i)) {
          console.log('User is: ' + i + ' --- ' +'Last Active Time Stamp is ' + userLastActiveStampMap[i]);
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



      for(var i = 0; i<uniqueYears.length; i++){
        for(var j =0; j<data.messageCount_yearlyDist.length; j++){
          if(uniqueYears[i] == data.messageCount_yearlyDist[j].Year){
            yearMessageMap[uniqueYears[i]] = yearMessageMap[uniqueYears[i]] + data.messageCount_yearlyDist[j].msgCount
          }
        }
      }

      for (var key in yearMessageMap) {
        if (yearMessageMap.hasOwnProperty(key)) {
          console.log('Year: '+key + " -> Messages " + yearMessageMap[key]);
        }
      }

      console.log('---------------------------------------------------------------')

      var totalMessages = 0
      for(var i = 0; i<data.messageCount_sender.length; i++){
        totalMessages = totalMessages + data.messageCount_sender[i].msgCount
      }

      console.log('Total Messages: '+totalMessages)

      var totalMembers = 0
      for(var i = 0; i<data.memberCount_channel.length; i++){
        totalMembers = totalMembers + data.memberCount_channel[i].memberCount
      }

      console.log('Total Members: '+totalMembers)

      var totalEmoticons = 0
      for(var i = 0; i<data.emojiCount.length; i++){
        totalEmoticons = totalEmoticons + data.emojiCount[i].emojiCount
      }

      console.log('Total Emoticons: '+totalEmoticons)


      var totalURLs = 0
      for(var i = 0; i<data.sharedURLs.length; i++){
        totalURLs = totalURLs + data.sharedURLs[i].urlCount
      }

      console.log('Total URLs: '+totalURLs)

      console.log('---------------------------------------------------------------')
      
			},

	});
});
