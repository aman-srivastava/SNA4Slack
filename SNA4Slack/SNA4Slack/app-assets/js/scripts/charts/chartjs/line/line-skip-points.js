/*=========================================================================================
    File Name: line-skip-point.js
    Description: Chartjs line skip point chart
    ----------------------------------------------------------------------------------------
    Item Name: Robust - Responsive Admin Theme
    Version: 1.2
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

// Line skip point chart
// ------------------------------
$(window).on("load", function(){

    //Get the context of the Chart canvas element we want to select
    var ctx = $("#line-skip-points");

    // Chart Options
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        title:{
            display:true,
            text:'Chart.js Line Chart - Skip Points'
        },
        tooltips: {
            mode: 'label',
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    color: "#f3f3f3",
                    drawTicks: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    color: "#f3f3f3",
                    drawTicks: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Value'
                },
            }]
        }
    };

    // Chart Data
    var chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",

            // Skip a point in the middle
            data: [65, 59, NaN, 81, 56, 55, 40],
            fill: true,
            borderDash: [5, 5],
            backgroundColor: "rgba(29,233,182,.6)",
            borderColor: "#1DE9B6",
            pointBorderColor: "#1DE9B6",
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
        }, {
            label: "My Second dataset",

            // Skip first and last points
            data: [NaN, 48, 40, 19, 86, 27, NaN],
            backgroundColor: "rgba(201,187,174,.4)",
            borderColor: "transparent",
            pointBorderColor: "#C9BBAE",
            pointBackgroundColor: "#FFF",
            pointBorderWidth: 2,
            pointHoverBorderWidth: 2,
            pointRadius: 4,
        }]
    };

    var config = {
        type: 'line',

        options : chartOptions,

        data : chartData
    };

    // Create the chart
    var skipPointChart = new Chart(ctx, config);
});