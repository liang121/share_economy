(function() {
    angular
        .module('app.messageCenter')
        .filter('messageFilter', ['utilService',dateFilter]);

    function dateFilter(utilService) {
        return function(input, val, isEnable) {
            var result = [];
            var currentDate = new Date();
            if(utilService.isEmpty(val)){
                return input;
            }
            if (isEnable) {
                angular.forEach(input, function(messageItem) {
                    if(utilService.isNumber(val)){
                        if(utilService.daysDifferents(messageItem.messageHeader.date,currentDate)<=val){
                            result.push(messageItem);
                        }
                    }else{
                        if(messageItem.isReaded === false){
                            result.push(messageItem);
                        }
                    }
                });
                return result;
            }else{
                return input;
            }
        };
    }
})();