(function(){
    angular
        .module('app.shoppingCart')
        .directive('shoppingCart',['utilService', '$state', '$http', shoppingCart]);
    function shoppingCart(){
        return {
            restrict: 'E',
            templateUrl: 'app/shoppingCart/shoppingCart.html',
            controller: shoppingCartCtrl,
            controllerAs: 'vm',
            bindToController: true
        }
        function shoppingCartCtrl(utilService, $state,$http){
            var vm = this;
            vm.init = init;
            vm.createNewTrade = createNewTrade;
            vm.deleteTradeItem = deleteTradeItem;
            vm.addOwnedItems = addOwnedItems;
            vm.addInterestingItems = addInterestingItems;
            vm.prev = prev;
            vm.next = next;
            vm.select = select;
            vm.pushBackBiddingItem = pushBackBiddingItem;
            vm.pushBackOwnedItem = pushBackOwnedItem;
            vm.redirect = redirect;
            function init(){
                vm.tradeIndex = 0;
                vm.totalTradeNum=0;
                vm.interestingItems = ['item1','item2','item3','item4','item5','item6'];
                vm.ownedItems = ['ownedItem1','ownedItem2','ownedItem3','ownedItem4','ownedItem5','ownedItem6','ownedItem7','ownedItem8'];
                vm.tradeItems = [];
                // $http.get('').then(function(req,res){
                //     console.log('get image');
                // })
            }
            function createNewTrade(){
                vm.tradeItems.push({
                    interestingBiddings:[],
                    ownedItems: []
                });
                vm.totalTradeNum = vm.totalTradeNum+1;
            }
            function deleteTradeItem(index){
                vm.tradeItems.splice(index,1);
                vm.totalTradeNum = vm.totalTradeNum-1;
            }
            function addOwnedItems(index){
                vm.tradeItems[vm.tradeIndex].ownedItems.push(vm.ownedItems.splice(index,1)[0]);

            }
            function addInterestingItems(index){
                vm.tradeItems[vm.tradeIndex].interestingBiddings.push(vm.interestingItems.splice(index,1)[0]);
            }
            function prev(){
                vm.tradeIndex = vm.tradeIndex-1;
            }
            function next(){
                vm.tradeIndex = vm.tradeIndex+1;
            }
            function select(event,index){
                event.preventDefault();
                event.stopPropagation();
                vm.tradeIndex = index;
            }
            function pushBackBiddingItem(index){
                vm.interestingItems.push(vm.tradeItems[vm.tradeIndex].interestingBiddings.splice(index,1)[0]);
            }
            function pushBackOwnedItem(index){
                vm.ownedItems.push(vm.tradeItems[vm.tradeIndex].ownedItems.splice(index,1)[0]);
            }
            function redirect(){
                $state.go('shareeconomy.proceedCheckout')
            }
        }
    }
})()