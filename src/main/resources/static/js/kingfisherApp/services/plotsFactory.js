/**
 * Created by xiuchengquek on 25/06/15.
 */




angular.module('kingFisherApp')
    .factory('mutationClusters', function ($rootScope, $q) {

        var nodeProfiles = {};
        var clusters = [];
        var mutationClusters = {};

        mutationClusters.initClusters = function(vafMap){
            var deferred = $q.defer();

            var color = d3.scale.category20().domain(
                Object.keys(vafMap)
            );
            var _clusters = {};
            var _nodeProfiles = {};

            angular.forEach(vafMap, function( value, key){
                console.log(_nodeProfiles)
                _nodeProfiles[key] = color(key);
            });

            angular.forEach(_nodeProfiles, function (value, key) {
                _clusters[value] = _clusters[value] || [];
                _clusters[value].push(key);
            });

            clusters = _clusters;
            nodeProfiles = _nodeProfiles;

            deferred.resolve(clusters);

            return deferred.promise
        };

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
            var ave = sum/arr.length;
            return ave
        };
        return {
            parseBox: function (vafMap, clusters) {

                var clusters = clusters;
                var boxplot = [];
                var order = order;
                if (!clusters) {
                    var color = d3.scale.category20();
                    angular.forEach(vafMap, function (value, key) {
                        this.push({x: key, y: value, members: [key], groupCol: color(key)})
                    }, boxplot)
                }
                else {
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

                    angular.forEach(members, function(value, index){

                        this.push({
                            mut : value , cluster : mutations, cluster_mean :  mean.toFixed(2) }
                        )





                    },table)



                })

                return table;



            },


            parseLine: function (vafMap, timePoint, clusters){

                var dataLong = [];

                angular.forEach(vafMap, function(mutation, name){
                    var color = clusters[name];
                    var Entry = { series : name, values : [] , color : color };
                    angular.forEach(mutation, function(vafScore, index ){
                        Entry.values.push({ x :  timePoint[index],
                            y : parseFloat(vafScore) });
                    });
                    dataLong.push(Entry);
                });
                return dataLong;


            },
        };
        // table is an array of mutations profile for each cluster.
    });




