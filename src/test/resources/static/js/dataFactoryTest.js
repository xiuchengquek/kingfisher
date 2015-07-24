

describe("dataFactoryTest", function () {


    beforeEach(module("kingFisherApp"));

    describe("Testing dataLoader", function(){
        var mergeMiniMafClincial;
        var clinicalParser;
        var mafParser;
        var mockMaf;
        var mockClinical;
        var expectedResults;
        var dataLoader;
        var contentHeader;
        var $httpBackend;


        beforeEach(inject(function(_$httpBackend_, _dataLoader_){
            dataLoader = _dataLoader_;
            $httpBackend = _$httpBackend_;



            mockMaf = [];
            mockMaf.push("Hugo_Symbol\tTumor_Sample_Barcode\tAmino_Acid_Change\tt_alt_count\tt_ref_count");


            var mutationA_1 = ["TP53","SampleA-1","P100G","10",'90'];

            var mutationA_2 = angular.copy(mutationA_1);
            mutationA_2[1] = "SampleA-2";
            mutationA_2[3] = "20";
            mutationA_2[4] = "80";


            var mutationB_1 = ["AKT1","SampleA-1", "P100A","40","60"];

            var mutationB_2 = angular.copy(mutationB_1);
            mutationB_2[1] = "SampleA-2";
            mutationB_2[3] = "90";

            mutationA_1 = mutationA_1.join('\t');
            mutationA_2 = mutationA_2.join('\t');
            mutationB_1 = mutationB_1.join('\t');
            mutationB_2 = mutationB_2.join('\t');

            mockMaf.push(mutationA_1);
            mockMaf.push(mutationA_2);
            mockMaf.push(mutationB_1);
            mockMaf.push(mutationB_2);




            //Create mockClincal data now

            mockClinical = [];
            mockClinical.push("Tumor_Sample_Barcode\tBiopsy_Time\tTreatment");
            mockClinical.push("SampleA-1\t1\tTreatmentA");
            mockClinical.push("SampleA-2\t2\tTreatmentA");

            expectedResults = { timePoint : ["SampleA-1", "SampleA-2"],
                vafMap : { "TP53_p.P100G" : [0.1,0.2],
                    "AKT1_p.P100A" : [0.4, 0.6] }
            };

            contentHeader = { 'Content-Type' : 'application/json'}

           // $httpBackend.whenPOST('/hclust', {data : expectedResults}).respond(200, 'Success');








        }));



        it("Testing DataLoader - load and Validate function", function(){


            mockMaf = mockMaf.join('\n');
            mockClinical = mockClinical.join('\n');
            dataLoader.loadAndValidate(mockMaf, mockClinical);
            //test that everything isOk
            expect(dataLoader.getVafMap()).toEqual(expectedResults.vafMap);
            expect(dataLoader.getTimePoint()).toEqual(expectedResults.timePoint);

        });

        it("Test that Do clust use the correct data", function(){

            mockMaf = mockMaf.join('\n');
            mockClinical = mockClinical.join('\n');
            dataLoader.loadAndValidate(mockMaf, mockClinical);
            //test that everything isOk




            var test;
            $httpBackend.expectPOST('/hclust', expectedResults).respond(200, 'Success');
            var promise = dataLoader.doHClust();


            $httpBackend.flush()




        })














    })


});

