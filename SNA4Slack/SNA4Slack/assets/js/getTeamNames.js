$( document ).ready(function() {
	$.ajax({
		 url: "https://api.mlab.com/api/1/databases/sna4slack/collections/teamnames?apiKey=dPpfbNvB6jRs-hvv-Veb1uVkXnX06Maa",
		 type: 'GET',
         success: function (data) {
			teamNames = document.getElementById('teamNames');
				for(var i = 0 ; i <data[0].teams.length ; i++){
					teamNames.options[teamNames.options.length] = new Option(data[0].teams[i].url.replace('http://',''));
				}
			},
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log('error', errorThrown);
      }
	});
});
$('#search').click( function(e) {e.preventDefault(); document.location.href = "Dashboard.html?teamName="+document.getElementById('teamNames').value.replace(".slackarchive.io",""); return false; } );
