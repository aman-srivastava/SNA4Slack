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
    "header": {
        "title": {
            "text": "Members Per Channel",
            "fontSize": 22,
            "font": "verdana"
        },
        "subtitle": {
            "text": "Number of Members per Channel",
            "color": "#999999",
            "fontSize": 10,
            "font": "verdana"
        },
        "titleSubtitlePadding": 12
    },
    "footer": {
        "color": "#999999",
        "fontSize": 11,
        "font": "open sans",
        "location": "bottom-center"
    },
    "size": {
        "canvasHeight": 400,
        "canvasWidth": 590,
        "pieOuterRadius": "88%"
    },
    "data": {
        "content": contents

    },
    "labels": {
        "outer": {
            "pieDistance": 32
        },
        "inner": {
            "format": "value"
        },
        "mainLabel": {
            "font": "verdana"
        },
        "percentage": {
            "color": "#e1e1e1",
            "font": "verdana",
            "decimalPlaces": 0
        },
        "value": {
            "color": "#e1e1e1",
            "font": "verdana"
        },
        "lines": {
            "enabled": true,
            "color": "#cccccc"
        },
        "truncation": {
            "enabled": true
        }
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
