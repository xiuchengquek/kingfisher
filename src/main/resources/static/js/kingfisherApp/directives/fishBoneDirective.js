/**
 * Created by xiuchengquek on 2/07/15.
 */
/**
 * Created by xiuchengquek on 14/06/15.
 */
angular.module('kingFisherApp')
    .directive('fishbone', function(){
        return {
            scope : {
                'data' : '='
            },

            templateUrl :"js/kingfisherApp/directives/templates/fishboneplot.html",




            link : function(scope, elem, attr){
                function plot(source) {
                    d3.select("fishbone").select("svg").remove();
                    var margin = {top: 40, right: 120, bottom: 20, left: 120},
                        width = 960 - margin.right - margin.left,
                        height = 400 - margin.top - margin.bottom;

                    var i = 0;

                    var tree = d3.layout.tree()
                        .size([height, width]);

                    var diagonal = d3.svg.diagonal()
                        .projection(function(d) { return [d.y, d.x]; });

                    var svg = d3.select("fishboneplot").append("svg")
                        .attr("width", width + margin.right + margin.left)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    // Compute the new tree layout.
                    var nodes = tree.nodes(source).reverse(),
                        links = tree.links(nodes);

                    // Compute the depth of the tree

                    var depths = nodes.map(function(d){ return d.depth });

                    var yMax = d3.max(depths);

                    var yScale = d3.scale.linear()
                        .domain([0, yMax])
                        .range([0, width]);

                    // Normalize for fixed-depth.
                    nodes.forEach(function(d) { d.y = yScale(d.depth); });




                    // Declare the nodes TODO: change to mut name¦
                    var node = svg.selectAll("g.node")
                        .data(nodes, function(d) { return d.id || (d.id = ++i); });

                    // Enter the nodes.
                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function(d) {
                            return "translate(" + d.y + "," + d.x + ")"; });

                    nodeEnter.append("circle")
                        .attr("r", 10)
                        .attr('fill', function(d){
                            return d.cluster.cluster
                        })

                    nodeEnter.append("text")
                        .attr("x", function(d) {
                            return d.children || d._children ? -13 : 13; })
                        .attr("dy", ".35em")
                        .attr("text-anchor", function(d) {
                            return d.children || d._children ? "end" : "start"; })
                        .text(function(d) { return d.mut; })
                        .attr('fill', function(d){
                                return d.cluster.cluster

                        })
                        .attr("transform", function(d) {
                            return "rotate(-65)"
                        });



                    // Declare the links
                    var link = svg.selectAll("path.link")
                        .data(links, function(d) { return d.target.id; });

                    // Enter the links.
                    link.enter().insert("path", "g")
                        .attr("class", "link")
                        .attr("d", diagonal);

                }


                scope.$watch('data', function(newVal){
                    if (newVal !== undefined){
                        plot(newVal)

                    }







                })




            }



        }
    });

