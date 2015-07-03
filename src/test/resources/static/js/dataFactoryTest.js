

describe("dataFactoryTest", function () {


    beforeEach(module("kingFisherApp"));

    describe("Testing dataLoader", function(){
        var mergeMafClincial;
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
            mockMaf.push("Hugo_Symbol\tEntrez_Gene_Id\t" +
                "NCBI_Build\tChromosome\tStart_Position\t" +
                "End_Position\tStrand\tReference_Allele\t" +
                "Tumor_Seq_Allele1\tTumor_Sample_Barcode\tScore");


            var mutationA_1 = ["TP53", "7157", "GRCh38.p2", "chr17",
                "100", "101", "+", "A", "T", "SampleA-1", "0.1"];

            var mutationA_2 = angular.copy(mutationA_1);
            mutationA_2[9] = "SampleA-2";
            mutationA_2[10] = "0.2";

            var mutationB_1 = ["AKT1", "7121", "GRCh38.p2", "chr11",
                "700", "701", "+", "A", "T", "SampleA-1", "0.4" ];

            var mutationB_2 = angular.copy(mutationB_1);
            mutationB_2[9] = "SampleA-2";
            mutationB_2[10] = "0.6";

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
                vafMap : { "TP53_g.[100A>T]" : [0.1,0.2],
                    "AKT1_g.[700A>T]" : [0.4, 0.6] }
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

