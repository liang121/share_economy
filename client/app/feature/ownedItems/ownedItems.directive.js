(function(){
    angular
        .module('app.ownedItems')
        .directive('ownedItems',ownedItems)
    function ownedItems(){
        return {
            restrict: 'E',
            templateUrl: 'app/feature/ownedItems/ownedItems.html',
            controllerAs: 'vm',
            controller: ownedItemsCtrl,
            bindToController: true
        }
    }
    function ownedItemsCtrl(){
        var vm = this;
        vm.init = init;
        vm.openDetail = openDetail;
        function init(){
            vm.status = {};
            vm.status.item1DetailOpen = false;
        };
        function openDetail(){
            vm.status.item1DetailOpen = !vm.status.item1DetailOpen;
        }
    }
})();