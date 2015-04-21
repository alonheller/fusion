angular.module('fusionLiveMobile.controllers')

    .controller('LoginCtrl', function ($scope, $ionicLoading, $state, $timeout, topologyService, loginService, commonDataService) {
        $scope.model = {server: '1.1.1.1', user: 'admin', password: 'admin'};

        $scope.errorMessage = '';

        // Move to utils
        function showProgress(message) {
            $ionicLoading.show({
                template: '<i class="ion-loading-c"></i><br/>' + message + '...'
            });
        }

        function hideProgress() {
            $ionicLoading.hide();
        }

        $scope.onLogin = function() {
            $scope.errorMessage = '';
            showProgress('Authenticating');

            // fake a login process
            $timeout(function () {
                //commonDataService.getCommonData()
                //topologyService.getRoot()
                hideProgress();
                $state.transitionTo('location', {'locationId': 2});
            }, 300)


        }
    }
);
