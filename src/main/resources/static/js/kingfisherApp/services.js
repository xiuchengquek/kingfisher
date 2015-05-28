/**
 * Created by xiuchengquek on 28/05/15.
 */


angular.module('kingFisherApp');


angular.module('kingFisherApp')
    .factory('kingFisherData', function($http){

        return {
            postData: function(data){
                return $http.post('/rest', data);
            }
        }
    });


