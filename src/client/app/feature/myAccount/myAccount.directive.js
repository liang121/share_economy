(function(){
   angular
       .module('app.myAccount')
       .directive('myAccount',myAccount);
   function myAccount(){
       return {
           restrict: 'E',
           controller: myAccountCtrl,
           controllerAs: 'vm',
           templateUrl: 'app/feature/myAccount/myAccount.html',
           bindToController: true
       }
   }
    function myAccountCtrl(){
        var vm = this;
        vm.init = init;
        function init(){
            vm.isOpen = {};
            vm.isOpen.login = false;
            vm.rate = 3;
            vm.max = 5;
        }
    }
})()