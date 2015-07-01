/**
 * Created by xiuchengquek on 29/06/15.
 */

angular.module(['kingFisherApp'])
    .directive('table', function () {
        return {
            scope: {
                data: "="
            },
            templateUrl : "js/kingfisherApp/directives/templates/metricsTable.html"}

      })


