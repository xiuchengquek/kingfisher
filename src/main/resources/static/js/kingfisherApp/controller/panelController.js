/**
 * Created by xiuchengquek on 28/05/15.
 */



angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, $http, dataLoader, mutationClusters, plotParsers){

        $scope.data = {};
        $scope.results = {};
        $scope.lineplot = {};


        $scope.update = function() {
            dataLoader.loadAndValidate($scope.data.maf, $scope.data.clinical);
            dataLoader.doHClust().then(function (results) {
                $scope.newick = results.data;
                $scope.lineplot = {vafMap: dataLoader.getVafMap(), timePoint: dataLoader.getTimePoint()};
                $scope.results = results;
                $('#headingTwoLink').trigger('click')
            });
        }

        $scope.$on('clusterChanged', function(){
            // cluster data looks like color : [ samples ]
            console.log('FUCK YOU THIS' , dataLoader.getVafMap())
            $scope.boxplot = plotParsers.parseBox(dataLoader.getVafMap(), mutationClusters.getClusters());
            $scope.$digest()
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
