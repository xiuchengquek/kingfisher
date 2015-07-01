angular.module('kingFisherApp').factory('fishPlotFactory', function () {

    var fishPlotAlgo  = {};

    var recursiveFind = function (input, obj) {
        if (input.length !== Object.keys(obj).length) {
            var currentMutation      = input.shift();
            obj[currentMutation.mut] = [];
            angular.forEach(input, function (value) {
                if (currentMutation.score < value.score + 0.001) {
                    obj[currentMutation.mut].push({mut: value.mut, mean: value.mean});
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

    fishPlotAlgo.findPaths = function (input) {
        var results = fishPlotAlgo.findMultiple(input);
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
        return longest
    };

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

    fishPlotAlgo.assemblePath = function (paths) {
        var parentChild = invertParentChild(paths);
        var leafNodes   = _.difference(Object.keys(paths), Object.keys(parentChild));
        var possiblePaths = [];
        angular.forEach(leafNodes, function (value) {
            var leafPath = paths[value];
            leafPath.reverse();
            leafPath.push({mut: value});
            leafPath = leafPath.map(function (d, i, arr) {
                var obj    = {};
                obj.mut    = d.mut;
                var parent = arr[i - 1];
                if (parent) { obj.parent = parent.mut }
                return obj
            });
            possiblePaths.push.apply(possiblePaths, leafPath);
        });
        var unique    = (_.uniq(possiblePaths, function (d) {
            return d.mut
        }));
        return tree(unique)
    };


    return fishPlotAlgo




});


