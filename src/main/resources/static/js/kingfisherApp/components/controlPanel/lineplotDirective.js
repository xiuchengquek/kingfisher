/**
 * Created by xiuchengquek on 19/06/15.
 */

angular.module('kingFisherApp')
    .directive('lineplot', function(d3Helper){
        return {
            restrict : 'E',
            scope : {
                data : '='
            },
            link : function(scope, element, attr){

                function plotline(data, timePoint, vafMap){
                    var margin = {top: 20, right: 20, bottom: 50, left: 50},
                        height = 320 - margin.top - margin.bottom,
                        width = 320 -margin.left - margin.right;

                    //var autoWidth = new d3Helper.autoWidth(element, height, margin, minWidth);
                    //autoWidth.reWidth();

                    var vafMax = d3.max(data, function(d) {return d3.max(d.values, function(v) {return v.vafScore}) ;});
                    var vafMin = d3.min(data, function(d) {return d3.min(d.values, function(v) {return v.vafScore}) ;});

                    var x = d3.scale.ordinal()
                        .domain(timePoint)
                        .rangePoints([0, width]);


                    console.log(timePoint)

                    var y = d3.scale.linear()
                        .domain([vafMax, vafMin])
                        .range([height, 0]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    // need to standardise color scheme between plots,
                    var color = d3.scale.category10()
                        .domain(data.map(function(d){ return d.mutation}));



                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d){ return x(d.timePoint) })
                        .y(function(d){ return y(d.vafScore)});

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

                    var mutations = svg.selectAll(".mutations")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "mutations");


                    mutations.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) { return line(d.values)})
                        .attr("stroke", function(d) { return color(d.mutation)})
                        .attr("fill", "none")
                }


                scope.$watch('data', function(newVal, oldVal){
                    if (newVal.vafMap !== undefined) {
                        var timePoint = newVal.timePoint;
                        var vafMap = newVal.vafMap;
                        var dataLong = [];
                        angular.forEach(vafMap, function(mutation, name){
                            var Entry = { mutation : name, values : [] };
                            angular.forEach(mutation, function(vafScore, index ){
                                Entry.values.push({ timePoint :  timePoint[index],
                                    vafScore : parseFloat(vafScore) });
                            });
                            dataLong.push(Entry)
                        });
                        plotline(dataLong, timePoint);
                    }
                })
            }
        }
    });




