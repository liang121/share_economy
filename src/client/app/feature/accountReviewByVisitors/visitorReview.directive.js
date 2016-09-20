(function(){
	angular
		.module('app.visitorReview')
		.directive('visitorReview',['snapLightboxService','$rootScope','$location','$anchorScroll','$http',visitorReview]);
	function visitorReview(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/accountReviewByVisitors/visitorReview.html',
			controller: visitorReviewCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function visitorReviewCtrl(snapLightboxService,$location,$anchorScroll,$rootScope,$http){
		var vm = this;
		vm.init = init;
		vm.openContactModal = openContactModal;
		vm.closeContactModal = closeContactModal;
		vm.getReviews = getReviews;
		vm.showMoreReviews = showMoreReviews;
		vm.closeReviewCommentModal = closeReviewCommentModal;
		vm.seeComments = seeComments;
		vm.submitComment = submitComment;
		vm.goToReview = goToReview;
		function init(){
			vm.labels = ["Wait Bids", "Cancel Bids", "Success Bids"];
			vm.data = [5,3,1];
			vm.showReviewsNum = 2;
			vm.reviewsNum = 0;
			vm.reviewContent = [];
			vm.showCommentField = false;
			vm.isReply = false;
			vm.commentFieldPlaceholder = '';
			vm.commentFieldContent = '';
			vm.selectedComment = {};
  			vm.getReviews();
		}
		function getReviews(){
			$http.get('api/review/getReviews/liang121').then(function(res){
				vm.reviewContent = res.data;
				vm.reviewsNum = vm.reviewContent.reviews.length;
			},function(err){
				console.log(err);
			})
			// vm.reviewContent = {
			// 				account: "liang121",
			// 				overallRate: 4,
			// 				rateDesc:3,
			// 				rateComm:4,
			// 				rateShippingTime:3,
			// 				rateShippingCharge:2,
			// 				reviews:[
			// 					{
			// 						rate: {
			// 							overallRate:3,
			// 							rateDesc:4,
			// 							rateComm:4,
			// 							rateShippingTime:3,
			// 							rateShippingCharge:2,
			// 						},
			// 						reviewedBy: 'Yinyu Niu',
			// 						date: 'June 15, 2016',
			// 						title: "5.0 out of 5 starsGreat picture, good sound, impressive design, 100% satisfied with this TV",
			// 						content: "I'd actually rate this TV a 4.5 but I'll round up here. Overall I am 100% satisfied with my purchase but I'll go into some details. Long review coming up here... TLDR: IT'S GOOD!!!! Picture: I thought the picture looked fantastic right out of box without any settings adjustments. After awhile though, I noticed that when watching some shows, depending on the lighting, the colors could look too bright and made people appear washed out and unnatural looking. I started poking around in the settings and I think I'm finally happy. Here are my quick/simple recommended specs, which are taken from rtings.com's setting, with just a couple minor changes.-Reset all settings to default-Change picture to Movie-Backlight 10-Brightness 45-Contrast 100-Sharpness 15-Color 50-Digital Clean View Off (supposedly makes low res content look better, not sure about this, can't tell you the last time I played a DVD)-Auto Motion Plus Auto (I hated Auto Motion on my old Samsung but the KS8000 handles it really well and looks great, imo, this one is divisive. if the picture seems to be moving too fast or smooth, turn it off)-Smart LED Low (when on High you can noticeably see the brightness shifting in scenes, Low is more subtle)-Dynamic Contrast Off (I don't notice much of a difference with this, I turn it off, that's what looks best imo)-Color Tone Warm1 (I think Warm2 looks too dull/yellow)-Color Space Native",
			// 						comments: [
			// 							{
			// 								commentBy: 'Tom',
			// 								date: 'June 16, 2016',
			// 								commentContent: "Hi I have a question. After two 4K LED TV's ( Samsung UN65JU7500 and Sony Bravia 930D ) which showed significant clouding and ghosting I am so lost in a search for a cleanest screen when it comes to Black Uniformity. How is the clouding on this model ? Have you seen any ? www.rtings.com rates it very well when it comes to Black Uniformity. Any feedback greatly appreciated."
			// 							},
			// 							{	
			// 								commentBy: 'SunnyK',
			// 								date: 'September 1, 2016',
			// 								commentContent: "I've owned this tv for nearly a month now and never had to log back into Netflix after setting up my account, or any other apps for that matter. It's possible you have some sort of setting turned on that's causing it not to remember your information. Same goes for that upscaling thing you wrote about. DVD's and Blu-Rays all upscale very well on my unit. I did some Google searching for the best possible settings for the TV. If you do the same, you'll probably find that some of your issues go away.",
			// 							}
			// 						]
			// 					},
			// 					{
			// 						rate: {
			// 							overallRate:4,
			// 							rateDesc:3,
			// 							rateComm:2,
			// 							rateShippingTime:4,
			// 							rateShippingCharge:2,
			// 						},
			// 						reviewedBy: 'Rui',
			// 						date: 'June 11, 2016',
			// 						title: 'Very good TV with awesome 4K picture.',
			// 						content: "Bought this TV from a local dealer and it's almost perfect. Have very slight light bleeding from bottom right but overall, it's very good. The new Tizen interface is much much faster than the old smart hub on my UN65H7100. The remote is interesting but I wish it had a number pad. While there is not a lot a 4K content out there, I did watch a few videos from Amazon and I was blown away how clear the picture looks. The speakers are decent but what else do you expect from speakers that need to fit inside a TV that is less than half an inch thick? Overall, a solid buy and would definitely recommend to friends. One friend actually went out and bought the same TV after seeing mine at my house. I was hesitant to buy because of all the 1 star reviews but then I noticed that most of them are not verified purchases and some don't even talk about this particular tv but blame Samsung for making bad products because their 5 year old tv broke and Samsung won't fix it.",
			// 						comments: [
			// 						]
			// 					},
			// 					{
			// 						rate: {
			// 							overallRate:5,
			// 							rateDesc:5,
			// 							rateComm:5,
			// 							rateShippingTime:5,
			// 							rateShippingCharge:4,
			// 						},
			// 						reviewedBy: 'David',
			// 						date: 'June 28, 2016',
			// 						title: "Nice improvement from the 2015 model",
			// 						content: "I owned the 2015 model, the 65UNJS8500 as well. I initially bought the UNJS8500 when Samsung announced the firmware update to HDMI 2.0A. The firmware update was to allow external devices to pass HDR to the TV. I was disappointed when the Ultra HD Premium standard was set in early 2016 to find that the JS did not have the required amount of brightness (nits) to be certified. Overall, I was very happy with the JS with the exception of the HDR limitation. The KS8500 is an amazing TV! It has the required brightness (1000 Nits) and UHD dimming to meet the Ultra HD Premium certification. The KS is clearly brighter than the 2015 model. The bezel is less pronounced and the new Tizen interface is much improved. It comes with the Smart Hub which makes cable management easy. The included stand is also improved. It is simple to install and looks better too! I am enjoying HDR from the Samsung Ultra HD 4k Blu Ray player. HDR is also great on the built in Netflix and Amazon apps. I wasn't sure that I would like the curve of this TV but it is not distracting after the first viewing. It is my opinion that the curve helps reduce light bleed from the top and bottom of the panel. Very pleased with this TV. Go for it!",
			// 						comments: [
			// 						]
			// 					}
			// 				]
			// 			}
			
		}
		function goToReview(){
			$location.hash('review');
			$anchorScroll();

		}
		function openContactModal(modalId){
			snapLightboxService.open($rootScope, modalId);
		}	
		function closeContactModal(modalId){
			snapLightboxService.close($rootScope,modalId);
		}
		function showMoreReviews(){
			vm.showReviewsNum = vm.showReviewsNum+2;
			if(vm.showReviewsNum > vm.reviewsNum){
				vm.showReviewsNum = vm.reviewsNum;
			}
		}
		function seeComments(reviewIndex, modalId){
			vm.reviewIndex = reviewIndex;
			vm.review = vm.reviewContent.reviews[reviewIndex];
			snapLightboxService.open($rootScope, modalId);
			$location.hash('commentModalHeader');
		}	
		function closeReviewCommentModal(modalId){
			snapLightboxService.close($rootScope,modalId);
			vm.showCommentField = false;
			$location.hash('review');
			$anchorScroll();
		}
		function submitComment(){
			$location.hash('');
			$anchorScroll();
			vm.showCommentField = false;
			vm.commentFieldContent = (vm.isReply)?'@'+vm.selectedComment.commentBy+' :'+vm.commentFieldContent:vm.commentFieldContent;
			var payload = {
				accountName: 'liang121',
				reviewIndex: vm.reviewIndex,
				commentFieldContent:{
					commentBy: 'liang121',
					commentContent:vm.commentFieldContent,
					date: 'Jan 1 2016',
				}
			}
			console.log(vm.commentFieldContent);
			vm.reviewContent.reviews[vm.reviewIndex].comments.push(payload.commentFieldContent);
			$http.post('/api/review/addComment',payload).then(function(res){
				console.log(res);
			})

		}
	}
})()