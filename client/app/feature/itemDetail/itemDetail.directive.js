(function(){
	angular
		.module('app.itemDetail')
		.directive('itemDetail',[itemDetail]);
	function itemDetail(){
		return {
			restrict: 'E',
			templateUrl: './app/feature/itemDetail/itemDetail.html',
			controller: itemDetailCtrl,
			controllerAs: 'vm',
			bindToCOntroller: true
		}
		function itemDetailCtrl(){
			var vm = this;
			vm.init = init;
			function init(){
				console.log('this is itemDetail page');
			}
		}
	}
})()