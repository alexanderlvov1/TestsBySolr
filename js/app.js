'use strict';

// App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
// the route provides parses the URL and injects the appropriate partial page
var storeApp = angular.module('AngularStore', ['ngRoute']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/store', {
        templateUrl: 'partials/store.htm',
        controller: storeController 
      }).
/*      when('/products/:productSku', {
        templateUrl: 'partials/product.htm',
        controller: storeController
      }).
      when('/cart', {
        templateUrl: 'partials/shoppingCart.htm',
        controller: storeController
      }).*/
      otherwise({
        redirectTo: '/store'
      });
}]);

// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory('HttpService', ['$http', function($http) {
    var doRequest = function(searchField) {
        return $http({
            method: 'JSONP',
            url: searchField
            //url: nprUrl + '&searchField=' + searchField + '&callback=JSON_CALLBACK'
        });
    }

    return {
        search: function(searchField) { return doRequest(searchField); }
    };
}]);

