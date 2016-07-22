(function () {
    angular
        .module('app.layout')
        .directive('layout',['snapLightboxService','$rootScope','$http','$state','$localStorage','$window',layout])
    function layout(){
        return {
            restrict: 'E',
            templateUrl: 'app/feature/layout/layout.html',
            controllerAs: 'vm',
            controller: layoutCtrl,
            bindtoController: true
        }
    }
    function layoutCtrl(snapLightboxService,$rootScope,$http,$state,$localStorage,$window){
        var vm = this;
        vm.init = init;
        vm.openModal = openModal;
        vm.closeModal = closeModal;
        vm.registerAccount = registerAccount;
        vm.signIn = signIn;
        vm.isCertified = isCertified;
        vm.logout = logout;
        function init(){
            vm.registerObj = {};
            vm.isUser = false;
            vm.isCertified();
        }
        function isCertified(){
            if($localStorage.user&&$localStorage.user.role === 'tourist'){
                vm.isTourist = true;
            }else if($localStorage.user&&$localStorage.user.role === 'user'){
                vm.isUser = true;
                vm.userName = $localStorage.user.userName;
            }
            // if(!$localStorage.user) {
            //     $state.go('shareeconomy.signIn');
            // }else{
            //     if($localStorage.user.role==='tourist'){
            //         vm.isUser = false;
            //     }else{
            //         vm.isUser = true;
            //     }
            //
            // }
        }
        function logout(){
            delete $localStorage.user;
            vm.userName = 'sign in'
            $state.go('shareeconomy.signIn');
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