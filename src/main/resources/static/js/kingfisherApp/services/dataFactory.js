/**
 * Created by xiuchengquek on 16/06/15.
 */

/**
 * TODO : To do make fields into an object that takes in an agrument that specific the type of value.
 */

angular.module('kingFisherApp')
    .factory('dataLoader',
    function(mafParser, clinicalParser, mergeMafClinical, $q, $http){
        var _timePoint;
        var _vafMap;
        var sharedData = {};

        sharedData.doHClust = function() {
            var req = {
                method : "POST",
                url : "/hclust",
                data : {vafMap : _vafMap, timePoint : _timePoint },
                header: {'Content-Type' : 'application/json'}
            };
            return $http(req)

        };

        sharedData.getVafMap = function(){
            return _vafMap;
        };

        sharedData.getTimePoint = function(){
            return _timePoint;
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
