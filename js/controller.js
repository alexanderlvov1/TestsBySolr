'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $http, $timeout, $routeParams, HttpService) {

    // get store and cart from service
    //$scope.store = DataService.store;
    //$scope.cart = DataService.cart;
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

function watchController($scope, $http, $timeout, $routeParams, HttpService) {
    var timeout;

    $scope.$watch('test', function(newVal) {
        if ($scope.test.answer != undefined) {
            if (timeout) $timeout.cancel(timeout);
            timeout = $timeout(function() {

                $scope.test.answer_multip = $scope.test.answer.split(/\s+/);
                $scope.test.answer_formated = '';
                for (var i=0;i<$scope.test.answer_multip.length;i++)
                {
                    //document.write(cars[i] + "<br>");
                    $scope.test.answer_formated = $scope.test.answer_formated + '+AND+answer_txt%3A' + $scope.test.answer_multip[i] + '~0.6';
                }

                if($scope.test.answer_multip.length >= $scope.test.answer_txt.toString().split(/\s+/).length) {
                    HttpService.search('http://localhost:8983/solr/collection1/select?q=id%3A' + $scope.test.id + $scope.test.answer_formated + '&wt=json&json.wrf=JSON_CALLBACK&indent=true')
                        //HttpService.search('http://localhost:8983/solr/collection1/select?q=id%3A' + $scope.test.id + '+AND+answer_txt%3A' + $scope.test.answer + '&wt=json&json.wrf=JSON_CALLBACK&indent=true')
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
                }

            }, 500);
            //alert('hej');
        }
    }, true);

}