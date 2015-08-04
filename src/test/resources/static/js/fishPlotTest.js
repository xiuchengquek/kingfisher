/**
 * Created by xiuchengquek on 28/06/15.
 */


describe("fishplot factory Tests", function(){

    var fishPlotFactory;
    var mockFishData, path, shortestPath, complexFishData, mockTree, mockAssembledPat, mockComplexTree;

    beforeEach(module("kingFisherApp"));






    beforeEach(inject(function(_fishPlotFactory_) {
            fishPlotFactory = _fishPlotFactory_;


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

        }));


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



});


