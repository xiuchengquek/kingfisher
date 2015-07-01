/**
 * Created by xiuchengquek on 28/05/15.
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
                $scope.lineplot = plotParsers.parseLine(vafData, timePoint, nodeProfiles);
                $scope.boxplot = plotParsers.parseBox(vafData, clusters);
                $scope.newick = { newick : newick , clusters : nodeProfiles};
                $scope.table = plotParsers.parseTable(vafData, clusters );


            })
        };


        $scope.$on('clusterChanged', function(){
            // cluster data looks like color : [ samples ]
            var vafData =  dataLoader.getVafMap();
            var timePoint = dataLoader.getTimePoint();
            var clusters = mutationClusters.getClusters();
            var nodeProfiles = mutationClusters.getNodeProfile();
            $scope.boxplot = plotParsers.parseBox(vafData, clusters);
            $scope.newick.clusters = clusters;
            $scope.lineplot = plotParsers.parseLine(vafData, timePoint, nodeProfiles);
            $scope.table = plotParsers.parseTable(vafData, clusters );

            $scope.$digest();
        });

        $scope.loadSample= function() {
            var mockClinical = ["Tumor_Sample_Barcode\tBiopsy_Time\tTreatment",
                            "sample-A01\t1\tTreatmentA",
                            "sample-B01\t2\tTreatmentB",
                            "sample-C01\t3\tTreatmentC"
            ];

            var mockClinical = mockClinical.join("\n");
            $http.get('js/kingfisherApp/directives/templates/example.tsv').then(function(results){
                $scope.data.maf = results.data;
                $scope.data.clinical = mockClinical;
            })
        };



});
