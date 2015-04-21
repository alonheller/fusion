angular.module('fusionLiveMobile.directives')
    .directive('ecsNavigator',
    [
        '$state',
        '$ionicScrollDelegate',
        'topologyTypes',
        function ($state, $ionicScrollDelegate, topologyTypes) {
            return {
                restrict: 'EA',
                templateUrl: 'js/directives/ecsNavigator/ecsNavigator.html',
                scope: {
                    items: '='
                },
                link: function (scope, element, attrs) {
                    scope.navTitle = 'Entry Page';
                    scope.onItemClick = function (item) {
                        //var addToBreadCrumbs = false;
                        switch (item.type) {
                            case topologyTypes.LOCATION.innerType:
                                $state.go('location', {'locationId': item.id});
                                break;
                            case topologyTypes.ASSET.innerType:
                                $state.go('location.asset', {'assetId': item.id});
                                break;
                            case topologyTypes.ASSET_MEASURE.innerType:
                                if ($state.current.name !== 'location.asset.assetMeasure') {
                                    $state.go('location.asset.assetMeasure', {'assetMeasureId': item.id});
                                }
                                break;
                        }
                        //$ionicScrollDelegate.scrollTop(true, true);
                    }
                }
            };
        }]);