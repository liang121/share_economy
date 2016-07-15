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
                .state('shareeconomy.ownedItems',{
                    url: '/yourItems',
                    template:'<owned-items></owned-items>'
                })
                .state('shareeconomy.messageCenter',{
                    url: '/messageCenter',
                    template:'<message-center></message-center>',
                    abstract:true
                })
                .state('shareeconomy.messageCenter.inbox',{
                    url: '/inbox',
                    template:'<message-inbox></message-inbox>',
                    params: { messageBoxType: null, }
                    // resolve:{
                    //     // messageBoxType: ['$stateParams',function($stateParams){
                    //     //     return $stateParams.messageBoxType;
                    //     // }]
                    //     messageBoxType: function($stateParams){
                    //         return $stateParams.messageBoxType;
                    //     }
                    // }
                })
                .state('shareeconomy.messageCenter.sent',{
                    url: '/sent',
                    template:'<message-sent></message-sent>'
                })
                .state('shareeconomy.wishList',{
                    url: '/wishList',
                    template:'<wish-list></wish-list>'
                })
        })
})()