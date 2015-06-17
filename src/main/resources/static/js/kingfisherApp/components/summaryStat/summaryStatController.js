/**
 * Created by xiuchengquek on 14/06/15.
 */


angular.module("kingFisherApp")
    .controller("summaryStat", function($scope, dataLoader){
        $scope.data = {vafMap : {}};

        $scope.data['vafMap'] = dataLoader.getVafMap()
        $scope.$watch(dataLoader.getVafMap, function(newVal,oldVal){
            console.log('changed')

        })
    });