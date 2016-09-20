(function(){
	angular
		.module('shared')
		.directive('commentModal',['$http','snapLightboxService','$rootScope','$location','$anchorScroll','$rootScope',commentModal]);
	function commentModal(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/shared/commentModalDirective/commentModal.html',
			scope:{
				obj: '=',
				title: '=',
				commentFieldPlaceholder: '=',
				selectedComment: '=',
				showCommentField: '=', 
				commentFieldContent:'=',
				isReply: '=',
				templateId: '@',
				submitComment: '&',
			},
			controller: commentModalCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
		function commentModalCtrl($http,snapLightboxService,$rootScope,$location,$anchorScroll,$stateParams,$scope){
			var vm = this;
			vm.init = init;
			vm.replyComment = replyComment;
			vm.addComment = addComment;
			vm.cancelComment = cancelComment;

			function init(){
				$scope.$watch('vm.obj',function(){
					vm.modalObj = vm.obj;
					console.log(vm.commentFieldPlaceholder);
				})
			}
			function replyComment(commentObj){
				console.log(vm.commentFieldPlaceholder);
				vm.commentFieldPlaceholder = '@'+commentObj.commentBy;
				$location.hash('commentField');
				vm.showCommentField = true;
				vm.selectedComment = commentObj;
				vm.isReply = true;
				vm.commentFieldContent = '';
			}
			function addComment(){
				vm.commentFieldPlaceholder = 'add a comment...'
				$location.hash('commentField');
				vm.showCommentField = true;
				vm.isReply = false;
				vm.commentFieldContent = '';
			}
			function cancelComment(){
				vm.showCommentField=false;
				$location.hash('');
			}
		}

	}
})()