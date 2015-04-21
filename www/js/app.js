// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('fusionLiveMobile', ['ionic', 'ngCookies', 'fusionLiveMobile.filters', 'fusionLiveMobile.controllers', 'fusionLiveMobile.services', 'fusionLiveMobile.consts', 'fusionLiveMobile.directives', 'nvd3'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post['Content-Type'] = 'ecs/json';

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('login', {
                url: '/login',
                views: {
                    'mainContainer': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('location', {
                url: '/location/:locationId',
                views: {
                    'mainContainer': {
                        templateUrl: 'templates/location.html',
                        controller: 'LocationCtrl'
                    }
                }
            })

            .state('location.asset', {
                url: "/asset/:assetId",
                views: {
                    'mainContainer': {
                        templateUrl: "templates/location.html",
                        controller: 'LocationCtrl'
                    }
                }
            })

            .state('location.asset.assetMeasure', {
                url: "/assetMeasure/:assetMeasureId",
                views: {
                    'mainContainer': {
                        templateUrl: "templates/location.html",
                        controller: 'LocationCtrl'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });