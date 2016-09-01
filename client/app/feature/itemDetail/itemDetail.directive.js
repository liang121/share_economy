(function(){
	angular
		.module('app.itemDetail')
		.directive('itemDetail',['$http','snapLightboxService','$rootScope','$location','$anchorScroll','$stateParams',itemDetail]);
	function itemDetail(){
		return {
			restrict: 'E',
			templateUrl: './app/feature/itemDetail/itemDetail.html',
			controller: itemDetailCtrl,
			controllerAs: 'vm',
			bindToCOntroller: true
		}
		function itemDetailCtrl($http,snapLightboxService,$rootScope,$location,$anchorScroll,$stateParams){
			var vm = this;
			vm.init = init;
			vm.getItemDetail = getItemDetail;
			vm.getItemQuestions = getItemQuestions;
			vm.showMoreAnswers = showMoreAnswers;
			vm.openEditCommentsModal = openEditCommentsModal;
			vm.closeEditCommentsModal = closeEditCommentsModal;
			vm.addComment = addComment;
			vm.submitComment = submitComment;
			vm.replyComment = replyComment;
			vm.cancelComment = cancelComment;
			vm.addAnswer = addAnswer;
			vm.closeAnswerModal = closeAnswerModal;
			vm.submitAnswer = submitAnswer;
			vm.goToAnswerQuestion = goToAnswerQuestion;
			function init(){
				//vm.showAnswerNum = 1;
				vm.questionIndex = 0;
				vm.answerIndex = 0;
				vm.showCommentField = false;
				vm.commentFieldPlaceholder = '';
				vm.commentFieldContent = '';
				vm.getItemDetail();
				vm.getItemQuestions();
				$location.hash('');
			}
			function getItemDetail(){
				$http.get('/api/itemDetail/'+$stateParams.itemId).then(function(res){
					if(res&&res.data){
						vm.itemDetail = res.data;
					}
				},function(err){
					console.log(err);
				})
			}
			function getItemQuestions(){
				$http.get('/api/question/'+$stateParams.itemId).then(function(res){
					if(res&&res.data){
						vm.questions = res.data;
						vm.showAnswerNum = new Array(vm.questions.questionsNum).fill(0);
					}
				},function(err){
					console.log(err);
				})
				// vm.questions = {
				// 	itemId: '1002431',
				// 	questionsNum: 2,
				// 	questionContents: [
				// 		{
				// 			questionTitle: 'Does this TV have built in Wi-Fi? The TCL website does not say anything about WiFi.',
				// 			voteNum: 155,
				// 			answersNum: 3,
				// 			answers: [
				// 				{
				// 					answerContent: 'Yes, this model has built-in, dual band Wi-Fi and connects wirelessly to your home network. There is no Ethernet connection.',
				// 					answerBy: 'Rui',
				// 					date: 'May 26, 2015',
				// 					comments: [
				// 						{
				// 							commentBy: 'Con Antonakos',
				// 							date: 'July 24 2015',
				// 							time: '9:58',
				// 							commentContent: 'This isn\'t working with babel nor even enabling the experimental JavaScript flag on Chrome. Any idea(s) why?',
				// 						},
				// 						{
				// 							commentBy: 'Oriol',
				// 							date: 'July 24 2015',
				// 							time: '9:59',
				// 							commentContent: '@ConAntonakos It should work on Chrome 45, or Chrome 36 with “Enable Experimental JavaScript”'
				// 						},
				// 						{
				// 							commentBy: 'Pimp Trizkit',
				// 							date: 'Sep 22 2015',
				// 							time: '16:08',
				// 							commentContent: 'fill is fast. new Array(len) is painfully slow. (arr = []).length = len; arr.fill(0); is about the fastest solution ive seen anywhere... or at least tied'
				// 						}
				// 					]
				// 				},
				// 				{
				// 					answerContent: 'I am looking for an Ethernet port also as we use wifi only when necessary in our house. James D. Anderson, did you ever find a similar one that fit the bill? ',
				// 					answerBy: 'Yinyu Niu',
				// 					date: 'Jan 21, 2015',
				// 					comments: [
				// 						{
				// 							commentBy: 'Triptych',
				// 							date:'Aug 18 2009',
				// 							time: '20:52',
				// 							commentContent: 'Not sure that backwards filling would matter here, given you are only accessing elements (not deleting them) and you\'ve already pre-allocated. Am I wrong?' 
				// 						},
				// 						{
				// 							commentBy: 'annakata',
				// 							date:'Aug 18 2009',
				// 							time: '20:54',
				// 							commentContent: 'the point of the backwards fill is not particularly to do with the array, it\'s to do with the escape condition for the while - the falsey 0 terminates the loop very efficiently ' 
				// 						},
				// 						{
				// 							commentBy: 'annakata',
				// 							date:'Aug 19 2009',
				// 							time: '20:56',
				// 							commentContent: '(though I\'ve just noticed this code doesn\'t actually make use of that) ' 
				// 						},
				// 						{
				// 							commentBy: 'Triptych',
				// 							date:'Aug 18 2009',
				// 							time: '20:59',
				// 							commentContent: '@annakata, you can\'t make use of that here, because 0 is a valid index. ' 
				// 						},
				// 					]
				// 				},
				// 				{
				// 					answerContent: 'Does it have 2 lift and rite connects ',
				// 					answerBy: 'David',
				// 					date: 'Feb 1, 2014',
				// 					comments: []
				// 				},
				// 			]

				// 		},{
				// 			questionTitle: 'I\'m a bit confused by the mentioning of cable. My goal is to stop paying high cable tv rates. Is it safe to assume this tv will do that?',
				// 			voteNum: 76,
				// 			answersNum: 7,
				// 			answers: [
				// 				{
				// 					answerContent: 'Does it have 2 lift and rite connects ',
				// 					answerBy: 'David',
				// 					date: 'Aug 1, 2016',
				// 					comments: [
				// 						{	
				// 							commentBy: 'Sean Bright',
				// 							date: 'Aug 18 2009',
				// 							time: '18:26',
				// 							commentContent: 'Isn\'t the i local variable extraneous? length is passed by value so you should be able to decrement it directly' 
				// 						}
				// 					]
				// 				},
				// 				{
				// 					answerContent: 'it means you need the Internet.. NOT cable TV.. the internet will allow you to connect to the streaming channels which is what Roku or any streamer box connects to..Cable Tv is just channels in real time.. but you can watch most of their stuff using Netflix, Hulu Plus, or Amazon Prime (I prefer Amazon Prime, lots of channels and some shows they produce, like Bosch at 99.00 a year cheaper than the others and better).. GET only the internet.. NOT Cable TV from your cable provider.. pay half as much..',
				// 					answerBy: 'Rui',
				// 					date: 'Jun 13, 2016',
				// 					comments: []
				// 				},
				// 				{
				// 					answerContent: 'If you want to stop paying for cable TV and still have some channels - your old TV is just fine. Any TV will get you a dozen or so free OTA channels, depending where you are. Close to big urban centers you\'ll get more-less same OTA channels - free - as you would with a Basic cable. But they are cr-ap, a lot of commercials, not too many movies. Some people are content with this, and it is free.If you have a nice top-tier cable package and want to have the same without paying a cent - stop dreaming. Firstly, you have to keep a decent internet plan with sufficient GB limit. Secondly, you have to pay for monthly plan with providers like Netflix or Hulu. ',
				// 					answerBy: 'Rui',
				// 					date: 'Jun 1, 2016',
				// 					comments: []
				// 				},
				// 				{
				// 					answerContent: 'That\'s relative to what you\'re paying now. You may want to pay for streaming services like Netflix and/or huluplus ($16). Maybe more if want sports channels. ',
				// 					answerBy: 'David',
				// 					date: 'July 23, 2015',
				// 					comments: []
				// 				},
				// 				{
				// 					answerContent: 'remote does not have number buttons. you can only SCROLL channels which makes regular t.v. surfing obsolete. Costco help desk said this was the #1 reason this t.v. is being returned. ',
				// 					answerBy: 'Yinyu Niu',
				// 					date: 'Feb 1, 2015',
				// 					comments: []
				// 				},
				// 				{
				// 					answerContent: 'Does it have 2 lift and rite connects ',
				// 					answerBy: 'David',
				// 					date: 'Jan 16, 2015',
				// 					comments: []
				// 				},
				// 				{
				// 					answerContent: 'Depending on your cable provider, this can still help you save on cable. Companies like Time Warner and Charter have Roku channels so you can use this tv in a spare bedroom or other room that isn\'t used very often and not have to spend the extra money on the extra boxes. Also, Charter has something very similar to Sling TV where if you only have internet through them, you can still get some channels in their lineup through their Roku channel. ',
				// 					answerBy: 'David',
				// 					date: 'Feb 1, 2014',
				// 					comments: []
				// 				},
				// 			]
				// 		}
				// 	]
				// }
				
			}
			function showMoreAnswers(questionIndex){
				vm.questionIndex = questionIndex;
				vm.showAnswerNum[questionIndex] = vm.showAnswerNum[questionIndex] + 2;
				if(vm.questions.questionContents[questionIndex].answersNum<vm.showAnswerNum[questionIndex]+1){
					vm.showAnswerNum[questionIndex] = vm.questions.questionContents[questionIndex].answersNum-1
				}
				
			}
			function openEditCommentsModal(questionIndex,answerIndex, modalId){
				$location.hash('commentModalHeader');
				vm.questionIndex = questionIndex;
				vm.answerIndex = answerIndex;
				vm.questionModalObj = vm.questions.questionContents[questionIndex];
				vm.answerModalObj = vm.questionModalObj.answers[answerIndex];
				snapLightboxService.open($rootScope,modalId);
			}
			function closeEditCommentsModal(modalId){
				$location.hash('answerQuestion');
				vm.showCommentField = false;
				snapLightboxService.close($rootScope,modalId);
			}
			function addComment(){
				vm.commentFieldPlaceholder = 'add a comment...'
				$location.hash('commentField');
				vm.showCommentField = true;
				vm.isReply = false;
				vm.commentFieldContent = '';
			}
			function submitComment(){
				$location.hash('');
				vm.showCommentField = false;
				vm.commentFieldContent = (vm.isReply)?'@'+vm.selectedComment.commentBy+' :'+vm.commentFieldContent:vm.commentFieldContent;
				var payload = {
					itemId:'1002431',
					questionIndex:vm.questionIndex,
					answerIndex:vm.answerIndex,
					commentFieldContent:{
						commentBy: 'Moyu Liang',
						commentContent:vm.commentFieldContent,
						date: 'Jan 1 2016',
						time: '12:00'
					}
				}
				vm.questions.questionContents[vm.questionIndex].answers[vm.answerIndex].comments.push(payload.commentFieldContent);
				$http.post('/api/comment/add',payload).then(function(res){
					console.log(res);
				})

			}
			function replyComment(commentObj){
				vm.commentFieldPlaceholder = '@'+commentObj.commentBy;
				$location.hash('commentField');
				vm.showCommentField = true;
				vm.selectedComment = commentObj;
				vm.isReply = true;
				vm.commentFieldContent = '';
			}
			function cancelComment(){
				vm.showCommentField=false;
				$location.hash('');
			}
			function addAnswer(questionIndex,modalId){
				vm.addAnswer = '';
				vm.questionIndex = questionIndex;
				vm.answerModalObj = vm.questions.questionContents[questionIndex];
				snapLightboxService.open($rootScope,modalId);
			}
			function closeAnswerModal(modalId){
				snapLightboxService.close($rootScope,modalId);
				$location.hash('answerQuestion');
			}
			function submitAnswer(){
				snapLightboxService.close($rootScope,'#answerModal');
				$location.hash('answerQuestion');
				var payload = {
					questionIndex: vm.questionIndex,
					itemId: vm.itemId,
					answerObj:{
						answerContent: vm.addedAnswer,
						answerBy: 'Moyu Liang',
						date: 'Feb 13, 2016',
						comments:[]
					}
				}
				vm.questions.questionContents[vm.questionIndex].answers.push(payload.answerObj);
				$http.post('/api/answer/add',payload).then(function(res){
					vm.questions.questionContents[vm.questionIndex].answersNum ++;
				})
			}
			function goToAnswerQuestion(){
				$location.hash('answerQuestion');
				$anchorScroll();

			}
		}
	}
})()