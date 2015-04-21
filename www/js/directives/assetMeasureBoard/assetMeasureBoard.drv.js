angular.module('fusionLiveMobile.directives')
    .directive('assetMeasureBoard',
    [
        '$state',
        '$ionicLoading',
        'topologyService',
        function ($state, $ionicLoading, topologyService) {
            return {
                restrict: 'EA',
                templateUrl: 'js/directives/assetMeasureBoard/assetMeasureBoard.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.assetMeasureId = $state.params.assetMeasureId;

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
                        scope.assetMeasureId = $state.params.assetMeasureId;
                        getData();
                    });

                    function getData() {
                        // TODO: Get relevant data for selected tab
                        getAsetMeasureInfo();
                    }

                    function getAsetMeasureInfo() {
                        showProgress('Getting Asset Measure Information...');

                        topologyService.getAssetMeasureInformation(scope.assetMeasureId).then(
                            function success(result) {
                                scope.assetMeasureInfo = result;
                                hideProgress();
                            },
                            function error(result) {
                                scope.assetMeasureInfo = null;
                                hideProgress();
                            }
                        )
                    }

                    getData();
                }
            };
        }]);