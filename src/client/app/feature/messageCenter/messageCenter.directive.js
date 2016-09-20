(function(){
	angular
		.module('app.messageCenter')
		.directive('messageCenter',['$location',messageCenter]);
	function messageCenter(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/messageCenter/messageCenter.html',
			controller: messageCenterCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function messageCenterCtrl($location,$scope){
		var vm = this;
		vm.init = init;
		vm.setFilterCondition = setFilterCondition
		function init(){
			vm.chooseInbox = true;
			vm.filterCondition = 'All Messages';
			$scope.$on('inboxNow',function(event,value){
				vm.chooseInbox = value;
			})
		}
		function setFilterCondition(condition,conditionName){
			vm.filterCondition = conditionName
			$scope.$broadcast('setMessageFilterCondition',{filterCondition:condition,enable:true});
		}
	}
})();