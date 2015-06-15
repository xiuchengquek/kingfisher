/**
 * Created by xiuchengquek on 11/06/15.
 */







angular.module('kingFisherApp').factory('kingFisherData', function ($http, $log, $q) {
    // TODO: Add function to validate form.

    // main object to return
    var sharedDataService = {};
    var _vafData = { vafScore : {} , timePoint : [] };


    // list of object containing vaf score

    /**
     * parse user input ( vafString ) into an object
     * @param {String} vafString input
     * @returns :{Object} parsedData 'timepoint' - column name and 'data' -
     * array of object with the key being the gene name and the value an array of vaf
     **/
    sharedDataService.parseStringToData = function(vafString) {

        var vafList = [];
        var geneName;
        // split string into lines.
        vafList = vafString.split('\n');

        // Get the first line and split it by tab character
        var timePoint = vafList.shift().split('\t');

        // remove the first column - presumed to be column for the gene name
        timePoint.shift();

        _vafData.timePoint = timePoint;
        _vafData.vafScore = []

        // loop thru the remaining lines.
        angular.forEach(vafList, function (value) {
            vafList = value.split('\t');
            geneName = vafList.shift();
            this[geneName] = vafList;

        }, _vafData.vafScore);
    }


    // getter vaf
    sharedDataService.getVafScore = function () {
        return _vafData.vafScore;
    };

    // setter function

    sharedDataService.getTimePoint = function () {
        return _vafData.timePoint;
    };




    sharedDataService.setVaf = function (vafScore) {
        _vafData.vafScore = vafScore

    };

    sharedDataService.setTimePoint = function (timePoint) {
        _vafdata.timePoint = timePoint

    };

    // post data
    sharedDataService.postData = function (data) {
        return postData(data)
    };

    // function that takes in data
    function postData(data) {
        var deferred = $q.defer();
        $http.post('/rest', data)
            .success(function (results) {
                deferred.resolve(results)
            }).error(function (msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });
        return deferred.promise;
    }

    return sharedDataService
});

