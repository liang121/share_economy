(function(){
	angular
		.module('app.lists')
		.directive('waitList',waitList);
	function waitList(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/lists/waitList.html',
			controller: waitListCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function waitListCtrl(){
		var vm = this;
		vm.init = init;
		function init(){
			
		}
	}
})()