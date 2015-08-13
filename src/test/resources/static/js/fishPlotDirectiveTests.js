/**
 * Created by xiuchengquek on 5/08/15.
 */



describe('fishplot directive', function(){


    // angular components
    var $compile, $rootScope, scope, element;

    // user defined variables

    var mockNodes, mockTimePoint;


    beforeEach(module('kingFisherApp'));

    beforeEach(inject(function(_$rootScope_, _$compile_){

        $compile = _$compile_;
        scope = _$rootScope_.$new();


        var parent1 = {
            'mut' : '#aec7e8',
            'depth' : 0,
            'x' : 0.5,
            'y' : 0,
            'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
            'score' :{ 'SampleA-1' :  0.48, 'SampleA-2' :  0.55, 'SampleA-3' : 0.53 },
            'branching' : false
        };

        var children1 = {
            'mut' : '#ff0000',
            'depth' : 1,
            'x' : 0.25,
            'y' : 1,
            'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
            'score' : {'SampleA-1' : 0.38,'SampleA-2' : 0.19, 'SampleA-3'  : 0.07},
            'branching' : true
        };

        var children2 = {
            'mut' : '#1f77b4',
            'depth' : 1,
            'x' : 0.75,
            'y' : 1,
            'members': ['GeneF_g.[1000G>T]'],
            'score' : { 'SampleA-1' : 0.1, 'SampleA-2' : 0.24, 'SampleA-3' : 0.32},
            'branching' : true


        };

        parent1.children = [children2,  children1 ];
        children1.parent = parent1;
        children2.parent = parent1;
        mockNodes  = [ parent1, children1, children2 ]


        mockTimePoint = [

            "SampleA-1","SampleA-2","SampleA-3"


        ];





        html = '<fishplot data="fishplot" ></fishplot>';

        element = angular.element(html);
        compiled = $compile(element);
        compiled(scope)
        scope.$digest();


    }));

    it('Testing that the number of time panel' +
        ' generated will be equivalent to the number of time points and transformation works', function(){


        scope.fishplot = {
            'value' : mockNodes,
            'timePoint' : mockTimePoint
        };
        scope.$digest();
        // use jquery to select nodes.
        expect($(element.html()).find('g.timePanel').length).toBe(3);

        //adding an additional timepoint

        scope.fishplot.value["SampleA-4"] = angular.copy(scope.fishplot.value["SampleA-3"])
        scope.fishplot.timePoint.push("SampleA-4")

        compiled(scope)
        scope.$digest();
        expect($(element.html()).find('g.timePanel').length).toBe(4);






    });


    it('test that attached timepoint data is correct', function(){



        scope.fishplot = {
            'value' : mockNodes,
            'timePoint' : mockTimePoint
        };
        scope.$digest();
        // use jquery to select nodes.
        expect(($(element.html()).find('g.timePanel'))).toBe('lol');






    })















})