angular.module('fusionLiveMobile.services')

    .factory('alarmService', function (networkService) {
        var getLocationAlarms = function (locationId) {
            return networkService.getLocationAlarms(locationId);
        };

        var getAssetAlarms = function (assetId, showWarnings) {
            return networkService.getAssetAlarms(assetId, showWarnings);
        };

        return {
            getLocationAlarms: function(locationId) {
                return getLocationAlarms(locationId);
            },
            getAssetAlarms: function(assetId, showWarnings) {
                return getAssetAlarms(assetId);
            }
        }
    });