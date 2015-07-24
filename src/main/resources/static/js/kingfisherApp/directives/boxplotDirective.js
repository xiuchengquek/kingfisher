angular.module(['kingFisherApp'])
    .directive('boxplot', function () {
        return {
            scope: {
                data: "="
            },
            templateUrl  : 'js/kingfisherApp/directives/templates/boxplot.html',
            link: function (scope, elem, attr) {

                scope.$watch('data', function (newVal, oldVal) {
                    if (newVal !== undefined) {
                        console.log('this is the newval' , newVal)
                        plotBoxPlot(newVal);
                    }
                });





                function plotBoxPlot(source){


                    var cols  = source.data.shift();
                    var data = new google.visualization.DataTable();
                    var domain = cols.pop();
                    var metrics = cols.slice(-5);
                    var values = cols.slice(0,-5);
                    data.addColumn('string', domain);



                    angular.forEach(values, function(val, idx){
                        data.addColumn('number', val);
                        console.log('this is ', val)

                    });

                    data.addColumn({id:'max', type:'number', role:'interval'});
                    data.addColumn({id:'min', type:'number', role:'interval'});
                    data.addColumn({id:'firstQuartile', type:'number', role:'interval'});
                    data.addColumn({id:'median', type:'number', role:'interval'});
                    data.addColumn({id:'thirdQuartile', type:'number', role:'interval'});
                    data.addRows(source.data);


                    var seriesCol= source.colors.map(function(d){return {color : d}})

                        console.log(seriesCol)


                    var options = {
                        title: 'Box Plot',
                        height: 500,
                        legend: {position: 'none'},
                        hAxis: {
                            gridlines: {color: '#fff'}
                        },
                        lineWidth: 0,
                        series:  [{'color': '#fff'}],
                        intervals: {
                            barWidth: 1,
                            boxWidth: 1,
                            lineWidth: 2,
                            colors:['red','green','red','green','red','green'],

                            style: 'boxes',
                            'ZUNX1_p.K83*' : {
                                'color':'#aec7e8'
                            }
                        },
                        interval: {
                            max: {
                                style: 'bars',
                                fillOpacity: 1,
                                color: '#777'
                            },
                            min: {
                                style: 'bars',
                                fillOpacity: 1,
                                color: '#777'
                            }
                        },

                    }


                    console.log(source.colors)


                    var chart = new google.visualization.LineChart(document.getElementById('box_plot'));
                    chart.draw(data, options);


                    d3.select('#box_plot').selectAll('rect[fill="#bf7300"]').each(function(d,i ){console.log(i);d3.select(this).attr('fill', source.colors[i])})
















                }


            }
        }
    })
