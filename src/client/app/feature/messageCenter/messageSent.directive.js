(function(){
	angular
		.module('app.messageCenter')
		.directive('messageSent',[messageSent]);
	function messageSent(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/messageCenter/messageBox.html',
			controller: messageSentCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function messageSentCtrl($scope){
		var vm = this;
		vm.init = init;
		vm.getMessage = getMessage;
		function init(){
			vm.boxContents = [];
			vm.templateId = 'sent';
			vm.getMessage('sentMessages');
		}
		function getMessage(messageProp){
			switch (messageProp){
				case 'sentMessages':
					vm.boxContents = [];
				break;
			}
		}
	}
})();