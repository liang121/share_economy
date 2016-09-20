(function(){
    angular
        .module('app.registerAccount')
        .directive('registerAccount',['$http',registerAccount]);
    function registerAccount(){
        return {
            restrict: 'E',
            templateUrl: 'app/feature/registerAccount/registerAccount.html',
            controller: registerAccountCtrl,
            controllerAs: 'vm',
            bindToController: true
        }
    }
    function registerAccountCtrl($http){
        var vm = this;
        vm.init = init;
        vm.registerAccount = registerAccount;

        function init(){
            vm.registerObj = {};
            vm.isSubmitted = false;

        }
        function registerAccount(form){
            vm.isSubmitted = true;
            if(vm.registerObj.password !== vm.registerObj.retypePassword){
                vm.retypeUncorrect = true;
            }else{
                vm.retypeUncorrect = false;
            }
            if(form.$valid&&!vm.retypeUncorrect){
                vm.registerObj.role = 'user';
                $http.post('api/registerAccount',vm.registerObj).then(function(res){
                    if(res.status===200){
                        vm.showSuccessAlert = true;
                    }
                })
            }
        }
    }
})()