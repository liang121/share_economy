(function(){
	angular
		.module('app.signIn')
		.directive('signIn',['$localStorage','$state','$http',signIn]);
	function signIn(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/signIn/signIn.html',
			controllerAs: 'vm',
			controller: signInCtrl,
			bindToController: true
		}
	}
	function signInCtrl($localStorage,$state,$http){
		var vm = this;
		vm.init = init;
		vm.signIn = signIn;
		vm.asTourist = asTourist;
		function init(){
			vm.storage = $localStorage;
			vm.pass = true;
			vm.signInObj = {};
		}
		function signIn(){
			$http.post('signIn',vm.signInObj).then(function(res){
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
	}
})();