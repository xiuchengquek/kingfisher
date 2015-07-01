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

                function plotline(data){
                    var margin = {top: 20, right: 20, bottom: 50, left: 50},
                        height = 320 - margin.top - margin.bottom,
                        width = 320 -margin.left - margin.right;

                    //var autoWidth = new d3Helper.autoWidth(element, height, margin, minWidth);


                    //autoWidth.reWidth();

                    var yMax = d3.max(data, function(d) {return d3.max(d.values, function(v) {return v.y}) ;});
                    var yMin = d3.min(data, function(d) {return d3.min(d.values, function(v) {return v.y}) ;});

                    var xDomain  = data[0].values.map(function(d) {return d.x});

                    var x = d3.scale.ordinal()
                        .domain(xDomain)
                        .rangePoints([0, width]);

                    var y = d3.scale.linear()
                        .domain([0, yMax ])
                        .range([height, 0]);

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
                        .attr("height", height + margin.left + margin.right)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                    // set xAxis
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

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

                    var mutations = svg.selectAll(".series")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "series");


                    mutations.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values)})
                        .attr("stroke", function(d) { return  d.color})
                        .attr("fill", "none")

                    mutations.append("text")
                        .datum(function(d){ return { series : d.series, color : d.color}})
                        .attr("x", 3)
                        .attr("y", function(d, i) { return i + "em" })
                        .text(function(d) { return d.series; })
                        .attr("stroke", function(d){ return d.color})
                        .attr("fill", function(d){ return d.color});

                }

                scope.$watch('data', function(newVal, oldVal){
                    if (newVal !== undefined) {
                        plotline(newVal);
                    }
                })
            }
        }
    });




