/**
 * Created by xiuchengquek on 28/06/15.
 */


describe("fishplot factory Tests", function(){

    var fishPlotFactory;
    var mockFishData, path, shortestPath, complexFishData, mockTree, mockAssembledPat, mockComplexTree,mockExpected
        , mockExpectedNodes, mockTimePoint, mockClusters;

    beforeEach(module("kingFisherApp"));
    beforeEach(inject(function(_fishPlotFactory_){
        fishPlotFactory = _fishPlotFactory_;
    }));




    describe('testing fish bone', function(){

        beforeEach(function() {

                complexFishData = {

                    "SampleA-1":
                        [
                            { "cluster": '#aec7e8', "members": ['GeneA_g.[100A>C]'],  score: 0.50},
                            { "cluster": '#ffffff', "members": ['GeneB_g.[1000G>T]'], score: 0.49},
                            { "cluster": '#007e80', "members": ['GeneC_g.[1000G>T]'], score: 0.44},
                            { "cluster": '#ff0000', "members": ['GeneD_g.[1000G>T]'], score: 0.38},
                            { "cluster": '#000000', "members": ['GeneE_g.[1000G>T]'], score: 0.37},
                            { "cluster": '#2f77b4', "members": ['GeneF_g.[1000G>T]'], score: 0.10}
                        ],
                    "SampleA-2":
                        [
                            { "cluster": '#aec7e8', "members": ['GeneA_g.[100A>C]'],  score: 0.68},
                            { "cluster": '#ffffff', "members": ['GeneB_g.[1000G>T]'], score: 0.49},
                            { "cluster": '#007e80', "members": ['GeneC_g.[1000G>T]'], score: 0.48},
                            { "cluster": '#ff0000', "members": ['GeneD_g.[1000G>T]'], score: 0.22},
                            { "cluster": '#000000', "members": ['GeneE_g.[1000G>T]'], score: 0.16},
                            { "cluster": '#2f77b4', "members": ['GeneF_g.[1000G>T]'], score: 0.24}
                        ],
                    "SampleA-3":
                        [
                            { "cluster": '#aec7e8', "members": ['GeneA_g.[100A>C]'],  score: 0.62},
                            { "cluster": '#ffffff', "members": ['GeneB_g.[1000G>T]'], score: 0.49},
                            { "cluster": '#007e80', "members": ['GeneC_g.[1000G>T]'], score: 0.49},
                            { "cluster": '#ff0000', "members": ['GeneD_g.[1000G>T]'], score: 0.07},
                            { "cluster": '#000000', "members": ['GeneE_g.[1000G>T]'], score: 0.07},
                            { "cluster": '#2f77b4', "members": ['GeneF_g.[1000G>T]'], score: 0.32}
                        ],

                };

                mockComplexTree = {
                    mut: '#aec7e8',
                    children: [
                        {
                            mut: '#ffffff',
                            parent: '#aec7e8',
                            children: [
                                {
                                    mut: '#007e80',
                                    parent: '#ffffff',
                                    children: [
                                        {
                                            mut: '#ff0000',
                                            parent: '#007e80',
                                            children: [
                                                {
                                                    mut: '#000000',
                                                    parent: '#ff0000'
                                                }
                                            ]
                                        },
                                        {
                                            mut: '#2f77b4',
                                            parent: '#007e80'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };

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




                path = {
                    '#aec7e8': [[],[],[]],
                    '#ff0000': [['#aec7e8'], ['#1f77b4', '#aec7e8'], ['#1f77b4', '#aec7e8']],
                    '#1f77b4':  [['#aec7e8', '#ff0000'],[ '#aec7e8' ],  [ '#aec7e8' ]]

                }

                shortestPath = {
                    '#aec7e8': [],
                    '#ff0000':  ['#aec7e8'],
                    '#1f77b4':  ['#aec7e8']

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

            mockAssembledPath = [
                {"mut" : "#aec7e8"},
                {"mut" :  "#ff0000", "parent" : "#aec7e8"},
                {"mut" :  "#1f77b4", "parent" : "#aec7e8"},
            ]

            });


            it('check that recursive find can find all paths', function(){
                var results = fishPlotFactory.findMultipleNew(mockFishData, {})
                expect(results).toEqual(path)
            });

            it('make sure shortest Path is found', function(){
                var results = fishPlotFactory.findShortest(path);
                expect(results).toEqual(shortestPath)

            });

            it('make sure that the correct path are assembled', function(){
                var results = fishPlotFactory.assemblePathNew(shortestPath)
                expect(results).toEqual(mockAssembledPath)
            })

            it('make sure that the tree is constructed proper', function(){
                var results = fishPlotFactory.constructTreeNew(mockAssembledPath);
                expect(results).toEqual(mockTree);
            })

            it('mkae sure parseFishBone', function(){
                var results = fishPlotFactory.parseFishBone(mockFishData)
                expect(results).toEqual(mockTree)
            })

            it('check complex tree structure', function(){
                var results = fishPlotFactory.parseFishBone(complexFishData)
                expect(results).toEqual(mockComplexTree)
            })
    })


    describe('testing fishplot', function(){

        beforeEach(function(){
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
            };
            var parent1 = {
                'mut' : '#aec7e8',
                'depth' : 0,
                'x' : 0.5,
                'y' : 0,
                'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                'score' :{ 'SampleA-1' :  0.48, 'SampleA-2' :  0.55, 'SampleA-3' : 0.53 },
            };

            var children1 = {
                'mut' : '#ff0000',
                'depth' : 1,
                'x' : 0.25,
                'y' : 1,
                'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                'score' : {'SampleA-1' : 0.38,'SampleA-2' : 0.19, 'SampleA-3'  : 0.07},
            };

            var children2 = {
                'mut' : '#1f77b4',
                'depth' : 1,
                'x' : 0.75,
                'y' : 1,
                'members': ['GeneF_g.[1000G>T]'],
                'score' : { 'SampleA-1' : 0.1, 'SampleA-2' : 0.24, 'SampleA-3' : 0.32},

            };




            parent1.children = [children2,  children1 ];
            children1.parent = parent1;
            children2.parent = parent1;
            mockExpectedNodes  = [ parent1, children1, children2 ]



            mockClusters = {
                "#aec7e8":[
                    "GeneA_g.[100A>C]",
                    "GeneB_g.[1000G>T]",
                    "GeneC_g.[1000G>T]"
                ],
                    "#ff0000":[
                    "GeneD_g.[1000G>T]",
                    "GeneE_g.[1000G>T]"
                ],
                    "#1f77b4":[
                    "GeneF_g.[1000G>T]"
                ]
            }


        })


        it('Test that add group members work', function(){


            var tree = d3.layout.tree();
            var nodes = tree.nodes(mockTree);

            fishPlotFactory.addGroupMembers(nodes, mockClusters, mockFishData);
            var testParameters = ['mut', 'score', 'members', 'depth'];

            angular.forEach(nodes, function(value, idx){
                angular.forEach(testParameters, function(para){
                    expect(value[para]).toEqual(mockExpectedNodes[idx][para])
                })
            })
        })

        it('Test that determining branching events work', function(){
            var tree = d3.layout.tree();
            var nodes = tree.nodes(mockTree);
            fishPlotFactory.addGroupMembers(nodes, mockClusters, mockFishData);
            fishPlotFactory.addBranchingEvents(nodes);

            expect(nodes[0].branching).toBeUndefined();
            expect(nodes[1].branching).toBe(1);
            expect(nodes[2].branching).toBe(2);
        })


        it('test that parsefishplot works' , function(){

            var tree = d3.layout.tree();
            var nodes = tree.nodes(mockTree);
            nodes = fishPlotFactory.parseFishPlotNew(mockFishData, mockClusters);

            var testParameters = ['mut', 'score', 'members', 'depth'];

            angular.forEach(nodes, function(value, idx){
                angular.forEach(testParameters, function(para){
                    expect(value[para]).toEqual(mockExpectedNodes[idx][para])
                })
            })


            expect(nodes[0].branching).toBeUndefined();
            expect(nodes[1].branching).toBe(1);
            expect(nodes[2].branching).toBe(2);

        })

        it('test that score adjustment works', function(){



            var tree = d3.layout.tree();
            var nodes = tree.nodes(mockTree);
            nodes = fishPlotFactory.parseFishPlotNew(mockFishData, mockClusters);
            fishPlotFactory.adjustScore(nodes)

            mockExpectedNodes[1].score = {




            }
            expect(nodes[0].score).toEqual(mockExpectedNodes[0].score)
            expect(nodes[0].score).toEqual(mockExpectedNodes[0].score)



        })





    })

});




/**


 mockExpected = [{
                'timePoint' : "SampleA-1",
                'startScore': null,
                'endScore' : 0.48,
                'values': [
                        {
                            'cluster': '#aec7e8',
                            'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                            'score': 0.48,
                            'adjustedEndFactor': 1,
                            'adjustedStartFactor': null,
                            'depth': 0
                        },
                        {
                            'cluster': '#ff0000',
                            'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                            'score': 0.38,
                            "adjustedEndFactor": 0.79,
                            "adjustedStartFactor": null,
                            'depth': 1,
        //                    'branching': true
                        },
                        {
                            'cluster': '#1f77b4',
                            'members': ['GeneF_g.[1000G>T]'],
                            'score': 0.1,

                            "adjustedEndFactor": 0.20,
                            "adjustedStartFactor": null,
                            'depth': 1,
    //                        'branching': true
                        }
                    ],
                },
 {
     'timePoint' : "SampleA-2",
     'startScore': 0.48,
     'endScore' : 0.55,
     'values': [
         {
             'cluster': '#aec7e8',
             'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
             'score': 0.55,
             "adjustedEndFactor": 1,
             "adjustedStartFactor": 1,
            'depth': 0
         },
         {
             'cluster': '#ff0000',
             'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
             'score': 0.19,
             "adjustedEndFactor": 0.34,
             "adjustedStartFactor": 0.79,


             'depth': 1
         },
         {
             'cluster': '#1f77b4',
             'members': ['GeneF_g.[1000G>T]'],
             'score': 0.24,
             "adjustedEndFactor": 0.43,
             "adjustedStartFactor": 0.20,


             'depth': 1

         }
     ]
 },
 {

     'timePoint': "SampleA-3",
     'startScore': 0.55,
     'endScore' : 0.53,
     'values' :
         [
             {
                 'cluster': '#aec7e8',
                 'members': ['GeneA_g.[100A>C]', 'GeneB_g.[1000G>T]', 'GeneC_g.[1000G>T]'],
                 'score': 0.53,
                 "adjustedEndFactor": 1,
                 "adjustedStartFactor": 1,
                 'depth': 0
             },
             {
                 'cluster': '#ff0000',
                 'members': ['GeneD_g.[1000G>T]', 'GeneE_g.[1000G>T]'],
                 'score': 0.07,
                 "adjustedEndFactor": 0.13,
                 "adjustedStartFactor": 0.34,
                 'depth': 1,

             },
             {
                 'cluster': '#1f77b4',
                 'members': ['GeneF_g.[1000G>T]'],
                 'score': 0.32,

                 "adjustedEndFactor": 0.60,
                 "adjustedStartFactor": 0.43,
                 'depth': 1,

             }
         ]
 },



 ]

 **/