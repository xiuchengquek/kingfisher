/**
 * Created by xiuchengquek on 29/06/15.
 */

// TODO : Add more robust test., test different scenrio

describe('Testing Algorithim', function(){

    var fishPlotFactory, fishPlotAlgo;
    var mock;
    var expected, expectedTree;

    beforeEach(module('kingFisherApp'));


    beforeEach(inject(function(_fishPlotFactory_) {

        fishPlotFactory = _fishPlotFactory_;

        mock = {
            pretreatment: [
                {mut: 'IDH2_p.R140Q',   score: 0.37, mean: 0.2},
                {mut: 'SETBP1_p.D868N', score: 0.10, mean: 0.22},
                {mut: 'RUNX1_p.K83*',   score: 0.38, mean: 0.22},
                {mut: 'ASXL1_p.Q760*',  score: 0.44, mean: 0.47},
                {mut: 'RUNX1_p.R174*',  score: 0.49, mean: 0.49},
                {mut: 'SRSF2_p.P95H',   score: 0.50, mean: 0.6}
            ],

            C4D1: [
                {mut: 'IDH2_p.R140Q',   score: 0.16, mean: 0.2},
                {mut: 'SETBP1_p.D868N', score: 0.24, mean: 0.22},
                {mut: 'RUNX1_p.K83*',   score: 0.22, mean: 0.22},
                {mut: 'ASXL1_p.Q760*',  score: 0.48, mean: 0.47},
                {mut: 'RUNX1_p.R174*',  score: 0.49, mean: 0.49},
                {mut: 'SRSF2_p.P95H',   score: 0.68, mean: 0.6}
            ],


            pC7D1: [
                {mut: 'IDH2_p.R140Q',   score: 0.07, mean: 0.2},
                {mut: 'SETBP1_p.D868N', score: 0.32, mean: 0.22},
                {mut: 'RUNX1_p.K83*',   score: 0.07, mean: 0.22},
                {mut: 'ASXL1_p.Q760*',  score: 0.49, mean: 0.47},
                {mut: 'RUNX1_p.R174*',  score: 0.49, mean: 0.49},
                {mut: 'SRSF2_p.P95H',   score: 0.62, mean: 0.6}
            ]
        };

        expectedTree = {
            mut : "SRSF2_p.P95H",
            children : [{ mut : "RUNX1_p.R174*" , parent : "SRSF2_p.P95H",
                children : [ {mut: "ASXL1_p.Q760*", parent : "RUNX1_p.R174*",
                    children : [{mut: "RUNX1_p.K83*", parent : "ASXL1_p.Q760*",
                        children : [{mut : "IDH2_p.R140Q", parent : "RUNX1_p.K83*"}]},
                                {mut : "SETBP1_p.D868N", parent :"ASXL1_p.Q760*"}
                    ]
                }]
            }]
        };

    }));

    it('test that noError Gives no Array', function(){

        var paths = fishPlotFactory.findPaths(mock);
        var tree = fishPlotFactory.assemblePath(paths);
        expect(tree).toEqual(expectedTree);

    })
});
















