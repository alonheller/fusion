angular.module('fusionLiveMobile.directives')
    .directive('assetBoard',
    [
        '$state',
        '$ionicLoading',
        '$ionicTabsDelegate',
        'topologyService',
        'alarmService',
        function ($state, $ionicLoading, $ionicTabsDelegate, topologyService, alarmService) {
            return {
                restrict: 'EA',
                templateUrl: 'js/directives/assetBoard/assetBoard.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.assetId = $state.params.assetId;

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
                        scope.assetId = $state.params.assetId;
                        getData();
                    });

                    function getData() {
                        scope.onTabSelected($ionicTabsDelegate.selectedIndex());
                    }

                    scope.onTabSelected = function(index) {
                        switch (index) {
                            case 0:
                                getAssetInfo();
                                break;
                            case 1:
                                // TODO: Status
                                break;
                            case 2:
                                getAssetAlarms();
                                break;
                            case 3:
                                getAssetTickets();
                                break;
                        }
                        // When using ng-click, we have to explicitly select the tab
                        $ionicTabsDelegate.$getByHandle('asset-tabs').select(index);
                    };

                    function getAssetInfo() {
                        showProgress('Getting Asset Information...');

                        topologyService.getAssetInformation(scope.assetId).then(
                            function success(result) {
                                scope.assetInfo = result;
                                hideProgress();
                            },
                            function error(result) {
                                scope.assetInfo = null;
                                hideProgress();
                            }
                        )
                    }

                    function getAssetAlarms() {
                        showProgress('Getting Asset Alarms...');
                        alarmService.getAssetAlarms(scope.assetId, true).then(
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

                    function getAssetTickets() {
                        topologyService.getAssetTickets(scope.assetId).then(
                            function success(result) {
                                scope.tickets = result.$values;
                                $ionicLoading.hide();
                            },
                            function error(result) {
                                scope.tickets = null;
                                $ionicLoading.hide();
                            }
                        )
                    }

                    getData();
                }
            };
        }]);