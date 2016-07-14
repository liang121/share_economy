(function(){
	angular
		.module('app.messageCenter')
		.directive('messageCenter',messageCenter);
	function messageCenter(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/messageCenter/messageCenter.html',
			controller: messageCenterCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function messageCenterCtrl(){
		var vm = this;
		vm.init = init;
		function init(){

		}
	}
})();