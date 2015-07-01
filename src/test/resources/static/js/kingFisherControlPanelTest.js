/**
 * Created by xiuchengquek on 14/06/15.
 *
 * BDD test to make sure that control panel works. need more test.
 *
 */



describe("kingFisherCtrl", function() {

    var $controller;
    var $httpBackend;
    var $q;
    var $scope;
    var $compile;
    var template;
    var mock;


    beforeEach(module("kingFisherApp"));

    /**
     * this is a hack.
     * Injecting template by downloading the template and putting it into $templateCache for use later
     * will replace it by Karma
     *  **/
    beforeEach(inject(function($templateCache, _$compile_, _$rootScope_) {
        template = $templateCache.get('src/main/resources/static/js/kingfisherApp/directives/templates/kingFisherForm.html')
        $templateCache.put("js/kingfisherApp/directives/templates/kingFisherForm.html", template);
    }));

    /**
     * Inject Controllers and Mocks data.
     *
     */
    beforeEach(inject(function(_$rootScope_,_$controller_, _$q_, _$compile_, $templateCache, _$httpBackend_){

        mock = ["Gene\tPretreatment\tC4D1\tC7D1",
            "SRSF2_p.P95H\t0.5\t0.68\t0.62",
            "RUNX1_p.R174*\t0.49\t0.482\t0.49",
            "ASXL1_p.Q760*\t0.44\t0.48\t0.49",
            "RUNX1_p.K83*\t0.38\t0.22\t0.07",
            "IDH2_p.R140Q\t0.37\t0.16\t0.07",
            "SETBP1_p.D868N\t0.1\t0.24\t0.32"];

        mock = mock.join("\n");

        $httpBackend = _$httpBackend_;
        //$httpBackend.when('GET', 'js/kingfisherApp/components/controlPanel/example.tsv').respond(mock);
        $httpBackend.whenPOST('/hclust', {data : expectedResults}).respond(200, '');
        $q = _$q_;

        // mock postData with $q
        $controller = _$controller_;

        // create new scope
        $scope = _$rootScope_.$new();
        // compile
        $compile = _$compile_;

        // load controller with the correct $scope and function
        $controller = $controller('kingFisherCtrl', {$scope: $scope, kingFisherData: mockKingFisherData});

        // get the template
        template = $templateCache.get('js/kingfisherApp/components/controlPanel/kingFisherForm.html');

        // transform template from string to angular element
        template = angular.element(template);




    }));

    // Test controller
    describe('Test kingFisherControlPanelController', function(){


        it('Testing controller and its function', function(){
            $scope.data = {
                'title' : 'title1',
                'maf' : 'maf1',
                'cnv' : 'cnv',
                'clinical' : 'clincal1'
            };
            $scope.update();
            $scope.$digest();
            console.log($scope.postreply);

            expect($scope.postreply.title).toBe('title1')
        });


        it('Testing kingFisherControlPanelDirective - load sample data and submit button', function(){
            $scope.data = {'title' : '',  'maf' : '', 'cnv': '','clinical' : ''};
            $scope.update();
            $scope.$digest();
            var element = $compile(template)($scope);

            expect($scope.postreply.title).toBe('');
            $scope.$digest();

            // only one span
            var items =template.find('span')[0];
            //console.log(test)

            items.click();
            $httpBackend.flush();

            $scope.$digest();

            expect($scope.data.maf).toBe(mock);

            // theres only one submit button
            var submitButton = template.find('button')[0];
            submitButton.click();
            expect($scope.postreply.maf).toBe(mock);
       })

    })




});

