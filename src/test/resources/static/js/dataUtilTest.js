/**
 * Created by xiuchengquek on 14/06/15.
 *
 * BDD test to make sure that control panel works. need more test.
 *
 */



describe("dataUtilitiesTest", function () {
    var mockUserInput;
    var requiredHeader;
    var expectedDataValues;


    beforeEach(module("kingFisherApp"));

    describe("Testing General Parser", function () {
        var generalParser;

        beforeEach(inject(function (_generalParser_) {
            generalParser = _generalParser_;
            mockUserInput = ["header1\theader2\theader3",
                "value1\tvalue2\tvalue3",
                "valueA\tvalueB\tvalueC"];
            expectedDataValues = [];
            expectedDataValues.push({Header1: "value1", Header2: "value2", Header3: "value3"});
            expectedDataValues.push({Header1: "valueA", Header2: "valueB", Header3: "valueC"});
            requiredHeader = ["Header1", "Header2", "Header3"];

        }));

        it("Test General Parser with Correct Data", function () {
            mockUserInput = mockUserInput.join("\n");
            var generalParserObj = new generalParser("general", requiredHeader);
            generalParserObj.parseData(mockUserInput);

            expect(generalParserObj.dataValues).toEqual(expectedDataValues);
            expect(generalParserObj.missingFields.length).toBe(0);

        });

        it("Testing General Parser With Missing Data in Line 1", function () {
            var generalParserObj = new generalParser("general", requiredHeader);
            mockUserInput[1] = "value1\tvalue2";
            mockUserInput = mockUserInput.join("\n");
            generalParserObj.parseData(mockUserInput);
            expectedDataValues.shift();

            expect(generalParserObj.malformedLines.length).toBe(1);
            expect(generalParserObj.malformedLines[0]).toBe(1);
            expect(generalParserObj.dataValues).toEqual(expectedDataValues);

        });

        it("Ignore Extraheader", function () {
            var generalParserObj = new generalParser("general", requiredHeader);
            mockUserInput = ["header1\theader2\theader3\theader4",
                "value1\tvalue2\tvalue3\tvalue4",
                "valueA\tvalueB\tvalueC\tvalueD"];


            mockUserInput = mockUserInput.join("\n");
            generalParserObj.parseData(mockUserInput);

            expect(generalParserObj.isOk()).toBe(true)
            console.log(generalParserObj)

            expect(generalParserObj.dataValues).toEqual(expectedDataValues);

        });


        it("Testing General parser With Missing Data in Line2", function () {
            var generalParserObj = new generalParser("general", requiredHeader);
            mockUserInput[2] = "value1\tvalue2";
            mockUserInput = mockUserInput.join("\n");
            generalParserObj.parseData(mockUserInput);
            expectedDataValues.pop();

            expect(generalParserObj.malformedLines.length).toBe(1);
            expect(generalParserObj.malformedLines[0]).toBe(2);
            expect(generalParserObj.dataValues).toEqual(expectedDataValues);

        });

        it("Testing General Parser with Missing Header", function () {
            var generalParserObj = new generalParser("general", requiredHeader);
            mockUserInput[0] = "header1\theader2";
            mockUserInput = mockUserInput.join("\n");

            generalParserObj.parseData(mockUserInput);

            expect(generalParserObj.missingFields).toEqual(["Header3"]);

        })
    });

    describe("Testing Maf Parser", function () {
        var mafParser;

        beforeEach(inject(function (_mafParser_) {
            mafParser = _mafParser_;

            mockUserInput = [];
            mockUserInput.push("Hugo_Symbol\tEntrez_Gene_Id\t" +
                "NCBI_Build\tChromosome\tStart_Position\t" +
                "End_Position\tStrand\tReference_Allele\t" +
                "Tumor_Seq_Allele1\tTumor_Sample_Barcode\tScore");

            mockUserInput.push("TP53\t7157\t" +
                "GRCh38.p2\tchr17\t7668402\t" +
                "7668402\t+\tA\tT\tSampleA\t0.1");

            expectedDataValues = {
                Hugo_Symbol: "TP53",
                Entrez_Gene_Id: "7157",
                NCBI_Build: "GRCh38.p2",
                Chromosome: "chr17",
                Start_Position: "7668402",
                End_Position: "7668402",
                Strand: "+",
                Reference_Allele: "A",
                Tumor_Seq_Allele1: "T",
                Tumor_Sample_Barcode: "SampleA",
                Score : "0.1"};

        }));

        it("Testing Maf Parser", function () {
            mockUserInput = mockUserInput.join('\n');
            var mafParserObj = new mafParser();
            mafParserObj.parseData(mockUserInput);

            expect(mafParserObj.missingFields.length).toBe(0);
            expect(mafParserObj.dataValues).toEqual([expectedDataValues])

        });

    });


    describe("Testing clinical parser", function () {
        var clinicalParser;

        beforeEach(inject(function (_clinicalParser_) {
            clinicalParser = _clinicalParser_;
            mockUserInput = [];
            mockUserInput.push("Tumor_Sample_Barcode\tBiopsy_Time\tTreatment");
            mockUserInput.push("SampleA\t1\tTreatmentA");
            expectedDataValues = [{
                Tumor_Sample_Barcode: "SampleA",
                Biopsy_Time: "1",
                Treatment: "TreatmentA"}];

        }));

        it("Testing Clincal Parser", function () {
            mockUserInput = mockUserInput.join("\n");
            var clinicalParserObj = new clinicalParser();
            clinicalParserObj.parseData(mockUserInput);

            expect(clinicalParserObj.dataValues).toEqual(expectedDataValues)

        })
    });


    describe("Testing mergeMafClincial", function(){
        var mergeMafClincial;
        var clinicalParser;
        var mafParser;
        var mockMaf;
        var mockClinical;
        var expectedResults;
        var arrangeTimePoint;

        beforeEach(inject(function(_mergeMafClinical_, _clinicalParser_, _mafParser_, _dataLoader_){
            mergeMafClincial = _mergeMafClinical_;
            clinicalParser = _clinicalParser_;
            mafParser = _mafParser_;


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
                                vafMap : { "TP53_g.[100A>T]" : ["0.1","0.2"],
                                           "AKT1_g.[700A>T]" : ["0.4", "0.6"] }
                                };


        }));



        it("Testing mergeMafClinical", function(){

            var mafParserObj = new mafParser();
            mockMaf = mockMaf.join('\n');

            var clinicaParserObj = new clinicalParser();
            mockClinical = mockClinical.join('\n');

            mafParserObj.parseData(mockMaf);
            clinicaParserObj.parseData(mockClinical);

            var results = mergeMafClincial(clinicaParserObj.dataValues, mafParserObj.dataValues)

            expect(results.vafMap).toEqual(expectedResults.vafMap);


        })

        it("Making Sure That it is always arranged", function(){
            var mafParserObj = new mafParser();
            mockMaf = mockMaf.join('\n');

            var clinicaParserObj = new clinicalParser();
            mockClinical = [];
            mockClinical.push("Tumor_Sample_Barcode\tBiopsy_Time\tTreatment");
            mockClinical.push("SampleA-2\t2\tTreatmentA");
            mockClinical.push("SampleA-1\t1\tTreatmentA");

            mockClinical = mockClinical.join('\n');

            mafParserObj.parseData(mockMaf);
            clinicaParserObj.parseData(mockClinical);

            var results = mergeMafClincial(clinicaParserObj.dataValues, mafParserObj.dataValues)
            expect(results).toEqual(expectedResults);
        })






    })


});

