(function(){
	angular
		.module('app.homePage')
		.directive('homeCategory',['$rootScope',homeCategory]);
	function homeCategory(){
		return {
			restrict: 'E',
			templateUrl: 'app/feature/homePage/homeCategories/homeCategories.html',
			controller: homeCategoryCtrl,
			controllerAs: 'vm',
			bindToController: true
		}
		function homeCategoryCtrl($scope){
			var vm = this;
			vm.init = init;
			vm.getBrands = getBrands;
			vm.getDisplayTech = getDisplayTech;
			vm.getScreenSize = getScreenSize;
			vm.getResolution = getResolution;
			vm.getConditions = getConditions;
			vm.clickBrand = clickBrand;
			function init(){
				vm.brands = [];
				vm.displayTech = [];
				vm.screenSize = [];
				vm.maxResolution = [];
				vm.conditions = [];
				vm.searchObject = [vm.brands,vm.displayTech,vm.screenSize,vm.maxResolution,vm.conditions];
				// vm.searchObject[''+vm.brands] = vm.brands;
				// vm.searchObject[''+vm.displayTech] = vm.displayTech;
				// vm.searchObject[''+vm.screenSize] = vm.screenSize;
				// vm.searchObject[''+vm.maxResolution] = vm.maxResolution;
				// vm.searchObject[''+vm.conditions] = vm.conditions;
				vm.obj1 = {};
				vm.obj2 = [vm.obj1];
				vm.obj1 = new Object({val:'haha'});
				console.log(vm.obj1);





				vm.obj = {};
				vm.obj = vm.brands;
				vm.getBrands();
				vm.getDisplayTech();
				vm.getScreenSize();
				vm.getResolution();
				vm.getConditions();
				$scope.$watch('vm.brands',function(oval,nval){
					if(oval!=nval){
						console.log(vm.searchObject);
					}
				},true)
			}
			function clickBrand() {
				//console.log(vm.brands[0])
			}
			function getBrands() {
				vm.brands = [
					{
						value: 'LG',
						isSelected: false
					},
					{
						value: 'RCA',
						isSelected: false
					},
					{
						value: 'Panasonic',
						isSelected: false
					},
					{
						value: 'Samsung',
						isSelected: false
					},
					{
						value: 'SHARP',
						isSelected: false
					},
					{
						value: 'Sony',
						isSelected: false
					},
					{
						value: 'Toshiba',
						isSelected: false
					},
				]
				console.log(vm.obj);
			}
			function getDisplayTech() {
				vm.displayTech = [
					{
						value: 'CRT',
						isSelected: false
					},
					{
						value: 'LCD',
						isSelected: false
					},
					{
						value: 'LED',
						isSelected: false
					},
					{
						value: 'OLED',
						isSelected: false
					},
					{
						value: 'Plasma',
						isSelected: false
					},
					{
						value: 'Rear-Projection',
						isSelected: false
					},
				]
			}
			function getScreenSize() {
				vm.screenSize = [
					{
						value: '4320p',
						isSelected: false
					},
					{
						value: '2160p',
						isSelected: false
					},
					{
						value: '1080p',
						isSelected: false
					},
					{
						value: '1080i',
						isSelected: false
					},
					{
						value: '720p',
						isSelected: false
					},
				]
			}
			function getResolution() {
				vm.maxResolution = [
					{
						value: 'Less than 20"',
						isSelected: true,
					},
					{
						value: '20" - 29"',
						isSelected: true,
					},
					{
						value: '30" - 39"',
						isSelected: true,
					},
					{
						value: '40" - 49"',
						isSelected: true,
					},
					{
						value: '50" - 60"',
						isSelected: true,
					},
					{
						value: 'More than 60"',
						isSelected: true,
					},
				]
			}
			function getConditions() {
				vm.conditions = [
					{
						value: 'brand new',
						isSelected: false,
					},
					{
						value: 'inbox new',
						isSelected: false,
					},
					{
						value: 'almost new',
						isSelected: false,
					},
					{
						value: 'good condition',
						isSelected: false,
					},
				]
			}
		}
		
	}
})()