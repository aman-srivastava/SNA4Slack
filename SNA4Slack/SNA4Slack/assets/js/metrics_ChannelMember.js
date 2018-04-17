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


    console.log('------------------------------------------')

    var contents = []
    var channelMemberMap = {}
    for( var i = 0; i<data.memberCount_channel.length; i++){
      channelMemberMap[data.memberCount_channel[i].channelName] = data.memberCount_channel[i].memberCount
    }

    for(var i in channelMemberMap) {
      if (channelMemberMap.hasOwnProperty(i)) {
        console.log('Channel is: ' + i + ' --- ' +'Total Members are ' + channelMemberMap[i]);

        contents.push({"label": i, "value": channelMemberMap[i], "color": "#7e3838"})
      }

    }

    console.log(contents)

    var pie = new d3pie("pieChartChannelMember", {

    "size": {
        "canvasHeight": 400,
        "canvasWidth": 470,
        "pieOuterRadius": "80%"
    },
    "data": {
        "content": contents

    },
    "labels": {
		"outer": {
			"format": "label-percentage2"
		},
		"inner": {
			"format": "value"
		},
		"mainLabel": {
			"color": "#000000",
			"fontSize": 12
		},
		"percentage": {
			"color": "#999999",
			"fontSize": 12,
			"decimalPlaces": 1
		},
		"value": {
			"color": "#e1e1e1",
			"font": "verdana"
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
    },
    "misc": {
  		"colors": {
  			"segmentStroke": "#222222"
  		},
  		"gradient": {
  			"enabled": true,
  			"percentage": 0,
  			"color": "#0AABD3"
  		},
    },
    "effects": {
        "pullOutSegmentOnClick": {
            "effect": "back",
            "speed": 400,
            "size": 8
        }
    },
    "callbacks": {}
});


            },

    });
});
