angular.module('kingFisherApp').factory('fishPlotFactory', function () {
    var fishPlotAlgo  = {};


    // function that do pairwise comparision to ensure that the mutations are ordered according to their vaf score.
    var recursiveFindNew = function(input, obj){

        if (input.length !== Object.keys(obj).length) {
            var currentMutation = input.shift();
            obj[currentMutation.cluster] = [];
            angular.forEach(input, function (value) {
                // if score is smaller than the next score, then the next member must one of parent of the current mutation
                if (currentMutation.score < value.score){
                    obj[currentMutation.cluster].push(value.cluster)
                }
                // sometimes they might have the same score, but they are a different group, in this case we give them
                // alphabetical order
                else if (currentMutation.score === value.score && currentMutation.cluster > value.cluster){
                    obj[currentMutation.cluster].push(value.cluster)
                }
            });
            input.push(currentMutation);
            recursiveFindNew(input, obj)
        }
        return obj

    };

    // Exposing this function for unit testing.
    fishPlotAlgo.findMultiple = function (input) {
        var results = {};

        angular.forEach(input, function (value, key) {
            this[key] = recursiveFind(value, {})
        }, results);
        return results
    };


    fishPlotAlgo.findMultipleNew = function (input) {
        var results = [];
        var mergedPaths = {};

        angular.forEach(input, function (value, key) {
            this.push(recursiveFindNew(value, {}))
        }, results);

        angular.forEach(results, function(value, index){
            angular.forEach(value, function(val, key){
                mergedPaths[key] = mergedPaths[key] || [];
                mergedPaths[key].push(val);
            })
        });
        return mergedPaths
    };


    fishPlotAlgo.findShortest = function(paths) {

        var shortestPath = {};

        angular.forEach(paths, function (value, mutation) {
            angular.forEach(value, function (val) {
                if (shortestPath[mutation]) {
                    if (shortestPath[mutation].length > val.length) {
                        shortestPath[mutation] = val
                    }
                }
                else {
                    console.log(val)
                    shortestPath[mutation] = val;
                }
            })
        });
        console.log('shortest path', shortestPath)
        return shortestPath
    };


    fishPlotAlgo.assemblePathNew = function(paths){
        console.log(paths)

        var parentChild = invertParentChildNew(paths);
        console.log(paths)
        var leafNodes   = _.difference(Object.keys(paths), Object.keys(parentChild));
        var possiblePaths = [];
        console.log('this is leaf nodes', leafNodes)
        // reconstruct path
        angular.forEach(leafNodes, function (value) {
            var leafPath = paths[value];

            console.log(leafPath)

            leafPath.push(value);
            leafPath = leafPath.map(function (d, i, arr) {
                var obj    = {};
                obj.mut    = d;
                var parent = arr[i - 1];
                if (parent) { obj.parent = parent }
                return obj
            });
            possiblePaths.push.apply(possiblePaths, leafPath);
        });

        var unique    = (_.uniq(possiblePaths, function (d) {
            return d.mut
        }));
        return unique
    };


    //function that do the following 1) find branching paths and assemble them according to their length.
    fishPlotAlgo.findPaths = function (input) {
        var results = fishPlotAlgo.findMultiple(input);
        console.log(results)
        var longest = {};
        angular.forEach(results, function (value) {
            angular.forEach(value, function (tree, mutation) {
                if (longest[mutation]) {
                    if (longest[mutation].length > tree.length) {
                        longest[mutation] = tree
                    }
                }
                else {
                    longest[mutation] = tree;
                }
            })
        });
        console.log('this is lognest', longest)
       return longest
    };

    fishPlotAlgo.constructTreeNew = function (nodes) {
        console.log(nodes)
        var nodesByMut = _.indexBy(nodes, 'mut');
        console.log('this is', nodesByMut)

        angular.forEach(nodes, function (d) {
            if (d.parent) {
                var parent = nodesByMut[d.parent];
                if (parent.children) {
                    parent.children.push(d)
                }
                else parent.children = [d];
            }
        });
        return nodes[0]

    };
    function invertParentChildNew(childParent){


        var parentChild = {};
        angular.forEach(childParent, function (value, key) {
            angular.forEach(value, function (parent) {
                parentChild[parent] = parentChild[parent] || [];
                parentChild[parent].push(key)
            })
        });
        return parentChild





    }

    // invert parent child relationship
    function invertParentChild(childParent) {

        var parentChild = {};
        angular.forEach(childParent, function (value, key) {
            angular.forEach(value, function (parent) {
                parentChild[parent.mut] = parentChild[parent.mut] || [];
                parentChild[parent.mut].push(key)
            })
        });
        return parentChild
    }

    function tree(nodes) {
        var nodesByMut = _.indexBy(nodes, 'mut');
        angular.forEach(nodes, function (d) {
            if (d.parent) {
                var parent = nodesByMut[d.parent];
                if (parent.children) {
                    parent.children.push(d)
                }
                else parent.children = [d];
            }
        });
        return nodes[0]

    }


   fishPlotAlgo.assemblePath = function (paths, clusters, input) {
        var parentChild = invertParentChild(paths);
        var leafNodes   = _.difference(Object.keys(paths), Object.keys(parentChild));

       console.log(leafNodes)

        var possiblePaths = [];

        angular.forEach(leafNodes, function (value) {
            var leafPath = paths[value];

           // leafPath.push({mut: value , cluster : clusters[value]});


            leafPath.push({mut: value , cluster : clusters[value]})


            leafPath = leafPath.map(function (d, i, arr) {
                //var obj    = {};
                //obj.mut    = d.mut;
                var parent = arr[i - 1];

                if (parent) { d.parent = parent.mut;
                }

                d.cluster = clusters[d.mut];
                return d
            });
            possiblePaths.push.apply(possiblePaths, leafPath);
        });

        var unique    = (_.uniq(possiblePaths, function (d) {
            return d.mut
        }));

        unique = unique.map(function(d){return _.omit(d, 'score')});
        return tree(unique)
    };


    fishPlotAlgo.parseFishBone = function(input){
        var path = fishPlotAlgo.findMultipleNew(input, {});
        var shortestPath = fishPlotAlgo.findShortest(path);
        var assembledPath = fishPlotAlgo.assemblePathNew(shortestPath);
        var tree = fishPlotAlgo.constructTreeNew(assembledPath);
        return tree
    };


    fishPlotAlgo.constructTree = function(input) {
        var paths = fishPlotAlgo.findPaths(input.value);
        var tree = fishPlotAlgo.assemblePath(paths, input.nodeProfile)
        return tree
    };


    function parseFishPlot(input, timePoint, nodes){

        var results = [];
        var startScore = null;
        nodes = nodes.map(function(d) {d.depth = parseInt(d.depth); return d});
        var depths = nodes.map(function(d) { return d.depth});
        // find the number of layers in the cluster
        var branchingDepth = (_.filter(_.countBy(depths, _.identity), function(v, k) { return v > 1   }));

        angular.forEach(timePoint, function(value, idx){
            // retrieve all information regarding time point data
            var adjustedData = {};
            var data = input[value];
            var max  = d3.max(data, function(d){ return d.score });

            angular.forEach(data, function(obj){
                // divide each time point with the start
                obj.adjustedEndFactor  =  Math.floor(((obj.score / max)*100))/100;
                var nodeObj = nodes.filter(function(d){ return d.mut == obj.cluster})[0];
                obj.depth = nodeObj.depth;

                if(idx === 0){
                    obj.adjustedStartFactor = null;
                    if ( branchindDepth === obj.depth) {
                        obj.branching = true;
                    }
                }
                else {
                    var arr = results[idx-1]['values'];
                    var previousObj = arr.filter(function(d){ return d.cluster === obj.cluster })[0];
                    obj.adjustedStartFactor = previousObj.adjustedEndFactor;
                }
            });
            adjustedData['timePoint']  = value;
            adjustedData['startScore'] = startScore
            adjustedData['endScore'] = max;
            adjustedData['values'] = data;
            startScore = max;
            results.push(adjustedData)
        });

        return results
    }


    fishPlotAlgo.addGroupMembers = function(nodes, clusters, data){
        var clusterScore = {};
        angular.forEach(data, function(value, key){
            angular.forEach(value, function(val, idx){
                clusterScore[val.cluster]  = clusterScore[val.cluster] || {};
                clusterScore[val.cluster][key] = val.score ;
            });
        });

        angular.forEach(nodes, function(value, idx){
            var members = clusters[value.mut];
            value.members = members;
            value.score = clusterScore[value.mut]
        })
    };

    fishPlotAlgo.addBranchingEvents = function(nodes){
        console.log(nodes)


        var depths = nodes.map(function(d) { return d.depth});
        // find the number of layers in the cluster

        var branchingDepth = [];

        angular.forEach(_.countBy(depths, _.identity), function(value, key){
            if (value > 1){  this.push(Number(key))}
        }, branchingDepth);

        var depthCounter =  {};



        angular.forEach(nodes, function(value, idx){
            if ( branchingDepth.indexOf(value.depth) !== -1 ){


                depthCounter[value.depth] = depthCounter[value.depth] || 0;
                value.branching = true;
                value.branchingOrder =  depthCounter[value.depth]
                depthCounter[value.depth]++

            }
        })


    };

    // functino not in used yet, trying altnernative methdos.
    fishPlotAlgo.adjustScore = function(data) {
        angular.forEach(data, function(value, index){

            if(value.children) {

                var scoreTotal = value.children.reduce(function (preV, curV, idx, arr) {
                    var val = {};
                    angular.forEach(curV, function (score, key) {
                        val.key = preV[key] + score
                    })
                    return val

                })

                value.children.map(function(d){
                    anuglar.forEach(d.score, function(val, key){
                        d.score[key] = Math.floor((val * value.score[key] / scoreTotal[key]) * 100 ) / 100;
                    })
                })
            }
        })
    };



    fishPlotAlgo.parseFishPlotNew = function(input, clusters, timePoint){
        var data = angular.copy(input);
        var tree = d3.layout.tree();
        var nodes = fishPlotAlgo.parseFishBone(data);
        nodes =  tree.nodes(nodes);







        fishPlotAlgo.addGroupMembers(nodes, clusters, data);

        var depthCounter = {};

        nodes = nodes.sort(function(a,b) { return a.score[timePoint[0]] - b.score[timePoint[0]]})
        angular.forEach(nodes, function(value, idx){

            depthCounter[nodes.depth] = depthCounter[nodes.depth] || 0;
            nodes.branchingOrder = depthCounter[nodes.depth];
            depthCounter[nodes.depth] ++




        });
        nodes = _.sortBy(nodes, 'depth')



        fishPlotAlgo.addBranchingEvents(nodes);
        return nodes

    };


    // timePoint is required to ensure that the data are always in order since keys in objects do not guarentee order
    fishPlotAlgo.parseFishPlot = function(input, timePoint){
        // copy first to prevent mixed up
        var data = angular.copy(input);
        var tree = d3.layout.tree();
        var nodes = fishPlotAlgo.parseFishBone(data);
        nodes =  tree.nodes(nodes);
        console.log(nodes)
        return parseFishPlot(data, timePoint, nodes);
    };



    return fishPlotAlgo
});




