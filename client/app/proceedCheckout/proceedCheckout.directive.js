(function(){
    angular
        .module('app.proceedCheckout')
        .directive('proceedCheckout',proceedCheckout);
    function proceedCheckout(){
        return {
            restrict: 'E',
            templateUrl: 'app/proceedCheckout/proceedCheckout.html',
            controller: proceedCheckoutCtrl,
            controllerAs: 'vm',
            bindToController: true
        }
    }
    function proceedCheckoutCtrl(){
        var vm = this;
        vm.init = init;
        function init(){
            vm.quantity = ['1','2','3','4','5','6','7','8','9','10+'];
        }
    }
})()