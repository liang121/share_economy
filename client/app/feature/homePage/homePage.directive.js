(function(){
    angular
        .module('app.homePage')
        .directive('homePage',['$http','$state','shoppingCartService','snapLightboxService','$rootScope','$localStorage','utilService',homePage]);
    function homePage(){
        return{
            restrict: 'E',
            templateUrl: 'app/feature/homePage/homePage.html',
            controller: homePageCtrl,
            controllerAs: 'vm',
            bindToController: true
        }
        function homePageCtrl($http,$state,$localStorage,shoppingCartService,snapLightboxService,$rootScope,$scope,utilService){
            var vm = this;
            vm.init = init;
            vm.getItems = getItems;
            vm.prevPageItems = prevPageItems;
            vm.nextPageItems = nextPageItems;
            vm.addToShoppingCart = addToShoppingCart;
            vm.deleteWishListItems = deleteWishListItems;
            vm.redirect = redirect;
            vm.openModal = openModal;
            // vm.isCertified = isCertified;
            function init(){
                vm.elecCompItems = [];
                vm.autoIndItems = [];
                vm.movieMusicGameItems = [];
                vm.homeServicesItems = [];
                vm.currentWishListPage = 0;
                vm.wishListContainer = [];
                vm.isAdd = false;
                vm.getItems();
                // $scope.$on('hasSignedIn', function(event, args) {
                //     vm.isSignIn = true;
                // });
            }
            // function isCertified(){
            //     if(!$localStorage.user) {
            //         $state.go('shareeconomy.signIn');
            //     }else{
            //         $localStorage.user.isSigned = true;
            //     }
            // }
            function getItems(){
                // $http.get('/elecCompItems').success(function(resp){
                //     angular.copy(resp.response,vm.elecCompItems);
                // })
                vm.elecCompItems = [
                    "TV & Video",
                    "Home Audio & Theater",
                    "Camera, Photo & Video",
                    "Cell Phones & Accessories",
                    "Headphones",
                    "Bluetooth & Wireless Speakers",
                    "Car Electronics",
                    "Musical Instruments",
                    "Wearable Technology",
                    "Computers & Tablets",
                    "Monitors",
                    "Computer Parts & Components"
                ]
                vm.autoIndItems = [
                    "Automotive Parts & Accessories",
                    "Automotive Tools & Equipment",
                    "Car/Vehicle Electronics & GPS",
                    "Tires & Wheels",
                    "Motorcycle & Powersports",
                    "Your Garage",
                    "Industrial Supplies",
                    "Safety"
                ]
                vm.movieMusicGameItems = [
                    "Movies & TV",
                    "Blu-ray",
                    "Amazon Video",
                    "CDs & Vinyl",
                    "Digital Music",
                    "Musical Instruments",
                    "Headphones",
                    "Video Games",
                    "PC Gaming",
                    "Digital Games"
                ]
                vm.homeServicesItems = [
                    "Home Improvement & Repair",
                    "Yard & Outdoors",
                    "Computer & Electronics",
                    "Assembly",
                    "Cleaning",
                    "Plumbing",
                    "Electrical",
                    "Home Theater"
                ]
                vm.recentViewItems = [
                    {
                        headerId: 'a1',
                        description: "VicTsing® 2Pcs Gold-Plated 1080P HDMI to VGA Adapter Video Converter (Male…"
                    },
                    {
                        headerId: 'a2',
                        description: "Cable Matters Mini DisplayPort (Thunderbolt™ 2 Port Compatible) to DVI…"
                    },
                    {
                        headerId: 'a3',
                        description: "Mission Power USB Cable for Powering Fire TV Stick"
                    },
                    {
                        headerId: 'a4',
                        description: "TotalMount Fire TV Remote Holder"
                    },
                    {
                        headerId: 'a5',
                        description: "Cable Matters 2 Pack, Gold Plated Mini HDMI to HDMI Male to Female Cable Adapter 6 Inch"
                    },

                    {
                        headerId: 'b1',
                        description: "Microsoft Surface Dock (Compatible with Surface Book, Surface Pro 4, and Surface Pro 3)"
                    },
                    {
                        headerId: 'b2',
                        description: "Mission Power USB Cable for Powering Fire TV Stick"
                    },
                    {
                        headerId: 'b3',
                        description: "Dell Latitude E5430 E5530 E6430 E6530 ATG Laptop Battery - Dell Part T54FJ DHT0W…"
                    },
                    {
                        headerId: 'b4',
                        description: "Microsoft Wired Desktop 400 for Business"
                    },
                    {
                        headerId: 'b5',
                        description: "AmazonBasics DVI to DVI Cable - 3 Feet (.9 Meters)"
                    },
                    {
                        headerId: 'c1',
                        description: "test"
                    }

                ];
                angular.copy(vm.recentViewItems.slice(vm.currentWishListPage*5,(vm.currentWishListPage+1)*5),vm.wishListContainer);
                vm.pageLength = Math.ceil(vm.recentViewItems.length/5);

            }
            function prevPageItems(){
                vm.pageLength = Math.ceil(vm.recentViewItems.length/5);
                vm.currentWishListPage = vm.currentWishListPage - 1;
                vm.currentWishListPage = (vm.currentWishListPage<0)?vm.pageLength-1:vm.currentWishListPage;
                angular.copy(vm.recentViewItems.slice(vm.currentWishListPage*5,(vm.currentWishListPage+1)*5),vm.wishListContainer);
            }
            function nextPageItems() {
                vm.pageLength = Math.ceil(vm.recentViewItems.length/5);
                vm.currentWishListPage = vm.currentWishListPage + 1;
                vm.currentWishListPage = (vm.currentWishListPage>vm.pageLength-1)?0:vm.currentWishListPage;
                angular.copy(vm.recentViewItems.slice(vm.currentWishListPage*5,(vm.currentWishListPage+1)*5),vm.wishListContainer);
            }
            function addToShoppingCart(headerId){
                vm[headerId+'isAdd'] = !vm[headerId+'isAdd'] ;
            }
            function deleteWishListItems(num,headerId){
                vm[headerId+'isDelete'] = !vm[headerId+'isDelete'];
                var index = (vm.currentWishListPage)*5+num;
                vm.recentViewItems.splice(index,1);
                vm.pageLength = Math.ceil(vm.recentViewItems.length/5);
                angular.copy(vm.recentViewItems.slice(vm.currentWishListPage*5,(vm.currentWishListPage+1)*5),vm.wishListContainer);
            }
            function redirect(index){
                var headerId = vm.wishListContainer[index].headerId;
                $state.go('shareeconomy.proceedCheckout',{itemsHeaderId:headerId});
            }
            // $http.get('/economyInfo').success(function(res){
            //     console.log(res);
            // });
            // $http.post('/economyInfo',{'CopyRight':'David Liang'}).success(function(response){
            //     console.log(response);
            //
            // })
            function openModal (modalId){
                snapLightboxService.open($rootScope,modalId);
            }

        }
    }
})()