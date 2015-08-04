'use strict';




angular.module('kingFisherApp')
    .directive('phylogenetic', function () {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },

            templateUrl: "js/kingfisherApp/directives/templates/phylo.html",
            controller: function ($scope, mutationClusters) {
                $scope.selected = [];
                $scope.treeWidth = 300;
                $scope.cutoff = 5 ;

                $scope.rangeChange = function(){
                    $scope.$broadcast('cutOffChanged', $scope.cutoff/10)
                };

                $scope.clearSelection = function () {
                    $scope.selected = [];
                    d3.selectAll('g.leaf.node').classed('selected', false);
                };

                this.assignCluster = function (selectedColor) {
                    d3.selectAll('g.leaf.node.selected').each(function (d, i) {
                        d3.select(this).select('circle').attr('fill', selectedColor);
                        d3.select(this).select("text").transition()
                            .duration(750)
                            .attr("x", 0)
                            .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')

                            .style("font-size", "14px")
                            .style("font-style", "regular");

                        d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", 8);
                    });
                    $scope.clearSelection();
                    $scope.buildCluster();
                };

                $scope.buildCluster = function () {
                    var clusters = {};
                    d3.selectAll('g.leaf.node circle').each(function (d) {
                        var fill         = d3.select(this).attr('fill');
                        clusters[d.name] = fill;
                    });
                    mutationClusters.setClusters(clusters);

                };
                this.setClusters = mutationClusters.setClusters;





            },
            link: function (scope, element, attr, ctrl) {



                // parameters to share between the slider and the tree.
                var treeYScale, nodeDistMax, nodesGlobal;

                function flattenTree(arr, depth, clusters, direction){
                    var group = direction + "_" + depth;
                    angular.forEach(arr, function(val, idx){
                        clusters[val] = group
                    });
                    return clusters
                }

                function inferTree (branches){
                    var clusters = {};
                    angular.forEach(branches, function(value, key){
                        var leftNode = value[0];
                        var rightNode = value[1];
                        var depth = value['depth'];
                        flattenTree(leftNode, key, clusters, 'left');
                        flattenTree(rightNode, key, clusters, 'right');


                    });
                    return clusters;
                }


                scope.$on('cutOffChanged', function(event, val){
                    var cutoff = val * nodeDistMax;
                    var children = {};
                    // change cut off line
                    d3.select('line#cutoff').transition()
                            .duration(750)
                            .attr("x1", treeYScale(cutoff))
                            .attr("x2", treeYScale(cutoff));
                    // change node color infomation
                    var parents = nodesGlobal.filter(function(d) {
                        return d.branchset && d.rootDist <= cutoff
                    });


                  //  parents = parents.filter(function(d) {return d.depth !== 0 });
                function findChildren(node, arr){
                    for (var i = 0; i < node.length; i++){
                        var currentNode = node[i]
                        if (currentNode.branchset){
                            findChildren(currentNode.branchset, arr)
                        }
                        else {
                            arr.push(currentNode.name)
                        }
                    }
                }

                angular.forEach(parents, function(d, idx){
                    children[idx] ={};
                    angular.forEach(d.branchset, function(bs, i){
                        var arr = [];
                        if (bs.branchset) {
                            findChildren(bs.branchset, arr);
                            children[idx][i] =  arr
                        }else {
                            children[idx][i] = [bs.name]
                        }
                        children[idx]['depth'] = bs.depth;
                        });
                    },children);


                    var nodeProfiles = inferTree(children);
                    var color = d3.scale.category10().domain(_.values(nodeProfiles));

                    var clusters ={}

                    angular.forEach(nodeProfiles, function(value, key){
                        var clusterCol = color(value);
                        nodeProfiles[key] = clusterCol;
                    });

                    ctrl.setClusters(nodeProfiles)


                    d3.selectAll("g.node.leaf circle").each(function(d){
                        d3.select(this)
                            .attr('fill', function(d) { return nodeProfiles[d.name]})
                    })





                });


                d3.phylogram = {};
                d3.phylogram.rightAngleDiagonal = function () {
                    var projection = function (d) {
                        return [d.y, d.x];
                    };

                    var path = function (pathData) {
                        return "M" + pathData[0] + ' ' + pathData[1] + " " + pathData[2];
                    };

                    function diagonal(diagonalPath, i) {
                        var source    = diagonalPath.source,
                            target    = diagonalPath.target,
                            midpointX = (source.x + target.x) / 2,
                            midpointY = (source.y + target.y) / 2,
                            pathData  = [source, {x: target.x, y: source.y}, target];
                        pathData      = pathData.map(projection);
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
                    var rootDists     = nodes.map(function (n) {
                        return n.rootDist;
                    });
                    var yscale        = d3.scale.linear()
                        .domain([0, d3.max(rootDists)])
                        .range([0, w]);
                    visitPreOrder(nodes[0], function (node) {
                        node.y = yscale(node.rootDist)
                    });
                    return yscale
                }


                d3.phylogram.build = function (selector, nodes, clusters, options) {
                    options = options || {};
                    var w   = options.width || d3.select(selector).style('width') || d3.select(selector).attr('width'),
                        h   = options.height || d3.select(selector).style('height') || d3.select(selector).attr('height');
                        w   = parseInt(w);
                        h   = parseInt(h);

                    var tree = d3.layout.cluster()
                            .size([h, w])
                            .sort(function (node) {
                                return node.children ? node.children.length : -1;
                            })
                            .children(options.children || function (node) {
                                return node.branchset
                            });

                    var diagonal = options.diagonal || d3.phylogram.rightAngleDiagonal();
                    var vis = d3.select(selector).append("svg:svg")
                                .attr("width", w)
                                .attr("height", h)
                                .append("svg:g")
                                .attr("transform", "translate(20,20)");

                    var nodes = tree(nodes);

                    nodesGlobal = nodes;

                    var yscale = scaleBranchLengths(nodes, w - 200);

                    treeYScale = yscale;

                    var rootDists     = nodes.map(function (n) {
                        return n.rootDist;
                    });

                    vis.selectAll('line')
                        .data(yscale.ticks(10))
                        .enter().append('svg:line')
                        .attr('y1', 0)
                        .attr('y2', h)
                        .attr('x1', yscale)
                        .attr('x2', yscale)
                        .attr("stroke", "#ddd");


                    nodeDistMax = d3.max(rootDists)

                    var cutoff = yscale(nodeDistMax / 2 )

                    vis.append('svg:line')
                       .attr('id', 'cutoff')
                       .attr('y1', 0)
                       .attr('y2', h)
                       .attr('x1', cutoff)
                       .attr('x2', cutoff)
                       .attr("stroke", "#369");


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

                    // function to check if node if leaf or inner node
                    var nodeType = function (n) {
                        if (n.children) {
                            if (n.depth === 0) {
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
                        .attr("id", function (d) { return d.name })
                        .attr("fill", "none")
                        .attr("stroke", "#aaa")
                        .attr("stroke-width", "4px");

                    var node = vis.selectAll("g.node")
                        .data(nodes)
                        .enter().append("svg:g")
                        .attr("class", function (d) {
                            return nodeType(d)
                        })
                        .attr("transform", function (d) {
                            return "translate(" + d.y + "," + d.x + ")";
                        })
                        .attr("id", function (d) {
                            return d.name
                        });


                    // Cut tree by height
                    var treeCutLine = vis.selectAll("g.cutoff")
                        .data([{x1: 100, x2: 100, y1: 10, y2: 300}])
                        .enter().append('line')
                        .attr("x1", function (d) { return d.x1 })
                        .attr("x2", function (d) { return d.x2 })
                        .attr("y1", function (d) { return d.y1 })
                        .attr("y2", function (d) { return d.y2 });

                    // Cluster by clicking nodes
                    function click() {
                        if (d3.select(this).classed("leaf")) {
                            if (d3.select(this).classed("selected")) {
                                d3.select(this).classed("selected", false)
                                d3.select(this).select("text").transition()
                                    .duration(750)
                                    .attr("x", 0)

                                    .style("font-size", "14px")
                                    .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')

                                    .style("font-style", "regular");

                                d3.select(this).select("circle").transition()
                                    .duration(750)
                                    .attr("r", 8);
                            }
                            else {
                                d3.select(this).select("text").transition()
                                    .duration(750)
                                    .attr("x", 11)
                                    .style("font-size", "18px")
                                    .style("font-style", "bold");

                                d3.select(this).select("circle").transition()
                                    .duration(750)
                                    .attr("r", 10);
                                d3.select(this).classed("selected", true);
                            }
                        }
                    }

                    node.on('click', click);

                    var leafNode = vis.selectAll("g.node.leaf")
                    leafNode.append('svg:circle')
                        .attr("r", 8)
                        .attr('fill', function (d) {
                            return clusters[d.name]
                        })
                        .attr('stroke', '#369')
                        .attr('stroke-width', '2px')
                        .attr('name', function (d){ return d.name })
                        .attr('class', function (d) { return nodeType(d) });


                    // add text annotating length of each branch
                    vis.selectAll('g.inner.node')
                        .append("svg:text")
                        .attr("dx", -6)
                        .attr("dy", -6)
                        .attr("text-anchor", 'end')
                        .attr('font-size', '12px')
                        .attr('fill', '#ccc')
                        .text(function (d) { return d.length });

                    // add text for each left
                    vis.selectAll('g.leaf.node').append("svg:text")
                        .attr("dx", 12)
                        .attr("dy", 3)
                        .attr("text-anchor", "start")
                        .attr('font-family', 'Helvetica Neue, Helvetica, sans-serif')
                        .attr('font-size', '14px')
                        .attr('fill', 'black')
                        .text(function (d) { return d.name });
                };


                scope.$watch('data.clusters', function (newVal) {
                    if (newVal !== undefined) {
                        var newwickStr = scope.data.newick.replace("Newick:", "");
                        var newick     = Newick.parse(newwickStr);
                        var maxTree = d3.max(newick, function(d){ return d.target.length});
                        d3.phylogram.build('#phyloplot', newick, scope.data.clusters, {
                            width: 500,
                            height: 320
                        });
                    }
                });


            }
        }
    })


    .directive('phyloInfo', function () {
        return {
            scope: true,
            restrict: 'A',
            require: '^phylogenetic',
            template: '<label for="colorpicker">Click for color palette :    </label><input name="colorpicker"/>',


            link: function (scope, element, attr, phyloCtrl) {


                var inputTag = angular.element(element).find('input')

                function getSelectedColor() {
                    var input         = inputTag.spectrum("get");
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
