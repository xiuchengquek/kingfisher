/**
 * Created by xiuchengquek on 16/06/15.
 */

/**
 * TODO : To do make fields into an object that takes in an agrument that specific the type of value.
 */


//angular.module('kingFisherApp', []);


angular.module('kingFisherApp')
    .factory('generalParser', function(){

    /**
     * General Parser that takes in the a list of required header
     * @param dataType String highlighting the data type - clinical, maf etc.
     * @param requiredHeader Column Fields Header That are required
     */
    var generalParser;

    generalParser = function (dataType, requiredHeader) {
        var self = this;
        self.dataType = dataType;
        self.requiredHeader = requiredHeader;
        self.userHeaderFields = [];
        self.missingFields = [];
        self.indexOrder = [];
        self.dataValues = [];
        self.malformedLines = [];

    };


     //Function to validate that the user Input has the required headers
    generalParser.prototype._validateHeader = function(){
        var self = this;

        var userHeader = self.userHeaderFields.map(function(value) { return value.toLowerCase()});
        var indexOrder = {};
        var missingFields = [];

        angular.forEach(self.requiredHeader, function(value){

            var indexNo = userHeader.indexOf(value.toLowerCase());

            if (indexNo == -1){
                missingFields.push(value);
            }
            else {
                indexOrder[value] = indexNo;
            }
        });

        self.missingFields = missingFields;
        self.indexOrder = indexOrder;
     };


        /**
     * Map Data to the correct header as a json object which is stored in attribute : dataValues
     * @param data list of lines from user Input
     */
    generalParser.prototype._mapDataToHeader = function(data) {
        var self = this;
        var dataValues =[];
        var malformedLines = [];

        // private method for mapping data to header
        var mapOnIndex = function (lineValues, indexOrder) {
            var lineObj = {};
            angular.forEach(indexOrder, function (index, headerName) {

                lineObj[headerName] = lineValues[index];
            });
            return lineObj;
        };

        angular.forEach(data, function(line, lineNo){
            // check that length of line equivalent to index
            var lineValues= line.split('\t');


            // if the number of fields in line is less or more than the header, report as malformed line
            if (lineValues.length != self.userHeaderFields.length) {
                malformedLines.push(lineNo + 1);
            } else {
                dataValues.push(mapOnIndex(lineValues, self.indexOrder));
            }

        }) ;

        self.dataValues = dataValues ;
        self.malformedLines = malformedLines;

    };

    /**
     * Main method to call for converting userInput into an object.
     * @param userString
     */

    generalParser.prototype.isOk = function(){
        var self = this;

        return ( self.malformedLines.length == 0 && self.missingFields.length == 0)
    };

    generalParser.prototype.parseData = function(userString){
        var self = this;

        self.userString = userString;
        var userLines = self.userString.split('\n');
        var userHeader = userLines.shift();
        self.userHeaderFields  = userHeader.split('\t');
        self._validateHeader();
        if (self.missingFields.length == 0){
            self._mapDataToHeader(userLines);
        }
    };




    return generalParser

});



