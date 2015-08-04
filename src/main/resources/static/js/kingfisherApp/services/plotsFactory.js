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

            var color = d3.scale.category10().domain(
                Object.keys(vafMap)
            );
            var _clusters = {};
            var _nodeProfiles = {};

            angular.forEach(vafMap, function( value, key){
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
            return Number(ave.toFixed(2));
        };


        function parseBox(vafMap, clusters){
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
                    var merged = [];


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
        };


        function parseNewTree (vafMap, clusters) {
            var treeData = [];

            // get average of each cluster
            angular.forEach(clusters, function(members, key){
                // this will return an array of array
                var membersScore = members.map(function (v) {
                    return vafMap[v]
                });
                // transpose array
                var tMemberScore = membersScore[0].map(function (col, i) {
                    return membersScore.map(function (row) {
                        return row[i]
                    })
                });

                // find mean for each timepoint
                tMemberScore = tMemberScore.map(findMean);
                // now remerge

                var merged = [];
                merged     = membersScore.concat.apply(merged, tMemberScore);
                treeData.push({ 'cluster' : key, 'members' : members, 'score' :  merged })
            });


            return treeData


        }

        function parseTree (vafMap, clusters, timePoint, nodeProfile) {

            var treeData  = {};
            var mutations = Object.keys(clusters);

            var nodeInfo = {};
            angular.forEach(nodeProfile, function(value, key){
                nodeInfo[key] = { cluster : value, score : []}
            });


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
                tMemberScore = tMemberScore.map(findMean);

                // now remerge
                var merged = [];
                merged     = membersScore.concat.apply(merged, tMemberScore);
                var mean   = findMean(merged);

                angular.forEach(timePoint, function (time, index) {

                    treeData[time] = treeData[time] || [];
                    angular.forEach(members, function (value) {
                        this.push({
                            mut: value, mean: mean, score: tMemberScore[index], group: nodeProfile[value], groupOrd : members.indexOf(value)

                        })
                    }, treeData[time])

                });

                var timeValueScore = [];

                angular.forEach(tMemberScore, function(value, index){
                    timeValueScore[index] = { x : value, y : timePoint[index]}
                });

                angular.forEach(members, function(value){
                    nodeInfo[value].score = timeValueScore;
                    nodeInfo[value].groupOrd = members.indexOf(value)
                })
            });

            return {value: treeData, nodeProfile: nodeInfo};
        }

            function parseTable  (vafMap, clusters) {


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
                    tMemberScore = tMemberScore.map(findMean);

                    // now remerge
                    var merged = [];
                    merged = membersScore.concat.apply(merged, tMemberScore);
                    var mean = findMean(merged);


                    angular.forEach(members, function(value, index){

                        this.push({
                                mut : value , cluster : mutations, cluster_mean :  mean }
                        )
                    },table)
                });
                return table;
            }

        function parseLine (vafMap, timePoint, clusters){

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
        }


        function parseGoogleLine (vafMap, timePoint, nodeProfile){
            var data = [];
            var colors = [];
            var cols = Object.keys(vafMap);
            // to ensure that object keys matches color we use cols since objects are not ordered
            angular.forEach(cols, function(value){
                this.push(nodeProfile[value]);
            }, colors );

            cols.unshift('Time');
            data.push(cols);

            angular.forEach(timePoint, function(value, idx){
                var row = [];
                row.push(value);
                angular.forEach(vafMap, function(score, mut){
                    row.push(  Number(score[idx]) );
                });
                data.push(row);
            });
            return {data :  data, colors  : colors  };
        }

        function parseGoogleBox ( vafMap, nodeProfile){

            function fillNull (array) {

                //sort array of array
                var sortedArray = array.sort(function(a,b){ return b.length - a.length});
                var maxLength = sortedArray[0].length;

                angular.forEach(sortedArray, function(arr, index){
                    var values = arr.slice(1);
                    // make sure that all values are number
                    values = values.map(Number);
                    values.sort();
                    var max = _.max(values);
                    var min = _.min(values);
                    var median = d3.median(values);
                    var firstQuantile = Number(d3.quantile(values, 0.25).toFixed(2));
                    var secondQuantile = Number(d3.quantile(values, 0.75).toFixed(2));

                    while(arr.length < maxLength ){
                        arr.push(null);
                    }
                    sortedArray[index] = arr.concat([max, min, firstQuantile, median, secondQuantile]);
                });
                return sortedArray;
            }

            var clusters = _.invert(nodeProfile, true);
            var clusterNo = 1;
            var colors = [];
            var data = [];

            angular.forEach(clusters, function(value, key){
                var results = [];
                var clusterName;
                if (value.length > 1) {
                    clusterName = "Cluster " + clusterNo;
                    results.push(clusterName);
                    angular.forEach(value, function(mutation){
                        results = results.concat(vafMap[mutation].map(Number))
                     });

                    clusterNo++;
                }
                else {
                    results = value.concat(vafMap[value[0]].map(Number))
                }
                data.push(results);
                colors.push(key);
            });

            //fill blanks and metrics
            data = fillNull(data);
            return {data : data, colors : colors}

        }



        return {
            parseBox: parseBox,
            parseTree : parseTree,
            parseGoogleLine : parseGoogleLine,
            parseGoogleBox : parseGoogleBox,
            // parse vaf map and cluster info into a json array with each row containing
            // ({x: clusterName, y: merged, members: members, groupCol: mutations, mean : mean})
            parseTable: parseTable,
            parseLine: parseLine,
            parseNewTree : parseNewTree,
        };
        // table is an array of mutations profile for each cluster.
    });




