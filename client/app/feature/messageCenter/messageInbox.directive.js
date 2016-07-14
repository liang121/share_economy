(function(){
	angular
		.module('app.messageCenter')
		.directive('messageInbox',[messageInbox]);
	function messageInbox(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/messageCenter/messageBox.html',
			controller: messageInboxCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function messageInboxCtrl($scope){
		var vm = this;
		vm.init = init;
		vm.getMessage = getMessage;
		function init(){
			vm.boxContents = [];
			vm.templateId = 'inBox';
			vm.getMessage('systemMessages');
			$scope.$watch('vm.boxContents',function(newVal,oldVal){
				if(!angular.equals(newVal,oldVal)){
					var i = 0;
					for(i=0;i<newVal.length;i++){
						if(newVal[i].selected){
							vm.showManulButton = true;
							break;
						}
						if(i==newVal.length-1){
							vm.showManulButton = false;
						}
					}
				}
			},true);
		}
		function getMessage(messageProp){
			switch(messageProp){
				case 'systemMessages':
					vm.boxContents = [
										{
											title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
											date: '2015/12/28',
											time: '22:28:31',
											selected: false,
											isReaded: false
										},
										{
											title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
											date: '2015/12/27',
											time: '17:30:23',
											selected: false,
											isReaded: true
										},
										{
											title: 'Your Amazon.com order',
											date: '2015/12/27',
											time: '09:38:38',
											selected: false,
											isReaded: true
										},
										{
											title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
											date: '2015/12/27',
											time: '09:13:30',
											selected: false,
											isReaded: false
										},
										{
											title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
											date: '2015/12/28',
											time: '22:28:31',
											selected: false,
											isReaded: true
										},
										{
											title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
											date: '2015/12/27',
											time: '17:30:23',
											selected: false,
											isReaded: true
										},
										{
											title: 'Your Amazon.com order',
											date: '2015/12/27',
											time: '09:38:38',
											selected: false,
											isReaded: true
										},
										{
											title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
											date: '2015/12/27',
											time: '09:13:30',
											selected: false,
											isReaded: true
										}
									];
					break;
					case 'biddingMessages' : 
					vm.boxContents = [
										
										{
											title: 'Your Amazon.com order',
											date: '2015/12/27',
											time: '09:38:38',
											selected: false,
											isReaded: true
										},
										{
											title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
											date: '2015/12/27',
											time: '09:13:30',
											selected: false,
											isReaded: true
										}
									];
					break;
					case 'traderMessages' : 
					vm.boxContents = [];
					break;
					case 'ItemsMessages' : 
					vm.boxContents = [
										{
											title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
											date: '2015/12/27',
											time: '09:13:30',
											selected: false,
											isReaded: true
										}
									];
					break;

			}
			
		}
	}
})();