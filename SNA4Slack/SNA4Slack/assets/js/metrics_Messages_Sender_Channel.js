var team;
if(window.location.href.includes("?teamName")){
    team = window.location.href.substring(window.location.href.indexOf("?")+10);

  }

$( document ).ready(function() {
  var teamName;
	var memberName;
	if(window.location.href.includes("?teamName")){
							console.log(window.location.href)
					var splitURL = window.location.href.split("!")
					console.log('URL 0 IS: '+ splitURL[0])
					console.log('URL 1 IS: '+ splitURL[1])

							teamName = splitURL[0].substring(splitURL[0].indexOf("?")+10);
							console.log(teamName)
							memberName = splitURL[1].substring(splitURL[1].indexOf("m")+11)
							console.log(memberName)
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
      //var memberName = 'carsten'
      console.log(data);


      console.log('Member Name: '+memberName)

      console.log('---------------------------------------')


      var memberChannelMessageMap = {}
      for (var i=0; i<data.messageCount_channel_sender.length; i++){
          if(data.messageCount_channel_sender[i].messageSender == memberName){
            memberChannelMessageMap[data.messageCount_channel_sender[i].channelName] = data.messageCount_channel_sender[i].msgCount
          }
      }

      var contents = []

      for(var i in memberChannelMessageMap) {
        if (memberChannelMessageMap.hasOwnProperty(i)) {
          console.log('Channel is: ' + i + ' --- ' +'Number of Messages are ' + memberChannelMessageMap[i]);

          contents.push({"label": i, "value": memberChannelMessageMap[i], "color":"#14e4b4"})

        }

      }

      console.log(contents)

      var pie = new d3pie("pieChart", {
  "header": {
    "title": {
      "text": "Messages per Channel",
      "fontSize": 20,
      "font": "courier"
    },
    "subtitle": {
      "text": "Member statistics",
      "color": "#999999",
      "fontSize": 10,
      "font": "courier"
    },
    "location": "pie-center",
    "titleSubtitlePadding": 10
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 590,
    "pieInnerRadius": "95%",
    "pieOuterRadius": "70%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content": contents

  },
  "labels": {
    "outer": {
      "format": "label-percentage1",
      "pieDistance": 20
    },
    "inner": {
      "format": "none"
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#999999",
      "fontSize": 11,
      "decimalPlaces": 0
    },
    "value": {
      "color": "#cccc43",
      "fontSize": 11
    },
    "lines": {
      "enabled": true,
      "color": "#777777"
    },
    "truncation": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "colors": {
      "segmentStroke": "#000000"
    }
  },
  "callbacks": {}
});

      },

  });
});
