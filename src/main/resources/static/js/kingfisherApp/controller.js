/**
 * Created by xiuchengquek on 28/05/15.
 */


angular.module('kingFisherApp')
    .controller('kingFisherCtrl', function($scope, kingFisherData){

        $scope.master = {};
        $scope.postreply = {};

        $scope.update = function(data) {
            alert(data);
            $scope.master.data = angular.copy(data);
            kingFisherData.postData(data).then(
                function(results){
                    $scope.postreply = results
                }
            )
        };




    });

