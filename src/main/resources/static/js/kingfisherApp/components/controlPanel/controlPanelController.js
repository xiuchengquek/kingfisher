/**
 * Created by xiuchengquek on 28/05/15.
 */

angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, kingFisherData){

        $scope.data = {}
        $scope.master = {};
        $scope.postreply = {};
        $scope.update = function() {
            kingFisherData.postData($scope.master).then(
                function(results){
                    $scope.postreply = results
                }
            )
        };


        $scope.loadSample= function() {
            var mock = ["Gene\tPretreatment\tC4D1\tC7D1",
                    "SRSF2_p.P95H\t0.5\t0.68\t0.62",
                    "RUNX1_p.R174*\t0.49\t0.482\t0.49",
                    "ASXL1_p.Q760*\t0.44\t0.48\t0.49",
                    "RUNX1_p.K83*\t0.38\t0.22\t0.07",
                    "IDH2_p.R140Q\t0.37\t0.16\t0.07",
                    "SETBP1_p.D868N\t0.1\t0.24\t0.32"]
            mock = mock.join("\n")
            $scope.data.maf = mock



        }



});


angular.module('kingFisherApp')
    .directive('userinput', function(){
        return {
            templateUrl : "js/kingfisherApp/components/controlPanel/kingFisherForm.html"
        }
    })