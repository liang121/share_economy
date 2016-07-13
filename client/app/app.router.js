(function(){
    angular.module('router',[])
        .config(function($locationProvider, $stateProvider, $urlRouterProvider){
           // $urlRouterProvider.otherwise('shareeconomy/home');
            $locationProvider.html5Mode(true);
            $stateProvider
                .state('shareeconomy',{
                    url: '/shareeconomy',
                    template: '<layout></layout>',
                    abstract: true
                })
                .state('shareeconomy.home',{
                    url: '/home',
                    template: '<home-page></home-page>'
                })
                .state('shareeconomy.shoppingCart',{
                    url: '/shoppingCart',
                    template:'<shopping-cart></shopping-cart>'
                })
                .state('shareeconomy.proceedCheckout',{
                    url: '/proceedCheckout',
                    template:'<proceed-checkout></proceed-checkout>'
                })
                .state('shareeconomy.myAccount',{
                    url: '/myAccount',
                    template:'<my-account></my-account>'
                })
        })
})()