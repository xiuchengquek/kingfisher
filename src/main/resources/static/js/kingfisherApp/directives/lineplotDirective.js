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
/**
                function plotline(data){
                    console.log(data.length)

                    d3.select("lineplot").select('svg').remove()


                    var margin = {top: 20, right: 20, bottom: 180, left: 50},
                        height = 500 - margin.top - margin.bottom,
                        width = 550 -margin.left - margin.right;

                    var yMax = d3.max(data, function(d) {return d3.max(d.values, function(v) {return v.y}) ;});
                    var yMin = d3.min(data, function(d) {return d3.min(d.values, function(v) {return v.y}) ;});

                    var xDomain  = data[0].values.map(function(d) {return d.x});

                    var x = d3.scale.ordinal()
                        .domain(xDomain)
                        .rangePoints([0, width]);

                    var y = d3.scale.linear()
                        .domain([0, yMax ])
                        .range([height + margin.top, 0 + margin.top]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d){ return x(d.x) })
                        .y(function(d){ return y(d.y)});



                    var svg = d3.select("lineplot").append("svg")
                        .attr("width", width + margin.left +  margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                    // set xAxis

                    var mutations = svg.selectAll(".series")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "series");



                    mutations.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values)})
                        .attr("stroke", function(d) { return  d.color})
                        .attr("fill", "none")
                        .append('svg:title')
                        .text(function(d) {return d.series})


                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + (height + margin.top) + ")")
                        .call(xAxis)
                        .selectAll('text')
                        .style("text-anchor", "end")
                        .style("font-size", "10px")
                        .attr("dy", "0.5em")
                        .attr("dx", "-1em")
                        .attr("transform", function(d) {
                            return "rotate(-65)";
                        });

                    svg.selectAll(".labels")
                        .data(data)
                        .enter().append("g")
                        .attr("transform", "translate(0," + ( height - (data.length * 16 )  + ")"))
                        .append("text")
                        .attr("x", 3)
                        .attr("y", function(d, i) { return i * 1.5  + "em" })
                        .text(function(d) { return d.series; })
                        .attr("stroke", function(d){ return d.color})
                        .attr("fill", function(d){ return d.color})
/**
                    svg.append("text")
                        .attr("x", (width / 2))
                        .attr("y", 0 + (margin.top / 2))
                        .attr("text-anchor", "middle")
                        .style("font-size", "18px")
                        //.style("text-decoration", "underline")
                        .text("VAF Over Time");
**/


/**
                    // set yAxis
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("VAF Score");



                }
            **/

                scope.$watch('data', function(newVal, oldVal){
                    if (newVal !== undefined) {
                        plotline(newVal);
                    }
                })
            }
        }
    });




