angular.module('fusionLiveMobile.services')

    .factory('reportService', function (networkService) {

        function getReport(rawParameters) {
            return networkService.getReport(rawParameters);
        }

        return {
            getReport: function (rawParameters) {
                return getReport(rawParameters);
            }
        }
    })