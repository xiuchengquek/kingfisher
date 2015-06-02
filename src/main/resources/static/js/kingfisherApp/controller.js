/**
 * Created by xiuchengquek on 28/05/15.
 */



angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, kingFisherData){

        $scope.master = {};
        $scope.postreply = {};

        $scope.update = function() {
            kingFisherData.postData($scope.master).then(
                function(results){
                    $scope.postreply = results
                }
            )
        };
    });
