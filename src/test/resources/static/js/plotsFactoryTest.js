/**
 * Created by xiuchengquek on 28/06/15.
 */


describe("plotsFactory Tests", function(){

    var plotParsers;
    var mockClustered;

    beforeEach(module("kingFisherApp"));

    beforeEach(function(){


        mockClustered = {
            "vafMap":{
                "GeneA_g.[100A>C]":[
                    "0.5",
                    "0.68",
                    "0.62"
                ],
                "GeneB_g.[1000G>T]":[
                    "0.49",
                    "0.482",
                    "0.49"
                ],
                "GeneC_g.[1000G>T]":[
                    "0.44",
                    "0.48",
                    "0.49"
                ],
                "GeneD_g.[1000G>T]":[
                    "0.38",
                    "0.22",
                    "0.07"
                ],
                "GeneE_g.[1000G>T]":[
                    "0.37",
                    "0.16",
                    "0.07"
                ],
                "GeneF_g.[1000G>T]":[
                    "0.1",
                    "0.24",
                    "0.32"
                ]
            },
            "clusters":{
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
            },
            timePoint : [
                "SampleA-1",
                "SampleA-2",
                "SampleA-3"
            ],
            "nodeProfile":{
                "GeneA_g.[100A>C]"  :  "#aec7e8",
                "GeneB_g.[1000G>T]" :  "#aec7e8",
                "GeneC_g.[1000G>T]" :  "#aec7e8",
                "GeneD_g.[1000G>T]" :  "#ff0000",
                "GeneE_g.[1000G>T]" :  "#ff0000",
                "GeneF_g.[1000G>T]" :  "#1f77b4"
            }
        }


    });


    describe("Testing tableParser factory", function(){

        var tableParser;
        var expectedTable;

        beforeEach(inject(function(_plotParsers_) {
                plotParsers = _plotParsers_;


                tableParser = plotParsers.parseTable;

                expectedTable = [
                    {"mut": "GeneA_g.[100A>C]",  "cluster": "#aec7e8", "cluster_mean": 0.52},
                    {"mut": "GeneB_g.[1000G>T]", "cluster": "#aec7e8", "cluster_mean": 0.52},
                    {"mut": "GeneC_g.[1000G>T]", "cluster": "#aec7e8", "cluster_mean": 0.52},
                    {"mut": "GeneD_g.[1000G>T]", "cluster": "#ff0000", "cluster_mean": 0.21},
                    {"mut": "GeneE_g.[1000G>T]", "cluster": "#ff0000", "cluster_mean": 0.21},
                    {"mut": "GeneF_g.[1000G>T]", "cluster": "#1f77b4", "cluster_mean": 0.22}
                ]
            }
            ));



        it('test that clustering works', function() {


            var results;
            results = tableParser(mockClustered.vafMap, mockClustered.clusters);
            expect(results[0]).toEqual(expectedTable[0]);
            expect(results[1]).toEqual(expectedTable[1]);
            expect(results[2]).toEqual(expectedTable[2]);
            expect(results[3]).toEqual(expectedTable[3]);
            expect(results[4]).toEqual(expectedTable[4]);
            expect(results[5]).toEqual(expectedTable[5]);

        })



    })

    describe("Test TreeParser factory", function() {

        var treeParser, fishPlotFactory, newTreeParser;
        var expected, mockInput;

        beforeEach(inject(function (_plotParsers_, _fishPlotFactory_) {
                plotParsers     = _plotParsers_;
                fishPlotFactory = _fishPlotFactory_;

                treeParser    = plotParsers.parseTree;


                expected = {
                    "value": {
                        "SampleA-1": [{mut: 'GeneA_g.[100A>C]', mean: 0.52, score: 0.48, group: '#aec7e8', groupOrd: 0},
                            {mut: 'GeneB_g.[1000G>T]', mean: 0.52, score: 0.48, group: '#aec7e8', groupOrd: 1},
                            {mut: 'GeneC_g.[1000G>T]', mean: 0.52, score: 0.48, group: '#aec7e8', groupOrd: 2},
                            {mut: 'GeneD_g.[1000G>T]', mean: 0.21, score: 0.38, group: '#ff0000', groupOrd: 0},
                            {mut: 'GeneE_g.[1000G>T]', mean: 0.21, score: 0.38, group: '#ff0000', groupOrd: 1},
                            {mut: 'GeneF_g.[1000G>T]', mean: 0.22, score: 0.1, group: '#1f77b4', groupOrd: 0}],
                        "SampleA-2": [{mut: 'GeneA_g.[100A>C]', mean: 0.52, score: 0.55, group: '#aec7e8', groupOrd: 0},
                            {mut: 'GeneB_g.[1000G>T]', mean: 0.52, score: 0.55, group: '#aec7e8', groupOrd: 1},
                            {mut: 'GeneC_g.[1000G>T]', mean: 0.52, score: 0.55, group: '#aec7e8', groupOrd: 2},
                            {mut: 'GeneD_g.[1000G>T]', mean: 0.21, score: 0.19, group: '#ff0000', groupOrd: 0},
                            {mut: 'GeneE_g.[1000G>T]', mean: 0.21, score: 0.19, group: '#ff0000', groupOrd: 1},
                            {mut: 'GeneF_g.[1000G>T]', mean: 0.22, score: 0.24, group: '#1f77b4', groupOrd: 0}],
                        "SampleA-3": [{mut: 'GeneA_g.[100A>C]', mean: 0.52, score: 0.53, group: '#aec7e8', groupOrd: 0},
                            {mut: 'GeneB_g.[1000G>T]', mean: 0.52, score: 0.53, group: '#aec7e8', groupOrd: 1},
                            {mut: 'GeneC_g.[1000G>T]', mean: 0.52, score: 0.53, group: '#aec7e8', groupOrd: 2},
                            {mut: 'GeneD_g.[1000G>T]', mean: 0.21, score: 0.07, group: '#ff0000', groupOrd: 0},
                            {mut: 'GeneE_g.[1000G>T]', mean: 0.21, score: 0.07, group: '#ff0000', groupOrd: 1},
                            {mut: 'GeneF_g.[1000G>T]', mean: 0.22, score: 0.32, group: '#1f77b4', groupOrd: 0}]
                    },

                    "nodeProfile": {
                        "GeneA_g.[100A>C]": {
                            cluster: '#aec7e8',
                            score: [{x: 0.48, y: 'SampleA-1'}, {x: 0.55, y: 'SampleA-2'}, {x: 0.53, y: 'SampleA-3'}],
                            groupOrd: 0
                        },
                        "GeneB_g.[1000G>T]": {
                            cluster: '#aec7e8',
                            score: [{x: 0.48, y: 'SampleA-1'}, {x: 0.55, y: 'SampleA-2'}, {x: 0.53, y: 'SampleA-3'}],
                            groupOrd: 1
                        },
                        "GeneC_g.[1000G>T]": {
                            cluster: '#aec7e8',
                            score: [{x: 0.48, y: 'SampleA-1'}, {x: 0.55, y: 'SampleA-2'}, {x: 0.53, y: 'SampleA-3'}],
                            groupOrd: 2
                        },
                        "GeneD_g.[1000G>T]": {
                            cluster: '#ff0000',
                            score: [{x: 0.38, y: 'SampleA-1'}, {x: 0.19, y: 'SampleA-2'}, {x: 0.07, y: 'SampleA-3'}],
                            groupOrd: 0
                        },
                        "GeneE_g.[1000G>T]": {
                            cluster: '#ff0000',
                            score: [{x: 0.38, y: 'SampleA-1'}, {x: 0.19, y: 'SampleA-2'}, {x: 0.07, y: 'SampleA-3'}],
                            groupOrd: 1
                        },
                        "GeneF_g.[1000G>T]": {
                            cluster: '#1f77b4',
                            score: [{x: 0.1, y: 'SampleA-1'}, {x: 0.24, y: 'SampleA-2'}, {x: 0.32, y: 'SampleA-3'}],
                            groupOrd: 0
                        }
                    },


                }
            }
        ));

        it('Test Construction of Tree', function () {

            var results;

            var expectedTree = {
                mut: 'GeneA_g.[100A>C]',
                mean: 0.52,
                group: '#aec7e8',
                groupOrd: 0,
                cluster: {
                    cluster: '#aec7e8',
                    score: [
                        {
                            x: 0.48,
                            y: 'SampleA-1'
                        },
                        {
                            x: 0.55,
                            y: 'SampleA-2'
                        },
                        {
                            x: 0.53,
                            y: 'SampleA-3'
                        }
                    ]
                },
                children: [
                    {
                        mut: 'GeneB_g.[1000G>T]',
                        mean: 0.52,
                        group: '#aec7e8',
                        groupOrd: 1,
                        parent: 'GeneA_g.[100A>C]',
                        cluster: {
                            cluster: '#aec7e8',
                            score: [
                                {
                                    x: 0.48,
                                    y: 'SampleA-1'
                                },
                                {
                                    x: 0.55,
                                    y: 'SampleA-2'
                                },
                                {
                                    x: 0.53,
                                    y: 'SampleA-3'
                                }
                            ]
                        },
                        children: [
                            {
                                mut: 'GeneC_g.[1000G>T]',
                                mean: 0.52,
                                group: '#aec7e8',
                                groupOrd: 2,
                                parent: 'GeneB_g.[1000G>T]',
                                cluster: {
                                    cluster: '#aec7e8',
                                    score: [
                                        {
                                            x: 0.48,
                                            y: 'SampleA-1'
                                        },
                                        {
                                            x: 0.55,
                                            y: 'SampleA-2'
                                        },
                                        {
                                            x: 0.53,
                                            y: 'SampleA-3'
                                        }
                                    ]
                                },
                                children: [
                                    {
                                        mut: 'GeneE_g.[1000G>T]',
                                        mean: 0.21,
                                        group: '#ff0000',
                                        groupOrd: 1,
                                        parent: 'GeneC_g.[1000G>T]',
                                        cluster: {
                                            cluster: '#ff0000',
                                            score: [
                                                {
                                                    x: 0.38,
                                                    y: 'SampleA-1'
                                                },
                                                {
                                                    x: 0.19,
                                                    y: 'SampleA-2'
                                                },
                                                {
                                                    x: 0.07,
                                                    y: 'SampleA-3'
                                                }
                                            ]
                                        },
                                        children: [
                                            {
                                                mut: 'GeneD_g.[1000G>T]',
                                                cluster: {
                                                    cluster: '#ff0000',
                                                    score: [
                                                        {
                                                            x: 0.38,
                                                            y: 'SampleA-1'
                                                        },
                                                        {
                                                            x: 0.19,
                                                            y: 'SampleA-2'
                                                        },
                                                        {
                                                            x: 0.07,
                                                            y: 'SampleA-3'
                                                        }
                                                    ]
                                                },
                                                parent: 'GeneE_g.[1000G>T]'
                                            }
                                        ]
                                    },
                                    {
                                        mut: 'GeneF_g.[1000G>T]',
                                        cluster: {
                                            cluster: '#1f77b4',
                                            score: [
                                                {
                                                    x: 0.1,
                                                    y: 'SampleA-1'
                                                },
                                                {
                                                    x: 0.24,
                                                    y: 'SampleA-2'
                                                },
                                                {
                                                    x: 0.32,
                                                    y: 'SampleA-3'
                                                }
                                            ]
                                        },
                                        parent: 'GeneC_g.[1000G>T]'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }


            var paths = fishPlotFactory.findPaths(expected.value);

            expect(paths['GeneA_g.[100A>C]'].length).toEqual(2);
            expect(paths['GeneB_g.[1000G>T]'].length).toEqual(1);
            expect(paths['GeneC_g.[1000G>T]'].length).toEqual(0);
            expect(paths['GeneD_g.[1000G>T]'].length).toEqual(4);
            expect(paths['GeneE_g.[1000G>T]'].length).toEqual(3);
            expect(paths['GeneF_g.[1000G>T]'].length).toEqual(3);
            var tree  = fishPlotFactory.assemblePath(paths, expected.nodeProfile);

            expect(tree).toEqual(expectedTree)
        });


        it('Test new tree data', function () {

            var results;

            expected = {
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

            results = treeParser(mockClustered.vafMap, mockClustered.clusters, mockClustered.timePoint);
            expect(results).toEqual(expected)

        })
    })











});


