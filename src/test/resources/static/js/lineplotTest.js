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