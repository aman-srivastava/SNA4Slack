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
//      console.log('------------------------------------------')

    var contents = []
    var channelsMessagesMap = {}

    for(var i = 0 ; i<data.messageCount_channel.length ; i++){
      channelsMessagesMap[data.messageCount_channel[i].channelName] = data.messageCount_channel[i].msgCount
    }
    for(var i in channelsMessagesMap) {
      if (channelsMessagesMap.hasOwnProperty(i)) {
        contents.push({"label": i, "value": channelsMessagesMap[i], "color": "#dd8d11"})

      }

    }

    var pie = new d3pie("pieChartChannelMessage", {

	"size": {
		"canvasWidth": 470,
		"canvasHeight": 400,
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
			"color": "#e41111",
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
			"percentage": 0,
			"color": "#d74338"
		},
	},
	"callbacks": {}
});


			},

	});
});
