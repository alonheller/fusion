angular.module('fusionLiveMobile.controllers')

    .controller('LocationCtrl', function ($scope, $state, $stateParams, $ionicLoading, topologyService) {

        $scope.$on('topologyRefreshEvent', function(e) {
            init();
        });

        $scope.$on("$stateChangeSuccess", function updatePage() {
            $scope.state = $state.current.name;
            switch ($state.current.name) {
                case 'location':
                    $scope.items = topologyService.getItemChildren($state.params.locationId);
                    //$scope.selectedObjectName = topologyService.getLocation($state.params.locationId).name;
                    break;
                case 'location.asset':
                    $scope.items = topologyService.getItemMeasures($state.params.assetId);
                    $scope.selectedObjectName = topologyService.getAsset($state.params.assetId).name;
                    break;
                case 'location.asset.assetMeasure':
                    $scope.items = [topologyService.getAssetMeasure($state.params.assetMeasureId)];
                    $scope.selectedObjectName = topologyService.getAssetMeasure($state.params.assetMeasureId).name;
                    break;
            }
        });

        // Move to utils
        function showProgress(message) {
            $ionicLoading.show({
                template: '<i class="ion-loading-c"></i><br/>' + message + '...'
            });
        }

        function hideProgress() {
            $ionicLoading.hide();
        }

        function init() {
            $scope.items = topologyService.getRootLocation().children;
        }

        init();
    }
);