angular.module('kingFisherApp').factory('mafParser', function(generalParser){

    /**
     *     //Column Header of MAF file format in order
     * var _mafColumnHeaders = [];
     * _mafColumnHeaders.push("Hugo_Symbol");
     * _mafColumnHeaders.push("Entrez_Gene_Id");
     * _mafColumnHeaders.push("Center");
     * _mafColumnHeaders.push("NCBI_Build");
     * _mafColumnHeaders.push("Chromosome");
     * _mafColumnHeaders.push("Start_Position");
     * _mafColumnHeaders.push("End_Position");
     * _mafColumnHeaders.push("Strand");
     * _mafColumnHeaders.push("Variant_Classification");
     * _mafColumnHeaders.push("Variant_Type");
     * _mafColumnHeaders.push("Reference_Allele");
     * _mafColumnHeaders.push("Tumor_Seq_Allele1");
     * _mafColumnHeaders.push("Tumor_Seq_Allele2");
     * _mafColumnHeaders.push("dbSNP_RS");
     * _mafColumnHeaders.push("dbSNP_Val_Status");
     * _mafColumnHeaders.push("Tumor_Sample_Barcode");
     * _mafColumnHeaders.push("Matched_Norm_Sample_Barcode");
     * _mafColumnHeaders.push("Match_Norm_Seq_Allele1");
     * _mafColumnHeaders.push("Match_Norm_Seq_Allele2");
     * _mafColumnHeaders.push("Tumor_Validation_Allele1");
     * _mafColumnHeaders.push("Tumor_Validation_Allele2");
     * _mafColumnHeaders.push("Match_Norm_Validation_Allele1");
     * _mafColumnHeaders.push("Match_Norm_Validation_Allele2");
     * _mafColumnHeaders.push("Verification_Status");
     * _mafColumnHeaders.push("Validaton_Status");
     * _mafColumnHeaders.push("Mutation_Status");
     * _mafColumnHeaders.push("Sequencing_Phase");
     * _mafColumnHeaders.push("Sequence_Source");
     * _mafColumnHeaders.push("Validation_Method");
     * _mafColumnHeaders.push("Score");
     * _mafColumnHeaders.push("BAM_File");
     * _mafColumnHeaders.push("Sequencer");
     * _mafColumnHeaders.push("Tumor_Sample_UUID");
     * _mafColumnHeaders.push("Matched_Norm_Sample_UUID");
     */



    // List of MAF fileds required for Fishplot
    var _complusoryMafFields = [];
    _complusoryMafFields.push("Hugo_Symbol");
    _complusoryMafFields.push("Entrez_Gene_Id");
    //_complusoryMafFields.push("Center");
    _complusoryMafFields.push("NCBI_Build");
    _complusoryMafFields.push("Chromosome");
    _complusoryMafFields.push("Start_Position");
    _complusoryMafFields.push("End_Position");
    _complusoryMafFields.push("Strand");
    //_complusoryMafFields.push("Variant_Classification");
    //_complusoryMafFields.push("Variant_Type");
    _complusoryMafFields.push("Reference_Allele");
    _complusoryMafFields.push("Tumor_Seq_Allele1");
    //_complusoryMafFields.push("Tumor_Seq_Allele2");
    _complusoryMafFields.push("Tumor_Sample_Barcode");
    //_complusoryMafFields.push("Matched_Norm_Sample_Barcode");
    //_complusoryMafFields.push("Validaton_Status");
    //_complusoryMafFields.push("Mutation_Status");
    //_complusoryMafFields.push("Sequence_Source");
    //_complusoryMafFields.push("Validation_Method");
    _complusoryMafFields.push("Score");
    //_complusoryMafFields.push("BAM_File");
    //_complusoryMafFields.push("Tumor_Sample_UUID");
    //_complusoryMafFields.push("Matched_Norm_Sample_UUID");



    mafParser.prototype = new generalParser();
    mafParser.prototype.constructor= mafParser;

    function mafParser(){
        this.dataType = "Maf";
        this.requiredHeader = _complusoryMafFields
    }


    return mafParser
});

angular.module('kingFisherApp').factory('clinicalParser', function(generalParser){

    var _clinicalFields = [];
    _clinicalFields.push('Tumor_Sample_Barcode');
    _clinicalFields.push('Biopsy_Time');
    _clinicalFields.push('Treatment');


    clinicalParser.prototype = new generalParser();
    clinicalParser.prototype.constructor= clinicalParser;
    function clinicalParser(){
        this.dataType = "Clinical";
        this.requiredHeader = _clinicalFields
    }



    return clinicalParser
});

