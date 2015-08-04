/**
 * Created by xiuchengquek on 28/05/15.\
 * TODO : refactor variables and function so they dont repeat themselves
 *
 *
 */



angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, $http, dataLoader, mutationClusters, plotParsers, fishPlotFactory,$q){

        $scope.data = {};
        $scope.results = {};

        $scope.update = function() {

            var newick;

            dataLoader.loadAndValidate($scope.data.maf, $scope.data.clinical);
            var doneClust = dataLoader.doHClust().then(function (results) {
                newick = results.data;
                $('#headingTwoLink').trigger('click')
                return mutationClusters.initClusters(dataLoader.getVafMap())

            });

           doneClust.then(function(data){
                var vafData =  dataLoader.getVafMap();
                var timePoint = dataLoader.getTimePoint();
                var clusters = mutationClusters.getClusters();
                var nodeProfiles = mutationClusters.getNodeProfile();
                var tree = plotParsers.parseTree(vafData, clusters, timePoint, nodeProfiles);
                var fishBones = fishPlotFactory.constructTree(tree);
                $scope.lineplot = plotParsers.parseGoogleLine(vafData, timePoint, nodeProfiles);
                $scope.boxplot = plotParsers.parseBox(vafData, clusters);
                $scope.newick = { newick : newick , clusters : nodeProfiles};
                $scope.table = plotParsers.parseTable(vafData, clusters );
                $scope.fishbone = fishBones;
                $scope.fishplot = fishBones;
            })
        };


        $scope.$on('clusterChanged', function(){
            // cluster data looks like color : [ samples ]
            var vafData =  dataLoader.getVafMap();
            var timePoint = dataLoader.getTimePoint();
            var clusters = mutationClusters.getClusters();
            var nodeProfiles = mutationClusters.getNodeProfile();
            var tree = plotParsers.parseTree(vafData, clusters, timePoint, nodeProfiles);
            var fishBones = fishPlotFactory.constructTree(tree);
            $scope.boxplot = plotParsers.parseBox(vafData, clusters);
            //$scope.newick['clusters'] = nodeProfiles;
            $scope.lineplot = plotParsers.parseGoogleLine(vafData, timePoint, nodeProfiles);
            $scope.table = plotParsers.parseTable(vafData, clusters );
            $scope.fishbone = fishBones;
            $scope.fishplot = fishBones;


            if(!$scope.$$phase) {
                $scope.$digest();
            }

        });

        $scope.loadSample= function() {
            var mockClinical = ["Tumor_Sample_Barcode\tBiopsy_Time\tTreatment",
                            "preTreatment\t1\tTreatmentA",
                            "C4D1\t2\tTreatmentB",
                            "C7D1\t3\tTreatmentC"
            ];

            $scope.data.title = "Example Data - Coleman Lindsley"

            var mockClinical = mockClinical.join("\n");
            $http.get('js/kingfisherApp/directives/templates/coleman_example.tsv').then(function(results){
                $scope.data.maf = results.data;
                $scope.data.clinical = mockClinical;
            })
        };



});
