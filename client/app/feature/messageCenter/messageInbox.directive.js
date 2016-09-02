(function(){
	angular
		.module('app.messageCenter')
		.directive('messageInbox',['$stateParams','$http','snapLightboxService','$rootScope',messageInbox]);
	function messageInbox(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/messageCenter/messageBox.html',
			controller: messageInboxCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function messageInboxCtrl($scope,$stateParams,$http,snapLightboxService,$rootScope){
		var vm = this;
		vm.init = init;
		vm.getMessage = getMessage;
		vm.operateMessage = operateMessage;
		function init(){
			vm.boxContents = [];
			vm.templateId = 'inBox';
			vm.messageBoxType = $stateParams.messageBoxType;
			vm.filterCondition = null;
			vm.selectedItemsId = [];
			vm.modalItem = {};
			vm.openModal = openModal;
			vm.closeModal = closeModal;
			vm.getMessage(vm.messageBoxType);
			$scope.$watch('vm.boxContents',function(newVal,oldVal){
				vm.selectedItemsId = [];
				if(!angular.equals(newVal,oldVal)){
					var i = 0;
					for(i=0;i<newVal.length;i++){
						if(newVal[i].selected){
							vm.showManulButton = true;
							vm.selectedItemsId.push(newVal[i]._id);
							if(newVal[i].isReaded === false){
								vm.mark = 'Mark As Read';
							}else{
								vm.mark = 'Mark As UnRead';
							}
						}
					}
					if(vm.selectedItemsId.length===0){
						vm.showManulButton = false;
					}
				}
			},true);
			$scope.$emit('inboxNow',true);
			$scope.$on('setMessageFilterCondition',function(event,obj){
				vm.filterCondition = obj.filterCondition;
			})
		}
		function getMessage(messageProp){
			vm.messageBoxType = messageProp;
			switch(messageProp){
				case 'System Messages':
					$http.post('api/inbox/systemMessages/operate',{action:'G'}).then(function(res){
						if(res){
							angular.copy(res.data,vm.boxContents)
						}
					})
					// vm.boxContents = [
					// 					{
					// 						title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
					// 						date: '2015/12/28',
					// 						time: '22:28:31',
					// 						selected: false,
					// 						isReaded: false
					// 					},
					// 					{
					// 						title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
					// 						date: '2015/12/27',
					// 						time: '17:30:23',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Your Amazon.com order',
					// 						date: '2015/12/27',
					// 						time: '09:38:38',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
					// 						date: '2015/12/27',
					// 						time: '09:13:30',
					// 						selected: false,
					// 						isReaded: false
					// 					},
					// 					{
					// 						title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
					// 						date: '2015/12/28',
					// 						time: '22:28:31',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Your Amazon.com order has shipped (#106-0621266-4893841)',
					// 						date: '2015/12/27',
					// 						time: '17:30:23',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Your Amazon.com order',
					// 						date: '2015/12/27',
					// 						time: '09:38:38',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Successful cancellation item(s) from your Amazon.com order #(106-4505514-5033055) ',
					// 						date: '2015/12/27',
					// 						time: '09:13:30',
					// 						selected: false,
					// 						isReaded: true
					// 					}
					// 				];
					break;
				case 'Bid Messages' :
					$http.post('api/inbox/bidMessages/operate',{action:'G'}).then(function(res){
						if(res){
							angular.copy(res.data,vm.boxContents)
						}
					})
					// vm.boxContents = [
					// 					{
					// 						title: 'Yinyu Niu provide a bid# 103756',
					// 						messageHeader:{
					// 							date: '2016/11/27',
					// 							time: '09:38:38',
					// 							itemNum: '1021434',
					// 							bidNum: '103756',
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent:'Moyu, Yinyu Niu provided you a bid related to Item# 1021434: SD Card, you can click the below link to see the bid detail',
					// 						selected: false,
					// 						isReaded: false
					// 					},
					// 					{
					// 						title: 'Yinyu Niu collect your Item# 1021434: SD Card',
					// 						messageHeader:{
					// 							date: '2016/11/27',
					// 							time: '09:38:38',
					// 							itemNum: '1021434',
					// 							bidNum: null,
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent:'Moyu, YinYu Niu collected your Item# 1021434: SD Card',
					// 						selected: false,
					// 						isReaded: false
					// 					},
					// 					{
					// 						title: 'Yinyu Niu cancel the bid# 033055',
					// 						messageHeader:{
					// 							date: '2016/11/25',
					// 							time: '09:13:30',
					// 							itemNum: '1021433',
					// 							bidNum: '033055',
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Yinyu Niu cancel the bid# 033055 related to item# 1021433: USB cable',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Yinyu Niu bargain on the bid# 033055',
					// 						messageHeader:{
					// 							date: '2016/11/25',
					// 							time: '09:13:30',
					// 							itemNum: '1021433',
					// 							bidNum: '033055',
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Yinyu Niu bargain the bid# 033055 related to item# 1021433: USB cable',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 				];
					break;
				// case 'traderMessages' :
					// vm.boxContents = [
					// 					{
					// 						title: 'Moyu: Can you rate the deal# 13241?',
					// 						messageHeader:{
					// 							date: '2016/07/25',
					// 							time: '21:21:40',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13241',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13241, can you rate comment on this transaction with Yinyu Niu? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'Congratulations! You Can Pay with Discover Cashback Bonus at xChange.com',
					// 						messageHeader:{
					// 							date: '2016/07/23',
					// 							time: '10:17:27',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: null,
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you can pay with Discover Credit Card to get 5% cashback bonus at xChange.com. Pay more, get more !',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13242 ?',
					// 						messageHeader:{
					// 							date: '2016/07/18',
					// 							time: '00:19:57',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13242',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13242, can you rate comment on this transaction with Yinyu Niu? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13243 ?',
					// 						messageHeader:{
					// 							date: '2015/12/27',
					// 							time: '10:17:27',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13243',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13243, can you rate comment on this transaction with Yinyu Niu? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13244 ?',
					// 						messageHeader:{
					// 							date: '2015/12/27',
					// 							time: '9:17:27',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13244',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13244, can you rate comment on this transaction with Yinyu Niu? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13245 ?',
					// 						messageHeader:{
					// 							date: '2015/12/24',
					// 							time: '10:37:27',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13245',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13245, can you rate comment on this transaction with Yinyu Niu? ',
					// 						date: '2015/12/24',
					// 						time: '10:37:27',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13246 ?',
					// 						messageHeader:{
					// 							date: '2015/11/27',
					// 							time: '14:17:20',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13246',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13246, can you rate comment on this transaction with Yinyu Niu ? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'Your xChange Student Membership Will Expire Soon',
					// 						messageHeader:{
					// 							date: '2015/3/27',
					// 							time: '10:17:00',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13247',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: your xChange Membership ill expire, would like to renew it ? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13247 ?',
					// 						messageHeader:{
					// 							date: '2014/12/27',
					// 							time: '10:10:27',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13247',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13247, can you rate comment on this transaction with Yinyu Niu ? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					},
					// 					{
					// 						title: 'moyu liang, will you rate your deal# 13248 ?',
					// 						messageHeader:{
					// 							date: '2014/11/27',
					// 							time: '12:10:20',
					// 							itemNum: null,
					// 							bidNum: null,
					// 							dealNum: '13248',
					// 							sender: 'System',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Moyu: you just got a done deal# 13248, can you rate comment on this transaction with Yinyu Niu ? ',
					// 						selected: false,
					// 						isReaded: true
                    //
					// 					}
					// 				];
					// break;
					case 'Items Messages' :
						$http.post('api/inbox/itemsMessages/operate',{action:'G'}).then(function(res){
							if(res){
								angular.copy(res.data,vm.boxContents)
							}
						})
					// vm.boxContents = [
					// 					{
					// 						title: 'Yinyu Niu commented on your item# 1021433',
					// 						messageHeader:{
					// 							date: '2016/11/27',
					// 							time: '09:13:30',
					// 							itemNum: '1021433',
					// 							bidNum: '103756',
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Yinyu Niu commented on your item# 1021433: USB cable, click below link to check the detail.',
					// 						selected: false,
					// 						isReaded: true
					// 					},
					// 					{
					// 						title: 'Yinyu Niu rated your item# 1021434: SD card',
					// 						messageHeader:{
					// 							date: '2016/11/27',
					// 							time: '09:13:30',
					// 							itemNum: '1021433',
					// 							bidNum: null,
					// 							sender: 'Yinyu Niu',
					// 							receiver: 'Moyu Liang'
					// 						},
					// 						messageContent: 'Yinyu Niu looking into and rated on your item# 1021433: USB cable',
					// 						selected: false,
					// 						isReaded: true
					// 					}
					// 				];
					break;

			}
			
		}
		function operateMessage(action,actionName){
			if(actionName){
				vm.mark = actionName;
			}
			switch (vm.messageBoxType){
				case 'System Messages':
					$http.post('api/inbox/systemMessages/operate', {action: action, selectedItemsId: vm.selectedItemsId}).then(function(res){
						if(res&&res.data.message){
							$http.post('api/inbox/systemMessages/operate',{action:'G'}).then(function(res){
								if(res){
									angular.copy(res.data,vm.boxContents)
								}
							})
						}
					});
					break;
				case 'Items Messages':
					$http.post('api/inbox/itemsMessages/operate', {action: action, selectedItemsId: vm.selectedItemsId}).then(function(res){
						if(res&&res.data.message){
							$http.post('api/inbox/itemsMessages/operate',{action:'G'}).then(function(res){
								if(res){
									angular.copy(res.data,vm.boxContents)
								}
							})
						}
					});
					break;
				case 'Bid Messages':
					$http.post('api/inbox/bidMessages/operate', {action: action, selectedItemsId: vm.selectedItemsId}).then(function(res){
						if(res&&res.data.message){
							$http.post('api/inbox/bidMessages/operate',{action:'G'}).then(function(res){
								if(res){
									angular.copy(res.data,vm.boxContents)
								}
							})
						}
					});
					break;
			}

		}
		function openModal(modalId,item){
			snapLightboxService.open($rootScope,modalId);
			item.isReaded = true;
			vm.selectedItemsId = [item._id];
			angular.copy(item,vm.modalItem);
			vm.modalItem.messageHeader.date = new Date(item.messageHeader.date);
			vm.modalItem.messageHeader.time = item.messageHeader.time;
			vm.operateMessage('R');
		}
		function closeModal(modalId){
			snapLightboxService.close($rootScope,modalId);
		}
	}
})();