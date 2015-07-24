/**
 * Created by xiuchengquek on 19/06/15.
 */

angular.module('kingFisherApp')
    .directive('lineplot', function(){
        return {
            restrict : 'E',
            scope : {
                data : '='
            },
            link : function(scope, element, attr){
                function plotline(source) {
                    var data = google.visualization.arrayToDataTable(source.data);

                    var options = {

                        legend: { position: 'none' },
                        width: 550,
                        height : 500,
                        chartArea: {top:20, left:100,'width': '80%', 'height': '60%'},
                        hAxis : {
                            title : "Timepoint",
                            titleTextStyle : {
                                fontSize : 18
                            },

                            slantedText:true,
                            slantedTextAngle:60,
                            textStyle : {
                                fontSize : 18
                            }
                        },
                        vAxis : { title : "Variant Allelic Frequency" ,
                                    titleTextStyle : {
                                        fontSize : 18
                                    },

                            textStyle : {
                                fontSize : 18
                            }},

                        pointSize: 12,
                        pointShape: 'square',
                    colors: source.colors

                    };

                    var chart = new google.visualization.LineChart(document.getElementById('linechart'));

                    chart.draw(data, options);
                }
                scope.$watch('data', function(newVal, oldVal){
                    if (newVal !== undefined) {
                        plotline(newVal);
                    }
                })
            }
        }
    });




