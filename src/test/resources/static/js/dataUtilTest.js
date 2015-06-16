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


    beforeEach(module("dataUtil"));

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
                "Tumor_Seq_Allele1\tTumor_Sample_Barcode");

            mockUserInput.push("TP53\t7157\t" +
                "GRCh38.p2\tchr17\t7668402\t" +
                "7668402\t+\tA\tT\tSampleA");

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
                Tumor_Sample_Barcode: "SampleA"};

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
                Biopsy_Time: "1", Treatment: "TreatmentA"}];

        }));

        it("Testing Clincal Parser", function () {
            mockUserInput = mockUserInput.join("\n");
            var clinicalParserObj = new clinicalParser();
            clinicalParserObj.parseData(mockUserInput);

            expect(clinicalParserObj.dataValues).toEqual(expectedDataValues)

        })
    })
});

