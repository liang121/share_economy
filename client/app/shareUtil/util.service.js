(function(){
    angular
        .module('app.util')
        .factory('utilService',utilService);
    function utilService(){
        return{
            isNumber: isNumber,
            isArray: isArray,
            isString: isString,
            isBoolean: isBoolean,
            isFunction: isFunction,
            isObject: isObject,
            isDefined: isDefined,
            isEmpty: isEmpty,
            isUndefined: isUndefined,
            daysDifferents: daysDifferents
        }
        /*
         *Determine if val is number
         *params type: {*}
         */
        function isNumber(val) {
            return typeof(val)==="number";
        }

        /*
         *Determine if val is array
         *params type: {*}
         */
        function isArray(val) {
            return Array.isArray(val);
        }

        /*
         *Determine if val is string
         *params type: {*}
         */
        function isString(val) {
            return typeof(val) ==="string";
        }

        /*
         *Determine if val is boolean
         *params type: {*}
         */
        function isBoolean(val) {
            return typeof(val) === "boolean";
        }

        /*
         *Determine if val is function
         *params type: {*}
         */
        function isFunction(val) {
            return val && Object.prototype.toString.call(val) === "[Object Function]";
        }

        /*
         *Determine if val is object
         *params type: {*}
         */
        function isObject(val) {
            return typeof(val) === 'object' && !Array.isArray(val);
        }

        /*
         *Determine if val is defined
         *params type: {*}
         */
        function isDefined(val) {
            return (val !== null && val !==undefined && val !=='')
        }
        function isUndefined(val){
            return val===undefined;
        }

        /*
         *Determine if val is empty or only consists shitespaces
         *Params type: {String|Array|Object} 
         */
        function isEmpty(val) {
            if(!val) return true;
            if(isString(val)) return val.trim().length === 0;
            else if(isArray(val)) return val.length === 0;
            else if(isObject(val)) return JASON.stringify(val) === "{}";
            else return false
        }

        /*
         *Determine the days differents between start date and end date
         *params type: {String}
         *params formats shoud be { MM/dd/yyyy | MM,dd,yyyy }
         */
        function daysDifferents(sDate, eDate) {
            var startDate = new Date(sDate);
            var endDate = new Date(eDate);
            return Math.ceil((endDate.getTime() - startDate.getTime())/1000/3600/24);
        }

        /*
         *Add new property into each object items in an object array
         *params type: {array, string, *, boolean}
         *isNew@params is true, operate and return new object array, 
         *otherwise operate on the original object arry
         */
        function addPropertyIntoEachObj(objArray,propertyName,propertyVal,isNew){
            var i=0, len=objArray.length;
            if(!isEmpty(isNew)||!isNew){
                for(i=0; i<len; i++){
                    objArray[i][propertyName] = propertyVal;
                }
                return;
            }else{
                var copyArray;
                copyArray = objArray.slice(0);
                for(i=0; i<len; i++){
                    copyObj[i][propertyName] = propertyVal;
                }
                return copyArray;
            }
        }
    }

})()
