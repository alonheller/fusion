angular.module('fusionLiveMobile.services')

    .factory('networkService', function ($q, $http, $cookies, $parse, $localstorage, httpMethod) {
        var serverUrl;

        function createRequestObject(action, parameters) {
            return {'Action': action, 'parameters': parameters}
        }

        function sendRequest(strHttpMethod, requestObj, action, extract, postProcess) {
            var deferred = $q.defer();

            console.log('Request HTTP ', strHttpMethod, ' <ACTION: ', requestObj.Action, '>,  <Parameters>:', requestObj.parameters != undefined ? requestObj.parameters : 'No Parameters');

            if (!serverUrl) {
                serverUrl = $localstorage.get('serverUrl');
            }

            var req = {
                method: strHttpMethod,
                url: serverUrl,
                headers: {'Action': action},
                data: requestObj
            }

            $http(req).
                success(function (data, status, headers, config) {
                    /*console.log('Response Success <Action: ' ,action, '> Data: ', data);*/
                    if (extract !== undefined && extract !== null) {
                        data = $parse(extract)(data);
                    }

                    if (postProcess !== undefined) {
                        data = postProcess(data);
                    }
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    console.log('Response Failed  <Action: ' ,action, '> Data: ', data);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        function login(server, user, password, rememberMe) {
            serverUrl = 'http://' + server + '/gateway.aspx';
            $localstorage.set('serverUrl', serverUrl);
            $cookies.ECSFusionAuth = undefined;
            var req = createRequestObject('Login', {'username': user, 'password': password, 'rememberMe': rememberMe});
            return sendRequest(httpMethod.POST, req, 'Login', 'ReturnValue', addCookie);
        }

        function addCookie(data) {
            var cookie = decodeURI(data.Ticket.split('ECSFusionAuth=')[1]);
            $cookies.ECSFusionAuth = cookie;

            return data;
        }

        function getUserLocations() {
            var req = createRequestObject('GetUserLocations');
            return sendRequest(httpMethod.POST, req, 'GetUserLocations', 'ReturnValue.$values');
        }

        function getLocationSummary(id) {
            var req = createRequestObject('GetLocationSummary', {locationID: id});
            return sendRequest(httpMethod.POST, req, 'GetLocationSummary', 'ReturnValue.$values');
        }

        function getAssetSummary(id) {
            var req = createRequestObject('GetAssetSummary', {assetID: id});
            return sendRequest(httpMethod.POST, req, 'GetAssetSummary', 'ReturnValue.$values');
        }

        function getLocationInfo(id) {
            var req = createRequestObject('GetLocationInfo', {locationID: id});
            return sendRequest(httpMethod.POST, req, 'GetLocationInfo', 'ReturnValue');
        }

        function getCommonData() {
            var req = createRequestObject('GetCommonData');
            return sendRequest(httpMethod.POST, req, 'GetCommonData', 'ReturnValue');
        }

        function getLocationAlarms(id, showWarnings) {
            var req = createRequestObject('GetLocationAlarms', {locationID: id, showWarnings: showWarnings});
            return sendRequest(httpMethod.POST, req, 'GetLocationAlarms', 'ReturnValue');
        }

        function getLocationTickets(locationID, openTickets, startDate, endDate) {
            var req = createRequestObject('GetLocationTickets', {locationID: locationID, openTickets: openTickets, startDate: startDate, endDate: endDate});
            return sendRequest(httpMethod.POST, req, 'getLocationTickets', 'ReturnValue');
        }

        function saveTicket(ticket) {
            var req = createRequestObject('SaveTicket', {ticket: ticket});
            return sendRequest(httpMethod.POST, req, 'SaveTicket', 'ReturnValue');
        }

        function getReport(rawParameters) {
            var req = createRequestObject('GetReport', {rawParameters: rawParameters});
            return sendRequest(httpMethod.POST, req, 'GetReport', 'ReturnValue');
        }

        function getAssetSummary(assetID, showWarnings) {
            var req = createRequestObject('GetAssetSummary', {assetID: assetID, showWarnings: showWarnings});
            return sendRequest(httpMethod.POST, req, 'GetAssetSummary', 'ReturnValue');
        }

        function getAssetInfo(assetID) {
            var req = createRequestObject('GetAssetInfo', {assetID: assetID});
            return sendRequest(httpMethod.POST, req, 'GetAssetInfo', 'ReturnValue');
        }

        function getAssetImage(assetID) {
            var req = createRequestObject('GetAssetImage', {assetID: assetID});
            return sendRequest(httpMethod.POST, req, 'GetAssetImage', 'ReturnValue');
        }

        function getAssetAlarms(assetID, showWarnings) {
            var req = createRequestObject('GetAssetAlarms', {assetID: assetID, showWarnings: showWarnings});
            return sendRequest(httpMethod.POST, req, 'GetAssetAlarms', 'ReturnValue');
        }

        function getAssetTickets(assetID, openTickets, startDate, endDate) {
            var req = createRequestObject('GetAssetTickets', {assetID: assetID, openTickets: openTickets, startDate: startDate, endDate: endDate});
            return sendRequest(httpMethod.POST, req, 'GetAssetTickets', 'ReturnValue');
        }

        function getAssetMeasureLogs(assetMeasureID, startDate, endDate) {
            var req = createRequestObject('GetAssetMeasureLogs', {assetID: assetID, startDate: startDate, endDate: endDate});
            return sendRequest(httpMethod.POST, req, 'GetAssetMeasureLogs', 'ReturnValue');
        }

        function getAssetMeasureInformation(assetMeasureID) {
            var req = createRequestObject('GetAssetMeasureInfo', {assetMeasureID: assetMeasureID});
            return sendRequest(httpMethod.POST, req, 'GetAssetMeasureInfo', 'ReturnValue');
        }

        return {
            login: function (server, user, password, rememberMe) {return login(server, user, password, rememberMe);},
            getUserLocations: function () {return getUserLocations();},
            getLocationSummary: function (id) {return getLocationSummary(id);},
            getLocationInfo: function (id) {return getLocationInfo(id);},
            getCommonData: function (id) {return getCommonData();},
            getLocationAlarms: function (id) {return getLocationAlarms(id);},
            getLocationTickets: function (locationID, openTickets, startDate, endDate) {return getLocationTickets(locationID, openTickets, startDate, endDate)},
            saveTicket: function (ticket) {return saveTicket(ticket)},
            getAssetSummary: function (assetID, showWarnings) {return getAssetSummary(assetID, showWarnings)},
            getAssetInfo: function (assetID) {return getAssetInfo(assetID)},
            getAssetImage: function (assetID) {return getAssetImage(assetID)},
            getAssetAlarms: function (assetID, showWarnings) {return getAssetAlarms(assetID, showWarnings)},
            getAssetTickets: function (assetID, openTickets, startDate, endDate) {return getAssetTickets(assetID, openTickets, startDate, endDate)},
            getAssetMeasureLogs: function (assetMeasureID, startDate, endDate) {return getAssetMeasureLogs(assetMeasureID, startDate, endDate)},
            getAssetMeasureInformation: function (assetMeasureID) {return getAssetMeasureInformation(assetMeasureID)},
            getReport: function (rawParameters) {return getReport(rawParameters)}
        }
    }
);

/*

 FusionRemotingService.GetAuthenticatedUser OK
 FusionRemotingService.GetLogoImage OK


 */