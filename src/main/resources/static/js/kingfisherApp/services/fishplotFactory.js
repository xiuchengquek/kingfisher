angular.module('kingFisherApp').factory('fishPlotFactory', function () {
    var fishPlotAlgo  = {};


    // function that do pairwise comparision to ensure that the mutations are ordered according to their vaf score.
    var recursiveFind = function (input, obj) {
        if (input.length !== Object.keys(obj).length) {
            var currentMutation      = input.shift();
            obj[currentMutation.mut] = [];
            angular.forEach(input, function (value) {
                // if score is smaller than the next score, then the next member must one of parent of the current mutation
                if (currentMutation.score < value.score){
                    obj[currentMutation.mut].push(value)
                }
                // sometimes they might have the same score, but they are a different group, in this case we give them
                // alphabetical order
                else if (currentMutation.score === value.score && currentMutation.group !== value.group
                    && currentMutation.mut > value.mut){
                    obj[currentMutation.mut].push(value)
                }

            });
         // sometimes they are the same group, if they are the same group then we  sort them but their group orderr.

         angular.forEach(input, function(value){
            if (currentMutation.group ===  value.group && currentMutation.groupOrd < value.groupOrd){
                   obj[currentMutation.mut].push(value)
               }
            });

            input.push(currentMutation);
            recursiveFind(input, obj)
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


    fishPlotAlgo.constructTree = function(input) {
        var paths = fishPlotAlgo.findPaths(input.value);
        var tree = fishPlotAlgo.assemblePath(paths, input.nodeProfile)
        return tree
    }

    return fishPlotAlgo
});




