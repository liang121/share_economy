(function(){
	angular
		.module('app.visitorReview')
		.directive('visitorReview',['snapLightboxService','$rootScope',visitorReview]);
	function visitorReview(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/accountReviewByVisitors/visitorReview.html',
			controller: visitorReviewCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
	}
	function visitorReviewCtrl(snapLightboxService,$rootScope){
		var vm = this;
		vm.init = init;
		vm.openContactModal = openContactModal;
		vm.closeContactModal = closeContactModal;
		vm.getReviews = getReviews;
		function init(){
			vm.labels = ["Wait Bids", "Cancel Bids", "Success Bids"];
  			vm.getReviews();
		}
		function getReviews(){
			vm.reviewContent = {
							account: "liang121",
							overallRate: 4,
							rateDesc:3,
							rateComm:4,
							rateShippingTime:3,
							rateShippingCharge:2,
							reviews:[
								{
									rate: 3,
									reviewedBy: 'Yinyu Niu',
									date: 'June 15, 2016',
									title: "5.0 out of 5 starsGreat picture, good sound, impressive design, 100% satisfied with this TV",
									content: "I'd actually rate this TV a 4.5 but I'll round up here. Overall I am 100% satisfied with my purchase but I'll go into some details. Long review coming up here... TLDR: IT'S GOOD!!!! Picture: I thought the picture looked fantastic right out of box without any settings adjustments. After awhile though, I noticed that when watching some shows, depending on the lighting, the colors could look too bright and made people appear washed out and unnatural looking. I started poking around in the settings and I think I'm finally happy. Here are my quick/simple recommended specs, which are taken from rtings.com's setting, with just a couple minor changes.-Reset all settings to default-Change picture to Movie-Backlight 10-Brightness 45-Contrast 100-Sharpness 15-Color 50-Digital Clean View Off (supposedly makes low res content look better, not sure about this, can't tell you the last time I played a DVD)-Auto Motion Plus Auto (I hated Auto Motion on my old Samsung but the KS8000 handles it really well and looks great, imo, this one is divisive. if the picture seems to be moving too fast or smooth, turn it off)-Smart LED Low (when on High you can noticeably see the brightness shifting in scenes, Low is more subtle)-Dynamic Contrast Off (I don't notice much of a difference with this, I turn it off, that's what looks best imo)-Color Tone Warm1 (I think Warm2 looks too dull/yellow)-Color Space Native"
								},
								{
									rate:4,
									reviewedBy: 'Rui',
									date: 'June 11, 2016',
									title: 'Very good TV with awesome 4K picture.',
									content: "Bought this TV from a local dealer and it's almost perfect. Have very slight light bleeding from bottom right but overall, it's very good. The new Tizen interface is much much faster than the old smart hub on my UN65H7100. The remote is interesting but I wish it had a number pad. While there is not a lot a 4K content out there, I did watch a few videos from Amazon and I was blown away how clear the picture looks. The speakers are decent but what else do you expect from speakers that need to fit inside a TV that is less than half an inch thick? Overall, a solid buy and would definitely recommend to friends. One friend actually went out and bought the same TV after seeing mine at my house. I was hesitant to buy because of all the 1 star reviews but then I noticed that most of them are not verified purchases and some don't even talk about this particular tv but blame Samsung for making bad products because their 5 year old tv broke and Samsung won't fix it."
								},
								{
									rate:5,
									reviewedBy: 'David',
									date: 'June 28, 2016',
									title: "Nice improvement from the 2015 model",
									content: "I owned the 2015 model, the 65UNJS8500 as well. I initially bought the UNJS8500 when Samsung announced the firmware update to HDMI 2.0A. The firmware update was to allow external devices to pass HDR to the TV. I was disappointed when the Ultra HD Premium standard was set in early 2016 to find that the JS did not have the required amount of brightness (nits) to be certified. Overall, I was very happy with the JS with the exception of the HDR limitation. The KS8500 is an amazing TV! It has the required brightness (1000 Nits) and UHD dimming to meet the Ultra HD Premium certification. The KS is clearly brighter than the 2015 model. The bezel is less pronounced and the new Tizen interface is much improved. It comes with the Smart Hub which makes cable management easy. The included stand is also improved. It is simple to install and looks better too! I am enjoying HDR from the Samsung Ultra HD 4k Blu Ray player. HDR is also great on the built in Netflix and Amazon apps. I wasn't sure that I would like the curve of this TV but it is not distracting after the first viewing. It is my opinion that the curve helps reduce light bleed from the top and bottom of the panel. Very pleased with this TV. Go for it!",
								}
							]
						}
		}
		function openContactModal(modalId){
			snapLightboxService.open($rootScope, modalId);
		}	
		function closeContactModal(modalId){
			snapLightboxService.close($rootScope,modalId);
		}	
	}
})()