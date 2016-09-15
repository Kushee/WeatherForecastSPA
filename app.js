// MODULE

var weatherSPA = angular.module('weatherSPA', ['ngRoute', 'ngResource']);

//ROUTES

weatherSPA.config(function($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'homeController'
            })
            .when('/forecast', {
                templateUrl: 'views/forecast.html',
                controller: 'forecastController'
            })
            .when('/forecast/:days', {
                templateUrl: 'views/forecast.html',
                controller: 'forecastController'
            })
            .otherwise({
                redirectTo:'/'
            });
});

//SERVICES

weatherSPA.service('cityService', function(){

    this.city = 'New York, US';

});
//CONTROLLERS

weatherSPA.controller('homeController', ['$scope','cityService', function($scope, cityService) {

    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });

}]);

weatherSPA.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

    $scope.city = cityService.city;

    $scope.days = $routeParams.days || '2';

    console.log("$routeParams" + $routeParams.pathname);

    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=62a496f762cfefc257fce62cf15fdeaf",
        {callback: "JSON_CALLBACK"}, {get: {method: "JSONP"}});

    $scope.weatherResult = $scope.weatherAPI.get({ q:$scope.city, cnt:$scope.days });

    console.log($scope.weatherResult);

    $scope.convertToFahrenheit = function(kelvin) {
        return Math.round((1.8 * (kelvin - 273)) + 32);
    };

    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000);
    };

    $scope.weatherIconClass = function(w) {
        console.log(w.weather[0].id);
        return "wi-owm-"+ w.weather[0].id;
    };


}]);

//DIRECTIVES

weatherSPA.directive("weatherReport", function() {
  return {
      restrict: 'E',
      templateUrl: 'templates/weatherReport.html',
      replace: true,
      scope: {
          weatherDay: "=",
          convertToStandardTemp: "&",
          convertToStandardDate: "&",
          className: "&",
          dateFormat: "@"
      }
  }
});

