angular.module('fusionLiveMobile.directives')
    .directive('locationBoard',
    [
        '$state',
        '$ionicLoading',
        '$ionicTabsDelegate',
        'topologyService',
        'commonDataService',
        'reportService',
        'reports',
        'ticketsService',
        'networkService',
        function ($state, $ionicLoading, $ionicTabsDelegate, topologyService, commonDataService, reportService, reports, ticketsService, networkService) {
            return {
                restrict: 'EA',
                templateUrl: 'js/directives/locationBoard/locationBoard.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.model = {};
                    scope.locationId = $state.params.locationId;

                    // Move to utils
                    function showProgress(message) {
                        $ionicLoading.show({
                            template: '<i class="ion-loading-c"></i><br/>' + message + '...'
                        });
                    }

                    function hideProgress() {
                        $ionicLoading.hide();
                    }

                    scope.$on("$stateChangeSuccess", function updatePage() {
                        scope.locationId = $state.params.locationId;
                        getData();
                    });

                    function getData() {
                        scope.onTabSelected($ionicTabsDelegate.selectedIndex());
                    }

                    scope.onTabSelected = function (index) {
                        switch (index) {
                            case 0:
                                getLocationInfo();
                                break;
                            case 1:
                                getLocationStatus();
                                break;
                            case 2:
                                getLocationAlarms();
                                break;
                            case 3:
                                getLocationTickets();
                                break;
                            case 4:
                                // Done by the generate report button
                                break;
                        }
                        // When using ng-click, we have to explicitly select the tab
                        $ionicTabsDelegate.$getByHandle('location-tabs').select(index);
                    };

                    function getLocationInfo() {
                        showProgress('Getting Location Information...');
                        console.log('Getting location information: ', scope.locationId);

                        topologyService.getLocationInfo(scope.locationId).then(
                            function success(result) {
                                scope.info = result;
                                hideProgress();
                            },
                            function error(result) {
                                scope.info = null;
                                hideProgress();
                            }
                        )
                    }

                    function getLocationStatus() {
                        showProgress('Getting Location Status...');
                        topologyService.getLocationSummary(scope.locationId).then(
                            function success(result) {
                                scope.alarmChartData = getAlarms(result[0]);
                                scope.ticketChartData = getTickets(result[1]);
                                hideProgress();
                            },
                            function error(result) {
                                scope.locationSummary = null;
                                hideProgress();
                            }
                        )
                    }

                    function getLocationAlarms() {
                        showProgress('Getting Location Alarms...');
                        networkService.getLocationAlarms(scope.locationId).then(
                            function success(result) {
                                scope.alarms = result.$values;
                                hideProgress();
                            },
                            function error(result) {
                                scope.alarms = null;
                                hideProgress();
                            }
                        )
                    }

                    function getAlarms(alarms) {
                        var parsedAlarms = [];

                        angular.forEach(alarms, function (value, key) {
                            var keyParsed = parseInt(key);
                            if (!isNaN(keyParsed)) {
                                parsedAlarms.push({name: commonDataService.getStatusName(parseInt(key)), value: value});
                            }
                        });

                        return parsedAlarms;

                    }

                    function getTickets(ticketsSummary)
                    {
                        var tickets = [];
                        angular.forEach(ticketsSummary, function (value, key) {
                            var ticketReasonID = parseInt(key);
                            if (!isNaN(ticketReasonID)) {
                                tickets.push({
                                    id: ticketReasonID,
                                    name: ticketsService.getTicketReasonName(ticketReasonID),
                                    value: ticketsSummary[key]
                                });
                            }
                        });

                        return tickets;
                    }

                    function getLocationTickets() {
                        showProgress('Getting Location Tickets...');
                        console.log('Getting location tickets: ', scope.locationId);

                        topologyService.getLocationTickets(scope.locationId).then(
                            function success(result) {
                                scope.tickets = result.$values;
                                hideProgress();
                            },
                            function error(result) {
                                scope.tickets = null;
                                hideProgress();
                            }
                        );
                    }

                    scope.reports = commonDataService.getReports();

                    scope.setVisibleControlsForReport = function() {
                        var report = angular.fromJson(scope.model.selectedReport);
                        switch (report.ID)
                        {
                            case reports.ASSET_DETAILS:
                            case reports.AUDIT_LOG:
                            case reports.INTELLIRINSE:
                            case reports.EXECUTIVE_SUMMARY:
                            case reports.ASSET_MAINTENANCE:
                            case reports.ASSET_MEASURES_LOG:
                            case reports.TICKET_LIST_BY_TIME:
                            case reports.TICKET_LIST_BY_LOCATION:
                            case reports.DIGITAL_ASSET_ALARM_ON_SUMMARY:
                            case reports.CALIBRATIONS:
                            case reports.INTELLITASK_SENSORS:
                            case reports.INTELLITASK_HANDHELDS:
                            case reports.INTELLITASK_DAILY_SUMMARY:
                            case reports.DATA_INTEGRITY:
                                scope.timeParameterVisible = true;
                                scope.warningParameterVisible = false;
                                scope.alarmParameterVisible = false;
                                break;

                            case reports.DAILY_SUMMARY:
                            case reports.ALARMS:
                                scope.timeParameterVisible = true;
                                scope.warningParameterVisible = true;
                                scope.alarmParameterVisible = false;
                                break;

                            case reports.INTELLICHEK:
                            case reports.INTELLICHECK_BY_LOCATION:
                                scope.timeParameterVisible = true;
                                scope.warningParameterVisible = false;
                                scope.alarmParameterVisible = true;
                                break;
                            default:
                                scope.timeParameterVisible = false;
                                scope.warningParameterVisible = false;
                                scope.alarmParameterVisible = false;
                        }
                    }

                    scope.onGenerateReport = function () {
                        var parameters =
                        {
                            reportID: scope.model.selectedReport,
                            locationID: scope.locationID,
                            startDate: undefined,
                            endDate: undefined,
                            includeWarnings: scope.model.showWarnings,
                            onlyAlarms: scope.model.showAlarms,
                            format: "PDF"
                        };

                        reportService.getReport(parameters).then(
                            function success(result) {
                                console.log('Report Created Successfully');
                            },
                            function error(result) {
                                console.log('Report failed');
                            }
                        );
                    };

                    scope.chartOptions = {
                        chart: {
                            type: 'pieChart',
                            height: 500,
                            x: function(d){return d.name;},
                            y: function(d){return d.value;},
                            showLabels: true,
                            transitionDuration: 500,
                            labelThreshold: 0.01,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            }
                        }
                    };

                    scope.onFromClick = function() {
                        var options = {
                            date: new Date(),
                            mode: 'date', // or 'time'
                            minDate: new Date() - 10000,
                            allowOldDates: true,
                            allowFutureDates: false,
                            doneButtonLabel: 'DONE',
                            doneButtonColor: '#F2F3F4',
                            cancelButtonLabel: 'CANCEL',
                            cancelButtonColor: '#000000'
                        };

                        //document.addEventListener("deviceready", function () {

                            $cordovaDatePicker.show(options).then(function(date){
                                alert(date);
                            });

                       // }, false);
                    }

                    scope.onToClick = function() {
                        var options = {
                            date: new Date(),
                            mode: 'date', // or 'time'
                            minDate: new Date() - 10000,
                            allowOldDates: true,
                            allowFutureDates: false,
                            doneButtonLabel: 'DONE',
                            doneButtonColor: '#F2F3F4',
                            cancelButtonLabel: 'CANCEL',
                            cancelButtonColor: '#000000'
                        };

                        //document.addEventListener("deviceready", function () {

                        $cordovaDatePicker.show(options).then(function(date){
                            alert(date);
                        });

                        // }, false);
                    }

                    getData();
                }
            };
        }]);