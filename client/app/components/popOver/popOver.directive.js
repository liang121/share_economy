(function(){
    angular
        .module('components.popOver')
        .directive('popOver',[popOver])
    function popOver(){
        return {
            restrict: 'A',
            controller: popOverCtrl,
            controllerAs: 'vm',
            bindToController: true,
            link: linkFunction
            
        }
        function popOverCtrl(){
            var vm = this;
        }
        function linkFunction(scope,element,attr,ctrl){
            console.log(angular.element(element));
            
        }
    }
})()