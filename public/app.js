'use strict';

angular.module('photobankApp', ['ngRoute']);

angular.module('photobankApp').config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/', {
            templateUrl: './views/auth.html'
        }).
        when('/albums', {
            templateUrl: './views/albums.html',
            controller: 'AlbumsCtrl'
        }).
        when('/albums/:albumId/photos', {
            templateUrl: './views/photos.html',
            controller: 'PhotosCtrl'
        }).
        when('/activity', {
            templateUrl: './views/activity.html',
            controller: 'ActivityCtrl'
        }).
        otherwise({redirectTo: '/'});
    }
]);

angular.module('photobankApp').controller('AuthCtrl', ['$scope', 'Auth', '$http', '$location',
    function ($scope, Auth, $http, $location) {
        var check = function () {
            $http.get('/profile').success(function (res) {
                Auth.setUser(res.user);
                console.log('REDIRECT');
                $location.path('/albums');
            }).error(function (data, status) {
                console.log(data, status);
                Auth.setUser(null);
                console.log('REDIRECT');
                $location.path('/');
            });
        };
        check();
    }
]);

angular.module('photobankApp').controller('AlbumsCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http) {
        $scope.albums = [];

        $scope.activity = function () {
            $http.get('/activity/new?event=albums').success(function (success) {
                console.log(success);
            }).error(function (data, status) {
                console.log(data, status);
            });
        };

        $scope.init = function () {
            $http.get('/albums').success(function (albums) {
                $scope.albums = albums;
            }).error(function (data, status) {
                console.log(data, status);
            });
        };
    }
]);

angular.module('photobankApp').controller('PhotosCtrl', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $scope.photos = [];

        $scope.activity = function () {
            $http.get('/activity/new?event=photos').success(function (success) {
                console.log(success);
            }).error(function (data, status) {
                console.log(data, status);
            });
        };

        $scope.init = function () {
            $http.get('/albums/' + $routeParams.albumId + '/photos').success(function (photos) {
                $scope.photos = photos;
            }).error(function (data, status) {
                console.log(data, status);
            });
        };

    }
]);

angular.module('photobankApp').controller('ActivityCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.activities = [];

        $scope.init = function () {
            $http.get('/activity').success(function (activities) {
                $scope.activities = activities;
            }).error(function (data, status) {
                console.log(data, status);
            });
        };
    }
]);

angular.module('photobankApp').run(['$rootScope', '$location', 'Auth', '$http', function ($rootScope, $location, Auth, $http) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        var route = next || current;
        if (!Auth.isLoggedIn()) {
            $http.get('/profile').success(function (res) {
                console.log('ALLOW');
                Auth.setUser(res.user);
            }).error(function () {
                console.log('DENY');
                event.preventDefault();
                console.log('REDIRECT');
                $location.path('/');
            });
        } else {
            console.log('ALLOW');
            if (route && route.$$route && route.$$route.originalPath && route.$$route.originalPath === '/') {
                event.preventDefault();
                console.log('REDIRECT');
                $location.path('/albums');
            }
        }
    });
}]);

angular.module('photobankApp').factory('Auth', function () {
    var user;

    return {
        setUser: function (aUser) {
            user = aUser;
        },
        isLoggedIn: function () {
            return (user) ? user : false;
        }
    }
});