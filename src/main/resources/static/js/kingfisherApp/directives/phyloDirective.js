'use strict';

angular.module('kingFisherApp')
    .directive('phylogenetic', function () {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            controller: function ($scope, mutationClusters) {
                $scope.selected = [];

                $scope.clearSelection = function () {
                    $scope.selected = [];
                    d3.selectAll('g.leaf.node').classed('selected', false);
                };

                $scope.$on('assignCluster', function(selectedColor){

                    console.log('called')

                    d3.selectAll('g.leaf.node.selected').each(function(d, i){
                        d3.select(this).select('circle').attr('fill', selectedColor)
                    });

                    $scope.clearSelection();
                    $scope.buildCluster();


                })


                this.assignCluster = function (selectedColor) {
                    d3.selectAll('g.leaf.node.selected').each(function(d, i){
                        d3.select(this).select('circle').attr('fill', selectedColor)
                    });

                    $scope.clearSelection();
                    $scope.buildCluster();
                };

                $scope.buildCluster = function() {
                    var clusters = {};

                    d3.selectAll('g.leaf.node circle').each(function (d) {
                        var fill = d3.select(this).attr('fill');
                        clusters[d.name] = fill;
                    });
                    mutationClusters.setClusters(clusters);

                }
            },
            link: function (scope, element, attr) {

                /*
                 d3.phylogram.js
                 Wrapper around a d3-based phylogram (tree where branch lengths are scaled)
                 Also includes a radial dendrogram visualization (branch lengths not scaled)
                 along with some helper methods for building angled-branch trees.

                 Copyright (c) 2013, Ken-ichi Ueda

                 All rights reserved.

                 Redistribution and use in source and binary forms, with or without
                 modification, are permitted provided that the following conditions are met:

                 Redistributions of source code must retain the above copyright notice, this
                 list of conditions and the following disclaimer. Redistributions in binary
                 form must reproduce the above copyright notice, this list of conditions and
                 the following disclaimer in the documentation and/or other materials
                 provided with the distribution.

                 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
                 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
                 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
                 ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
                 LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
                 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
                 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
                 INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
                 CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
                 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
                 POSSIBILITY OF SUCH DAMAGE.

                 DOCUEMENTATION

                 d3.phylogram.build(selector, nodes, options)
                 Creates a phylogram.
                 Arguments:
                 selector: selector of an element that will contain the SVG
                 nodes: JS object of nodes
                 Options:
                 width
                 Width of the vis, will attempt to set a default based on the width of
                 the container.
                 height
                 Height of the vis, will attempt to set a default based on the height
                 of the container.
                 vis
                 Pre-constructed d3 vis.
                 tree
                 Pre-constructed d3 tree layout.
                 children
                 Function for retrieving an array of children given a node. Default is
                 to assume each node has an attribute called "branchset"
                 diagonal
                 Function that creates the d attribute for an svg:path. Defaults to a
                 right-angle diagonal.
                 skipTicks
                 Skip the tick rule.
                 skipBranchLengthScaling
                 Make a dendrogram instead of a phylogram.

                 d3.phylogram.buildRadial(selector, nodes, options)
                 Creates a radial dendrogram.
                 Options: same as build, but without diagonal, skipTicks, and
                 skipBranchLengthScaling

                 d3.phylogram.rightAngleDiagonal()
                 Similar to d3.diagonal except it create an orthogonal crook instead of a
                 smooth Bezier curve.

                 d3.phylogram.radialRightAngleDiagonal()
                 d3.phylogram.rightAngleDiagonal for radial layouts.
                 */

                if (!d3) {
                    throw "d3 wasn't included!"
                }

                d3.phylogram = {};
                d3.phylogram.rightAngleDiagonal = function () {
                    var projection = function (d) {
                        return [d.y, d.x];
                    };

                    var path = function (pathData) {
                        return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
                    };

                    function diagonal(diagonalPath, i) {
                        var source = diagonalPath.source,
                            target = diagonalPath.target,
                            midpointX = (source.x + target.x) / 2,
                            midpointY = (source.y + target.y) / 2,
                            pathData = [source, {x: target.x, y: source.y}, target];
                        pathData = pathData.map(projection);
                        return path(pathData)
                    }

                    diagonal.projection = function (x) {
                        if (!arguments.length) return projection;
                        projection = x;
                        return diagonal;
                    };

                    diagonal.path = function (x) {
                        if (!arguments.length) return path;
                        path = x;
                        return diagonal;
                    };

                    return diagonal;
                };


                // Convert XY and radius to angle of a circle centered at 0,0
                d3.phylogram.coordinateToAngle = function (coord, radius) {
                    var wholeAngle = 2 * Math.PI,
                        quarterAngle = wholeAngle / 4;

                    var coordQuad = coord[0] >= 0 ? (coord[1] >= 0 ? 1 : 2) : (coord[1] >= 0 ? 4 : 3),
                        coordBaseAngle = Math.abs(Math.asin(coord[1] / radius));

                    // Since this is just based on the angle of the right triangle formed
                    // by the coordinate and the origin, each quad will have different
                    // offsets

                    var coordAngle;

                    switch (coordQuad) {
                        case 1:
                            coordAngle = quarterAngle - coordBaseAngle;
                            break;
                        case 2:
                            coordAngle = quarterAngle + coordBaseAngle;
                            break;
                        case 3:
                            coordAngle = 2 * quarterAngle + quarterAngle - coordBaseAngle;
                            break;
                        case 4:
                            coordAngle = 3 * quarterAngle + coordBaseAngle
                    }
                    return coordAngle
                };

                d3.phylogram.styleTreeNodes = function (vis) {

                };

                function scaleBranchLengths(nodes, w) {
                    // Visit all nodes and adjust y pos width distance metric
                    var visitPreOrder = function (root, callback) {
                        callback(root);
                        if (root.children) {
                            for (var i = root.children.length - 1; i >= 0; i--) {
                                visitPreOrder(root.children[i], callback)
                            }
                        }
                    };
                    visitPreOrder(nodes[0], function (node) {
                        node.rootDist = (node.parent ? node.parent.rootDist : 0) + (node.length || 0)
                    });
                    var rootDists = nodes.map(function (n) {
                        return n.rootDist;
                    });
                    var yscale = d3.scale.linear()
                        .domain([0, d3.max(rootDists)])
                        .range([0, w]);
                    visitPreOrder(nodes[0], function (node) {
                        node.y = yscale(node.rootDist)
                    });
                    return yscale
                }


                d3.phylogram.build = function (selector, nodes, clusters,  options) {
                    options = options || {};
                    var w = options.width || d3.select(selector).style('width') || d3.select(selector).attr('width'),
                        h = options.height || d3.select(selector).style('height') || d3.select(selector).attr('height');
                    w = parseInt(w);
                    h = parseInt(h);

                    var tree = options.tree || d3.layout.cluster()
                            .size([h, w])
                            .sort(function (node) {
                                return node.children ? node.children.length : -1;
                            })
                            .children(options.children || function (node) {
                                return node.branchset
                            });
                    var diagonal = options.diagonal || d3.phylogram.rightAngleDiagonal();
                    var vis = options.vis || d3.select(selector).append("svg:svg")
                            .attr("width", w)
                            .attr("height", h)
                            .append("svg:g")
                            .attr("transform", "translate(20,20)");

                    //.attr("transform", "rotate(90,  300, 320)")
                    var nodes = tree(nodes);

                    var yscale = scaleBranchLengths(nodes, w -150);

                    if (!options.skipTicks) {
                        vis.selectAll('line')
                            .data(yscale.ticks(10))
                            .enter().append('svg:line')
                            .attr('y1', 0)
                            .attr('y2', h)
                            .attr('x1', yscale)
                            .attr('x2', yscale)
                            .attr("stroke", "#ddd");

                        vis.selectAll("text.rule")
                            .data(yscale.ticks(10))
                            .enter().append("svg:text")
                            .attr("class", "rule")
                            .attr("x", yscale)
                            .attr("y", 0)
                            .attr("dy", -3)
                            .attr("text-anchor", "middle")
                            .attr('font-size', '8px')
                            .attr('fill', '#ccc')
                            .text(function (d) {
                                return Math.round(d * 100) / 100;
                            });
                    }

                    var nodeType = function (n) {
                        if (n.children) {
                            if (n.depth == 0) {
                                return "root node"
                            } else {
                                return "inner node"
                            }
                        } else {
                            return "leaf node"
                        }
                    };

                    var link = vis.selectAll("path.link")
                        .data(tree.links(nodes))
                        .enter().append("svg:path")
                        .attr("class", "link")
                        .attr("d", diagonal)
                        .attr("fill", "none")
                        .attr("stroke", "#aaa")
                        .attr("stroke-width", "4px");

                    var node = vis.selectAll("g.node")
                        .data(nodes)
                        .enter().append("svg:g")
                        .attr("class", function (d) { return nodeType(d)})
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        })
                        .attr("id", function (d) {
                            return d.name
                        });

                    node.on('click', function (d) {
                        if (d3.select(this).classed("leaf")) {
                            if (d3.select(this).classed("selected")){
                                d3.select(this).classed("selected", false)
                            }
                            else {
                                d3.select(this).classed("selected", true);
                            }
                        }
                    });

                    // add other circle with class other

                    var leafNode = vis.selectAll("g.node.leaf")
                    leafNode.append('svg:circle')
                        .attr("r", 4.5)
                        .attr('fill', function(d){
                            return clusters[d.name]
                        })
                        .attr('stroke', '#369')
                        .attr('stroke-width', '2px')
                        .attr('name', function (d) {
                            return d.name
                        })
                        .attr('class', function (d) {
                            return nodeType (d)
                        });


                    // add text annotating length of each branch
                    vis.selectAll('g.inner.node')
                        .append("svg:text")
                        .attr("dx", -6)
                        .attr("dy", -6)
                        .attr("text-anchor", 'end')
                        .attr('font-size', '8px')
                        .attr('fill', '#ccc')
                        .text(function (d) {
                            return d.length;
                        });

                    // add text for each left
                    vis.selectAll('g.leaf.node').append("svg:text")
                        .attr("dx", 8)
                        .attr("dy", 3)
                        .attr("text-anchor", "start")
                        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
                        .attr('font-size', '10px')
                        .attr('fill', 'black')
                        .text(function (d) {
                            return d.name
                        });
                    return {tree: tree, vis: vis}
                };


                scope.$watch('data', function (newVal) {
                    if (newVal !== undefined) {
                        console.log('this is newval', newVal)
                        var newwickStr = newVal.newick.replace("Newick:", "");
                        var newick = Newick.parse(newwickStr);
                        d3.phylogram.build('#phyloplot', newick, newVal.clusters, {
                            width: 500,
                            height: 320
                        });



                    }

                })

            }
        }
    })


    .directive('phyloInfo', function () {
        return {
            scope : true,
            restrict: 'A',
            require: '^phylogenetic',
            templateUrl : 'js/kingfisherApp/directives/templates/phylo.html',


            link: function (scope, element, attr, phyloCtrl) {


                var inputTag = angular.element(element).find('input')

                function getSelectedColor() {
                    var input = inputTag.spectrum("get");
                    var selectedColor = input.toHexString();
            //        scope.$emit('assignCluster', scope.selectedColor)
                    phyloCtrl.assignCluster(selectedColor);
                }
                inputTag.spectrum({
                    showPaletteOnly: true,
                    togglePaletteOnly: true,
                    togglePaletteMoreText: 'more',
                    togglePaletteLessText: 'less',
                    hideAfterPaletteSelect: true,
                    color: 'blanchedalmond',
                    change: getSelectedColor,
                    palette: [
                        ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
                        ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
                        ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
                        ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
                        ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
                        ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
                        ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
                        ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
                    ]
                })
            }
        }
    });