angular.module('kingFisherApp').factory('mergeMafClinical', function(){

    var groupMut;
    var mergeMafClinical;
    var arrangeTimePoint;

    /**
     * function to check the data type for timepoint field in clincal data and return the apporiate function
     * to handle the different value type - date, float or character
     *
     * @param value time point value
     * @returns {*}
     */
    function checkTimeType(value){

        var isDate = function(val) {
            return ( (new Date(val) !== "Invalid Date" && !isNaN(new Date(val)) ));
        };

        var isFloat =  function(val) {
            return ( !isNaN(parseFloat(val)) )
        };

        if (value.every(isDate)){
            return function(value) {
                return new Date(value);
            }
        } else if (value.every(isFloat)) {
            return  function(value){
                return parseFloat(value)
            }
        } else {
            return function(value) {
                return value.toLowerCase()
            }
        }
    }

    groupMut = function (mafData) {
        var mutation = {};

        angular.forEach(mafData, function (value) {
            var sampleCode = value.Tumor_Sample_Barcode;
            var hugoSymbol = value.Hugo_Symbol;
            var position = value.Start_Position;
            var refAllele = value.Reference_Allele;
            var tumAllele = value.Tumor_Seq_Allele1;
            var score = value.Score;

            var mutationName = hugoSymbol + ":g.[" + position + refAllele + ">" + tumAllele + "]";
            mutation[mutationName] = mutation[mutationName] || {};
            mutation[mutationName][sampleCode] = score;
        });
        return mutation
    };


    arrangeTimePoint = function (clinicalData) {
        var timeType;
        var biopsyTimeList = clinicalData.map(function (obj) {
            return obj.Biopsy_Time
        });

        timeType = checkTimeType(biopsyTimeList);
        clinicalData = clinicalData.sort(function (a, b) {
            return timeType(a.Biopsy_Time) > timeType(b.Biopsy_Time)
        });

        return clinicalData.map(function (x) { return x.Tumor_Sample_Barcode });
    };

    mergeMafClinical = function (clinicalData, mafData) {
        var vafMap = {};
        var timePoint = arrangeTimePoint(clinicalData);
        var groupMutations = groupMut(mafData);

        angular.forEach(groupMutations, function(value, mutName) {
            vafMap[mutName] = vafMap[mutName] || [];
            angular.forEach(timePoint, function(sample) {
                var score = value[sample] || 0;
                vafMap[mutName].push(score);
            });
        });
        return {timePoint : timePoint, vafMap : vafMap}
    };
    return mergeMafClinical
});


angular.module('kingFisherApp')
    .factory('dataLoader',
    function(mafParser, clinicalParser, mergeMafClinical, $q, $http){


        var _timePoint;
        var _vafMap;
        var _cluster = {};







        var sharedData = {};

        sharedData.doCall = function() {

            var req = {
                method : "POST",
                url : "/hclust",
                data : {vafMap : _vafMap, timePoint : _timePoint },
                header: {'Content-Type' : 'application/json'}
            };

            return $http(req)

        }

        sharedData.getVafMap = function(){
            return _vafMap;
        };

        sharedData.getTimePoint = function(){
            return _timePoint;
        };

        sharedData.getCluster = function(){
            return _cluster;
        };

        sharedData.setCluster = function(cluster){
            _cluster = cluster;
        };


        sharedData.setVafMap = function(vafMap){
            _vafMap = vafMap
        };

        sharedData.setTimePoint = function(timePoint) {
            _timePoint = timePoint
        };



        sharedData.loadAndValidate = function(maf, clinical) {

            var results = {};
            var mafObj = new mafParser();
            mafObj.parseData(maf);

            var clinicalObj = new clinicalParser();
            clinicalObj.parseData(clinical);

            if (clinicalObj.isOk() && mafObj.isOk()) {
                results = mergeMafClinical(clinicalObj.dataValues, mafObj.dataValues)
            }
            else if (clinicalObj.isOk()) {
                // statement to tell mafObj is not okay


            }
            else if (mafObj.isOk()) {
                // statement to say clinical is wrong


            }
            else {
                // statement both are wrong;

            }
            sharedData.setVafMap(results.vafMap);
            sharedData.setTimePoint(results.timePoint);




        };

        return sharedData

});

angular.module('kingFisherApp')
    .factory('d3Helper', function(){

        var _data;
        var _vafMax;

        // Only one instance of d3Helper need to exist
        var d3Helper = {};
        var autoWidth = {};

        function findVafMax(data){
            return d3.max(data.map(function(d) { return d3.max(d)}))
        }

        // AutoWdith for each plot, multiple instances, so create prototype
        autoWidth = function (elem, height, margin, minWidth){
            var self = this;
            self.elem = elem[0];
            self.margin = margin;
            self.heigth = height - self.margin.left - self.margin.right || height - self.margin || height;
            self.minWidth = minWidth
            return this;
        };

        autoWidth.prototype.reWidth = function() {
            var self = this;
            var width = self.elem.offsetWidth;

            if (width > self.minWidth) {
                self.width = width - self.margin.left - self.margin.right || width - self.margin || width;
            }
            else {
                self.width = self.minWidth
            }
        };

        autoWidth.prototype.getWidth = function(){
            return this.width
        };


        autoWidth.prototype.getHeight = function(){
            return this.height

        };

        d3Helper.setData = function(data){
            _vafMax = findVafMax(data.vafMap);
            _data = data;
        };


        d3Helper.getvafMax = function(){
            return _vafMax;
        };

        return {
            autoWidth  : autoWidth,
            d3Helper   : d3Helper
        }
    });







