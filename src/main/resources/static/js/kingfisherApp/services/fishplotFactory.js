/**
 * Created by xiuchengquek on 29/06/15.
 */



angular.module('kingFisherApp')
    .factory('fishPlotFactory', function () {

        var fishPlotTreeMaker = {};


        fishPlotTreeMaker.checkBranches = function (obj) {
            var branches = []

            angular.forEach(obj, function (value, key) {
                this.push(value.map(function (val, idx, arr) {
                    if (arr[idx + 1]) {
                        if (val.score > arr[idx + 1]['score']) {
                            return {"timePoint": key, "mut": val.mut, "conflict": arr[idx + 1]['mut']}
                        }
                    }
                }).filter(function (v) {
                    return v !== undefined
                }))

            }, branches)

            branches = branches.filter(function (v) {
                return v.length !== 0
            })


            return _.flatten(branches)

        };

        var removeDuplicateTime = function (branches) {
            var groupedByMut = _.groupBy(branches, function (d) {
                return d.mut
            })
            groupedByMut = _.mapValues(groupedByMut, function (d) {
                return _.first(d)
            })

            return groupedByMut
        };


        fishPlotTreeMaker.removeDamaged = function (obj, branch) {

            angular.forEach(branch, function (value, index) {
                var mutScore = this[value.timePoint];
                mutScore = mutScore.filter(function (x) {
                    return x.mut !== value.mut
                });
                this[value.timePoint] = mutScore;
            }, obj);

            return obj
        }

        fishPlotTreeMaker.recursiveTrimmed = function (obj, branches) {
            var flattenBranches = fishPlotTreeMaker.checkBranches(obj);

            if (flattenBranches.length !== 0) {
                var cleared = fishPlotTreeMaker.removeDamaged(obj, flattenBranches);
                branches.push(flattenBranches);
                fishPlotTreeMaker.recursiveTrimmed(cleared, branches);
            }

            return removeDuplicateTime(_.flatten(branches))
        };


        fishPlotTreeMaker.constructTree = function (obj, conflict) {

            angular.forEach(obj, function (value, key) {


            })
        }







        return {
            fishPlotTreeMaker : fishPlotTreeMaker
        }





        // table is an array of mutations profile for each cluster.
    });




