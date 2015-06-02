/**
 * Created by xiuchengquek on 2/06/15.
 */




describe("kingFisherCtrl", function() {

    beforeEach(module("kingFisherApp"));



    var $controller;
    var $scope;
    var $q

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_){

        $q = _$q_;

        var mockKingFisherData = {
            postData : function(data){

                var output = data;

                var deferred = $q.defer();
                deferred.resolve(output);





                return deferred.promise;
            }


        }

        $scope = _$rootScope_.$new();
        $controller = _$controller_('kingFisherCtrl', {
            $scope : $scope,
            kingFisherData : mockKingFisherData
        });

    }));


    it("Perform POST request and Get Respond", function(){
        $scope.master = {
            'title' : 'title1',
            'maf' : 'maf1',
            'cnv' : 'cnv',
            'clinical' : 'clincal1'
        };
        $scope.update();
        $scope.$digest();
        console.log($scope.postreply)
        expect($scope.postreply.title).toBe('title1')

        $scope.master = {
            'title' : 'title2',
            'maf' : 'maf2',
            'cnv' : 'cnv2',
            'clinical' : 'clincal2'

        };

        expect($scope.postreply.title).toBe('title1')





    });

    it("Change in User input should not affect posted results without submitting", function(){

        $scope.master = {
            'title' : 'title1',
            'maf' : 'maf1',
            'cnv' : 'cnv',
            'clinical' : 'clincal1'
        };
        $scope.update();
        $scope.$digest();

        $scope.master = {
            'title' : 'title2',
            'maf' : 'maf2',
            'cnv' : 'cnv2',
            'clinical' : 'clincal2'

        };

        expect($scope.postreply.title).toBe('title1')
    })
})