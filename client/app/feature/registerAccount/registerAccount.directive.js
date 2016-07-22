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
        vm.isSubmitted = false;
        function init(){
            vm.registerObj = {};
        }
        function registerAccount(form){
            console.log(form);
            vm.isSubmitted = true;
            if(vm.registerObj.password !== vm.registerObj.retypePassword){
                vm.retypeUncorrect = true;
            }
            if(form.$valid){
                vm.registerObj.role = 'user';
                $http.post('registerAccount',vm.registerObj).then(function(req,res){
                    console.log(vm.registerObj);
                })
            }
        }
    }
})()