/**
 * Created by xiuchengquek on 5/08/15.
 */



describe('fishplot directive', function(){


    // angular components
    var $compile, $rootScope, scope, element;
    // user defined variables
    var mockFishData, mockTree, mockCluster, compiled, html;


    beforeEach(module('kingFisherApp'));

    beforeEach(inject(function(_$rootScope_, _$compile_){

        $compile = _$compile_;
        scope = _$rootScope_.$new();



        mockFishData  = {
            "SampleA-1" :
                [
                    {
                        'cluster': '#aec7e8',
                        'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                        'score': 0.48,
                    },
                    {
                        'cluster': '#ff0000',
                        'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                        'score': 0.38,
                    },
                    {
                        'cluster': '#1f77b4',
                        'members': ['GeneF_g.[1000G>T]'],
                        'score': 0.1,
                    }
                ],
            "SampleA-2" :
                [
                    {
                        'cluster': '#aec7e8',
                        'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                        'score': 0.55,
                    },
                    {
                        'cluster': '#ff0000',
                        'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                        'score': 0.19,
                    },
                    {
                        'cluster': '#1f77b4',
                        'members': ['GeneF_g.[1000G>T]'],
                        'score': 0.24,
                    }
                ],
            "SampleA-3" :
                [
                    {
                        'cluster': '#aec7e8',
                        'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                        'score': 0.53,
                    },
                    {
                        'cluster': '#ff0000',
                        'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                        'score': 0.07,
                    },
                    {
                        'cluster': '#1f77b4',
                        'members': ['GeneF_g.[1000G>T]'],
                        'score': 0.32,
                    }
                ],
        };


        mockCluster = {
            '#aec7e8' : ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
            '#ff0000' : ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
            '#1f77b4' : ['GeneF_g.[1000G>T]']
        };




        mockTree = {
            "mut"  : "#aec7e8",
            "children" : [
                {
                    "mut": "#ff0000",
                    "parent" : "#aec7e8"
                },
                {
                    "mut": "#1f77b4",
                    "parent" : "#aec7e8"
                }
            ]
        }




        html = '<fishplot data="fishplot" ></fishplot>';

        element = angular.element(html);
        compiled = $compile(element);
        compiled(scope)
        scope.$digest();


    }));

    it('Testing that the number of time panel' +
        ' generated will be equivalent to the number of time points', function(){


        scope.fishplot = {
            'structure' : mockTree,
            'clusters' : mockCluster,
            'value' : mockFishData
        };
        scope.$digest();
        // use jquery to select nodes.
        expect($(element.html()).find('g.timePanel').length).toBe(3);

        //adding an additional timepoint

        scope.fishplot.value["SampleA-4"] = angular.copy(scope.fishplot.value["SampleA-3"])
        compiled(scope)
        scope.$digest();
        expect($(element.html()).find('g.timePanel').length).toBe(4);



    });


    it('Testing that the ')















})