/**
 * Created by xiuchengquek on 28/05/15.
 */



angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, $http, dataLoader){

        $scope.data = {};
        $scope.results = {};

        $scope.update = function() {
            dataLoader.loadAndValidate($scope.data.maf, $scope.data.clinical);
            dataLoader.doCall().then(function(results){

                var results = { newick : results.data, vafMap :dataLoader.getVafMap(), timePoint : dataLoader.getTimePoint()  }
                $scope.results = results;
                $('#headingTwoLink').trigger('click')




            });
        };

        $scope.loadSample= function() {
            var mockClinical = ["Tumor_Sample_Barcode\tBiopsy_Time\tTreatment",
                            "sample-A01\t1\tTreatmentA",
                            "sample-B01\t2\tTreatmentB",
                            "sample-C01\t3\tTreatmentC"];

            var mockClinical = mockClinical.join("\n");

            $http.get('js/kingfisherApp/components/controlPanel/example.tsv').then(function(results){
                $scope.data.maf = results.data;
                $scope.data.clinical = mockClinical;
            })
        };
});





/**
 * Created by xiuchengquek on 14/06/15.
 */
angular.module('kingFisherApp')
    .directive('userinput', function(){
        return {
            templateUrl : "js/kingfisherApp/components/controlPanel/kingFisherForm.html"
        }
    });

