(function(){
    angular
        .module('app.ownedItems')
        .directive('ownedItems',['$state',ownedItems])
    function ownedItems(){
        return {
            restrict: 'E',
            templateUrl: 'app/feature/ownedItems/ownedItems.html',
            controllerAs: 'vm',
            controller: ownedItemsCtrl,
            bindToController: true
        }
    }
    function ownedItemsCtrl($state){
        var vm = this;
        vm.init = init;
        vm.openDetail = openDetail;
        // vm.redirectToMessageCenter = redirectToMessageCenter;
        function init(){
            vm.status = {};
            vm.status.item1DetailOpen = false;
        };
        function openDetail(){
            vm.status.item1DetailOpen = !vm.status.item1DetailOpen;
        }
        // function redirectToMessageCenter(type){
        //     $state.go('shareeconomy.messageCenter.inbox(messageBoxType:"type")')
        //     console.log(type);
        // }
    }
})();