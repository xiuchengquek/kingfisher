/**
 * Created by xiuchengquek on 21/07/15.
 */
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


describe("Boxplot Parser Tests", function(){


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
        };

        mockTimePoint = [
            "SampleA-1",
            "SampleA-2",
            "SampleA-3"
        ];

        mockNodeProfile = {
            "GeneA" :  "#aec7e8",
            "GeneB" :  "#aec7e8",
            "GeneC" :  "#aec7e8",
            "GeneD" :  "#ff0000",
            "GeneE" :  "#ff0000",
            "GeneF" :  "#1f77b4"
        };



        // the last four value of the array are : max, min, median, first quantile, 3rd quantile



    })


    beforeEach(inject(function(_plotParsers_) {

        plotParser = _plotParsers_;
    }));



    it('Should return array of array with Cluster1 , Cluster2 and GeneF', function(){
        var googleBox = plotParser.parseGoogleBox;
        var results = googleBox(mockVaf, mockTimePoint, mockNodeProfile);

        expected = {
            "data" : [
                ["Cluster 1", 0.5, 0.68, 0.62 , 0.49, 0.482, 0.49, 0.44, 0.48, 0.49, 0.68, 0.44, 0.48, 0.49, 0.50],
                [ "Cluster 2", 0.38, 0.22,  0.07, 0.37, 0.16, 0.07, null,null,null, 0.38, 0.07,0.09 , 0.19,0.33],
                [ "GeneF", 0.1, 0.24, 0.32, null, null, null, null, null, null, 0.32,0.1, 0.17, 0.24, 0.28]
            ],
            "colors" : ["#aec7e8","#ff0000","#1f77b4"]

        };


        expect(results).toEqual(expected);

    })


    it('should return an array of array with only gene names', function() {

        mockNodeProfile = {
            "GeneA" :  "c1",
            "GeneB" :  "c2",
            "GeneC" :  "c3",
            "GeneD" :  "c4",
            "GeneE" :  "c5",
            "GeneF" :  "c6"
        };

        var googleBox = plotParser.parseGoogleBox;
        var results = googleBox(mockVaf, mockTimePoint, mockNodeProfile);


        expected = {
            "data" : [
                [ "GeneA", 0.5, 0.68, 0.62, 0.68, 0.5, 0.56, 0.62, 0.65],
                [ "GeneB", 0.49, 0.482, 0.49, 0.49, 0.482, 0.49, 0.49, 0.49],
                [ "GeneC", 0.44, 0.48, 0.49,  0.49, 0.44, 0.46, 0.48, 0.48],
                [ "GeneD", 0.38, 0.22,  0.07, 0.38, 0.07, 0.15, 0.22, 0.3],
                [ "GeneE", 0.37, 0.16, 0.07, 0.37, 0.07, 0.12, 0.16, 0.27],
                [ "GeneF", 0.1, 0.24, 0.32, 0.32, 0.1, 0.17, 0.24, 0.28]

            ],
            "colors" : ["c1","c2","c3","c4","c5","c6"]

        };

        expect(results).toEqual(expected);




    })










})








