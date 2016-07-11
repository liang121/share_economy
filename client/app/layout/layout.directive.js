(function () {
    angular
        .module('app.layout')
        .directive('layout',['snapLightboxService','$rootScope','$http',layout])
    function layout(){
        return {
            restrict: 'E',
            templateUrl: 'app/layout/layout.html',
            controllerAs: 'vm',
            controller: layoutCtrl,
            bindtoController: true
        }
    }
    function layoutCtrl(snapLightboxService,$rootScope,$http){
        var vm = this;
        vm.init = init;
        vm.openModal = openModal;
        vm.closeModal = closeModal;
        vm.registerAccount = registerAccount;
        vm.signIn = signIn;
        function init(){
            vm.registerObj = {};
        }
        function openModal(modalId){
           snapLightboxService.open($rootScope,modalId);
        }
        function closeModal(modalId){
            snapLightboxService.close($rootScope,modalId);
        }
        function registerAccount(){
            $http.post('registerAccount',vm.registerObj).then(function(req,res){

                console.log(vm.registerObj);
            })
        }
        function signIn (){
            $http.post('signIn',vm.signInObj).then(function(res){
                if( res.data === 'signIn successfully'){
                    $rootScope.$broadcast('hasSignedIn');
                    snapLightboxService.close($rootScope,'#signIn');
                }
            })
        }
    }
})()