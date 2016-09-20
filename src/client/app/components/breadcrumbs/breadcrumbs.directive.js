(function(){
	angular
		.module('components')
		.directive('breadcrumbs',['$state',breadcrumbs]);
	function breadcrumbs(){
		return {
			restrict: 'E',
			templateUrl: 'app/components/breadcrumbs/breadcrumbs.html',
			controller: breadcrumbsCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function breadcrumbsCtrl($state){
		var vm = this;
		vm.init = init;
		function init(){
			vm.stateArray = $state.current.name.split('.');
		}
	}
})();