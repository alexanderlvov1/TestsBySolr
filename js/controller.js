'use strict';

// the storeController contains two objects:
// - store: contains the product list
// - cart: the shopping cart object
function storeController($scope, $http, $timeout, $routeParams, HttpService) {

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

                if(!$scope.test.answer) { return false;}

                $scope.test.answer_multip = $scope.test.answer.split(/\s+/);
                $scope.test.answer_multip_formated = '';
                for (var i=0;i<$scope.test.answer_multip.length;i++)
                {
                    //document.write(cars[i] + "<br>");
                    if($scope.test.answer_multip[i] && $scope.test.answer_multip[i].length > 0)  {
                        $scope.test.answer_multip_formated = $scope.test.answer_multip_formated + '+AND+answer_txt:' + $scope.test.answer_multip[i].replace(':', '') + '~0.6';
                    }
                }

                if($scope.test.answer_multip.length >= $scope.test.answer_txt.toString().split(/\s+/).length) {
                    var currentUri = 'http://localhost:8983/solr/collection1/select?q=id:' + $scope.test.id + $scope.test.answer_multip_formated + '&wt=json&json.wrf=JSON_CALLBACK&indent=true';
                    //var currentUri = encodeURIComponent('http://localhost:8983/solr/collection1/select?q=id%3A' + $scope.test.id + $scope.test.answer_multip_formated + '&wt=json&json.wrf=JSON_CALLBACK&indent=true');
                    HttpService.search(currentUri)
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