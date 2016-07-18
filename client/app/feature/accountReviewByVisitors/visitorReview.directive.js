(function(){
	angular
		.module('app.visitorReview')
		.directive('visitorReview',visitorReview);
	function visitorReview(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/accountReviewByVisitors/visitorReview.html',
			controller: visitorReviewCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function visitorReviewCtrl(){
		var vm = this;
		vm.init = init();
		function init(){
			vm.labels = ["Wait Bids", "Cancel Bids", "Success Bids"];
  			vm.data = [3, 5, 1];
		}		
	}
})()