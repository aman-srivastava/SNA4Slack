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



      console.log('------------------------------------------')

    var contents = []
    var channelsMessagesMap = {}
	
    for(var i = 0 ; i<data.messageCount_channel.length ; i++){
      channelsMessagesMap[data.messageCount_channel[i].channelName] = data.messageCount_channel[i].msgCount
    }
    for(var i in channelsMessagesMap) {
      if (channelsMessagesMap.hasOwnProperty(i)) {
        console.log('Channel is: ' + i + ' --- ' +'Total Messages are ' + channelsMessagesMap[i]);
        contents.push({"label": i, "value": channelsMessagesMap[i], "color": "#dd8d11"})
	
      }

    }

    var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "Channels",
			"color": "#000000",
			"fontSize": 50
		},
		"subtitle": {
			"text": "Total Messages",
			"color": "#b80000"
		},
		"location": "pie-center",
		"titleSubtitlePadding": 3
	},
	"footer": {
		"text": "Channel-Message Pie Chart",
		"color": "#e81414",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasWidth": 590,
		"pieOuterRadius": "83%"
	},
	"data": {
		"sortOrder": "label-desc",
		"content": contents 
	},
	"labels": {
		"outer": {
			"format": "label-percentage2"
		},
		"inner": {
			"format": "none"
		},
		"mainLabel": {
			"color": "#e41111",
			"fontSize": 11
		},
		"percentage": {
			"color": "#999999",
			"fontSize": 11,
			"decimalPlaces": 5
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
	"effects": {
		"load": {
			"speed": 1030
		},
		"pullOutSegmentOnClick": {
			"effect": "elastic",
			"speed": 400,
			"size": 8
		}
	},
	"misc": {
		"colors": {
			"segmentStroke": "#222222"
		},
		"gradient": {
			"enabled": true,
			"percentage": 47,
			"color": "#a0123d"
		},
		"pieCenterOffset": {
			"x": 15,
			"y": 15
		}
	},
	"callbacks": {}
});

    
			},

	});
});

