'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $http, $timeout, $routeParams, DataService, HttpService) {

    // get store and cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    var timeout;

    HttpService.search('http://localhost:8983/solr/collection1/select?q=*%3A*&wt=json&json.wrf=JSON_CALLBACK&indent=true&rows=2147483647')
        .success(function(data, status) {
            $scope.tests = data.response.docs;

        });

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }



}

function watchController($scope, $http, $timeout, $routeParams, DataService, HttpService) {
    var timeout;

    $scope.$watch('test', function(newVal) {
        if ($scope.test.answer != undefined) {
            if (timeout) $timeout.cancel(timeout);
            timeout = $timeout(function() {
                HttpService.search('http://localhost:8983/solr/collection1/select?q=id%3A' + $scope.test.id + '+AND+answer_txt%3A' + $scope.test.answer + '&wt=json&json.wrf=JSON_CALLBACK&indent=true')
                //HttpService.search('http://localhost:8983/solr/collection1/select?q=id%3A' + $scope.test.id + '+%26+answer_txt%3A' + $scope.test.answer + '&wt=json&json.wrf=JSON_CALLBACK&indent=true')
                //HttpService.search('http://localhost:8983/solr/collection1/select?q=id%3ACIPC3_19+%26+answer_txt%3A%22SAPHIRE%3ABLUE%22&wt=json&json.wrf=JSON_CALLBACK&indent=true')
                 .success(function(data, status) {
                        if(data.response.docs[0]) {
                            $scope.test.found_answer = data.response.docs[0].answer_txt;
                            $scope.test.isCorrect = true;
                            //alert('hej');
                        } else {
                            $scope.test.found_answer = '';
                            $scope.test.isCorrect = false;
                        }
                 });

            }, 500);
            //alert('hej');
        }
    }, true);

}