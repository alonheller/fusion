angular.module('fusionLiveMobile.filters').filter('beautyDate',
    function () {
        return function(strDate) {
            //return moment('2013-05-09T18:55:07.148258Z').format("MMMM Do YYYY, h:mm:ss a");
            return moment(strDate).format("MMMM Do YYYY, h:mm:ss a");
        };
    }
);
