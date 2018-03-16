$( document ).ready(function() {
	var teamName;
	if(window.location.href.includes("?teamName")){
					teamName = window.location.href.substring(window.location.href.indexOf("?")+10);
				}
	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/"+teamName+"?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			data = data[0]['dataAnalytics']
			console.log(data);
			var noOfMessages = 0
			var noOfChannels = []
			var noOfMembers = []
			for(var i = 0 ; i<data.length ; i++){
				noOfMessages += parseInt(data[i].messageCount);

				if (noOfMembers.indexOf(data[i].messageSender) === -1){
				noOfMembers.push(data[i].messageSender);
				}
				if (noOfChannels.indexOf(data[i].channelName) === -1){
				noOfChannels.push(data[i].channelName);
				}
				
			}
			document.getElementById("noOfConversations").innerHTML = noOfMessages;
			document.getElementById("noOfUsers").innerHTML = noOfMembers.length;
			document.getElementById("noOfChannels").innerHTML = noOfChannels.length;
			},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log('error', errorThrown);
      }
	});
});
