angular.module('fusionLiveMobile.services')

    .factory('loginService', function ($q, networkService) {
        var login = function(server, user, password, rememberMe) {
            return networkService.login(server, user, password, rememberMe);
        }

        return {
            login: function(server, user, password, rememberMe) {
                return login(server, user, password, rememberMe)
            }
        }
    })