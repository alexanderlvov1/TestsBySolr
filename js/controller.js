'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $http, $routeParams, DataService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }

    $http({
        method: 'JSONP',
        //url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
        url: 'http://localhost:8983/solr/collection1/select?q=*%3A*&wt=json&json.wrf=JSON_CALLBACK&fl=id,text_txt&indent=true&rows=2147483647'
        //&wt=json&json.wrf=callback
    }).success(function(data, status) {
            //http://localhost:8983/solr/collection1/select?q=*%3A*&wt=json&fl=id,text_txt&indent=true
           /* {
                "responseHeader":{
                "status":0,
                    "QTime":5,
                    "params":{
                    "q":"*:*",
                        "indent":"true",
                        "fl":"id,text_txt",
                        "wt":"json"}},
                "response":{"numFound":16,"start":0,"docs":[
                {
                    "id":"id1001",
                    "text_txt":["How much is 2+2"]},
                {
                    "id":"id1002",
                    "text_txt":["What?"]},
                {*/

            // Now we have a list of the stories (data.list.story)
            // in the data object that the NPR API
            // returns in JSON that looks like:
            // data: { "list": {
            //   "title": ...
            //   "story": [
            //     { "id": ...
            //       "title": ...

            //$scope.programs = data.list.story;
            $scope.tests = data.response.docs;
            //$scope.tests = '{"tests":[{"id":"123"},{"id":"333"},{"id":"567"}]}';
        }).error(function(data, status) {
            // Some error occurred
            alert(data);
        });
}
