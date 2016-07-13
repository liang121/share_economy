(function(){
    angular
        .module('app.lists')
        .directive('ownedItems',ownedItems)
    function ownedItems(){
        return {
            restrict: 'E',
            templateUrl: 'app/lists/ownedItems/ownedItems.html',
            controllerAs: 'vm',
            controller: ownedItemsCtrl,
            bindToController: true
        }
    }
    function ownedItemsCtrl(){
        var vm = this;
        vm.init = init;
        function init(){

        };
    }
})();