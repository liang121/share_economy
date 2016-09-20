(function(){
    angular
        .module('app.services')
        .service('shoppingCartService',[shoppingCartService]);
    function shoppingCartService(){
        return {
            name:'name'
        }
    }
    
})()