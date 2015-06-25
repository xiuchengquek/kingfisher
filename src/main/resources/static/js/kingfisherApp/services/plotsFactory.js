/**
 * Created by xiuchengquek on 25/06/15.
 */




angular.module('kingFisherApp')
    .factory('mutationClusters', function ($rootScope) {

        var nodeProfiles = {};
        var clusters = [];
        var mutationClusters = {};

        mutationClusters.setClusters = function (newCluster) {
            angular.forEach(newCluster, function(fill, name){
                nodeProfiles[name] = fill;
            });

            var _clusters = {};
            angular.forEach(nodeProfiles, function (value, key) {
                _clusters[value] = _clusters[value] || [];
                _clusters[value].push(key);
            });

            clusters = _clusters;
            $rootScope.$broadcast('clusterChanged')
        };

        mutationClusters.getClusters = function () {
            return clusters
        };

        mutationClusters.getNodeProfile = function () {
            return nodeProfiles
        };
        return mutationClusters
    })
    .factory('plotParsers', function () {


        var findMean = function(arr) {
            var sum = arr.reduce(function(a,b){return parseFloat(a) + parseFloat(b) });
            console.log('this is the sum' ,sum)
            var ave = sum/arr.length;
            return ave
        };
        return {
            parseBox: function (vafMap, clusters) {


                console.log('wtf' , vafMap, clusters)


                var clusters = clusters;
                var boxplot = [];
                var order = order;
                if (!clusters) {
                    var color = d3.scale.category20();
                    angular.forEach(vafMap, function (value, key) {
                        console.log('value and key', value, key)
                        this.push({x: key, y: value, members: [key], groupCol: color(key)})
                    }, boxplot)
                }
                else {


                    console.log('fucka  dgo')
                    var clusterNo = 1;
                    var mutations = Object.keys(clusters);
                    angular.forEach(mutations, function (mutations, index) {
                        // get the member
                        var clusterName;
                        var members = clusters[mutations];
                        // get the value of each members
                        var membersScore = members.map(function (v) {
                            return vafMap[v]
                        });
                        var merged = []

                        console.log(membersScore)
                        // flatten array of array - this will be the y value
                        merged = membersScore.concat.apply(merged, membersScore);

                        // new Cluster name
                        // create new cluster name and push value into
                        if (members.length == 1) {
                            clusterName = members
                        } else {
                            clusterName = 'cluster ' + clusterNo;
                            clusterNo++
                        }
                        this.push({x: clusterName, y: merged, members: members, groupCol: mutations})
                    }, boxplot);
                }


                return boxplot;
            },

            // parse vaf map and cluster info into a json array with each row containing
            // ({x: clusterName, y: merged, members: members, groupCol: mutations, mean : mean})
            parseTable: function (vafMap, clusters) {


                var table = [];
                var mutations = Object.keys(clusters);

                angular.forEach(mutations, function (mutations, index) {
                    // get the member
                    var members = clusters[mutations];
                    // get the value of each members
                    var membersScore = members.map(function (v) {
                        return vafMap[v]
                    });

                    // transpose array

                    var tMemberScore = membersScore[0].map(function (col, i) {
                        return membersScore.map(function (row) {
                            return row[i]
                        })
                    });

                    // now find the median of each time point
                    var tMemberScore = tMemberScore.map(findMean);

                    // now remerge
                    var merged = [];
                    var merged = membersScore.concat.apply(merged, tMemberScore);

                    var mean = findMean(merged);


                    // new Cluster name
                    var clusterNo = index + 1;
                    // create new cluster name and push value into
                    var clusterName = 'cluster ' + clusterNo;
                    if (members.length == 1) {
                        clusterName = members
                    }

                    this.push({
                        x: clusterName, y: merged, members: members,
                        groupCol: mutations, mean: mean
                    })

                }, table)
            }
        }

        // table is an array of mutations profile for each cluster.



    })

