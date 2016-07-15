(function(){
	angular
		.module('app.lists')
		.directive('wishList',wishList);
	function wishList(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/lists/wishList.html',
			controller: wishListCtrl,
			controllerAs: 'vm',
			bandToController: true
		}
		function wishListCtrl(){
			var vm = this;
			vm.init = init;
			function init(){
				vm.totalItems = 64;
  				vm.currentPage = 4;
			}
		}
	}
})()