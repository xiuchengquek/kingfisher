/**
 * Created by xiuchengquek on 28/06/15.

describe("lineplot Test", function(){

    beforeEach(module("kingFisherApp"));


    var $compile;
    var $rootScope;
    var element;
    var scope;


    describe("Testing lineplot", function(){

        beforeEach(inject(function(_$compile_, _$rootScope_){
            scope = _$rootScope_.$new();
            $compile = _$compile_;
            element = '<lineplot data="lineplot"></lineplot>';

            var data = { "vafMap" :
                            {   "SRSF2_p.P95H" : [0.5,0.68,0.62],
                                "RUNX1_p.R174*" :[0.49, 0.482, 0.49],
                                "ASXL1_p.Q760*" :[0.44,0.48,0.49],
                                "RUNX1_p.K83*" : [0.38,0.22,0.07],
                                "IDH2_p.R140Q" : [0.37,0.16,0.07] ,
                                "SETBP1_p.D868N" :[0.1,0.24,0.32] } ,
                        "timePoint" : [ "Pretreatment","C4D1","C7D1"]
            };


            scope.lineplot = data;

            element = $compile(element)(scope);
            scope.$digest();
        }))


        it("should ", function(){




            expect(true).toBe(true)




        })






    })




}) */




/**
 * Created by xiuchengquek on 28/06/15.
 */


describe("linePlot Parser Tests", function(){


    var mockVaf;
    var mockTimePoint;

    var expected;
    var plotParser;
    var mockNodeProfile;


    beforeEach(module("kingFisherApp"));


    beforeEach(function() {


        mockVaf = {

            "GeneA": [
                "0.5",
                "0.68",
                "0.62"
            ],
            "GeneB": [
                "0.49",
                "0.482",
                "0.49"
            ],
            "GeneC": [
                "0.44",
                "0.48",
                "0.49"
            ],
            "GeneD": [
                "0.38",
                "0.22",
                "0.07"
            ],
            "GeneE": [
                "0.37",
                "0.16",
                "0.07"
            ],
            "GeneF": [
                "0.1",
                "0.24",
                "0.32"
            ]
        }

        mockTimePoint = [
            "SampleA-1",
            "SampleA-2",
            "SampleA-3"
        ];


        mockNodeProfile = {
                "GeneA"  :  "#aec7e8",
                "GeneB" :  "#aec7e8",
                "GeneC" :  "#aec7e8",
                "GeneD" :  "#ff0000",
                "GeneE" :  "#ff0000",
                "GeneF" :  "#1f77b4"
        }


        expected = {
            data: [["Time", "GeneA", "GeneB", "GeneC", "GeneD", "GeneE", "GeneF"],
                ["SampleA-1", 0.50, 0.49, 0.44, 0.38, 0.37, 0.1],
                ["SampleA-2", 0.68, 0.482, 0.48, 0.22, 0.16, 0.24],
                ["SampleA-3", 0.62, 0.49, 0.49, 0.07, 0.07, 0.32]] ,
            colors : ["#aec7e8","#aec7e8","#aec7e8", "#ff0000","#ff0000", "#1f77b4"]

        };


    })

/**

         z= {











            "cols": [

                {"id": "", "label": "Time Point", "pattern": "", "type": "string"},
                {"id": "", "label": "GeneA", "pattern": "", "type": "number"},
                {"id": "", "label": "GeneB", "pattern": "", "type": "number"},
                {"id": "", "label": "GeneC", "pattern": "", "type": "number"},
                {"id": "", "label": "GeneD", "pattern": "", "type": "number"},
                {"id": "", "label": "GeneE", "pattern": "", "type": "number"},
                {"id": "", "label": "GeneF", "pattern": "", "type": "number"}
                {"id": "", "label": "Style", "pattern": "", "type": "number"}


            ],
            "rows" :[

                {"c":[

                    {"v" : "SampleA-1", "f" : null},
                    {"v" : 0.50, "f" : null},
                    {"v" : 0.49, "f" : null},
                    {"v" : 0.44, "f" : null},
                    {"v" : 0.38, "f" : null},
                    {"v" : 0.37, "f" : null},
                    {"v" : 0.10, "f" : null}
                ]},

                {"c":[

                    {"v" : "SampleA-2", "f" : null},
                    {"v" : 0.68, "f" : null},
                    {"v" : 0.482, "f" : null},
                    {"v" : 0.48, "f" : null},
                    {"v" : 0.22, "f" : null},
                    {"v" : 0.16, "f" : null},
                    {"v" : 0.24, "f" : null}
                ]},

                {"c":[

                    {"v" : "SampleA-3", "f" : null},
                    {"v" : 0.62, "f" : null},
                    {"v" : 0.49, "f" : null},
                    {"v" : 0.49, "f" : null},
                    {"v" : 0.07, "f" : null},
                    {"v" : 0.07, "f" : null},
                    {"v" : 0.32, "f" : null}
                ]}

            ]





        };
 **/

    beforeEach(inject(function(_plotParsers_) {

        plotParser = _plotParsers_;
    }));



     it('Should return array of array', function(){
            var googleLine = plotParser.parseGoogleLine;
            var results = googleLine(mockVaf, mockTimePoint, mockNodeProfile);
            expect(results).toEqual(expected)
     })










    })








