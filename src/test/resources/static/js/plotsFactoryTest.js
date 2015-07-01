/**
 * Created by xiuchengquek on 28/06/15.
 */


describe("plotsFactory Tests", function(){

    var plotParsers;
    var mockClustered;

    beforeEach(module("kingFisherApp"));

    beforeEach(function(){


        mockClustered = {"vafMap":{"GeneA_g.[100A>C]":["0.5","0.68","0.62"],"GeneB_g.[1000G>T]":["0.49","0.482","0.49"],
            "GeneC_g.[1000G>T]":["0.44","0.48","0.49"],"GeneD_g.[1000G>T]":["0.38","0.22","0.07"],
            "GeneE_g.[1000G>T]":["0.37","0.16","0.07"],"GeneF_g.[1000G>T]":["0.1","0.24","0.32"]},
            "clusters":{"#aec7e8":["GeneA_g.[100A>C]","GeneB_g.[1000G>T]","GeneC_g.[1000G>T]"],
                        "#ff0000":["GeneD_g.[1000G>T]","GeneE_g.[1000G>T]"],
                        "#1f77b4" : ["GeneF_g.[1000G>T]"]}}


    });


    describe("Testing tableParser factory", function(){

        var tableParser;
        var expectedTable;

        beforeEach(inject(function(_plotParsers_) {
                plotParsers = _plotParsers_;

                tableParser = plotParsers.parseTable;

                expectedTable = [{"mut": "GeneA_g.[100A>C]", "cluster": "#aec7e8", "cluster_mean": "0.52"},
                    {"mut": "GeneB_g.[1000G>T]", "cluster": "#aec7e8", "cluster_mean": "0.52"},
                    {"mut": "GeneC_g.[1000G>T]", "cluster": "#aec7e8", "cluster_mean": "0.52"},
                    {"mut": "GeneD_g.[1000G>T]", "cluster": "#ff0000", "cluster_mean":"0.21"},
                    {"mut": "GeneE_g.[1000G>T]", "cluster": "#ff0000", "cluster_mean": "0.21"},
                    {"mut": "GeneF_g.[1000G>T]", "cluster": "#1f77b4", "cluster_mean": "0.22"}]
            }
            ))



        it('test that clustering works', function() {


            var results = tableParser(mockClustered.vafMap, mockClustered.clusters);

            expect(results[0]).toEqual(expectedTable[0]);
            expect(results[1]).toEqual(expectedTable[1]);
            expect(results[2]).toEqual(expectedTable[2]);
            expect(results[3]).toEqual(expectedTable[3]);
            expect(results[4]).toEqual(expectedTable[4]);
            expect(results[5]).toEqual(expectedTable[5]);

        })




    })

})


