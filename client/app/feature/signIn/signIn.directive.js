(function(){
	angular
		.module('app.signIn')
		.directive('signIn',['$localStorage','$state','$http','snapLightboxService','$rootScope',signIn]);
	function signIn(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/signIn/signIn.html',
			controllerAs: 'vm',
			controller: signInCtrl,
			bindToController: true
		}
	}
	function signInCtrl($localStorage,$state,$http,snapLightboxService,$rootScope){
		var vm = this;
		vm.init = init;
		vm.signIn = signIn;
		vm.asTourist = asTourist;
		vm.openModal = openModal;
		vm.closeModal = closeModal;
		vm.continued = continued;
		function init(){
			vm.storage = $localStorage;
			vm.pass = true;
			vm.signInObj = {};
			vm.chooseEmail = true;
			vm.isContinued = false;
		}
		function signIn(){
			$http.post('api/signIn',vm.signInObj).then(function(res){
                if( res.data.status === 'success'){
                    // $rootScope.$broadcast('hasSignedIn');
                    // snapLightboxService.close($rootScope,'#signIn');
					$localStorage.user = res.data;
                    $state.go('shareeconomy.home');
                }else{
                	vm.pass = false;
				}
            })
		}
		function asTourist(){
			$state.go('shareeconomy.home');
			$localStorage.user = {};
			$localStorage.user.role = 'tourist';
		}
		function openModal(modalId){
			snapLightboxService.open($rootScope,modalId);
		}
		function closeModal(modalId){
			snapLightboxService.close($rootScope,modalId);
		}
		function continued(){
			vm.isContinued = true;
		}
	}
})();