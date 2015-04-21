angular.module('fusionLiveMobile.services')

    .factory('commonDataService', function ($q, networkService, statusCodes, defaults) {
        var cache = null;

        var getCommonData = function() {
            var deferred = $q.defer();

            if (cache == null) {
                networkService.getCommonData().then(
                    function success(result) {
                        cache = result;
                        deferred.resolve(cache);
                    },
                    function error(result) {
                        cache = null;
                        deferred.reject(cache);
                    }
                )
            }
            else {
                deferred.resolve(cache);
            }
            return deferred.promise;
        }

        var getStatusName = function(statusCode, alarmClear) {
            var statusName = '';

            switch (statusCode)
            {
                case statusCodes.OK:
                    statusName = "OK";
                    break;
                case statusCodes.WARNING:
                    statusName = "Warning";
                    break;
                case statusCodes.CRITICAL:
                    statusName = "Critical";
                    break;
                case statusCodes.FAULT:
                    statusName = "Fault - General";
                    break;
                case statusCodes.FAULT_OPEN:
                    statusName = "Fault - Open Sensor";
                    break;
                case statusCodes.FAULT_SHORTED:
                    statusName = "Fault - Shorted Sensor";
                    break;
                case statusCodes.FAULT_COMM:
                    statusName = "Fault - Communication Error";
                    break;
                case statusCodes.DISCONNECTED:
                    statusName = "Disconnected";
                    break;
                default:
                    statusName = "";
                    break;
            }

            if (alarmClear == defaults.NAFEM_TRUE)
            {
                statusName += " (Ack.)";
            }

            return statusName;
        }

        var getReports = function() {
          return cache.Reports.$values;
        };

        var getTicketReasons = function() {
          return cache.TicketReasons.$values;
        };

        return {
            getCommonData: function() {
                return getCommonData()
            },
            getStatusName: function(statusCode, alarmClear) {
                return getStatusName(statusCode, alarmClear);
            },
            getReports: function() {
                return getReports();
            },
            getTicketReasons: function() {
                return getTicketReasons();
            }
        }
    })