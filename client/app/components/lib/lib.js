(function() {
    'use strict';

    //modules
    angular.module('angularLibrary', ['services', 'feedback', 'forms', 'pageLayout', 'search', 'tables', 'designElements', 'navigation', 'custom.ui.bootstrap', 'ngFileUpload', 'helpers', 'ngSanitize']);
})();
(function() {
    'use strict';
    angular.module('designElements', []);
})();
(function() {
    'use strict';
    angular.module('feedback', []);
})();
(function() {
    'use strict';
    angular.module('forms', []);
})();
(function() {
    'use strict';
    angular.module('helpers', []);
})();
(function() {
    'use strict';
    angular.module('navigation', []);
})();
(function() {
    'use strict';
    angular.module('pageLayout', []);
})();
(function() {
    'use strict';
    angular.module('search', []);
})();
(function() {
    'use strict';
    angular.module('tables', []);
})();
(function() {
    'use strict';
    angular.module('designElements')
        .factory('infoBoxService', infoBoxService);

    //TODO: finish refactor

    function infoBoxService() {
        var service = {
            toggleInfoBox: toggleInfoBox,
            getSettings: getSettings,
            setClasses: setClasses,
            wireOn: wireOn,
            wireOff: wireOff
        };

        return service;

        function toggleInfoBox(id) {
            if (!id) {
                return;
            }
            var elem = angular.element(document.querySelector('#' + id).children[0]),
                settings;
            if (elem.hasClass('info-box-popover')) {
                settings = getSettings('popover');
            } else if (elem.hasClass('info-box-tooltip')) {
                settings = getSettings('tooltip');
            }
            if (elem.hasClass(settings.activeClass)) {
                wireOff(document.body, 'click');
            } else {
                wireOn(document.body, 'click', function(evt) {
                    console.log('called here');
                    console.log(elem.find(settings.baseTarget).hasClass(settings.activeClass));
                    if (!elem[0].contains(evt.target) && elem.hasClass(settings.activeClass)) {
                        elem.removeClass(settings.activeClass);
                        wireOff(document.body, 'click');
                    }
                });
            }
            elem.toggleClass(settings.activeClass);
        }

        function getSettings(type) {
            switch (type) {
                case 'popover': return { wrapperClass: 'info-box-popover', activeClass: 'active', childTarget: 'infoBoxContent', showDiv: true, baseTarget: 'div', linkTarget: 'a' };
                case 'tooltip': return { wrapperClass: 'info-box-tooltip', activeClass: 'active', childTarget: 'infoBoxContent', showSpan: true, baseTarget: 'div', linkTarget: 'a' };
            }
        }

        function setClasses(elem, boxType, placement, iconClass, id) {
            var settings = getSettings(boxType);

            var baseTarget = settings.baseTarget,
                childTarget = settings.childTarget,
                wrapperClass = settings.wrapperClass;

            //set the base class
            elem.find(baseTarget).addClass(wrapperClass);
            angular.element(document.querySelector('#' + id + ' #aTagSpan')).addClass(iconClass);
            angular.element(document.getElementById(childTarget)).addClass(placement || 'top-right');

            return settings;
        }

        function wireOn(element, listeners, func) {
            angular.element(element).on(listeners, func);
        }

        function wireOff(element, listeners) {
            angular.element(element).off(listeners);
        }

        //function onBodyClick(e) {
        //    var elem = angular.element(document.querySelector('#' + id).children[0]);
        //    if (elem.find())
        //}
    }
})();
(function() {
    'use strict';
    snapInfoBox.$inject = ["infoBoxService"];
    angular.module('designElements')
        .directive('snapInfoBox', snapInfoBox);

    /* @ngInject */
    function snapInfoBox(infoBoxService) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                boxType: '@',
                id: '@',
                eventListeners: '@',
                placement: '@',
                iconClass: '@',
                link: '@',
                aTagClass: '@',
                popoverClass: '@',
                isArray: '='
            },
            link: function(scope, element, attr, ctrl, $transclude) {

                $transclude(function(clone) {
                    if (!clone.length) {
                        scope.missingContent = true;
                    }
                });

                scope.boxType = scope.boxType ? scope.boxType : 'tooltip';
                //expose setting variable
                scope.settings = infoBoxService.setClasses(element, (scope.boxType), scope.placement, scope.iconClass, scope.id);

                //determine template
                scope.isTemplate = !!scope.isTemplate;

                //wire up the listeners

                scope.eventListeners = scope.eventListeners ? scope.eventListeners : (scope.boxType === 'tooltip' ? 'mouseenter mouseleave' : 'click');

                infoBoxService.wireOn(element.find(scope.settings.linkTarget), scope.eventListeners, toggleActive);


                function toggleActive(e) {
                    //added condition to allow for clicking within popover without closing popover
                    if (scope.settings.wrapperClass === 'info-box-popover') {
                        if (element.find(e.target) && !angular.element(e.target).hasClass(scope.settings.wrapperClass)){
                            if (angular.element(element[0].querySelector('.' + scope.settings.wrapperClass)).hasClass(scope.settings.activeClass)) {
                                infoBoxService.wireOff(document.body, 'click');
                            } else {
                                infoBoxService.wireOn(document.body, 'click', onBodyClick);
                            }
                            angular.element(element[0].querySelector('.' + scope.settings.wrapperClass)).toggleClass(scope.settings.activeClass);
                        }
                    } else if (element.find(e.target)) {
                        if (element.find(scope.settings.baseTarget).hasClass(scope.settings.activeClass)) {
                            infoBoxService.wireOff(document.body, 'click');
                        } else {
                            infoBoxService.wireOn(document.body, 'click', onBodyClick);
                        }
                        element.find(scope.settings.baseTarget).toggleClass(scope.settings.activeClass);
                    }
                }

                function onBodyClick(e){
                    console.log('called');
                    if (element.find(scope.settings.baseTarget).hasClass(scope.settings.activeClass) && !element[0].contains(e.target)) {
                        element.find(scope.settings.baseTarget).removeClass(scope.settings.activeClass);
                        infoBoxService.wireOff(document.body, 'click');
                    }
                }

                scope.$on('$destroy', function() {
                    infoBoxService.wireOff(document.body, 'click');
                    infoBoxService.wireOff(element, scope.eventListeners);
                });
            },
            templateUrl: 'components/design-elements/infoBox/snapInfoBox.html'
        };
    }
})();

/*
 AngularJS v1.4.9
 (c) 2010-2015 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(n,h,p){'use strict';function E(a){var f=[];r(f,h.noop).chars(a);return f.join("")}function g(a,f){var d={},c=a.split(","),b;for(b=0;b<c.length;b++)d[f?h.lowercase(c[b]):c[b]]=!0;return d}function F(a,f){function d(a,b,d,l){b=h.lowercase(b);if(s[b])for(;e.last()&&t[e.last()];)c("",e.last());u[b]&&e.last()==b&&c("",b);(l=v[b]||!!l)||e.push(b);var m={};d.replace(G,function(b,a,f,c,d){m[a]=q(f||c||d||"")});f.start&&f.start(b,m,l)}function c(b,a){var c=0,d;if(a=h.lowercase(a))for(c=e.length-
    1;0<=c&&e[c]!=a;c--);if(0<=c){for(d=e.length-1;d>=c;d--)f.end&&f.end(e[d]);e.length=c}}"string"!==typeof a&&(a=null===a||"undefined"===typeof a?"":""+a);var b,k,e=[],m=a,l;for(e.last=function(){return e[e.length-1]};a;){l="";k=!0;if(e.last()&&w[e.last()])a=a.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*"+e.last()+"[^>]*>","i"),function(a,b){b=b.replace(H,"$1").replace(I,"$1");f.chars&&f.chars(q(b));return""}),c("",e.last());else{if(0===a.indexOf("\x3c!--"))b=a.indexOf("--",4),0<=b&&a.lastIndexOf("--\x3e",
    b)===b&&(f.comment&&f.comment(a.substring(4,b)),a=a.substring(b+3),k=!1);else if(x.test(a)){if(b=a.match(x))a=a.replace(b[0],""),k=!1}else if(J.test(a)){if(b=a.match(y))a=a.substring(b[0].length),b[0].replace(y,c),k=!1}else K.test(a)&&((b=a.match(z))?(b[4]&&(a=a.substring(b[0].length),b[0].replace(z,d)),k=!1):(l+="<",a=a.substring(1)));k&&(b=a.indexOf("<"),l+=0>b?a:a.substring(0,b),a=0>b?"":a.substring(b),f.chars&&f.chars(q(l)))}if(a==m)throw L("badparse",a);m=a}c()}function q(a){if(!a)return"";A.innerHTML=
    a.replace(/</g,"&lt;");return A.textContent}function B(a){return a.replace(/&/g,"&amp;").replace(M,function(a){var d=a.charCodeAt(0);a=a.charCodeAt(1);return"&#"+(1024*(d-55296)+(a-56320)+65536)+";"}).replace(N,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(a,f){var d=!1,c=h.bind(a,a.push);return{start:function(a,k,e){a=h.lowercase(a);!d&&w[a]&&(d=a);d||!0!==C[a]||(c("<"),c(a),h.forEach(k,function(d,e){var k=h.lowercase(e),g="img"===a&&"src"===k||
    "background"===k;!0!==O[k]||!0===D[k]&&!f(d,g)||(c(" "),c(e),c('="'),c(B(d)),c('"'))}),c(e?"/>":">"))},end:function(a){a=h.lowercase(a);d||!0!==C[a]||(c("</"),c(a),c(">"));a==d&&(d=!1)},chars:function(a){d||c(B(a))}}}var L=h.$$minErr("$sanitize"),z=/^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,y=/^<\/\s*([\w:-]+)[^>]*>/,G=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,K=/^</,J=/^<\//,H=/\x3c!--(.*?)--\x3e/g,x=/<!DOCTYPE([^>]*?)>/i,
    I=/<!\[CDATA\[(.*?)]]\x3e/g,M=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,N=/([^\#-~| |!])/g,v=g("area,br,col,hr,img,wbr");n=g("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr");p=g("rp,rt");var u=h.extend({},p,n),s=h.extend({},n,g("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),t=h.extend({},p,g("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var"));
    n=g("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan,use");var w=g("script,style"),C=h.extend({},v,s,t,u,n),D=g("background,cite,href,longdesc,src,usemap,xlink:href");n=g("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,tabindex,target,title,type,valign,value,vspace,width");
    p=g("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",
        !0);var O=h.extend({},D,p,n),A=document.createElement("pre");h.module("ngSanitize",[]).provider("$sanitize",function(){this.$get=["$$sanitizeUri",function(a){return function(f){var d=[];F(f,r(d,function(c,b){return!/^unsafe/.test(a(c,b))}));return d.join("")}}]});h.module("ngSanitize").filter("linky",["$sanitize",function(a){var f=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/i,d=/^mailto:/i;return function(c,b){function k(a){a&&g.push(E(a))}function e(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           c){g.push("<a ");h.isDefined(b)&&g.push('target="',b,'" ');g.push('href="',a.replace(/"/g,"&quot;"),'">');k(c);g.push("</a>")}if(!c)return c;for(var m,l=c,g=[],n,p;m=l.match(f);)n=m[0],m[2]||m[4]||(n=(m[3]?"http://":"mailto:")+n),p=m.index,k(l.substr(0,p)),e(n,m[0].replace(d,"")),l=l.substring(p+m[0].length);k(l);return a(g.join(""))}}])})(window,window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.1 - 2015-10-17
 * License: MIT
 */
angular.module("custom.ui.bootstrap", ["custom.ui.bootstrap.datepicker","custom.ui.bootstrap.dateparser","custom.ui.bootstrap.position"]);
angular.module('custom.ui.bootstrap.datepicker', ['custom.ui.bootstrap.dateparser', 'custom.ui.bootstrap.position'])

    .constant('datepickerConfig', {
        formatDay: 'dd',
        formatMonth: 'MMMM',
        formatYear: 'yyyy',
        formatDayHeader: 'EEE',
        formatDayTitle: 'MMMM yyyy',
        formatMonthTitle: 'yyyy',
        datepickerMode: 'day',
        minMode: 'day',
        maxMode: 'year',
        showWeeks: false,
        startingDay: 0,
        yearRange: 20,
        minDate: null,
        maxDate: null
    })

    .controller('CustomDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
        var self = this,
            ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;
        var todaysDate = new Date();

        // Modes chain
        this.modes = ['day', 'month', 'year'];

        // Configuration attributes
        angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
            'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function( key, index ) {
            self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
        });

        // Watchable date attributes
        angular.forEach(['minDate', 'maxDate'], function( key ) {
            if ( $attrs[key] ) {
                $scope.$parent.$watch($parse($attrs[key]), function(value) {
                    self[key] = value ? new Date(value) : null;
                    self.refreshView();
                });
            } else {
                self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
            }
        });

        $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
        $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
        this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();

        $scope.isActive = function(dateObject) {
            return compareDates(dateObject, self.activeDate);
        };

        $scope.isToday = function(dateObject) {
            return compareDates(dateObject, todaysDate);
        }

        function compareDates(date1, date2) {
            if (self.compare(date1.date, date2) === 0) {
                $scope.activeDateId = date1.uid;
                return true;
            }
            return false;
        }

        this.init = function( ngModelCtrl_ ) {
            ngModelCtrl = ngModelCtrl_;

            ngModelCtrl.$render = function() {
                self.render();
            };
        };

        this.render = function() {
            if ( ngModelCtrl.$modelValue ) {
                var date = new Date( ngModelCtrl.$modelValue ),
                    isValid = !isNaN(date);

                if ( isValid ) {
                    this.activeDate = date;
                } else {
                    $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                }
                ngModelCtrl.$setValidity('date', isValid);
            }
            this.refreshView();
        };

        this.refreshView = function() {
            if ( this.element ) {
                this._refreshView();

                var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
                ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
            }
        };

        this.createDateObject = function(date, format) {
            var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
            return {
                date: date,
                label: dateFilter(date, format),
                selected: model && this.compare(date, model) === 0,
                disabled: this.isDisabled(date),
                current: this.compare(date, new Date()) === 0
            };
        };

        this.isDisabled = function( date ) {
            return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
        };

        // Split array into smaller arrays
        this.split = function(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        };

        $scope.select = function( date ) {
            if ( $scope.datepickerMode === self.minMode ) {
                var dt = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : new Date(0, 0, 0, 0, 0, 0, 0);
                dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
                ngModelCtrl.$setViewValue( dt );
                ngModelCtrl.$render();
            } else {
                self.activeDate = date;
                $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) - 1 ];
            }
        };

        $scope.move = function( direction ) {
            var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
                month = self.activeDate.getMonth() + direction * (self.step.months || 0);
            self.activeDate.setFullYear(year, month, 1);
            self.refreshView();
        };

        $scope.toggleMode = function( direction ) {
            direction = direction || 1;

            if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
                return;
            }

            $scope.datepickerMode = self.modes[ self.modes.indexOf( $scope.datepickerMode ) + direction ];
        };

        // Key event mapper
        $scope.keys = { 13:'enter', 32:'space', 33:'pageup', 34:'pagedown', 35:'end', 36:'home', 37:'left', 38:'up', 39:'right', 40:'down' };

        var focusElement = function() {
            $timeout(function() {
                self.element[0].focus();
            }, 0 , false);
        };

        // Listen for focus requests from popup directive
        $scope.$on('datepicker.focus', focusElement);

        $scope.keydown = function( evt ) {
            var key = $scope.keys[evt.which];

            if ( !key || evt.shiftKey || evt.altKey ) {
                return;
            }

            evt.preventDefault();
            evt.stopPropagation();

            if (key === 'enter' || key === 'space') {
                if ( self.isDisabled(self.activeDate)) {
                    return; // do nothing
                }
                $scope.select(self.activeDate);
                focusElement();
            } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
                $scope.toggleMode(key === 'up' ? 1 : -1);
                focusElement();
            } else {
                self.handleKeyDown(key, evt);
                self.refreshView();
            }
        };
    }])

    .directive( 'datepickerSnap', function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/deps/uib.0.12.1/datepicker.html',
            scope: {
                datepickerMode: '=?',
                dateDisabled: '&'
            },
            require: ['datepickerSnap', '?^ngModel'],
            controller: 'CustomDatepickerController',
            link: function(scope, element, attrs, ctrls) {
                var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if ( ngModelCtrl ) {
                    datepickerCtrl.init( ngModelCtrl );
                }
            }
        };
    })

    .directive('customdaypicker', ['dateFilter', function (dateFilter) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/deps/uib.0.12.1/day.html',
            require: '^datepickerSnap',
            link: function(scope, element, attrs, ctrl) {
                scope.showWeeks = ctrl.showWeeks;

                ctrl.step = { months: 1 };
                ctrl.element = element;

                var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                function getDaysInMonth( year, month ) {
                    return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
                }

                function getDates(startDate, n) {
                    var dates = new Array(n), current = new Date(startDate), i = 0;
                    current.setHours(12); // Prevent repeated dates because of timezone bug
                    while ( i < n ) {
                        dates[i++] = new Date(current);
                        current.setDate( current.getDate() + 1 );
                    }
                    return dates;
                }

                ctrl._refreshView = function() {
                    var year = ctrl.activeDate.getFullYear(),
                        month = ctrl.activeDate.getMonth(),
                        firstDayOfMonth = new Date(year, month, 1),
                        difference = ctrl.startingDay - firstDayOfMonth.getDay(),
                        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
                        firstDate = new Date(firstDayOfMonth);

                    if ( numDisplayedFromPreviousMonth > 0 ) {
                        firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
                    }

                    // 42 is the number of days on a six-month calendar
                    var days = getDates(firstDate, 42);
                    for (var i = 0; i < 42; i ++) {
                        days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
                            secondary: days[i].getMonth() !== month,
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.labels = new Array(7);
                    for (var j = 0; j < 7; j++) {
                        scope.labels[j] = {
                            abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
                            full: dateFilter(days[j].date, 'EEEE')
                        };
                    }

                    scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
                    scope.rows = ctrl.split(days, 7);

                    if ( scope.showWeeks ) {
                        scope.weekNumbers = [];
                        var weekNumber = getISO8601WeekNumber( scope.rows[0][0].date ),
                            numWeeks = scope.rows.length;
                        while( scope.weekNumbers.push(weekNumber++) < numWeeks ) {}
                    }
                };

                ctrl.compare = function(date1, date2) {
                    return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
                };

                function getISO8601WeekNumber(date) {
                    var checkDate = new Date(date);
                    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
                    var time = checkDate.getTime();
                    checkDate.setMonth(0); // Compare with Jan 1
                    checkDate.setDate(1);
                    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
                }

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getDate();

                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 7;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 7;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
                        ctrl.activeDate.setMonth(month, 1);
                        date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
                    } else if (key === 'home') {
                        date = 1;
                    } else if (key === 'end') {
                        date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
                    }
                    ctrl.activeDate.setDate(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .directive('custommonthpicker', ['dateFilter', function (dateFilter) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/deps/uib.0.12.1/month.html',
            require: '^datepickerSnap',
            link: function(scope, element, attrs, ctrl) {
                ctrl.step = { years: 1 };
                ctrl.element = element;

                ctrl._refreshView = function() {
                    var months = new Array(12),
                        year = ctrl.activeDate.getFullYear();

                    for ( var i = 0; i < 12; i++ ) {
                        months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
                    scope.rows = ctrl.split(months, 3);
                };

                ctrl.compare = function(date1, date2) {
                    return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
                };

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getMonth();

                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 3;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 3;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
                        ctrl.activeDate.setFullYear(year);
                    } else if (key === 'home') {
                        date = 0;
                    } else if (key === 'end') {
                        date = 11;
                    }
                    ctrl.activeDate.setMonth(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .directive('customyearpicker', ['dateFilter', function (dateFilter) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'components/deps/uib.0.12.1/year.html',
            require: '^datepickerSnap',
            link: function(scope, element, attrs, ctrl) {
                var range = ctrl.yearRange;

                ctrl.step = { years: range };
                ctrl.element = element;

                function getStartingYear( year ) {
                    return parseInt((year - 1) / range, 10) * range + 1;
                }

                ctrl._refreshView = function() {
                    var years = new Array(range);

                    for ( var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++ ) {
                        years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
                            uid: scope.uniqueId + '-' + i
                        });
                    }

                    scope.title = [years[0].label, years[range - 1].label].join(' - ');
                    scope.rows = ctrl.split(years, 5);
                };

                ctrl.compare = function(date1, date2) {
                    return date1.getFullYear() - date2.getFullYear();
                };

                ctrl.handleKeyDown = function( key, evt ) {
                    var date = ctrl.activeDate.getFullYear();

                    if (key === 'left') {
                        date = date - 1;   // up
                    } else if (key === 'up') {
                        date = date - 5;   // down
                    } else if (key === 'right') {
                        date = date + 1;   // down
                    } else if (key === 'down') {
                        date = date + 5;
                    } else if (key === 'pageup' || key === 'pagedown') {
                        date += (key === 'pageup' ? - 1 : 1) * ctrl.step.years;
                    } else if (key === 'home') {
                        date = getStartingYear( ctrl.activeDate.getFullYear() );
                    } else if (key === 'end') {
                        date = getStartingYear( ctrl.activeDate.getFullYear() ) + range - 1;
                    }
                    ctrl.activeDate.setFullYear(date);
                };

                ctrl.refreshView();
            }
        };
    }])

    .constant('datepickerPopupConfig', {
        datepickerPopup: 'MM/dd/yyyy',
        currentText: 'Today',
        clearText: 'Clear',
        closeText: 'Done',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true
    })

    .directive('snapDatepicker', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datepickerPopupConfig',
        function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
            return {
                restrict: 'EA',
                require: 'ngModel',
                scope: {
                    isOpen: '=?',
                    isStandalone: '=?',
                    currentText: '@',
                    clearText: '@',
                    closeText: '@',
                    dateDisabled: '&'
                },
                link: function(scope, element, attrs, ngModel) {
                    var dateFormat,
                        closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
                        appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

                    scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : (angular.isDefined(attrs.isStandalone) ? !scope.$parent.$eval(attrs.isStandalone) : datepickerPopupConfig.showButtonBar);

                    scope.getText = function( key ) {
                        return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
                    };

                    attrs.$observe('snapDatepicker', function(value) {
                        dateFormat = value || datepickerPopupConfig.datepickerPopup;
                        ngModel.$render();
                    });

                    // popup element used to display calendar
                    var popupEl = angular.element('<div snap-datepicker-popup-wrap><div datepicker-snap datepicker-mode="datepickerMode"></div></div>');
                    popupEl.attr({
                        'ng-model': 'date',
                        'ng-change': 'dateSelection()'
                    });

                    function cameltoDash( string ){
                        return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
                    }

                    // datepicker element
                    var datepickerEl = angular.element(popupEl.children()[0]);
                    if ( attrs.datepickerOptions ) {
                        angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function( value, option ) {
                            datepickerEl.attr( cameltoDash(option), value );
                        });
                    }

                    scope.watchData = {};
                    angular.forEach(['minDate', 'maxDate', 'datepickerMode'], function( key ) {
                        if ( attrs[key] ) {
                            var getAttribute = $parse(attrs[key]);
                            scope.$parent.$watch(getAttribute, function(value){
                                scope.watchData[key] = value;
                            });
                            datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

                            // Propagate changes from datepicker to outside
                            if ( key === 'datepickerMode' ) {
                                var setAttribute = getAttribute.assign;
                                scope.$watch('watchData.' + key, function(value, oldvalue) {
                                    if ( value !== oldvalue ) {
                                        setAttribute(scope.$parent, value);
                                    }
                                });
                            }
                        }
                    });
                    if (attrs.dateDisabled) {
                        datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
                    }

                    function parseDate(viewValue) {
                        if (!viewValue) {
                            ngModel.$setValidity('date', true);
                            return null;
                        } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
                            ngModel.$setValidity('date', true);
                            return viewValue;
                        } else if (angular.isString(viewValue)) {
                            var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
                            if (isNaN(date)) {
                                ngModel.$setValidity('date', false);
                                return undefined;
                            } else {
                                ngModel.$setValidity('date', true);
                                return date;
                            }
                        } else {
                            ngModel.$setValidity('date', false);
                            return undefined;
                        }
                    }
                    ngModel.$parsers.unshift(parseDate);

                    // Inner change
                    scope.dateSelection = function(dt) {
                        if (angular.isDefined(dt)) {
                            scope.date = dt;
                        }
                        ngModel.$setViewValue(scope.date);
                        ngModel.$render();

                        if ( closeOnDateSelection && !scope.isStandalone) {
                            scope.isOpen = false;
                            element[0].focus();
                        }
                    };

                    element.bind('input change keyup', function() {
                        scope.$apply(function() {
                            scope.date = ngModel.$modelValue;
                        });
                    });

                    // Outter change
                    ngModel.$render = function() {
                        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
                        element.val(date);
                        scope.date = parseDate( ngModel.$modelValue );
                    };

                    var documentClickBind = function(event) {
                        if (scope.isOpen && event.target !== element[0] && !scope.isStandalone) {
                            scope.$apply(function() {
                                scope.isOpen = false;
                            });
                        }
                    };

                    var keydown = function(evt, noApply) {
                        scope.keydown(evt);
                    };
                    element.bind('keydown', keydown);

                    scope.keydown = function(evt) {
                        if (evt.which === 27 && !scope.isStandalone) {
                            evt.preventDefault();
                            evt.stopPropagation();
                            scope.close();
                        } else if (evt.which === 40 && !scope.isOpen) {
                            scope.isOpen = true;
                        }
                    };

                    scope.$watch('isOpen', function(value) {
                        if (value) {
                            scope.$broadcast('datepicker.focus');
                            scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                            scope.position.top = scope.position.top + element.prop('offsetHeight');
                            $document.bind('click', documentClickBind);
                            scope.$$childHead.datepickerMode = 'day';
                        } else {
                            $document.unbind('click', documentClickBind);
                        }
                    });

                    scope.select = function( date ) {
                        if (date === 'today') {
                            var today = new Date();
                            if (angular.isDate(ngModel.$modelValue)) {
                                date = new Date(ngModel.$modelValue);
                                date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
                            } else {
                                date = new Date(today.setHours(0, 0, 0, 0));
                            }
                        }
                        scope.dateSelection( date );
                    };

                    scope.close = function() {
                        scope.isOpen = false;
                        element[0].focus();
                    };

                    var $popup = $compile(popupEl)(scope);
                    // Prevent jQuery cache memory leak (template is now redundant after linking)
                    popupEl.remove();

                    if ( appendToBody ) {
                        $document.find('body').append($popup);
                    } else {
                        element.after($popup);
                    }

                    scope.$on('$destroy', function() {
                        $popup.remove();
                        element.unbind('keydown', keydown);
                        $document.unbind('click', documentClickBind);
                    });
                }
            };
        }])

    .directive('snapDatepickerPopupWrap', function() {
        return {
            restrict:'EA',
            replace: true,
            transclude: true,
            templateUrl: 'components/deps/uib.0.12.1/popup.html',
            link:function (scope, element, attrs) {
                element.bind('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        };
    });

angular.module('custom.ui.bootstrap.dateparser', [])

    .service('dateParser', ['$locale', 'orderByFilter', function($locale, orderByFilter) {

        this.parsers = {};

        var formatCodeToRegex = {
            'yyyy': {
                regex: '\\d{4}',
                apply: function(value) { this.year = +value; }
            },
            'yy': {
                regex: '\\d{2}',
                apply: function(value) { this.year = +value + 2000; }
            },
            'y': {
                regex: '\\d{1,4}',
                apply: function(value) { this.year = +value; }
            },
            'MMMM': {
                regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
                apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
            },
            'MMM': {
                regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
                apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
            },
            'MM': {
                regex: '0[1-9]|1[0-2]',
                apply: function(value) { this.month = value - 1; }
            },
            'M': {
                regex: '[1-9]|1[0-2]',
                apply: function(value) { this.month = value - 1; }
            },
            'dd': {
                regex: '[0-2][0-9]{1}|3[0-1]{1}',
                apply: function(value) { this.date = +value; }
            },
            'd': {
                regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
                apply: function(value) { this.date = +value; }
            },
            'EEEE': {
                regex: $locale.DATETIME_FORMATS.DAY.join('|')
            },
            'EEE': {
                regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
            }
        };

        function createParser(format) {
            var map = [], regex = format.split('');

            angular.forEach(formatCodeToRegex, function(data, code) {
                var index = format.indexOf(code);

                if (index > -1) {
                    format = format.split('');

                    regex[index] = '(' + data.regex + ')';
                    format[index] = '$'; // Custom symbol to define consumed part of format
                    for (var i = index + 1, n = index + code.length; i < n; i++) {
                        regex[i] = '';
                        format[i] = '$';
                    }
                    format = format.join('');

                    map.push({ index: index, apply: data.apply });
                }
            });

            return {
                regex: new RegExp('^' + regex.join('') + '$'),
                map: orderByFilter(map, 'index')
            };
        }

        this.parse = function(input, format) {
            if ( !angular.isString(input) || !format ) {
                return input;
            }

            format = $locale.DATETIME_FORMATS[format] || format;

            if ( !this.parsers[format] ) {
                this.parsers[format] = createParser(format);
            }

            var parser = this.parsers[format],
                regex = parser.regex,
                map = parser.map,
                results = input.match(regex);

            if ( results && results.length ) {
                var fields = { year: 1900, month: 0, date: 1, hours: 0 }, dt;

                for( var i = 1, n = results.length; i < n; i++ ) {
                    var mapper = map[i-1];
                    if ( mapper.apply ) {
                        mapper.apply.call(fields, results[i]);
                    }
                }

                if ( isValid(fields.year, fields.month, fields.date) ) {
                    dt = new Date( fields.year, fields.month, fields.date, fields.hours);
                }

                return dt;
            }
        };

        // Check if date is valid for specific month (and year for February).
        // Month: 0 = Jan, 1 = Feb, etc
        function isValid(year, month, date) {
            if ( month === 1 && date > 28) {
                return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
            }

            if ( month === 3 || month === 5 || month === 8 || month === 10) {
                return date < 31;
            }

            return true;
        }
    }]);

angular.module('custom.ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
    .factory('$position', ['$document', '$window', function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, 'position') || 'static' ) === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = { top: 0, left: 0 };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                };
            },

            /**
             * Provides coordinates for the targetEl in relation to hostEl
             */
            positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

                var positionStrParts = positionStr.split('-');
                var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

                var hostElPos,
                    targetElWidth,
                    targetElHeight,
                    targetElPos;

                hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

                targetElWidth = targetEl.prop('offsetWidth');
                targetElHeight = targetEl.prop('offsetHeight');

                var shiftWidth = {
                    center: function () {
                        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                    },
                    left: function () {
                        return hostElPos.left;
                    },
                    right: function () {
                        return hostElPos.left + hostElPos.width;
                    }
                };

                var shiftHeight = {
                    center: function () {
                        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                    },
                    top: function () {
                        return hostElPos.top;
                    },
                    bottom: function () {
                        return hostElPos.top + hostElPos.height;
                    }
                };

                switch (pos0) {
                    case 'right':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: shiftWidth[pos0]()
                        };
                        break;
                    case 'left':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: hostElPos.left - targetElWidth
                        };
                        break;
                    case 'bottom':
                        targetElPos = {
                            top: shiftHeight[pos0](),
                            left: shiftWidth[pos1]()
                        };
                        break;
                    default:
                        targetElPos = {
                            top: hostElPos.top - targetElHeight,
                            left: shiftWidth[pos1]()
                        };
                        break;
                }

                return targetElPos;
            }
        };
    }]);

(function() {
    'use strict';
    SnapMessageCtrl.$inject = ["snapMessageService"];
    angular.module('feedback')
        .directive('snapMessage', snapMessage);

    function snapMessage() {
        var directive = {
            controller:  SnapMessageCtrl,
            controllerAs: 'vm',
            scope: {
                isFixedPosition: '=',
                header: '@',
                isVisible: '=',
                messageType: '@',
                isDismissible: '='
            },
            transclude: true,
            bindToController: true,
            restrict: 'E',
            templateUrl: function (el, attrs) {
                var type = eval(attrs.isFixedPosition) ? 'Fixed' : 'Inline';
                return 'components/feedback/messaging/snap' + type + 'Message.html'
            }
        };
        return directive;
    }

    /* @ngInject */
    function SnapMessageCtrl(snapMessageService) {
        var vm = this;
        vm.clearAll = clearAll;
        vm.hideParent = hideParent;
        vm.getLength = getLength;
        vm.types = [];

        if (vm.isFixedPosition) {
            vm.types.push(
                {
                    messageType:'success',
                    header: 'Success',
                    alerts: snapMessageService.successAlerts
                }, {
                    messageType: 'error',
                    header: 'Error',
                    alerts: snapMessageService.errorAlerts
                }
            );
        } else {
            if (!isMessageTypeValid()) {
                vm.messageType = 'error';
                console.log('Defaulting to error type. Please pass only error, informational,' +
                    ' or success types to fixed messages.');
            }
        }

        function clearAll(type) {
            for (var i = snapMessageService[type + 'Alerts'].length; i > 0; i--) {
                snapMessageService[type + 'Alerts'].pop();
            }
        }

        function hideParent(event) {
            if (event && event.target && event.target.parentElement && event.target.parentElement && event.target.parentElement.parentElement) {
                angular.element(event.target.parentElement.parentElement).addClass('ng-hide');
            }
        }

        function getLength(type) {
            return (type.alerts.length > 0) && angular.element(document.getElementById(type.header + 'DIV')).hasClass('active');
        }

        function isMessageTypeValid() {
            switch (vm.messageType) {
                case 'error': return true;
                case 'informational': return true;
                case 'success': return true;
                default: return false;
            }
        }
    }
})();
(function() {
    'use strict';
    SnapProgressCtrl.$inject = ["$scope"];
    angular.module('feedback')
        .directive('snapProgressIndicator', snapProgressIndicator);

    function snapProgressIndicator() {
        var directive = {
            controller:  SnapProgressCtrl,
            controllerAs: 'vm',
            scope: {
                current: '=',
                total: '='
            },
            restrict: 'E',
            templateUrl: 'components/feedback/progressIndicator/progressIndicator.html'
        };
        return directive;
    }

    /* @ngInject */
    function SnapProgressCtrl($scope) {
        var vm = this;
        $scope.$watch('current', function() {
            if (angular.isDefined($scope.current) && angular.isDefined($scope.total) && (typeof $scope.current !== 'undefined')) {
                vm.progress = Math.floor($scope.current / $scope.total * 100);
            }
        });
    }
})();
(function() {
    'use strict';

    httpProvider.$inject = ["$httpProvider"];
    angular.module('feedback').config(['$httpProvider', httpProvider]);
    /* @ngInject */
    function httpProvider($httpProvider) {
        $httpProvider.interceptors.push('statusSpinnerInterceptor');
    }
})();
(function() {
    'use strict';

    angular.module('feedback').factory('statusSpinnerInterceptor', spinnerInterceptor);
    function spinnerInterceptor() {
        return {};
    }
})();
(function() {
    'use strict';

    angular
        .module('feedback')
        .provider('snapSpinnerConfig', function() {
            var _config = {};

            return {
                setDefaults: function(config) {
                    _config = config || _config;
                },
                $get: function() {
                    return {
                        config: _config
                    };
                }
            };
        });
})();

(function() {
    'use strict';
    snapStatusSpinner.$inject = ["statusSpinnerInterceptor", "$q", "$timeout", "snapSpinnerService"];
    angular.module('feedback')
        .directive('snapStatusSpinner', snapStatusSpinner);

    /* @ngInject */
    function snapStatusSpinner(statusSpinnerInterceptor, $q, $timeout, snapSpinnerService) {
        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, element, attr) {
                var defaults = {
                        overlayDelayIn: 500,
                        overlayDelayOut: 500
                    },
                    delayIn = attr.delayIn ? scope.$eval(attr.delayIn) : defaults.overlayDelayIn,
                    delayOut = attr.delayOut ? scope.$eval(attr.delayOut) : defaults.overlayDelayOut,
                    wireIntercept = attr.wireIntercept ? scope.$eval(attr.wireIntercept) : false,
                    isNested = attr.isNested ? scope.$eval(attr.isNested) : false,
                    queue = [];

                if (wireIntercept) {
                    wireUpInterceptor();
                }

                scope.spinner = element;

                if (isNested) {
                    scope.spinner.addClass('spinner-nested');
                }

                scope.key = angular.isDefined(attr.spinnerKey) ? attr.spinnerKey : false;

                function stopSpinner(key) {
                    if (key === scope.key) {
                        if (scope.spinner.hasClass('launch-spinner')) {
                            scope.spinner.removeClass('launch-spinner');
                        }
                    }
                }

                function startSpinner(key) {
                    if (key === scope.key) {
                        if (!scope.spinner.hasClass('launch-spinner')){
                            scope.spinner.addClass('launch-spinner');
                        }
                    }
                }

                function wireUpInterceptor() {
                    statusSpinnerInterceptor.request = function (config) {
                        if (!config.hideSpinner){
                            $timeout(function () {
                                processRequest(config.spinnerKey || snapSpinnerService.mainSpinner);
                            }, delayIn); //Delay showing for 500 millis to avoid flicker
                            queue.push(config.spinnerKey);
                        }
                        return config || $q.when(response);
                    };

                    statusSpinnerInterceptor.response = function (response) {
                        if (response && response.config && !response.config.hideSpinner) {
                            $timeout(function () {
                                processResponse(response.config.spinnerKey || snapSpinnerService.mainSpinner);
                            }, delayOut);
                        }
                        return response || $q.when(response);
                    };

                    statusSpinnerInterceptor.responseError = function (rejection) {
                        if (rejection && rejection.config && !rejection.config.hideSpinner) {
                            processResponse(rejection.config.spinnerKey || snapSpinnerService.mainSpinner);
                        }
                        return $q.reject(rejection);
                    };
                }

                function processRequest(key) {
                    startSpinner(key);
                }

                function processResponse(key) {
                    queue.pop();
                    if (queue.length === 0){
                        stopSpinner(key);
                    }
                }

                scope.$on('us-spinner:spin', function(event, key){
                    $timeout(function() {
                        startSpinner(key);
                    }, delayIn);
                });

                scope.$on('us-spinner:stop', function(event, key) {
                    $timeout(function() {
                        stopSpinner(key);
                    }, delayOut);
                });
            },
            templateUrl: 'components/feedback/spinner/spinner.html'
        };
    }
})();
(function() {
    'use strict';

    //TODO: add unit tests

    /**
     * snapComboBox
     *
     * This directive provides a combo box with auto-complete functionality.
     *
     * NOTE:
     * This is a heavily-modified version of the angucomplete-alt directive by Hidenari Nozaki.
     * angucomplete-alt is copyright (c) 2014 Hidenari Nozaki and contributors and is
     * licensed under the MIT license.
     * https://github.com/ghiden/angucomplete-alt
     */
    ComboBoxCtrl.$inject = ["$scope", "$element", "$sce", "$timeout", "snapSpinnerService"];
    angular
        .module('forms')
        .directive('snapComboBox', comboBox);

    /**
     * Internal function that returns the snapComboBox directive.
     * @returns {object} the angular directive
     */
    function comboBox() {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                id: '@',
                type: '@',
                title: '@',
                label: '@',
                pause: '@',
                placeholder: '@',
                searchFields: '@',
                clearSelected: '@',
                forceMatch: '=',
                minLength: '@',
                maxLength: '@',
                maxResults: '@',
                textNoResults: '@',
                inputClass: '@',
                pattern: '@',
                additionalInfo: '@',
                resultFields: '=',
                resultClasses: '=',
                fieldRequired: '=',
                selectedObject: '=',
                localData: '=',
                disableInput: '=',
                optionalData: '=',
                showAdditionalInfo: '=',
                onFocus: '&',        // ()
                onSelect: '&',       // ({selection: string|object, optionalData: *})
                onLookup: '&',       // ({searchStr: string})
                onInputChanged: '&',  // ({searchStr: string}),
                form: '=',
                responseType: '@'
            },
            templateUrl: 'components/forms/comboBox/snapComboBox.html',
            controller: ComboBoxCtrl,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    /**
     * Constructor function for the snapComboBox directive's controller.
     * @constructor
     * @ngInject
     */
    function ComboBoxCtrl($scope, $element, $sce, $timeout, snapSpinnerService) {
        /* jshint -W074 */
        var vm = this;

        // keyboard event key values
        var KEY_DOWN = 40;
        var KEY_RIGHT = 39;
        var KEY_UP = 38;
        var KEY_LEFT = 37;
        var KEY_ESC = 27;
        var KEY_ENTER = 13;
        var KEY_TAB = 9;
        var KEY_SHIFT = 16;
        var KEY_CTRL = 17;
        var KEY_ALT = 18;
        var KEY_CMD_L = 91;
        var KEY_CMD_R = 93;

        var ignoreKeys = [KEY_SHIFT, KEY_CTRL, KEY_ALT, KEY_CMD_L, KEY_CMD_R];
        var inputField = $element.find('input');
        var defaultPause = 500; //half a second
        var searchTimer = null;
        var listElement = $element[0].querySelector('ul');
        var isScrollOn = false;
        var lookupCounter = 0;

        vm.init = init;
        vm.inputFocusHandler = inputFocusHandler;
        vm.inputChangeHandler = inputChangeHandler;
        vm.inputKeydownHandler = inputKeydownHandler;
        vm.inputKeyupHandler = inputKeyupHandler;
        vm.inputBlurHandler = inputBlurHandler;
        vm.rowMouseEnterHandler = rowMouseEnterHandler;
        vm.rowMouseLeaveHandler = rowMouseLeaveHandler;
        vm.rowClickHandler = rowClickHandler;

        /////////////////////
        // scope functions

        /**
         * Initializes the directive.
         */
        function init() {
            vm.currentIndex = null;
            vm.searching = false;
            vm.searchStr = '';
            vm.isInvalid = false;

            vm.minLength = vm.minLength ? parseInt(vm.minLength, 10) : 3;
            vm.maxLength = vm.maxLength ? parseInt(vm.maxLength, 10) : 524288;
            vm.maxResults = vm.maxResults ? parseInt(vm.maxResults, 10) : 1000;
            vm.pause = vm.pause ? parseInt(vm.pause, 10) : defaultPause;
            vm.clearSelected = !!vm.clearSelected || false;
            vm.type = vm.type || 'text';
            vm.textNoResults = vm.textNoResults || 'No suggestions. Please run a keyword search.';

            // determine whether scrolling support logic should be used
            $timeout(function() {
                var css = getComputedStyle(listElement);
                isScrollOn = css.maxHeight && css.overflowY === 'auto';
            });

            // watch for changes to the result object we're bound to and update the
            // input field if it changes
            $scope.$watch('vm.selectedObject', function(newVal) {
                if (typeof newVal === 'string' || newVal === null) {
                    vm.searchStr = newVal;
                } else if (typeof newVal === 'object' && vm.resultFields && vm.resultFields[0]) {
                    vm.searchStr = newVal[vm.resultFields[0]];
                }
            }, true);
        }

        vm.showLi = angular.element(document.querySelector('auto-suggest row spinner-lightbox')).hasClass('launch-spinner');

        /**
         * Handler for when a mouse hovers over a row in the dropdown.
         * @param {number} index the index of the row being hovered over
         */
        function rowMouseEnterHandler(index) {
            vm.currentIndex = index;
            vm.isHoveredOverSelections = true;
        }

        /**
         * Handler for when the mouse leaves a previously hovered over row in the dropdown.
         */
        function rowMouseLeaveHandler() {
            vm.isHoveredOverSelections = false;
        }

        /**
         * Handler for when a row in the dropdown is clicked.
         */
        function rowClickHandler() {
            if (vm.results && vm.results.length > 0) {
                //select on blur vs leaving string val found here
                //don't select on blur only select on tab off or enter key
                selectResult(vm.results[vm.currentIndex]);
                if (vm.form && vm.forceMatch) {
                    vm.form[vm.id].$setValidity('forceMatch', true);
                }
            } else {
                if (vm.resultFields && vm.selectedObject && typeof vm.selectedObject === 'object' &&
                    vm.searchStr !== vm.selectedObject[vm.resultFields[0]]) {
                    vm.selectedObject = {};
                } else if (typeof vm.selectedObject === 'string' && vm.responseType === 'string' && (vm.selectedObject.toLowerCase() === vm.searchStr.toLowerCase())) {
                    vm.selectedObject = vm.searchStr;
                    if (vm.form && vm.forceMatch) {
                        vm.form[vm.id].$setValidity('forceMatch', true);
                    }
                } else if (vm.forceMatch && typeof vm.selectedObject === 'string' && vm.responseType === 'string' && (vm.selectedObject.toLowerCase() !== vm.searchStr.toLowerCase())) {
                    if (vm.form && vm.forceMatch) {
                        vm.form[vm.id].$setValidity('forceMatch', false);
                    }
                }
            }

            if (vm.onSelect) {
                vm.onSelect({
                    selection: vm.selectedObject || vm.searchStr,
                    optionalData: vm.optionalData
                });
            }

            clearResults();
            handleValidation();
            vm.isHoveredOverSelections = false;
        }

        /**
         * Action to take when a result in the dropdown is selected.
         * @param {object} result the result object to select
         */
        function selectResult(result) {
            var i, len, formattedFields, field;

            formattedFields = [];
            if (!result) {
                result = {originalObject: formattedFields[0]};
            }
            if (vm.resultFields && vm.resultFields.length) {
                for (i = 0, len = vm.resultFields.length; i < len; i++) {
                    if (i === 0) {
                        field = formattedFields[i] = extractTitle(result.originalObject);
                    } else {
                        field = formattedFields[i] = extractValue(result.originalObject, vm.resultFields[i]);
                    }
                }
            }
            else {
                formattedFields = result ? [extractTitle(result.originalObject)] : [vm.searchStr];
            }
            result.formattedFields = formattedFields;
            if (vm.clearSelected) {
                vm.searchStr = null;
            } else {
                if (typeof result.formattedFields[0] === 'string' || result.formattedFields[0] === null) {
                    vm.searchStr = result.formattedFields[0];
                } else if (typeof result.formattedFields[0] === 'object' && vm.resultFields && vm.resultFields[0]) {
                    vm.searchStr = result.formattedFields[0][vm.resultFields[0]];
                }
            }

            vm.selectedObject = result.originalObject;

            clearResults();
            if (vm.form && vm.forceMatch) {
                vm.form[vm.id].$setValidity('forceMatch', true);
            }
        }

        /**
         * Handler for when the value changes in the input field.
         */
        function inputChangeHandler() {
            vm.selectedObject = undefined;
            if (vm.searchStr && (vm.searchStr.length < vm.minLength)) {
                clearResults();
            } else if (angular.isDefined(vm.searchStr) && (vm.searchStr.length === 0) && (vm.minLength === 0)) {
                vm.searching = false;
                loadAllResults();
            } else if (vm.searchStr && vm.searchStr.length >= vm.minLength) {
                initResults();

                if (searchTimer) {
                    $timeout.cancel(searchTimer);
                }


                searchTimer = $timeout(function() {
                    vm.searching = true;
                    loadResults(vm.searchStr);
                }, vm.pause);
            }

            if (vm.onInputChanged) {
                vm.onInputChanged({searchStr: vm.searchStr});
            }
        }

        /**
         * Handler for when the input field is focused on.
         */
        function inputFocusHandler() {
            if (vm.onFocus) {
                vm.onFocus();
            }
            if ((vm.minLength == 0) && (!vm.searchStr || vm.searchStr.length === 0)) {
                vm.showDropdown = true;
                loadAllResults();
            }
        }

        /**
         * Handler for when focus leave the input field (e.g. 'blurred').
         * @param {Event?} event
         */
        function inputBlurHandler(event) {
            if (event) {
                event.preventDefault();
            }
            if (vm.forceMatch && ((vm.responseType === 'object' && typeof vm.selectedObject !== 'object') || (vm.responseType === 'string' && typeof vm.selectedObject !== 'string')) && !vm.isHoveredOverSelections) {
                if (vm.form && vm.forceMatch) {
                    vm.form[vm.id].$setValidity('forceMatch', false);
                }
                vm.selectedObject = undefined;
            }
            if (!vm.isHoveredOverSelections) {
                clearResults();
            }
        }

        /**
         * Handler for when a key is released in the input field.
         * @param {Event} event
         */
        function inputKeyupHandler(event) {
            var which;

            ie8EventNormalizer(event);
            which = event.which;
            if (which === KEY_LEFT || which === KEY_RIGHT) {
                return;
            }

            if (which === 8 || which === 46) {
                if (!vm.searchStr) {
                    if (typeof vm.selectedObject === 'object') {
                        vm.selectedObject = {};
                    }

                    clearResults();
                }
            }

            if (which === KEY_UP) {
                event.preventDefault();
            } else if (which === KEY_DOWN) {
                event.preventDefault();
                if (!vm.showDropdown && vm.searchStr && vm.searchStr.length >= vm.minLength) {
                    initResults();
                    vm.searching = true;
                    loadResults(vm.searchStr);
                }
            } else if (which === KEY_ESC) {
                clearResults();
                inputField.val(vm.searchStr);
            } else if (which !== KEY_TAB && ignoreKeys.indexOf(which) === -1) {
                if (vm.minLength === 0 && !vm.searchStr) {
                    return;
                }

                if (!vm.searchStr || vm.searchStr === '') {
                    vm.showDropdown = false;
                } else if (vm.searchStr.length >= vm.minLength) {
                    initResults();

                    if (searchTimer) {
                        $timeout.cancel(searchTimer);
                    }
                    vm.noResultsFound = false;


                    searchTimer = $timeout(function() {
                        vm.searching = true;
                        loadResults(vm.searchStr);
                    }, vm.pause);
                }
            }
        }

        /**
         * Handler for when a key is pressed in the input field.
         * @param {Event} event
         */
        function inputKeydownHandler(event) {
            var which, row, rowTop;

            ie8EventNormalizer(event);
            which = event.which;
            row = null;
            rowTop = null;

            if ((which === KEY_ENTER || which === KEY_TAB) && vm.results) {
                if (vm.currentIndex >= -1 && vm.currentIndex < vm.results.length) {
                    if (which === KEY_ENTER) {
                        // if 'enter', trigger a blur manually
                        event.preventDefault();
                        $element.find('input')[0].blur();
                    }
                    rowClickHandler();
                    clearResults();
                } else {
                    clearResults();
                    handleValidation();
                }
            } else if (which === KEY_DOWN && vm.results) {
                event.preventDefault();
                if ((vm.currentIndex + 1) < vm.results.length && vm.showDropdown) {
                    vm.currentIndex++;
                    updateInputField();

                    if (isScrollOn) {
                        row = dropdownRow();
                        if (dropdownHeight() < row.getBoundingClientRect().bottom) {
                            dropdownScrollTopTo(dropdownRowOffsetHeight(row));
                        }
                    }
                }
            } else if (which === KEY_UP && vm.results) {
                event.preventDefault();
                if (vm.currentIndex >= 1) {
                    vm.currentIndex--;
                    updateInputField();

                    if (isScrollOn) {
                        rowTop = dropdownRowTop();
                        if (rowTop < 0) {
                            dropdownScrollTopTo(rowTop - 1);
                        }
                    }
                }
            }
        }

        /////////////////////
        // helpers

        /**
         * Extracts the title value from the given data.
         * @param {string|object} data the raw data from a search result item
         * @returns {string} the title string
         */
        function extractTitle(data) {
            if (typeof data === 'string' && !vm.resultFields) {
                return data;
            }

            // split title fields and run extractValue for each and join with ' '
            return vm.resultFields[0].split(',')
                .map(function(field) {
                    return extractValue(data, field);
                })
                .join(' ');
        }

        /**
         * Extracts the value from an object.
         * @param {object} obj the object to extract a value from
         * @param {string} key the property or key of the object to get the value of
         * @returns {*}
         */
        function extractValue(obj, key) {
            var keys, result;
            if (key) {
                keys = key.split('.');
                result = obj;
                keys.forEach(function(k) { result = result[k]; });
            } else {
                result = obj;
            }
            return result;
        }

        /**
         * Handles validation for this element (when enabled).
         */
        function handleValidation() {
            //if (vm.fieldRequired) {
            //    vm.isInvalid = !vm.selectedObject;
            //}
        }

        /**
         * Retrieves the element that represents the currently selected dropdown row.
         * @returns {Element}
         */
        function dropdownRow() {
            return $element[0].querySelectorAll('li')[vm.currentIndex];
        }

        /**
         * Determines the offset height of the specified dropdown row.
         * @param {Element} row
         * @returns {number}
         */
        function dropdownRowOffsetHeight(row) {
            var css = getComputedStyle(row);
            return row.offsetHeight + parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
        }

        /**
         * Determines the height of the dropdown list container.
         * @returns {number}
         */
        function dropdownHeight() {
            return listElement.getBoundingClientRect().top + parseInt(getComputedStyle(listElement).maxHeight, 10);
        }

        /**
         * Determines the top of the currently selected dropdown row.
         * @returns {number}
         */
        function dropdownRowTop() {
            return dropdownRow().getBoundingClientRect().top -
                (listElement.getBoundingClientRect().top +
                parseInt(getComputedStyle(listElement).paddingTop, 10));
        }

        /**
         * Scrolls to the specified offset.
         * @param {number} offset
         */
        function dropdownScrollTopTo(offset) {
            listElement.scrollTop = listElement.scrollTop + offset;
        }

        /**
         * Updates the input field with the currently selected dropdown row.
         */
        function updateInputField() {
            var current = vm.results[vm.currentIndex];
            inputField.val(extractTitle(current.originalObject));
        }

        /**
         * Clears, resets and hides the dropdown results.
         */
        function clearResults() {
            vm.showDropdown = false;
            vm.results = [];
            if (listElement) {
                listElement.scrollTop = 0;
            }
        }

        /**
         * Initializes and displays the dropdown results.
         */
        function initResults() {
            vm.showDropdown = true;
            vm.currentIndex = 0;
            vm.results = [];
        }

        /**
         * Kicks off the process for loading the result set and populating the dropdown list.
         * @param {string} str the string to filter the results by
         */
        function loadResults(str) {
            if (!str || str.length < vm.minLength) {
                return;
            }
            if (vm.localData) {
                getLocalResults(str);
            } else {
                lookupResults(str);
            }
        }

        /**
         * Loads all of the unfiltered results.
         */
        function loadAllResults() {
            if (vm.localData) {
                vm.searching = true;
                processResults(vm.localData, '');
            } else {
                lookupResults('');
            }
        }

        /**
         * Populates the result list from locally stored data.
         * @param {string} str the filter string to match against the data set
         */
        function getLocalResults(str) {
            var i, len, j, len2, match, value,
                searchFields = vm.searchFields.split(','),
                matches = [];

            for (i = 0, len = vm.localData.length; i < len; i++) {
                match = false;

                for (j = 0, len2 = searchFields.length; j < len2; j++) {
                    value = extractValue(vm.localData[i], searchFields[j]) || '';
                    match = match || (value.toLowerCase().indexOf(str.toLowerCase()) >= 0);
                }

                if (match) {
                    matches[matches.length] = vm.localData[i];
                }
            }

            vm.searching = false;
            processResults(matches, str);
        }

        /**
         * Populates the result list by executing a lookup function.
         * @param {string} str the filter string to pass into the lookup function
         */
        function lookupResults(str) {
            var counter = ++lookupCounter;
            vm.searching = true;
            snapSpinnerService.start(vm.id + 'Spinner');
            vm.onLookup({searchStr: str}).then(
                function(data) {
                    if (counter !== lookupCounter || !vm.showDropdown) {
                        return;
                    }
                    vm.searching = false;
                    processResults(data, str);
                    snapSpinnerService.stop(vm.id + 'Spinner');
                }
            );
        }

        /**
         * Processes the result set into dropdown list objects.
         * @param {*} responseData the filtered array of data to populate the dropdown list with
         * @param {string} str the filter string to use when highlighting text in the result set
         */
        function processResults(responseData, str) {
            var i, len, j, len2, field, formattedFields;

            vm.selectedObject = undefined;
            if (responseData && responseData.length > 0) {
                vm.results = [];
                formattedFields = [];

                for (i = 0, len = responseData.length; i < len; i++) {
                    if (vm.resultFields && vm.resultFields.length) {
                        formattedFields[i] = [];
                        for (j = 0, len2 = vm.resultFields.length; j < len2; j++) {
                            field = extractValue(responseData[i], vm.resultFields[j]);
                            formattedFields[i][j] = highlightMatchingText(field, str);
                        }
                        vm.results[vm.results.length] = {
                            formattedFields: formattedFields[i],
                            originalObject: responseData[i]
                        };
                    } else {
                        field = formattedFields[i] = extractTitle(responseData[i]);
                        formattedFields[i] = highlightMatchingText(field, str);
                        vm.results[vm.results.length] = {
                            formattedFields: [formattedFields[i]],
                            originalObject: responseData[i]
                        };
                    }

                    if (field === vm.searchStr) {
                        vm.currentIndex = i;
                    }
                }
            } else {
                vm.results = [];
                vm.noResultsFound = true;
            }
        }

        /**
         * Highlights text the given target string that matches the filter string.
         * @param {string} target
         * @param {string} str the filter string
         * @returns {string}
         */
        function highlightMatchingText(target, str) {
            var result, matches, re;
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
            // Escape user input to be treated as a literal string within a regular expression
            re = new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            if (!target) {
                return '';
            }
            matches = target.match(re);
            if (matches) {
                result = target.replace(re,
                    '<span class="text-bold text-black">' + matches[0] + '</span>');
            } else {
                result = target;
            }
            return $sce.trustAsHtml(result);
        }

        /**
         * An event normalizer for handling IE8 quirkiness with event.which.
         * @param {Event} event the event to normalize
         */
        function ie8EventNormalizer(event) {
            if (!event.which) {
                event.which = event.keyCode;
            }
        }
    }

})();

(function() {
    'use strict';
    DropDownSelectCtrl.$inject = ["$scope", "$element", "infoBoxService"];
    angular.module('forms')
        .directive('snapDropDownSelect', snapDropDownSelect);

    function snapDropDownSelect() {
        var directive = {
            controller:  DropDownSelectCtrl,
            controllerAs: 'vm',
            scope: {
                options: '=',
                classes: '=',
                onSelect: '&',
                selectedOption: '=',
                isMulti: '=',
                inputClass: '@',
                dropDownClass: '@',
                delimiter: '@'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/forms/dropDownSelect/snapDropDownSelect.html'
        };
        return directive;
    }

    /* @ngInject */
    function DropDownSelectCtrl($scope, $element, infoBoxService) {
        var vm = this;

        //check number codes on a full-key NUMPAD
        var defaultClass = 'text-light';
        var KEY_DOWN = 40;
        var KEY_RIGHT = 39;
        var KEY_UP = 38;
        var KEY_LEFT = 37;
        var KEY_ESC = 27;
        var KEY_ENTER = 13;
        var KEY_TAB = 9;
        var KEY_SHIFT = 16;
        var KEY_CTRL = 17;
        var KEY_ALT = 18;
        var KEY_CMD_L = 91;
        var KEY_CMD_R = 93;
        var KEY_BACKSPACE = 8;
        var KEY_DELETE = 46;
        var ignoreKeys = [KEY_SHIFT, KEY_CTRL, KEY_ALT, KEY_CMD_L, KEY_CMD_R];

        vm.toggleActive = toggleActive;
        vm.isDropDownActive = isDropDownActive;
        vm.getClass = getClass;
        vm.selectOption = selectOption;
        vm.activateTooltip = activateTooltip;
        vm.dropDownActive = false;
        vm.currentActiveTab = false;
        vm.selectedIndex = 0;
        vm.selectedOptionConcat = '- Select -';

        vm.keyUpFunction = function(event) {
            ie8EventNormalizer(event);
            var which = event.which;
            if (which === KEY_LEFT || which === KEY_RIGHT) {
                return;
            }
            if (which === KEY_UP) {
                event.preventDefault();
                if (vm.selectedIndex) {
                    vm.selectedIndex = vm.selectedIndex - 1;
                }
            } else if (which === KEY_DOWN) {
                event.preventDefault();
                if (vm.selectedIndex < (vm.options.length - 1)) {
                    vm.selectedIndex = vm.selectedIndex + 1;
                }
            } else if (which === KEY_ENTER) {
                event.preventDefault();
                selectOption(vm.options[vm.selectedIndex]);
                toggleActive(true);
            } else if (which === KEY_TAB) {
                event.preventDefault();
                selectOption(vm.options[vm.selectedIndex]);
                toggleActive(true);
            } else if (ignoreKeys.indexOf(which) === -1) {
                angular.forEach(vm.options, function (opt, index) {
                    if (opt && opt.lines && opt.lines[0]) {
                        if (opt.lines[0].toUpperCase().charCodeAt(0) === which) {
                            vm.selectedIndex = index;
                        }
                    }
                });
            }
        };

        vm.testFuncDown = function(event) {
            //console.log('keyDown - which :' + event.which);
            //console.log(event.target);
        };


        function toggleActive(evt) {
            if (evt) {
                vm.dropDownActive = !vm.dropDownActive;
            }
        }

        function isDropDownActive() {
            if (vm.dropDownActive){
                return 'display-block';
            }
        }

        function getClass(index) {
            if (vm.classes && vm.classes[index]){
                return vm.classes[index];
            } else {
                return defaultClass;
            }
        }

        function selectOption(option) {
            if (!vm.isMulti) {
                vm.selectedOption = option;
                vm.selectedOptionConcat = concatSelectedOption();
                toggleActive(true);
            } else {
                //if selectedObject is passed as an array
                vm.selectedOption = vm.options.filter(function(object) {
                    return object.isSelected;
                });
                if (vm.selectedOption.length) {
                    vm.selectedOptionConcat = vm.selectedOption.length + (vm.selectedOption.length > 1 ?
                            ' options selected' : ' option selected');
                    vm.tooltipString = [];
                    angular.forEach(vm.selectedOption, function (option, index) {
                        if (index < 6) {
                            vm.tooltipString.push(option.lines[0]);
                        } else if (index === 6) {
                            vm.tooltipString.push('...');
                        }
                    });
                } else {
                    vm.selectedOptionConcat = '- Select -';
                    vm.tooltipString = '';
                }
            }
            if (vm.onSelect()) {
                vm.onSelect()();
            }
        }

        function concatSelectedOption() {
            var tempString = '';
            angular.forEach(vm.selectedOption.lines, function(line) {
                tempString = tempString + line + ' ' + vm.delimiter + ' ';
            });
            return tempString.substr(0, tempString.length - 2);
        }

        /**
         * An event normalizer for handling IE8 quirkiness with event.which.
         * @param {Event} event the event to normalize
         */
        function ie8EventNormalizer(event) {
            if (!event.which) {
                event.which = event.keyCode;
            }
        }

        angular.element(document.body).on('click', function(e){
            var isClickedElementOfSelect = $element[0].contains(e.target);

            if (!isClickedElementOfSelect) {
                vm.dropDownActive = false;
                $scope.$apply();
            }
        });

        function activateTooltip() {
            if (vm.tooltipString && vm.tooltipString.length) {
                infoBoxService.toggleInfoBox('dropDownInfoBox');
            }
        }
    }
})();
/*! 12.0.1 */
!window.XMLHttpRequest||window.FileAPI&&FileAPI.shouldLoad||(window.XMLHttpRequest.prototype.setRequestHeader=function(a){return function(b,c){if("__setXHR_"===b){var d=c(this);d instanceof Function&&d(this)}else a.apply(this,arguments)}}(window.XMLHttpRequest.prototype.setRequestHeader));var ngFileUpload=angular.module("ngFileUpload",[]);ngFileUpload.version="12.0.1",ngFileUpload.service("UploadBase",["$http","$q","$timeout",function(a,b,c){function d(d){function e(a){j.notify&&j.notify(a),k.progressFunc&&c(function(){k.progressFunc(a)})}function h(a){return null!=d._start&&g?{loaded:a.loaded+d._start,total:d._file&&d._file.size||a.total,type:a.type,config:d,lengthComputable:!0,target:a.target}:a}function i(){a(d).then(function(a){g&&d._chunkSize&&!d._finished&&d._file?(e({loaded:d._end,total:d._file&&d._file.size,config:d,type:"progress"}),f.upload(d,!0)):(d._finished&&delete d._finished,j.resolve(a))},function(a){j.reject(a)},function(a){j.notify(a)})}d.method=d.method||"POST",d.headers=d.headers||{};var j=d._deferred=d._deferred||b.defer(),k=j.promise;return d.disableProgress||(d.headers.__setXHR_=function(){return function(a){a&&a.upload&&a.upload.addEventListener&&(d.__XHR=a,d.xhrFn&&d.xhrFn(a),a.upload.addEventListener("progress",function(a){a.config=d,e(h(a))},!1),a.upload.addEventListener("load",function(a){a.lengthComputable&&(a.config=d,e(h(a)))},!1))}}),g?d._chunkSize&&d._end&&!d._finished?(d._start=d._end,d._end+=d._chunkSize,i()):d.resumeSizeUrl?a.get(d.resumeSizeUrl).then(function(a){d._start=d.resumeSizeResponseReader?d.resumeSizeResponseReader(a.data):parseInt((null==a.data.size?a.data:a.data.size).toString()),d._chunkSize&&(d._end=d._start+d._chunkSize),i()},function(a){throw a}):d.resumeSize?d.resumeSize().then(function(a){d._start=a,i()},function(a){throw a}):(d._chunkSize&&(d._start=0,d._end=d._start+d._chunkSize),i()):i(),k.success=function(a){return k.then(function(b){a(b.data,b.status,b.headers,d)}),k},k.error=function(a){return k.then(null,function(b){a(b.data,b.status,b.headers,d)}),k},k.progress=function(a){return k.progressFunc=a,k.then(null,null,function(b){a(b)}),k},k.abort=k.pause=function(){return d.__XHR&&c(function(){d.__XHR.abort()}),k},k.xhr=function(a){return d.xhrFn=function(b){return function(){b&&b.apply(k,arguments),a.apply(k,arguments)}}(d.xhrFn),k},f.promisesCount++,k["finally"](function(){f.promisesCount--}),k}function e(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}var f=this;f.promisesCount=0,this.isResumeSupported=function(){return window.Blob&&window.Blob instanceof Function&&window.Blob.prototype.slice};var g=this.isResumeSupported();this.isUploadInProgress=function(){return f.promisesCount>0},this.rename=function(a,b){return a.ngfName=b,a},this.jsonBlob=function(a){null==a||angular.isString(a)||(a=JSON.stringify(a));var b=new window.Blob([a],{type:"application/json"});return b._ngfBlob=!0,b},this.json=function(a){return angular.toJson(a)},this.isFile=function(a){return null!=a&&(a instanceof window.Blob||a.flashId&&a.name&&a.size)},this.upload=function(a,b){function c(b,c){if(b._ngfBlob)return b;if(a._file=a._file||b,null!=a._start&&g){a._end&&a._end>=b.size&&(a._finished=!0,a._end=b.size);var d=b.slice(a._start,a._end||b.size);return d.name=b.name,d.ngfName=b.ngfName,a._chunkSize&&(c.append("_chunkSize",a._chunkSize),c.append("_currentChunkSize",a._end-a._start),c.append("_chunkNumber",Math.floor(a._start/a._chunkSize)),c.append("_totalSize",a._file.size)),d}return b}function h(b,d,e){if(void 0!==d)if(angular.isDate(d)&&(d=d.toISOString()),angular.isString(d))b.append(e,d);else if(f.isFile(d)){var g=c(d,b),i=e.split(",");i[1]&&(g.ngfName=i[1].replace(/^\s+|\s+$/g,""),e=i[0]),a._fileKey=a._fileKey||e,b.append(e,g,g.ngfName||g.name)}else if(angular.isObject(d)){if(d.$$ngfCircularDetection)throw"ngFileUpload: Circular reference in config.data. Make sure specified data for Upload.upload() has no circular reference: "+e;d.$$ngfCircularDetection=!0;try{for(var j in d)if(d.hasOwnProperty(j)&&"$$ngfCircularDetection"!==j){var k=null==a.objectKey?"[i]":a.objectKey;d.length&&parseInt(j)>-1&&(k=null==a.arrayKey?k:a.arrayKey),h(b,d[j],e+k.replace(/[ik]/g,j))}}finally{delete d.$$ngfCircularDetection}}else b.append(e,d)}function i(){a._chunkSize=f.translateScalars(a.resumeChunkSize),a._chunkSize=a._chunkSize?parseInt(a._chunkSize.toString()):null,a.headers=a.headers||{},a.headers["Content-Type"]=void 0,a.transformRequest=a.transformRequest?angular.isArray(a.transformRequest)?a.transformRequest:[a.transformRequest]:[],a.transformRequest.push(function(b){var c,d=new window.FormData;b=b||a.fields||{},a.file&&(b.file=a.file);for(c in b)if(b.hasOwnProperty(c)){var e=b[c];a.formDataAppender?a.formDataAppender(d,c,e):h(d,e,c)}return d})}return b||(a=e(a)),a._isDigested||(a._isDigested=!0,i()),d(a)},this.http=function(b){return b=e(b),b.transformRequest=b.transformRequest||function(b){return window.ArrayBuffer&&b instanceof window.ArrayBuffer||b instanceof window.Blob?b:a.defaults.transformRequest[0].apply(this,arguments)},b._chunkSize=f.translateScalars(b.resumeChunkSize),b._chunkSize=b._chunkSize?parseInt(b._chunkSize.toString()):null,d(b)},this.translateScalars=function(a){if(angular.isString(a)){if(a.search(/kb/i)===a.length-2)return parseFloat(1024*a.substring(0,a.length-2));if(a.search(/mb/i)===a.length-2)return parseFloat(1048576*a.substring(0,a.length-2));if(a.search(/gb/i)===a.length-2)return parseFloat(1073741824*a.substring(0,a.length-2));if(a.search(/b/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/s/i)===a.length-1)return parseFloat(a.substring(0,a.length-1));if(a.search(/m/i)===a.length-1)return parseFloat(60*a.substring(0,a.length-1));if(a.search(/h/i)===a.length-1)return parseFloat(3600*a.substring(0,a.length-1))}return a},this.urlToBlob=function(c){var d=b.defer();return a({url:c,method:"get",responseType:"arraybuffer"}).then(function(a){var b=new Uint8Array(a.data),c=a.headers("content-type")||"image/WebP",e=new window.Blob([b],{type:c});d.resolve(e)},function(a){d.reject(a)}),d.promise},this.setDefaults=function(a){this.defaults=a||{}},this.defaults={},this.version=ngFileUpload.version}]),ngFileUpload.service("Upload",["$parse","$timeout","$compile","$q","UploadExif",function(a,b,c,d,e){function f(a,b,c){var e=[h.emptyPromise()];return angular.forEach(a,function(d,f){0===d.type.indexOf("image/jpeg")&&h.attrGetter("ngfFixOrientation",b,c,{$file:d})&&e.push(h.happyPromise(h.applyExifRotation(d),d).then(function(b){a.splice(f,1,b)}))}),d.all(e)}function g(a,b,c){function e(d,e){if(0===d.type.indexOf("image")){if(f.pattern&&!h.validatePattern(d,f.pattern))return;var i=h.resize(d,f.width,f.height,f.quality,f.type,f.ratio,f.centerCrop,function(a,e){return h.attrGetter("ngfResizeIf",b,c,{$width:a,$height:e,$file:d})},f.restoreExif!==!1);g.push(i),i.then(function(b){a.splice(e,1,b)},function(a){d.$error="resize",d.$errorParam=(a?(a.message?a.message:a)+": ":"")+(d&&d.name)})}}var f=h.attrGetter("ngfResize",b,c);if(!(f&&angular.isObject(f)&&h.isResizeSupported()&&a.length))return h.emptyPromise();for(var g=[h.emptyPromise()],i=0;i<a.length;i++)e(a[i],i);return d.all(g)}var h=e;return h.getAttrWithDefaults=function(a,b){if(null!=a[b])return a[b];var c=h.defaults[b];return null==c?c:angular.isString(c)?c:JSON.stringify(c)},h.attrGetter=function(b,c,d,e){var f=this.getAttrWithDefaults(c,b);if(!d)return f;try{return e?a(f)(d,e):a(f)(d)}catch(g){if(b.search(/min|max|pattern/i))return f;throw g}},h.shouldUpdateOn=function(a,b,c){var d=h.attrGetter("ngModelOptions",b,c);return d&&d.updateOn?d.updateOn.split(" ").indexOf(a)>-1:!0},h.emptyPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.resolve.apply(a,c)}),a.promise},h.rejectPromise=function(){var a=d.defer(),c=arguments;return b(function(){a.reject.apply(a,c)}),a.promise},h.happyPromise=function(a,c){var e=d.defer();return a.then(function(a){e.resolve(a)},function(a){b(function(){throw a}),e.resolve(c)}),e.promise},h.updateModel=function(c,d,e,i,j,k,l){function m(f,g,j,l,m){d.$$ngfPrevValidFiles=f,d.$$ngfPrevInvalidFiles=g;var n=f&&f.length?f[0]:null,o=g&&g.length?g[0]:null;c&&(h.applyModelValidation(c,f),c.$setViewValue(m?n:f)),i&&a(i)(e,{$files:f,$file:n,$newFiles:j,$duplicateFiles:l,$invalidFiles:g,$invalidFile:o,$event:k});var p=h.attrGetter("ngfModelInvalid",d);p&&b(function(){a(p).assign(e,m?o:g)}),b(function(){})}function n(){function a(a,b){return a.name===b.name&&(a.$ngfOrigSize||a.size)===(b.$ngfOrigSize||b.size)&&a.type===b.type}function b(b){var c;for(c=0;c<s.length;c++)if(a(b,s[c]))return!0;for(c=0;c<t.length;c++)if(a(b,t[c]))return!0;return!1}if(j){r=[],u=[];for(var c=0;c<j.length;c++)b(j[c])?u.push(j[c]):r.push(j[c])}}function o(a){return angular.isArray(a)?a:[a]}function p(){w=[],v=[],angular.forEach(r,function(a){a.$error?v.push(a):w.push(a)})}function q(){function a(){b(function(){m(x?s.concat(w):w,x?t.concat(v):v,j,u,y)},B&&B.debounce?B.debounce.change||B.debounce:0)}g(z?r:w,d,e).then(function(){z?h.validate(r,A,c,d,e).then(function(){p(),a()}):a()},function(a){throw"Could not resize files "+a})}var r,s,t,u=[],v=[],w=[];s=d.$$ngfPrevValidFiles||[],t=d.$$ngfPrevInvalidFiles||[],c&&c.$modelValue&&(s=o(c.$modelValue));var x=h.attrGetter("ngfKeep",d,e);r=(j||[]).slice(0),("distinct"===x||h.attrGetter("ngfKeepDistinct",d,e)===!0)&&n(d,e);var y=!x&&!h.attrGetter("ngfMultiple",d,e)&&!h.attrGetter("multiple",d);if(!x||r.length){h.attrGetter("ngfBeforeModelChange",d,e,{$files:j,$file:j&&j.length?j[0]:null,$newFiles:r,$duplicateFiles:u,$event:k});var z=h.attrGetter("ngfValidateAfterResize",d,e),A=r.length+s.length+t.length,B=h.attrGetter("ngModelOptions",d,e);h.validate(r,A,c,d,e).then(function(){l?m(r,[],j,u,y):(B&&B.allowInvalid||z?w=r:p(),h.attrGetter("ngfFixOrientation",d,e)&&h.isExifSupported()?f(w,d,e).then(function(){q()}):q())})}},h}]),ngFileUpload.directive("ngfSelect",["$parse","$timeout","$compile","Upload",function(a,b,c,d){function e(a){var b=a.match(/Android[^\d]*(\d+)\.(\d+)/);if(b&&b.length>2){var c=d.defaults.androidFixMinorVersion||4;return parseInt(b[1])<4||parseInt(b[1])===c&&parseInt(b[2])<c}return-1===a.indexOf("Chrome")&&/.*Windows.*Safari.*/.test(a)}function f(a,b,c,d,f,h,i,j){function k(){return"input"===b[0].tagName.toLowerCase()&&c.type&&"file"===c.type.toLowerCase()}function l(){return t("ngfChange")||t("ngfSelect")}function m(b){if(j.shouldUpdateOn("change",c,a)){for(var e=b.__files_||b.target&&b.target.files,f=[],g=0;g<e.length;g++)f.push(e[g]);j.updateModel(d,c,a,l(),f.length?f:null,b)}}function n(a){if(b!==a)for(var c=0;c<b[0].attributes.length;c++){var d=b[0].attributes[c];"type"!==d.name&&"class"!==d.name&&"style"!==d.name&&((null==d.value||""===d.value)&&("required"===d.name&&(d.value="required"),"multiple"===d.name&&(d.value="multiple")),a.attr(d.name,"id"===d.name?"ngf-"+d.value:d.value))}}function o(){if(k())return b;var a=angular.element('<input type="file">');n(a);var c=angular.element("<label>upload</label>");return c.css("visibility","hidden").css("position","absolute").css("overflow","hidden").css("width","0px").css("height","0px").css("border","none").css("margin","0px").css("padding","0px").attr("tabindex","-1"),g.push({el:b,ref:c}),document.body.appendChild(c.append(a)[0]),a}function p(c){if(b.attr("disabled"))return!1;if(!t("ngfSelectDisabled",a)){var d=q(c);if(null!=d)return d;r(c);try{k()||document.body.contains(w[0])||(g.push({el:b,ref:w.parent()}),document.body.appendChild(w.parent()[0]),w.bind("change",m))}catch(f){}return e(navigator.userAgent)?setTimeout(function(){w[0].click()},0):w[0].click(),!1}}function q(a){var b=a.changedTouches||a.originalEvent&&a.originalEvent.changedTouches;if("touchstart"===a.type)return v=b?b[0].clientY:0,!0;if(a.stopPropagation(),a.preventDefault(),"touchend"===a.type){var c=b?b[0].clientY:0;if(Math.abs(c-v)>20)return!1}}function r(b){j.shouldUpdateOn("click",c,a)&&w.val()&&(w.val(null),j.updateModel(d,c,a,l(),null,b,!0))}function s(a){if(w&&!w.attr("__ngf_ie10_Fix_")){if(!w[0].parentNode)return void(w=null);a.preventDefault(),a.stopPropagation(),w.unbind("click");var b=w.clone();return w.replaceWith(b),w=b,w.attr("__ngf_ie10_Fix_","true"),w.bind("change",m),w.bind("click",s),w[0].click(),!1}w.removeAttr("__ngf_ie10_Fix_")}var t=function(a,b){return j.attrGetter(a,c,b)};j.registerModelChangeValidator(d,c,a);var u=[];u.push(a.$watch(t("ngfMultiple"),function(){w.attr("multiple",t("ngfMultiple",a))})),u.push(a.$watch(t("ngfCapture"),function(){w.attr("capture",t("ngfCapture",a))})),u.push(a.$watch(t("ngfAccept"),function(){w.attr("accept",t("ngfAccept",a))})),c.$observe("accept",function(){w.attr("accept",t("accept"))}),u.push(function(){c.$$observers&&delete c.$$observers.accept});var v=0,w=b;k()||(w=o()),w.bind("change",m),k()?b.bind("click",r):b.bind("click touchstart touchend",p),-1!==navigator.appVersion.indexOf("MSIE 10")&&w.bind("click",s),d&&d.$formatters.push(function(a){return(null==a||0===a.length)&&w.val()&&w.val(null),a}),a.$on("$destroy",function(){k()||w.parent().remove(),angular.forEach(u,function(a){a()})}),h(function(){for(var a=0;a<g.length;a++){var b=g[a];document.body.contains(b.el[0])||(g.splice(a,1),b.ref.remove())}}),window.FileAPI&&window.FileAPI.ngfFixIE&&window.FileAPI.ngfFixIE(b,w,m)}var g=[];return{restrict:"AEC",require:"?ngModel",link:function(e,g,h,i){f(e,g,h,i,a,b,c,d)}}}]),function(){function a(a){return"img"===a.tagName.toLowerCase()?"image":"audio"===a.tagName.toLowerCase()?"audio":"video"===a.tagName.toLowerCase()?"video":/./}function b(b,c,d,e,f,g,h,i){function j(a){var g=b.attrGetter("ngfNoObjectUrl",f,d);b.dataUrl(a,g)["finally"](function(){c(function(){var b=(g?a.$ngfDataUrl:a.$ngfBlobUrl)||a.$ngfDataUrl;i?e.css("background-image","url('"+(b||"")+"')"):e.attr("src",b),b?e.removeClass("ng-hide"):e.addClass("ng-hide")})})}c(function(){var c=d.$watch(f[g],function(c){var d=h;if("ngfThumbnail"===g&&(d||(d={width:e[0].clientWidth,height:e[0].clientHeight}),0===d.width&&window.getComputedStyle)){var f=getComputedStyle(e[0]);d={width:parseInt(f.width.slice(0,-2)),height:parseInt(f.height.slice(0,-2))}}return angular.isString(c)?(e.removeClass("ng-hide"),i?e.css("background-image","url('"+c+"')"):e.attr("src",c)):void(!c||!c.type||0!==c.type.search(a(e[0]))||i&&0!==c.type.indexOf("image")?e.addClass("ng-hide"):d&&b.isResizeSupported()?b.resize(c,d.width,d.height,d.quality).then(function(a){j(a)},function(a){throw a}):j(c))});d.$on("$destroy",function(){c()})})}ngFileUpload.service("UploadDataUrl",["UploadBase","$timeout","$q",function(a,b,c){var d=a;return d.base64DataUrl=function(a){if(angular.isArray(a)){var b=c.defer(),e=0;return angular.forEach(a,function(c){d.dataUrl(c,!0)["finally"](function(){if(e++,e===a.length){var c=[];angular.forEach(a,function(a){c.push(a.$ngfDataUrl)}),b.resolve(c,a)}})}),b.promise}return d.dataUrl(a,!0)},d.dataUrl=function(a,e){if(!a)return d.emptyPromise(a,a);if(e&&null!=a.$ngfDataUrl||!e&&null!=a.$ngfBlobUrl)return d.emptyPromise(e?a.$ngfDataUrl:a.$ngfBlobUrl,a);var f=e?a.$$ngfDataUrlPromise:a.$$ngfBlobUrlPromise;if(f)return f;var g=c.defer();return b(function(){if(window.FileReader&&a&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 8")||a.size<2e4)&&(!window.FileAPI||-1===navigator.userAgent.indexOf("MSIE 9")||a.size<4e6)){var c=window.URL||window.webkitURL;if(c&&c.createObjectURL&&!e){var f;try{f=c.createObjectURL(a)}catch(h){return void b(function(){a.$ngfBlobUrl="",g.reject()})}b(function(){if(a.$ngfBlobUrl=f,f){g.resolve(f,a),d.blobUrls=d.blobUrls||[],d.blobUrlsTotalSize=d.blobUrlsTotalSize||0,d.blobUrls.push({url:f,size:a.size}),d.blobUrlsTotalSize+=a.size||0;for(var b=d.defaults.blobUrlsMaxMemory||268435456,e=d.defaults.blobUrlsMaxQueueSize||200;(d.blobUrlsTotalSize>b||d.blobUrls.length>e)&&d.blobUrls.length>1;){var h=d.blobUrls.splice(0,1)[0];c.revokeObjectURL(h.url),d.blobUrlsTotalSize-=h.size}}})}else{var i=new FileReader;i.onload=function(c){b(function(){a.$ngfDataUrl=c.target.result,g.resolve(c.target.result,a),b(function(){delete a.$ngfDataUrl},1e3)})},i.onerror=function(){b(function(){a.$ngfDataUrl="",g.reject()})},i.readAsDataURL(a)}}else b(function(){a[e?"$ngfDataUrl":"$ngfBlobUrl"]="",g.reject()})}),f=e?a.$$ngfDataUrlPromise=g.promise:a.$$ngfBlobUrlPromise=g.promise,f["finally"](function(){delete a[e?"$$ngfDataUrlPromise":"$$ngfBlobUrlPromise"]}),f},d}]),ngFileUpload.directive("ngfSrc",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfSrc",a.attrGetter("ngfResize",f,d),!1)}}}]),ngFileUpload.directive("ngfBackground",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){b(a,c,d,e,f,"ngfBackground",a.attrGetter("ngfResize",f,d),!0)}}}]),ngFileUpload.directive("ngfThumbnail",["Upload","$timeout",function(a,c){return{restrict:"AE",link:function(d,e,f){var g=a.attrGetter("ngfSize",f,d);b(a,c,d,e,f,"ngfThumbnail",g,a.attrGetter("ngfAsBackground",f,d))}}}]),ngFileUpload.config(["$compileProvider",function(a){a.imgSrcSanitizationWhitelist&&a.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/),a.aHrefSanitizationWhitelist&&a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|local|file|data|blob):/)}]),ngFileUpload.filter("ngfDataUrl",["UploadDataUrl","$sce",function(a,b){return function(c,d,e){if(angular.isString(c))return b.trustAsResourceUrl(c);var f=c&&((d?c.$ngfDataUrl:c.$ngfBlobUrl)||c.$ngfDataUrl);return c&&!f?(!c.$ngfDataUrlFilterInProgress&&angular.isObject(c)&&(c.$ngfDataUrlFilterInProgress=!0,a.dataUrl(c,d)),""):(c&&delete c.$ngfDataUrlFilterInProgress,(c&&f?e?b.trustAsResourceUrl(f):f:c)||"")}}])}(),ngFileUpload.service("UploadValidate",["UploadDataUrl","$q","$timeout",function(a,b,c){function d(a){var b="",c=[];if(a.length>2&&"/"===a[0]&&"/"===a[a.length-1])b=a.substring(1,a.length-1);else{var e=a.split(",");if(e.length>1)for(var f=0;f<e.length;f++){var g=d(e[f]);g.regexp?(b+="("+g.regexp+")",f<e.length-1&&(b+="|")):c=c.concat(g.excludes)}else 0===a.indexOf("!")?c.push("^((?!"+d(a.substring(1)).regexp+").)*$"):(0===a.indexOf(".")&&(a="*"+a),b="^"+a.replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]","g"),"\\$&")+"$",b=b.replace(/\\\*/g,".*").replace(/\\\?/g,"."))}return{regexp:b,excludes:c}}function e(a,b){null==b||a.$dirty||(a.$setDirty?a.$setDirty():a.$dirty=!0)}var f=a;return f.validatePattern=function(a,b){if(!b)return!0;var c=d(b),e=!0;if(c.regexp&&c.regexp.length){var f=new RegExp(c.regexp,"i");e=null!=a.type&&f.test(a.type)||null!=a.name&&f.test(a.name)}for(var g=c.excludes.length;g--;){var h=new RegExp(c.excludes[g],"i");e=e&&(null==a.type||h.test(a.type))&&(null==a.name||h.test(a.name))}return e},f.ratioToFloat=function(a){var b=a.toString(),c=b.search(/[x:]/i);return b=c>-1?parseFloat(b.substring(0,c))/parseFloat(b.substring(c+1)):parseFloat(b)},f.registerModelChangeValidator=function(a,b,c){a&&a.$formatters.push(function(d){a.$dirty&&(d&&!angular.isArray(d)&&(d=[d]),f.validate(d,d?d.length:0,a,b,c).then(function(){f.applyModelValidation(a,d)}))})},f.applyModelValidation=function(a,b){e(a,b),angular.forEach(a.$ngfValidations,function(b){a.$setValidity(b.name,b.valid)})},f.getValidationAttr=function(a,b,c,d,e){var g="ngf"+c[0].toUpperCase()+c.substr(1),h=f.attrGetter(g,a,b,{$file:e});if(null==h&&(h=f.attrGetter("ngfValidate",a,b,{$file:e}))){var i=(d||c).split(".");h=h[i[0]],i.length>1&&(h=h&&h[i[1]])}return h},f.validate=function(a,c,d,e,g){function h(b,c,h){if(a){for(var i=a.length,j=null;i--;){var k=a[i];if(k){var l=f.getValidationAttr(e,g,b,c,k);null!=l&&(h(k,l)||(k.$error=b,(k.$errorMessages=k.$errorMessages||{}).name=!0,k.$errorParam=l,a.splice(i,1),j=!1))}}null!==j&&d.$ngfValidations.push({name:b,valid:j})}}function i(c,h,i,k,l){function m(a,b,d){null!=d?k(b,d).then(function(e){l(e,d)?a.resolve():(b.$error=c,(b.$errorMessages=b.$errorMessages||{}).name=!0,b.$errorParam=d,a.reject())},function(){j("ngfValidateForce",{$file:b})?(b.$error=c,(b.$errorMessages=b.$errorMessages||{}).name=!0,b.$errorParam=d,a.reject()):a.resolve()}):a.resolve()}var n=[f.emptyPromise()];return a?(a=void 0===a.length?[a]:a,angular.forEach(a,function(a){var d=b.defer();return n.push(d.promise),!i||null!=a.type&&0===a.type.search(i)?void("dimensions"===c&&null!=f.attrGetter("ngfDimensions",e)?f.imageDimensions(a).then(function(b){m(d,a,j("ngfDimensions",{$file:a,$width:b.width,$height:b.height}))},function(){d.reject()}):"duration"===c&&null!=f.attrGetter("ngfDuration",e)?f.mediaDuration(a).then(function(b){m(d,a,j("ngfDuration",{$file:a,$duration:b}))},function(){d.reject()}):m(d,a,f.getValidationAttr(e,g,c,h,a))):void d.resolve()}),b.all(n).then(function(){d.$ngfValidations.push({name:c,valid:!0})},function(){d.$ngfValidations.push({name:c,valid:!1})})):void 0}d=d||{},d.$ngfValidations=d.$ngfValidations||[],angular.forEach(d.$ngfValidations,function(a){a.valid=!0});var j=function(a,b){return f.attrGetter(a,e,g,b)};if(null==a||0===a.length)return f.emptyPromise(d);a=void 0===a.length?[a]:a.slice(0),h("maxFiles",null,function(a,b){return b>=c}),h("pattern",null,f.validatePattern),h("minSize","size.min",function(a,b){return a.size+.1>=f.translateScalars(b)}),h("maxSize","size.max",function(a,b){return a.size-.1<=f.translateScalars(b)});var k=0;if(h("maxTotalSize",null,function(b,c){return k+=b.size,k>f.translateScalars(c)?(a.splice(0,a.length),!1):!0}),h("validateFn",null,function(a,b){return b===!0||null===b||""===b}),!a.length)return f.emptyPromise(d,d.$ngfValidations);var l=b.defer(),m=[];return m.push(f.happyPromise(i("maxHeight","height.max",/image/,this.imageDimensions,function(a,b){return a.height<=b}))),m.push(f.happyPromise(i("minHeight","height.min",/image/,this.imageDimensions,function(a,b){return a.height>=b}))),m.push(f.happyPromise(i("maxWidth","width.max",/image/,this.imageDimensions,function(a,b){return a.width<=b}))),m.push(f.happyPromise(i("minWidth","width.min",/image/,this.imageDimensions,function(a,b){return a.width>=b}))),m.push(f.happyPromise(i("dimensions",null,/image/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("ratio",null,/image/,this.imageDimensions,function(a,b){for(var c=b.toString().split(","),d=!1,e=0;e<c.length;e++)Math.abs(a.width/a.height-f.ratioToFloat(c[e]))<1e-4&&(d=!0);return d}))),m.push(f.happyPromise(i("maxRatio","ratio.max",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)<1e-4}))),m.push(f.happyPromise(i("minRatio","ratio.min",/image/,this.imageDimensions,function(a,b){return a.width/a.height-f.ratioToFloat(b)>-1e-4}))),m.push(f.happyPromise(i("maxDuration","duration.max",/audio|video/,this.mediaDuration,function(a,b){return a<=f.translateScalars(b)}))),m.push(f.happyPromise(i("minDuration","duration.min",/audio|video/,this.mediaDuration,function(a,b){return a>=f.translateScalars(b)}))),m.push(f.happyPromise(i("duration",null,/audio|video/,function(a,b){return f.emptyPromise(b)},function(a){return a}))),m.push(f.happyPromise(i("validateAsyncFn",null,null,function(a,b){return b},function(a){return a===!0||null===a||""===a}))),b.all(m).then(function(){l.resolve(d,d.$ngfValidations)})},f.imageDimensions=function(a){if(a.$ngfWidth&&a.$ngfHeight){var d=b.defer();return c(function(){d.resolve({width:a.$ngfWidth,height:a.$ngfHeight})}),d.promise}if(a.$ngfDimensionPromise)return a.$ngfDimensionPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("image")?void e.reject("not image"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].clientWidth,c=h[0].clientHeight;h.remove(),a.$ngfWidth=b,a.$ngfHeight=c,e.resolve({width:b,height:c})}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].clientWidth?d():i>10?f():g())},1e3)}var h=angular.element("<img>").attr("src",b).css("visibility","hidden").css("position","fixed");h.on("load",d),h.on("error",f);var i=0;g(),angular.element(document.getElementsByTagName("body")[0]).append(h)},function(){e.reject("load error")})}),a.$ngfDimensionPromise=e.promise,a.$ngfDimensionPromise["finally"](function(){delete a.$ngfDimensionPromise}),a.$ngfDimensionPromise},f.mediaDuration=function(a){if(a.$ngfDuration){var d=b.defer();return c(function(){d.resolve(a.$ngfDuration)}),d.promise}if(a.$ngfDurationPromise)return a.$ngfDurationPromise;var e=b.defer();return c(function(){return 0!==a.type.indexOf("audio")&&0!==a.type.indexOf("video")?void e.reject("not media"):void f.dataUrl(a).then(function(b){function d(){var b=h[0].duration;a.$ngfDuration=b,h.remove(),e.resolve(b)}function f(){h.remove(),e.reject("load error")}function g(){c(function(){h[0].parentNode&&(h[0].duration?d():i>10?f():g())},1e3)}var h=angular.element(0===a.type.indexOf("audio")?"<audio>":"<video>").attr("src",b).css("visibility","none").css("position","fixed");h.on("loadedmetadata",d),h.on("error",f);var i=0;g(),angular.element(document.body).append(h)},function(){e.reject("load error")})}),a.$ngfDurationPromise=e.promise,a.$ngfDurationPromise["finally"](function(){delete a.$ngfDurationPromise}),a.$ngfDurationPromise},f}]),ngFileUpload.service("UploadResize",["UploadValidate","$q",function(a,b){var c=a,d=function(a,b,c,d,e){var f=e?Math.max(c/a,d/b):Math.min(c/a,d/b);return{width:a*f,height:b*f,marginX:a*f-c,marginY:b*f-d}},e=function(a,e,f,g,h,i,j,k){var l=b.defer(),m=document.createElement("canvas"),n=document.createElement("img");return n.onload=function(){if(null!=k&&k(n.width,n.height)===!1)return void l.reject("resizeIf");try{if(i){var a=c.ratioToFloat(i),b=n.width/n.height;a>b?(e=n.width,f=e/a):(f=n.height,e=f*a)}e||(e=n.width),f||(f=n.height);var o=d(n.width,n.height,e,f,j);m.width=Math.min(o.width,e),m.height=Math.min(o.height,f);var p=m.getContext("2d");p.drawImage(n,Math.min(0,-o.marginX/2),Math.min(0,-o.marginY/2),o.width,o.height),l.resolve(m.toDataURL(h||"image/WebP",g||.934))}catch(q){l.reject(q)}},n.onerror=function(){l.reject()},n.src=a,l.promise};return c.dataUrltoBlob=function(a,b,c){for(var d=a.split(","),e=d[0].match(/:(.*?);/)[1],f=atob(d[1]),g=f.length,h=new Uint8Array(g);g--;)h[g]=f.charCodeAt(g);var i=new window.Blob([h],{type:e});return i.name=b,i.$ngfOrigSize=c,i},c.isResizeSupported=function(){var a=document.createElement("canvas");return window.atob&&a.getContext&&a.getContext("2d")&&window.Blob},c.isResizeSupported()&&Object.defineProperty(window.Blob.prototype,"name",{get:function(){return this.$ngfName},set:function(a){this.$ngfName=a},configurable:!0}),c.resize=function(a,d,f,g,h,i,j,k,l){if(0!==a.type.indexOf("image"))return c.emptyPromise(a);var m=b.defer();return c.dataUrl(a,!0).then(function(b){e(b,d,f,g,h||a.type,i,j,k).then(function(d){if("image/jpeg"===a.type&&l)try{d=c.restoreExif(b,d)}catch(e){setTimeout(function(){throw e},1)}m.resolve(c.dataUrltoBlob(d,a.name,a.size))},function(b){"resizeIf"===b&&m.resolve(a),m.reject()})},function(){m.reject()}),m.promise},c}]),function(){function a(a,c,d,e,f,g,h,i,j,k){function l(){return c.attr("disabled")||r("ngfDropDisabled",a)}function m(b,c){i.updateModel(e,d,a,r("ngfChange")||r("ngfDrop"),b,c)}function n(b,c){if(!i.shouldUpdateOn(b,d,a)||!c)return i.rejectPromise([]);var e=[];c.replace(/<(img src|img [^>]* src) *=\"([^\"]*)\"/gi,function(a,b,c){e.push(c)});var f=[],g=[];if(e.length){angular.forEach(e,function(a){f.push(i.urlToBlob(a).then(function(a){g.push(a)}))});var h=k.defer();return k.all(f).then(function(){h.resolve(g)},function(a){h.reject(a)}),h.promise}}function o(a,b,c,d){var e=r("ngfDragOverClass",a,{$event:c}),f="dragover";if(angular.isString(e))f=e;else if(e&&(e.delay&&(v=e.delay),e.accept||e.reject)){var g=c.dataTransfer.items;if(null!=g&&g.length)for(var h=e.pattern||r("ngfPattern",a,{$event:c}),j=g.length;j--;){if(!i.validatePattern(g[j],h)){f=e.reject;break}f=e.accept}else f=e.accept}d(f)}function p(b,c,e,f){function g(a,b){var c=k.defer();if(null!=a)if(a.isDirectory){var d=[i.emptyPromise()];if(m){var e={type:"directory"};e.name=e.path=(b||"")+a.name+a.name,n.push(e)}var f=a.createReader(),h=[],p=function(){f.readEntries(function(e){try{e.length?(h=h.concat(Array.prototype.slice.call(e||[],0)),p()):(angular.forEach(h.slice(0),function(c){n.length<=j&&l>=o&&d.push(g(c,(b?b:"")+a.name+"/"))}),k.all(d).then(function(){c.resolve()},function(a){c.reject(a)}))}catch(f){c.reject(f)}},function(a){c.reject(a)})};p()}else a.file(function(a){try{a.path=(b?b:"")+a.name,m&&(a=i.rename(a,a.path)),n.push(a),o+=a.size,c.resolve()}catch(d){c.reject(d)}},function(a){c.reject(a)});return c.promise}var j=i.getValidationAttr(d,a,"maxFiles")||Number.MAX_VALUE,l=i.getValidationAttr(d,a,"maxTotalSize")||Number.MAX_VALUE,m=r("ngfIncludeDir",a),n=[],o=0,p=[i.emptyPromise()];if(b&&b.length>0&&"file"!==h.protocol())for(var q=0;q<b.length;q++){if(b[q].webkitGetAsEntry&&b[q].webkitGetAsEntry()&&b[q].webkitGetAsEntry().isDirectory){var s=b[q].webkitGetAsEntry();if(s.isDirectory&&!e)continue;null!=s&&p.push(g(s))}else{var t=b[q].getAsFile();null!=t&&(n.push(t),o+=t.size)}if(n.length>j||o>l||!f&&n.length>0)break}else if(null!=c)for(var u=0;u<c.length;u++){var v=c.item(u);if((v.type||v.size>0)&&(n.push(v),o+=v.size),n.length>j||o>l||!f&&n.length>0)break}var w=k.defer();return k.all(p).then(function(){if(f||m)w.resolve(n);else{for(var a=0;n[a]&&"directory"===n[a].type;)a++;w.resolve([n[a]])}},function(a){w.reject(a)}),w.promise}var q=b(),r=function(a,b,c){return i.attrGetter(a,d,b,c)};if(r("dropAvailable")&&g(function(){a[r("dropAvailable")]?a[r("dropAvailable")].value=q:a[r("dropAvailable")]=q}),!q)return void(r("ngfHideOnDropNotAvailable",a)===!0&&c.css("display","none"));null==r("ngfSelect")&&i.registerModelChangeValidator(e,d,a);var s,t=null,u=f(r("ngfStopPropagation")),v=1;c[0].addEventListener("dragover",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){if(b.preventDefault(),u(a)&&b.stopPropagation(),navigator.userAgent.indexOf("Chrome")>-1){var e=b.dataTransfer.effectAllowed;b.dataTransfer.dropEffect="move"===e||"linkMove"===e?"move":"copy"}g.cancel(t),s||(s="C",o(a,d,b,function(d){s=d,c.addClass(s),r("ngfDrag",a,{$isDragging:!0,$class:s,$event:b})}))}},!1),c[0].addEventListener("dragenter",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation())},!1),c[0].addEventListener("dragleave",function(b){!l()&&i.shouldUpdateOn("drop",d,a)&&(b.preventDefault(),u(a)&&b.stopPropagation(),t=g(function(){s&&c.removeClass(s),s=null,r("ngfDrag",a,{$isDragging:!1,$event:b})},v||100))},!1),c[0].addEventListener("drop",function(b){if(!l()&&i.shouldUpdateOn("drop",d,a)){b.preventDefault(),u(a)&&b.stopPropagation(),s&&c.removeClass(s),s=null;var e,f=b.dataTransfer.items;try{e=b.dataTransfer&&b.dataTransfer.getData&&b.dataTransfer.getData("text/html")}catch(g){}p(f,b.dataTransfer.files,r("ngfAllowDir",a)!==!1,r("multiple")||r("ngfMultiple",a)).then(function(a){a.length?m(a,b):n("dropUrl",e).then(function(a){m(a,b)})})}},!1),c[0].addEventListener("paste",function(b){if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&b.preventDefault(),!l()&&i.shouldUpdateOn("paste",d,a)){var c=[],e=b.clipboardData||b.originalEvent.clipboardData;if(e&&e.items)for(var f=0;f<e.items.length;f++)-1!==e.items[f].type.indexOf("image")&&c.push(e.items[f].getAsFile());c.length?m(c,b):n("pasteUrl",e).then(function(a){m(a,b)})}},!1),navigator.userAgent.toLowerCase().indexOf("firefox")>-1&&r("ngfEnableFirefoxPaste",a)&&(c.attr("contenteditable",!0),c.on("keypress",function(a){a.metaKey||a.ctrlKey||a.preventDefault()}))}function b(){var a=document.createElement("div");return"draggable"in a&&"ondrop"in a&&!/Edge\/12./i.test(navigator.userAgent)}ngFileUpload.directive("ngfDrop",["$parse","$timeout","$location","Upload","$http","$q",function(b,c,d,e,f,g){return{restrict:"AEC",require:"?ngModel",link:function(h,i,j,k){a(h,i,j,k,b,c,d,e,f,g)}}}]),ngFileUpload.directive("ngfNoFileDrop",function(){return function(a,c){b()&&c.css("display","none")}}),ngFileUpload.directive("ngfDropAvailable",["$parse","$timeout","Upload",function(a,c,d){
    return function(e,f,g){if(b()){var h=a(d.attrGetter("ngfDropAvailable",g));c(function(){h(e),h.assign&&h.assign(e,!0)})}}}])}(),ngFileUpload.service("UploadExif",["UploadResize","$q",function(a,b){function c(a,b,c,d){switch(b){case 2:return a.transform(-1,0,0,1,c,0);case 3:return a.transform(-1,0,0,-1,c,d);case 4:return a.transform(1,0,0,-1,0,d);case 5:return a.transform(0,1,1,0,0,0);case 6:return a.transform(0,1,-1,0,d,0);case 7:return a.transform(0,-1,-1,0,d,c);case 8:return a.transform(0,-1,1,0,0,c)}}function d(a){for(var b="",c=new Uint8Array(a),d=c.byteLength,e=0;d>e;e++)b+=String.fromCharCode(c[e]);return window.btoa(b)}var e=a;return e.isExifSupported=function(){return window.FileReader&&(new FileReader).readAsArrayBuffer&&e.isResizeSupported()},e.readOrientation=function(a){var c=b.defer(),d=new FileReader,e=a.slice(0,65536);return d.readAsArrayBuffer(e),d.onerror=function(a){return c.reject(a)},d.onload=function(a){var b={orientation:1},d=new DataView(this.result);if(65496!==d.getUint16(0,!1))return c.resolve(b);for(var e=d.byteLength,f=2;e>f;){var g=d.getUint16(f,!1);if(f+=2,65505===g){if(1165519206!==d.getUint32(f+=2,!1))return c.resolve(b);var h=18761===d.getUint16(f+=6,!1);f+=d.getUint32(f+4,h);var i=d.getUint16(f,h);f+=2;for(var j=0;i>j;j++)if(274===d.getUint16(f+12*j,h)){var k=d.getUint16(f+12*j+8,h);return k>=2&&8>=k&&(d.setUint16(f+12*j+8,1,h),b.fixedArrayBuffer=a.target.result),b.orientation=k,c.resolve(b)}}else{if(65280!==(65280&g))break;f+=d.getUint16(f,!1)}}return c.resolve(b)},c.promise},e.applyExifRotation=function(a){if(0!==a.type.indexOf("image/jpeg"))return e.emptyPromise(a);var f=b.defer();return e.readOrientation(a).then(function(b){return b.orientation<2||b.orientation>8?f.resolve(a):void e.dataUrl(a,!0).then(function(g){var h=document.createElement("canvas"),i=document.createElement("img");i.onload=function(){try{h.width=b.orientation>4?i.height:i.width,h.height=b.orientation>4?i.width:i.height;var g=h.getContext("2d");c(g,b.orientation,i.width,i.height),g.drawImage(i,0,0);var j=h.toDataURL(a.type||"image/WebP",.934);j=e.restoreExif(d(b.fixedArrayBuffer),j);var k=e.dataUrltoBlob(j,a.name);f.resolve(k)}catch(l){return f.reject(l)}},i.onerror=function(){f.reject()},i.src=g},function(a){f.reject(a)})},function(a){f.reject(a)}),f.promise},e.restoreExif=function(a,b){var c={};return c.KEY_STR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c.encode64=function(a){var b,c,d,e,f,g="",h="",i="",j=0;do b=a[j++],c=a[j++],h=a[j++],d=b>>2,e=(3&b)<<4|c>>4,f=(15&c)<<2|h>>6,i=63&h,isNaN(c)?f=i=64:isNaN(h)&&(i=64),g=g+this.KEY_STR.charAt(d)+this.KEY_STR.charAt(e)+this.KEY_STR.charAt(f)+this.KEY_STR.charAt(i),b=c=h="",d=e=f=i="";while(j<a.length);return g},c.restore=function(a,b){a.match("data:image/jpeg;base64,")&&(a=a.replace("data:image/jpeg;base64,",""));var c=this.decode64(a),d=this.slice2Segments(c),e=this.exifManipulation(b,d);return"data:image/jpeg;base64,"+this.encode64(e)},c.exifManipulation=function(a,b){var c=this.getExifArray(b),d=this.insertExif(a,c);return new Uint8Array(d)},c.getExifArray=function(a){for(var b,c=0;c<a.length;c++)if(b=a[c],255===b[0]&225===b[1])return b;return[]},c.insertExif=function(a,b){var c=a.replace("data:image/jpeg;base64,",""),d=this.decode64(c),e=d.indexOf(255,3),f=d.slice(0,e),g=d.slice(e),h=f;return h=h.concat(b),h=h.concat(g)},c.slice2Segments=function(a){for(var b=0,c=[];;){if(255===a[b]&218===a[b+1])break;if(255===a[b]&216===a[b+1])b+=2;else{var d=256*a[b+2]+a[b+3],e=b+d+2,f=a.slice(b,e);c.push(f),b=e}if(b>a.length)break}return c},c.decode64=function(a){var b,c,d,e,f,g="",h="",i=0,j=[],k=/[^A-Za-z0-9\+\/\=]/g;k.exec(a)&&console.log("There were invalid base64 characters in the input text.\nValid base64 characters are A-Z, a-z, 0-9, NaNExpect errors in decoding."),a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");do d=this.KEY_STR.indexOf(a.charAt(i++)),e=this.KEY_STR.indexOf(a.charAt(i++)),f=this.KEY_STR.indexOf(a.charAt(i++)),h=this.KEY_STR.indexOf(a.charAt(i++)),b=d<<2|e>>4,c=(15&e)<<4|f>>2,g=(3&f)<<6|h,j.push(b),64!==f&&j.push(c),64!==h&&j.push(g),b=c=g="",d=e=f=h="";while(i<a.length);return j},c.restore(a,b)},e}]);
(function () {
    'use strict';
    FileUploadCtrl.$inject = ["snapFileUploadService"];
    angular.module('forms')
        .directive('snapFileUpload', snapFileUpload);

    function snapFileUpload() {
        var directive = {
            controller: FileUploadCtrl,
            controllerAs: 'vm',
            scope: {
                id: '@',
                isRemoveable: '=?',
                templateId: '=',
                isStacked: '=?',
                acceptFilter: '=?',
                isUploadBoxShown: '=?',
                isFileListShown: '=?',
                maxFileSize: '=?',
                listClasses: '@'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/forms/fileUpload/snapFileUpload.html'
        };
        return directive;
    }

    /* @ngInject */
    function FileUploadCtrl(snapFileUploadService) {
        var vm = this;

        vm.uploadFiles = uploadFiles;
        vm.deleteFile = deleteFile;
        vm.downloadFile = downloadFile;
        vm.isTemplateIdSet = isTemplateIdSet;

        start();

        function start() {
            vm.uploadId = newUUID();
            snapFileUploadService.fileUploads[vm.uploadId] = {};
            snapFileUploadService.fileUploads[vm.uploadId].files = []
            vm.fileUploads = snapFileUploadService.fileUploads[vm.uploadId].files;
            vm.isRemoveable = vm.isRemoveable || false;
            vm.isStacked = vm.isStacked || false;
            vm.acceptFilter = vm.acceptFilter || '*';
            vm.isUploadBoxShown = vm.isUploadBoxShown || false;
            vm.isFileListShown = vm.isFileListShown || false;
            vm.maxFileSize = vm.maxFileSize || '2097152';
            snapFileUploadService.fileUploads[vm.uploadId].maxSize = vm.maxFileSize;
        }

        function uploadFiles() {
            snapFileUploadService.startUpload(vm.uploadId, vm.templateId, vm.files);
            vm.files = [];
        }

        function deleteFile(file) {
            if (!file.complete) {
                // file upload still in progress
                file.upload.abort();
            }
            snapFileUploadService.deleteFile(vm.uploadId, file);
            vm.fileUploads = snapFileUploadService.fileUploads[vm.uploadId].files;
        }

        function downloadFile(file) {
            if (file.complete) {
                snapFileUploadService.downloadFile(file.fileId);
            }
        }

        function isTemplateIdSet() {
            return typeof vm.templateId === 'number';
        }

        function newUUID() {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        }
    }
})();
(function() {
    'use strict';

    //TODO: attach functions to vm in controller function's root
    //TODO: implement passed in function calls using explicit parameter naming convention
    //TODO: passed in functions should use naming convention 'onXxx' and name should have semantic meaning
    //TODO: add unit tests

    /**
     * arFormErrors
     *
     * This directive lists the errors that invalidate a form.
     */
    FormErrorsCtrl.$inject = ["$timeout", "snapFormErrorsService"];
    angular
        .module('forms')
        .directive('snapFormErrors', formErrors);

    /**
     * Internal function that returns the arFormErrors directive.
     * @returns {Object} the angular directive
     */
    function formErrors() {
        return {
            restrict: 'E',
            scope: {
                forms: '=',
                optionalSelector: '=',
                callbackFn: '&',
                callbackParam: '='
            },
            templateUrl: 'components/forms/validation/snapFormErrors.html',
            controller: FormErrorsCtrl,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    /**
     * Constructor function for the arFormErrors directive's controller.
     * @param $timeout
     * @constructor
     * @ngInject
     */
    function FormErrorsCtrl($timeout, snapFormErrorsService) {
        var vm = this;

        vm.getMessage = getMessage;
        vm.getTitle = getTitle;
        vm.focusInput = focusInput;
        vm.showFormErrors = showFormErrors;
        vm.checkForErrors = checkForErrors;

        /////////////////////

        /**
         * Retrieves the error message for the specified key.
         * @param {String} key
         * @param {String} name
         * @returns {String}
         */
        function getMessage(key, name) {

            var messageFoundInService = testServiceCases(key, name);

            if (messageFoundInService) {
                return messageFoundInService;
            }
            /* jshint ignore:start */
            switch (key) {
                case 'required':
                    return 'Field is required.';
                case 'selectionRequired':
                    return 'A selection is required.';
                case 'invalid':
                    return 'Field not valid.';
                case 'pattern':
                    return 'Field contains unexpected characters.';
                case 'minlength':
                    return 'Minimum ' +
                        angular.element(document.getElementsByName(name)).attr('minlength') + ' characters allowed.';
                case 'maxlength':
                    return 'Maximum ' +
                        angular.element(document.getElementsByName(name)).attr('maxlength') + ' characters reached.';
                case 'email':
                    return 'Field must be a valid email address.';
                case 'number':
                    return 'Field must be a number.';
                case 'url':
                    return 'Field must be a valid URL.';
                case 'blacklisted':
                    return 'The email domain entered is not allowed.';
                case 'maxkeyword':
                    return 'Input keyword Count Exceeds 25. Please Remove Excess Keywords.';
                case 'formValueRequired':
                    return 'Provide one search criteria to proceed.';
                case 'min':
                    return 'Field value is required to be at least ' +
                        angular.element(document.getElementsByName(name)).attr('min');
                case 'max':
                    return 'Field value is required to be less than or equal to ' +
                        angular.element(document.getElementsByName(name)).attr('max');
                case 'date':
                    return 'Field value must be a valid date.';
                case 'parse':
                    return 'Field is invalid.';
                case 'angularValidator':
                    return 'Field is invalid.';
                case 'deal-reg-num':
                    return 'Deal Registration Number must start with L or DR.';
                case 'valid-input':
                case 'address':
                    return 'Valid selection required.';
                case 'MachineModel':
                    return 'Model Already Adjusted';
                case 'MachineType':
                    return 'Type Already Adjusted';
                case 'forceMatch':
                    return 'Valid selection required';
                case 'autocomplete':
                    return 'Failed to save ' +
                        angular.element(document.getElementsByName(name)).attr('title').toLowerCase() +
                        '. Please use the Lookup (Magnifying Glass Icon) to select a valid address.';
                case key:
                    return key;
            }
            /* jshint ignore:end */
        }

        function testServiceCases(key, name) {
            var found;
            snapFormErrorsService.errors.forEach(function(error){
                if (error.key && error.key.toLowerCase() === key.toLowerCase() && typeof error.message === 'string') {
                    found = error.message;
                } else if (error.key && error.key.toLowerCase() === key.toLowerCase() && typeof error.message === 'function') {
                    found = error.message(name);
                }
            });
            return found;
        }

        /**
         * Retrieves the title for the given form element name.
         * @param {String} name
         * @returns {String}
         */
        function getTitle(name) {
            var form, element;

            if (vm.optionalSelector) {
                form = angular.element(document.getElementById(vm.optionalSelector));
                element = angular.element(form.find('input[name="' + name + '"]'));
                if (!element || element.length === 0) {
                    element = angular.element(form.find('select[name="' + name + '"]'));
                }
                if (!element || element.length === 0) {
                    element = angular.element(form.find('textarea[name="' + name + '"]'));
                }
            } else {
                element = angular.element(document.getElementsByName(name));
            }

            return element ? element.prop('title') : name;
        }

        /**
         * Set focus on the form element that has the specified name.
         * @param {String} name
         * @param {String} formName
         */
        function focusInput(name, formName) {
            if (vm.callbackFn()) {
                if (vm.callbackParam === 'name') {
                    vm.callbackFn()(name);
                } else {
                    vm.callbackFn()(formName);
                }
            }
            //FIXME: discuss $timeout for transition on accordions... use NG-ANIMATE???//
            if (vm.optionalSelector) {
                var form = angular.element(document.getElementById(vm.optionalSelector));
                $timeout(function() {
                    if (form.find('input[name="' + name + '"]').length > 0) {
                        angular.element(form.find('input[name="' + name + '"]'))[0].focus();
                    } else if (form.find('select[name="' + name + '"]').length > 0) {
                        angular.element(form.find('select[name="' + name + '"]'))[0].focus();
                    } else if (form.find('textarea[name"' + name + '"]').length > 0) {
                        angular.element(form.find('textarea[name"' + name + '"]'))[0].focus();
                    }
                }, 100);
            } else {
                $timeout(function() {
                    angular.element(document.getElementsByName(name))[0].focus();
                }, 100);
            }
        }

        /**
         * Whether to show the errors list for the specified form.
         * @param form
         * @returns {boolean}
         */
        function showFormErrors(form) {
            if (form && form.$invalid && form.$submitted) {
                return true;
            } else if (form && form.$valid && form.$submitted) {
                return false;
            }
        }

        /**
         * Checks all forms to determine if there are any errors.
         * @returns {boolean}
         */
        function checkForErrors() {
            var i, len, form;

            for (i = 0, len = vm.forms.length; i < len; i++) {
                form = vm.forms[i];
                if (form && form.$invalid && form.$submitted) {
                    return true;
                }
            }
            return false;
        }
    }
})();

(function() {
    'use strict';

    //TODO: initialize variables and $scope actions in init function
    //TODO: clean up, document and improve code - meet style guide requirements
    //TODO: add unit tests

    /**
     * arFormValidator
     *
     * This directive handles form validation.
     */
    formValidatorLink.$inject = ["scope", "element"];
    angular
        .module('forms')
        .directive('snapFormValidator', validator);

    /**
     * Internal function that returns the arFormValidator directive.
     * @returns {Object} the angular directive
     */
    function validator() {
        return {
            restrict: 'A',
            link: formValidatorLink
        };
    }

    /**
     * Link function for the arFormValidator directive.
     * @param scope
     * @param element
     * @ngInject
     */
    function formValidatorLink(scope, element) {
        var formEl = angular.element(element)[0];

        // This is the the scope form model
        // All validation states are contained here
        var formName = formEl.attributes.name.value;
        var scopeForm = scope[formName];

        // Set the default submitted state to false
        scopeForm.$submitted = false;

        // Watch form length to add watches for new form elements
        scope.$watch(function() {return formEl.length;}, function() {
            setupWatches(formEl);
        });

        // Intercept and handle submit events of the form
        element.on('submit', function(event) {
            event.preventDefault();
            scope.$apply(function() {
                scopeForm.$submitted = true;
            });

            // If the form is valid then call the function that is
            // declared in the snap-form-validator-submit attribute on the form element
            if (scopeForm.$valid) {
                scope.$apply(function() {
                    scope.$eval(formEl.attributes['snap-form-validator-submit'].value);
                });
            }
        });

        scopeForm.reset = function() {
            // Clear all the form values
            for (var i = 0; i < formEl.length; i++) {
                if (formEl[i].name) {
                    scopeForm[formEl[i].name].$setViewValue('');
                    scopeForm[formEl[i].name].$render();
                }
            }

            scopeForm.$submitted = false;
            scopeForm.$setPristine();
        };

        // Setup watches on all form fields
        setupWatches(formEl);

        /**
         * Iterate through the form fields and setup watches on each one.
         * @param formElement
         */
        function setupWatches(formElement) {
            for (var i = 0; i < formElement.length; i++) {
                // This ensures we are only watching form fields
                if (i in formElement) {
                    setupWatch(formElement[i]);
                }
            }
        }

        /**
         * Setup $watch on a single form field.
         * @param elementToWatch
         */
        function setupWatch(elementToWatch) {
            if (elementToWatch.isWatchedByValidator) {
                return;
            }

            elementToWatch.isWatchedByValidator = true;

            // only add to inputs/selects/textarea for styling (adding validation error)
            if ((elementToWatch.tagName === 'INPUT' && elementToWatch.type === 'text')|| elementToWatch.tagName === 'SELECT' || elementToWatch.tagName == 'TEXTAREA') {
                angular.element(elementToWatch).wrap('<div></div>');
            }

            // If element is set to validate on blur then update the element on blur
            if ('validate-on' in elementToWatch.attributes &&
                elementToWatch.attributes['validate-on'].value === 'blur') {

                angular.element(elementToWatch).on('blur', function() {
                    updateValidationMessage(elementToWatch);
                    updateValidationClass(elementToWatch);
                });

            }

            scope.$watch(function() {
                    return elementToWatch.value +
                        elementToWatch.required +
                        scopeForm.$submitted +
                        checkElementValidity(elementToWatch) +
                        getDirtyValue(scopeForm[elementToWatch.name]) +
                        getValidValue(scopeForm[elementToWatch.name]);
                },
                function() {
                    if ('validate-on' in elementToWatch.attributes &&
                        elementToWatch.attributes['validate-on'].value === 'blur') {
                        updateValidationMessage(elementToWatch);
                        updateValidationClass(elementToWatch);
                    }
                    if (scopeForm.$submitted ||
                        (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].blacklist ||
                        scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].MachineType ||
                        scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].Adjustment ||
                        scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].MachineModel ||
                        scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].forceMatch)) {
                        updateValidationMessage(elementToWatch);
                        updateValidationClass(elementToWatch);
                    } else {
                        // Determine if the element in question is to be updated on blur
                        var isDirtyElement = 'validate-on' in elementToWatch.attributes &&
                            elementToWatch.attributes['validate-on'].value === 'dirty';

                        if (isDirtyElement) {
                            updateValidationMessage(elementToWatch);
                            updateValidationClass(elementToWatch);
                        }
                        // This will get called in the case of resetting the form.
                        // This only gets called for elements that update on blur and submit.
                        else if (scopeForm[elementToWatch.name] &&
                            scopeForm[elementToWatch.name].$pristine) {
                            updateValidationMessage(elementToWatch);
                            updateValidationClass(elementToWatch);
                        }
                    }

                });
        }

        /**
         * Returns the $dirty value of the element if it exists
         * @param element
         * @returns {boolean|*}
         */
        function getDirtyValue(element) {
            if (element) {
                if ('$dirty' in element) {
                    return element.$dirty;
                }
            }
        }

        function getValidValue(element) {
            if (element) {
                if ('$valid' in element) {
                    return element.$valid;
                }
            }
        }

        function checkElementValidity(element) {
            // If element has a custom validation function
            if ('validator' in element.attributes) {
                // Call the custom validator function
                var isElementValid = scope.$eval(element.attributes.validator.value);
                scopeForm[element.name].$setValidity('angularValidator', isElementValid);
                return isElementValid;
            } else {
                return scopeForm[element.name] && scopeForm[element.name].$valid;
            }
        }

        /**
         * Adds and removes an error message as a sibling element of the form field
         * depending on the validity of the form field and the $submitted state of the form.
         * Will use default message if a custom message is not given.
         * @param element
         */
        function updateValidationMessage(element) {

            var defaultRequiredMessage = function() {
                return 'Required';
            };
            var defaultInvalidMessage = function() {
                return 'Invalid';
            };

            // Make sure the element is a form field and not a button for example
            // Only form elements should have names.
            if (!(element.name in scopeForm)) {
                return;
            }

            var scopeElementModel = scopeForm[element.name];

            // Remove all validation messages
            var validationMessageElement = isValidationMessagePresent(element);
            if (validationMessageElement) {
                validationMessageElement.remove();
            }

            // Only add validation messages if the form field is $dirty or the form has been $submitted
            if (scopeElementModel.$dirty ||
                (element.form && element.form.name && scope[element.form.name].$submitted)) {
                if (scopeElementModel.$error.required) {
                    // If there is a custom required message display it
                    if ('required-message' in element.attributes) {
                        angular.element(element)
                            .after(generateErrorMessage
                            (element.attributes['required-message'].value, element));
                    }
                    // Display the default required message
                    else {
                        angular.element(element).after
                        (generateErrorMessage(defaultRequiredMessage, element));
                    }
                } else if (scopeElementModel.$error.blacklisted) {
                    angular.element(element).after
                    (generateErrorMessage('\'Emails to this domain are not allowed. Please select a different email' +
                        ' address.\'', element));
                } else if (scopeElementModel.$error.MachineType) {
                    angular.element(element).after
                    (generateErrorMessage('\'Type Already Adjusted\'', element));
                } else if (scopeElementModel.$error.MachineModel) {
                    angular.element(element).after
                    (generateErrorMessage('\'Model Already Adjusted\'', element));
                } else if (scopeElementModel.$error.Adjustment) {
                    angular.element(element).after
                    (generateErrorMessage('\'Required\'', element));
                } else if (!scopeElementModel.$valid) {
                    // If there is a custom validation message add it
                    if ('invalid-message' in element.attributes) {
                        angular.element(element)
                            .after
                            (generateErrorMessage(element.attributes['invalid-message'].value, element));
                    }
                    // Display the default error message
                    else {
                        angular.element(element).after
                        (generateErrorMessage(defaultInvalidMessage, element));
                    }
                }
            }
        }

        function generateErrorMessage(messageText) {
            return '<span class=\'validation-message\'>' +
                scope.$eval(messageText) +
                '</span>';
        }

        /**
         * Returns the validation message element or False.
         * @param element
         * @returns {*}
         */
        function isValidationMessagePresent(element) {
            var elementSiblings = angular.element(element).parent().children();
            for (var i = 0; i < elementSiblings.length; i++) {
                if (angular.element(elementSiblings[i]).hasClass('validation-message')) {
                    return angular.element(elementSiblings[i]);
                }
            }
            return false;
        }

        /**
         * Adds and removes .validation-error class to both the form element and the form element's parent
         * depending on the validity of the element and the $submitted state of the form.
         * @param element
         */
        function updateValidationClass(element) {
            // Make sure the element is a form field and not a button for example
            // Only form fields should have names.
            if (!(element.name in scopeForm)) {
                return;
            }
            var formField = scopeForm[element.name];

            // This is extra for users wishing to implement the .validation-error class on the field itself
            // instead of on the parent element. Note that Bootstrap requires the
            // .validation-error class to be on the parent element
            angular.element(element).removeClass('validation-error');
            angular.element(element.parentNode).removeClass('validation-error');
            var parent1 = element.parentNode,
                parent2 = (parent1 && parent1.parentNode) ? parent1.parentNode : '',
                parent3 = (parent2 && parent2.parentNode) ? parent2.parentNode : '',
                parent4 = (parent3 && parent3.parentNode) ? parent3.parentNode : '';
            if (parent1 && angular.element(parent1).hasClass('validation-error')) {
                angular.element(parent1).removeClass('validation-error');
            } else if (parent2 && angular.element(parent2).hasClass('validation-error')) {
                angular.element(parent2).removeClass('validation-error');
            } else if (parent3 && angular.element(parent3).hasClass('validation-error')) {
                angular.element(parent3).removeClass('validation-error');
            } else if (parent4 && angular.element(parent4).hasClass('validation-error')) {
                angular.element(parent4).removeClass('validation-error');
            } else {
                angular.element(parent1).removeClass('validation-error');
            }

            // Only add/remove validation classes if the field is $dirty or the form has been $submitted
            if (formField.$dirty || (element.form && element.form.name && scope[element.form.name].$submitted)) {
                if (formField.$invalid) {
                    //climb the parents until we find input-group,
                    //if not found on 4th parent element we default to first parent
                    if (parent1 && angular.element(parent1).hasClass('input-group')) {
                        angular.element(parent1).addClass('validation-error');
                    } else if (parent2 && angular.element(parent2).hasClass('input-group')) {
                        angular.element(parent2).addClass('validation-error');
                    } else if (parent3 && angular.element(parent3).hasClass('input-group')) {
                        angular.element(parent3).addClass('validation-error');
                    } else if (parent4 && angular.element(parent4).hasClass('input-group')) {
                        angular.element(parent4).addClass('validation-error');
                    } else {
                        angular.element(parent1).addClass('validation-error');
                    }

                    // This is extra for users wishing to implement
                    // the .validation-error class on the field itself
                    // instead of on the parent element.
                    // Note that Bootstrap requires the .validation-error
                    // class to be on the parent element
                    //angular.element(element).addClass('error-message');
                }
            }
        }
    }

})();
(function() {
    'use strict';
    angular.module('helpers')
        .directive('bindHtmlCompile', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    //watch for changes
                    scope.$watch(function () {
                        //evaluate the angular model bound to that attribute, ie bind-to-html"thisIsEvaled"
                        return scope.$eval(attrs.bindHtmlCompile);
                    }, function (value) {
                        //Set element.html to what's there just in case it evals to not strings
                        element.html(value && value.toString());
                        //get scope of the element
                        var compileScope = scope;
                        //if there is bind-html-scope="" defined
                        if (attrs.bindHtmlScope) {
                            //compile with that socpe
                            compileScope = scope.$eval(attrs.bindHtmlScope);
                        }
                        //then compile the original contents into the the directives template or whatever it may be
                        $compile(element.contents())(compileScope);
                    });
                }
            };
        }]);
})();
/** NOTE: THIS WAS BUILT FOR AND ONLY FOR UI-ROUTER! NOT NG-ROUTE **/
(function() {
    'use strict';
    snapBreadcrumbs.$inject = ["$interpolate", "$state"];
    angular.module('navigation')
        .directive('snapBreadcrumbs', snapBreadcrumbs);

    /* @ngInject */
    function snapBreadcrumbs($interpolate, $state) {
        return {
            restrict: 'E',
            templateUrl: 'components/navigation/breadcrumbs/snapBreadCrumbs.html',
            scope: {
                displaynameProperty: '@',
                abstractProxyProperty: '@?'
            },
            link: function(scope) {
                scope.breadcrumbs = [];
                if ($state.$current.name !== '') {
                    updateBreadcrumbsArray();
                }
                scope.$on('$stateChangeSuccess', function() {
                    updateBreadcrumbsArray();
                });

                /**
                 * Start with the current state and traverse up the path to build the
                 * array of breadcrumbs that can be used in an ng-repeat in the template.
                 */
                function updateBreadcrumbsArray() {
                    var workingState;
                    var displayName;
                    var breadcrumbs = [];
                    var currentState = $state.$current;

                    while(currentState && currentState.name !== '') {
                        workingState = getWorkingState(currentState);
                        if (workingState) {
                            displayName = getDisplayName(workingState);

                            if (displayName !== false && !stateAlreadyInBreadcrumbs(workingState, breadcrumbs)) {
                                breadcrumbs.push({
                                    displayName: displayName,
                                    route: workingState.name
                                });
                            }
                        }
                        currentState = currentState.parent;
                    }
                    breadcrumbs.reverse();
                    scope.breadcrumbs = breadcrumbs;
                }

                /**
                 * Get the state to put in the breadcrumbs array, taking into account that if the current state is abstract,
                 * we need to either substitute it with the state named in the `scope.abstractProxyProperty` property, or
                 * set it to `false` which means this breadcrumb level will be skipped entirely.
                 * @param currentState
                 * @returns {*}
                 */
                function getWorkingState(currentState) {
                    var proxyStateName;
                    var workingState = currentState;
                    if (currentState.abstract === true) {
                        if (typeof scope.abstractProxyProperty !== 'undefined') {
                            proxyStateName = getObjectValue(scope.abstractProxyProperty, currentState);
                            if (proxyStateName) {
                                workingState = angular.copy($state.get(proxyStateName));
                                if (workingState) {
                                    workingState.locals = currentState.locals;
                                }
                            } else {
                                workingState = false;
                            }
                        } else {
                            workingState = false;
                        }
                    }
                    return workingState;
                }

                /**
                 * Resolve the displayName of the specified state. Take the property specified by the `displayname-property`
                 * attribute and look up the corresponding property on the state's config object. The specified string can be interpolated against any resolved
                 * properties on the state config object, by using the usual {{ }} syntax.
                 * @param currentState
                 * @returns {*}
                 */
                function getDisplayName(currentState) {
                    var interpolationContext;
                    var propertyReference;
                    var displayName;

                    if (!scope.displaynameProperty) {
                        // if the displayname-property attribute was not specified, default to the state's name
                        return currentState.name;
                    }
                    propertyReference = getObjectValue(scope.displaynameProperty, currentState);

                    if (propertyReference === false) {
                        return false;
                    } else if (typeof propertyReference === 'undefined') {
                        return currentState.name;
                    } else {
                        // use the $interpolate service to handle any bindings in the propertyReference string.
                        interpolationContext =  (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
                        displayName = $interpolate(propertyReference)(interpolationContext);
                        return displayName;
                    }
                }

                /**
                 * Given a string of the type 'object.property.property', traverse the given context (eg the current $state object) and return the
                 * value found at that path.
                 *
                 * @param objectPath
                 * @param context
                 * @returns {*}
                 */
                function getObjectValue(objectPath, context) {
                    var i;
                    var propertyArray = objectPath.split('.');
                    var propertyReference = context;

                    for (i = 0; i < propertyArray.length; i ++) {
                        if (angular.isDefined(propertyReference[propertyArray[i]])) {
                            propertyReference = propertyReference[propertyArray[i]];
                        } else {
                            // if the specified property was not found, default to the state's name
                            return undefined;
                        }
                    }
                    return propertyReference;
                }

                /**
                 * Check whether the current `state` has already appeared in the current breadcrumbs array. This check is necessary
                 * when using abstract states that might specify a proxy that is already there in the breadcrumbs.
                 * @param state
                 * @param breadcrumbs
                 * @returns {boolean}
                 */
                function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
                    var i;
                    var alreadyUsed = false;
                    for(i = 0; i < breadcrumbs.length; i++) {
                        if (breadcrumbs[i].route === state.name) {
                            alreadyUsed = true;
                        }
                    }
                    return alreadyUsed;
                }
            }
        };
    }
})();

(function() {
    'use strict';
    CollapsibleCtrl.$inject = ["$scope", "$sce"];
    angular.module('pageLayout')
        .directive('snapCollapsibleBlock', collapsibleBlock);

    function collapsibleBlock() {
        var directive = {
            restrict: 'E',
            templateUrl: 'components/page-layout/collapsible-content-blocks/collapsibleBlock.html',
            transclude: true,
            scope: {
                htmlContent: '=',
                disablePadding: '=',
                disableBorder: '='
            },
            controller: CollapsibleCtrl
        };
        return directive;
    }

    /* @ngInject */
    function CollapsibleCtrl($scope, $sce) {
        $scope.$sce = $sce;

        angular.forEach($scope.htmlContent, function(htmlString, index){
            $scope.htmlContent[index] = $sce.trustAsHtml(htmlString);
        })
    }
})();
(function() {
    'use strict';
    SnapGlobalHeaderCtrl.$inject = ["snapHeaderService"];
    angular.module('pageLayout')
        .directive('snapGlobalHeader', snapGlobalHeader);

    function snapGlobalHeader() {
        var directive = {
            controller:  SnapGlobalHeaderCtrl,
            controllerAs: 'vm',
            scope: {
                includeGlobalNav: '=',
                isGlobalNavMegaMenu: '=?',
                globalNavClass: '@?',
                productTitle: '@?',
                productTabs: '=?',
                logoUrl: '@?',
                userName: '@',
                onSignOut: '&'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/page-layout/global-header/snapGlobalHeader.html'
        };
        return directive;
    }

    /* @ngInject */
    function SnapGlobalHeaderCtrl(snapHeaderService) {
        var vm = this;

        vm.data = snapHeaderService.data;

        if (vm.includeGlobalNav) {
            vm.globalNavTabs = vm.data.globalNavData;
        }
        vm.userSettingsTabs = vm.data.userSettingsData;
        vm.appSettingsTabs = vm.data.appSettingsData;

        vm.activeProductPage = undefined;
    }
})();
(function() {
    'use strict';
    SnapGlobalNavCtrl.$inject = ["$scope", "$element"];
    angular.module('pageLayout')
        .directive('snapGlobalNav', snapGlobalNav);

    function snapGlobalNav() {
        var directive = {
            controller:  SnapGlobalNavCtrl,
            controllerAs: 'vm',
            scope: {
                navClass: '@',
                tabs: '=',
                isMegaMenu: '='
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/page-layout/global-navigation/snapGlobalNavigation.html'
        };
        return directive;
    }

    /* @ngInject */
    function SnapGlobalNavCtrl($scope, $element) {
        var vm = this;
        vm.removeHTML = removeHTML;

        function removeHTML(string) {
            var rex = /(<([^>]+)>)/ig;
            string = string.replace(rex, '');
            string = string.replace(/&nbsp;/gi, '');
            return string;
        }

        angular.element(document.body).on('click', function(e) {
            var isClickedElementChildOfPopup = $element[0].contains(e.target);

            if (!isClickedElementChildOfPopup) {
                vm.activeTab = false;
                $scope.$apply();
            }
        });

        $scope.$watchCollection('vm.tabs', function() {
            if (vm.tabs && vm.tabs && vm.tabs.length) {
                vm.groupedMegaMenuTabs = groupTabs(vm.tabs);
            }
        });

        function groupTabs(array) {
            angular.forEach(array, function(tab) {
                tab.groups = [];
                var j = tab.nodes.length,
                    groupSize = 4;

                for (var i=0; i < j; i += groupSize) {
                    tab.groups.push({nodes:tab.nodes.slice(i, i+groupSize)});
                }
            });
            return array;
        }

        vm.activeTab = false;
        vm.activateTab = function(name) {
            if (vm.activeTab === name) {
                vm.activeTab = false;
            } else {
                vm.activeTab = name;
            }
        };
    }
})();
(function() {
    'use strict';
    SnapUtilityNavCtrl.$inject = ["$element", "$scope"];
    angular.module('pageLayout')
        .directive('snapUtilityNav', snapUtilityNav);

    function snapUtilityNav() {
        var directive = {
            restrict: 'E',
            controller: SnapUtilityNavCtrl,
            controllerAs: 'vm',
            scope: {
                appSettingsTabs: '=',
                userSettingsTabs: '=',
                userName: '=',
                onSignOut: '&'
            },
            bindToController: true,
            templateUrl: 'components/page-layout/global-utility-nav/snapUtilityNav.html'
        };

        return directive;
    }

    /* @ngInject */
    function SnapUtilityNavCtrl($element, $scope) {
        var vm = this;

        vm.activeTab = false;

        vm.activateTab = function(name) {
            if (vm.activeTab === name) {
                vm.activeTab = false;
            } else {
                vm.activeTab = name;
            }
        };

        angular.element(document.body).on('click', function(e) {
            var isClickedElementChildOfPopup = $element[0].contains(e.target);

            if (!isClickedElementChildOfPopup) {
                vm.activeTab = false;
                $scope.$apply();
            }
        });

    }
})();
(function() {
    'use strict';
//lightbox esc close directive attribute
    escKey.$inject = ["snapLightboxService", "$document"];
    angular.module('pageLayout')
        .directive("escKey", escKey);

    /* @ngInject */
    function escKey(snapLightboxService, $document) {
        return function(scope, element, attributes) {
            $document.on("keyup", function(event) {
                scope.$apply(function() {
                        if ((event.keyCode == 27) && element.hasClass('launch-lightbox') && !document.getElementsByClassName('modal-lightbox launch-lightbox').length) {
                            snapLightboxService.close(scope, element);
                        }
                    }
                )
            });
        };
    }
})();
(function() {
    'use strict';
    //lightbox directive
    lightboxCtrl.$inject = ["$scope", "snapLightboxService", "$timeout"];
    angular.module('pageLayout')
        .directive('snapLightbox', lightBox);

    /* @ngInject */
    function lightBox() {
        var directive = {
            controller: lightboxCtrl,
            controllerAs: 'vm',
            transclude: true,
            scope: {
                boxTitle: '@',
                boxId: '@',
                boxType: '@',
                isModal: '=',
                rightClass: '@',
                isConfirm: '='
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/page-layout/lightbox/snapLightbox.html'
        };

        return directive;
    }

    /* @ngInject */
    function lightboxCtrl($scope, snapLightboxService, $timeout) {
        var vm = this;
        vm.init = init;

        init();

        //wait for openModal to match modalId to listen for clicks
        function init() {
            $scope.$on('lightboxOpen#' + vm.boxId, function () {
                vm.hideX = angular.element(document.getElementById(vm.boxId)).hasClass('modal-lightbox');

                $timeout(function () {
                    //listen for clicks
                    angular.element(document.body).on('click', function (e) {
                        if (angular.element(document.getElementById(vm.boxId)).hasClass('launch-lightbox')) {

                            //get the lightbox element
                            var boxEl = angular.element(document.getElementById(vm.boxId));

                            //find other lightboxes open
                            var otherBoxes = document.getElementsByClassName('launch-lightbox');

                            //convert to array instead of HTML element array
                            otherBoxes = [].slice.call(otherBoxes);

                            //determine if it's a container, if so, remove it
                            angular.forEach(otherBoxes, function (box, index) {
                                if (angular.element(box).hasClass('lightbox-container')) {
                                    otherBoxes.splice(index, 1);
                                }
                            });

                            //check if click is in the lightboxbox element
                            var isInBox = boxEl.find(e.target).length > 0;

                            //check if it's another lightbox
                            angular.forEach(otherBoxes, function (box) {
                                if (angular.element(box)[0].contains(e.target)) {
                                    isInBox = true;
                                }
                            });

                            //find out if it's in the container (grey area)
                            var isInSomeContainer = (angular.element(e.target).hasClass('launch-lightbox') && !angular.element(e.target).hasClass('lightbox-container'));

                            //condition to close lightboxes based on where the click happens
                            if ((e.target.id !== vm.boxId) && (!isInBox) && (boxEl.hasClass('launch-lightbox')) && !boxEl.hasClass('modal-lightbox') && !isInSomeContainer && !(document.getElementsByClassName('modal-lightbox launch-lightbox').length)) {
                                snapLightboxService.close($scope, boxEl);
                                angular.element(document.body).off('click');
                            }
                        }
                    });
                    //300ms timeout to prevent closing lightbox on double click
                },300);
            });
        }
    }
})();
(function() {
    'use strict';
    snapLightboxClose.$inject = ["$rootScope", "snapLightboxService", "$timeout"];
    angular.module('pageLayout')
        .directive('snapLightboxClose', snapLightboxClose);

    /* @ngInject */
    function snapLightboxClose($rootScope, snapLightboxService, $timeout) {
        return {
            restrict: 'A',
            scope: {
                snapLightboxClose: '='
            },
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    if (scope.snapLightboxClose) {
                        return;
                    }
                    $timeout(function() {
                        snapLightboxService.close($rootScope, element, attrs.closingType);
                    });
                });
            }
        };
    }
})();
(function() {
    'use strict';
//lightbox-open directive attribute
    snapLightboxOpen.$inject = ["$rootScope", "snapLightboxService", "$timeout"];
    angular.module('pageLayout')
        .directive('snapLightboxOpen', snapLightboxOpen);

    /* @ngInject */
    function snapLightboxOpen($rootScope, snapLightboxService, $timeout) {
        return {
            restrict: 'A',
            scope: {
                snapLightboxOpen: '='
            },
            link: function(scope, element) {
                var config = scope.snapLightboxOpen;
                if (!config || !config.selector) {
                    return;
                }

                element.bind('click', function() {
                    if (config.preventLoad) {
                        return;
                    }

                    $timeout(function() {
                        snapLightboxService.open($rootScope, config.selector);
                        //$rootScope.$broadcast('lightboxOpen' + config.selector);
                    });
                });
            }
        };
    }
})();
(function() {
    'use strict';
    angular.module('search')
        .directive('snapSearchCriteria', snapSearchCriteria);

    function snapSearchCriteria() {
        var directive = {
            controller:  searchCriteriaCtrl,
            controllerAs: 'vm',
            scope: {
                terms: '=',
                onClear: '&'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/search/searchCriteria/snapSearchCriteria.html'
        };

        return directive;
    }

    function searchCriteriaCtrl() {
        var vm = this;

        vm.clearTerm = clearTerm;
        vm.clearAllTerms = clearAllTerms;

        function clearTerm(index, term) {
            //take the spot out of the array
            vm.terms.splice(index, 1);

            //if the callbackFn is defined then call it
            if (vm.onClear()) {
                vm.onClear()(term);
            }
        }

        function clearAllTerms() {
            //clear the array
            vm.terms = [];

            //if the callbackFn is defined then call it
            if (vm.onClear()) {
                vm.onClear()();
            }
        }
    }
})();
(function() {
    'use strict';
    angular.module('search')
        .directive('snapSearchFilter', searchFilter);

    function searchFilter() {
        return {
            restrict: 'E',
            templateUrl: function (el, attrs) {
                var filterType = (!attrs.filterType) ? 'base' : attrs.filterType;
                return 'components/search/searchFilters/' + filterType + 'SearchFilter.html'
            },
            scope: {
                header: '@',
                filterData: '=',
                callbackFn: '&'
            },
            bindToController: true,
            controller: filterCtrl,
            controllerAs: 'vm'
        };
    }

    /* @ngInject */
    function filterCtrl() {
        var vm = this;

        vm.sections =  vm.filterData.filters.sections;

        angular.forEach(vm.sections, function(section){
            angular.forEach(section.filters, function(filter){
                if (angular.isDefined(filter.color)) {
                    section.style = 'filter-color-key'
                }
            });
        });

        vm.onSelectionChange = onSelectionChange;

        function onSelectionChange() {

            vm.currentFilters = angular.copy(vm.filterData);

            if (vm.callbackFn) {
                vm.callbackFn()(vm.currentFilters);
            }
        }
    }
})();
(function() {
    'use strict';
    angular.module('tables')
        .directive('snapGrid', snapGrid);

    function snapGrid() {
        var directive = {
            restrict: 'E',
            transclude: true,
            templateUrl: function (elem, attr) {
                return 'components/tables/grid/snapGrid' + attr.gridTemplate + '.html';
            },
            scope: {
                gridConfig: '='
            },
            bindToController: true,
            controllerAs: 'vm',
            /* @ngInject */
            controller: ["$scope", function($scope){
                var vm = this;
                vm.gridConfig.parentScope = (vm.gridConfig.parentScope || $scope.$parent);
            }]
        };
        return directive;
    }
})();
(function() {
    'use strict';
    PaginationCtrl.$inject = ["$scope"];
    angular.module('tables')
        .directive('snapPagination', snapPagination);

    function snapPagination() {
        //TODO
        //incrementor (+5 or +1 > default)
        var directive = {
            controller:  PaginationCtrl,
            controllerAs: 'vm',
            scope: {
                pageObject: '=',
                pageSizes: '=',
                callbackFn: '&',
                id: '@'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/tables/pagination/snapPagination.html'
        };

        return directive;
    }

    /* @ngInject */
    function PaginationCtrl($scope) {
        var vm = this;

        vm.init = init;
        vm.goToFirstPage = goToFirstPage;
        vm.goToLastPage = goToLastPage;
        vm.goToNextPage = goToNextPage;
        vm.goToPrevPage = goToPrevPage;
        vm.goToPage = goToPage;
        vm.pageSizeChanged = pageSizeChanged;

        function init() {
            if (!vm.pageSizes) {
                vm.pageSizes = [10, 20, 50, 100];
            }

            //watch for numResults change to calculate new pagination state
            $scope.$watch('vm.pageObject', function(newVal, oldVal) {
                if (newVal.numResults !== oldVal.numResults) {
                    vm.pageObject.currentPage = 1;
                }
                setShowHideConditions();
            }, true);
        }

        function goToFirstPage() {
            vm.pageObject.currentPage = 1;
            search();
        }

        function goToLastPage() {
            vm.pageObject.currentPage = vm.pageObject.lastPage;
            search();
        }

        function goToNextPage() {
            if (vm.pageObject.currentPage < vm.pageObject.lastPage) {
                vm.pageObject.currentPage += 1;
                search();
            }
        }

        function goToPrevPage() {
            if (vm.pageObject.currentPage > 1) {
                vm.pageObject.currentPage -= 1;
                search();
            }
        }

        function goToPage(number) {
            vm.pageObject.currentPage = number;
            search();
        }

        function pageSizeChanged() {
            vm.pageObject.currentPage = 1;
            search();
        }

        function search() {
            setShowHideConditions();
            if (vm.callbackFn()){
                vm.callbackFn()();
            }
        }

        function calculateLastPage() {
            vm.pageObject.lastPage = Math.ceil(vm.pageObject.numResults / vm.pageObject.currentPageSize);
        }

        function setShowHideConditions() {
            //get new last page
            calculateLastPage();

            //set show incremented variables to determine which numbers to show based on current page
            //TODO:DONT CHANGE!
            vm.showCurrentPlus1 = (((vm.pageObject.currentPage + 1) <= vm.pageObject.lastPage));
            vm.showCurrentPlus2 = (((vm.pageObject.currentPage + 2) <= vm.pageObject.lastPage));
            vm.showCurrentPlus3 = ((vm.pageObject.currentPage < 5) && (vm.pageObject.lastPage > vm.pageObject.currentPage + 3));
            vm.showCurrentPlus4  = ((vm.pageObject.currentPage < 4) && (vm.pageObject.lastPage > vm.pageObject.currentPage + 4));
            vm.showCurrentPlus5 = ((vm.pageObject.currentPage  < 3) && (vm.pageObject.lastPage > vm.pageObject.currentPage + 5));
            vm.showCurrentPlus6 = ((vm.pageObject.currentPage === 1) && (vm.pageObject.lastPage > vm.pageObject.currentPage + 6));

            //set show decremented variables to determine which numbers to show based on current page
            vm.showCurrentMinus1 = ((vm.pageObject.currentPage - 1) > 0);
            vm.showCurrentMinus2 = ((vm.pageObject.currentPage - 2) > 0);
            vm.showCurrentMinus3 = (vm.pageObject.lastPage - vm.pageObject.currentPage < 4) && ((vm.pageObject.currentPage - 3) > 1);
            vm.showCurrentMinus4  = (vm.pageObject.lastPage - vm.pageObject.currentPage < 3) && ((vm.pageObject.currentPage - 4) > 1);
            vm.showCurrentMinus5  = (vm.pageObject.lastPage - vm.pageObject.currentPage < 2) && ((vm.pageObject.currentPage - 5) > 1);
            vm.showCurrentMinus6  = (vm.pageObject.lastPage - vm.pageObject.currentPage < 1) && ((vm.pageObject.currentPage - 6) > 1);

            //set show first/last page variables to determine when to show first/last
            vm.showFirstPage = (vm.pageObject.currentPage >= 4);
            vm.showLastPage = (vm.pageObject.currentPage !== vm.pageObject.lastPage) && (vm.pageObject.lastPage - vm.pageObject.currentPage > 2) ;

            //set show ellipsis variables to determine when to show based on current page
            vm.showFirstEllipsis = vm.showFirstPage && (vm.pageObject.currentPage > 4) && (vm.pageObject.currentPage !== 4) && (vm.pageObject.lastPage > 8);
            vm.showLastEllipsis = vm.showLastPage && (vm.pageObject.currentPage < vm.pageObject.lastPage - 3) && (vm.pageObject.lastPage > 8);
        }
    }
})();
angular.module("angularLibrary").run(["$templateCache", function($templateCache) {$templateCache.put("components/page-layout/boxContent.html","<button type=button snap-lightbox-open=\"{selector: \'#secondLightbox\'}\" class=tertiary-button>secondLightbox</button>");
    $templateCache.put("components/page-layout/loremIpsum.html","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris efficitur diam ex, in laoreet turpis malesuada in. Donec nec eros et orci vulputate ullamcorper. Sed non augue consectetur, facilisis mi nec, vestibulum nulla. Vestibulum lorem tellus, feugiat sed scelerisque vel, elementum nec felis. Maecenas faucibus mauris imperdiet velit dignissim, ut vestibulum sapien pharetra. Nullam vitae risus id erat aliquet pulvinar. Fusce viverra at erat vel commodo. Donec dictum porttitor nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.");
    $templateCache.put("components/page-layout/spinnerBox.html","<div snap-status-spinner spinner-key=lightbox-spinner class=spinner-lightbox wire-intercept=false is-nested=true><div class=spinner-container><svg class=status-spinner><circle class=spinner-path cx=50 cy=50 r=10></circle><circle class=spinner-color cx=50 cy=50 r=10 stroke-miterlimit=10></circle></svg></div></div><div ng-controller=\"demoController as demoCtrl\"><button type=button class=\"tertiary-button center-block margin-bottom-3x\" ng-click=demoCtrl.startLightboxSpinner()>Start Lightbox Spinner, 3s</button></div>");
    $templateCache.put("components/design-elements/infoBox/snapInfoBox.html","<div data-test=snapInfoBox id={{id}}><a href ng-class=aTagClass data-test=snapInfoBoxATagWrap><span id=aTagSpan></span> {{link}}</a><div class=\"info-box-content z-index-900\" ng-transclude id=infoBoxContent ng-class=\"[placement, popoverClass]\" data-test=snapInfoBoxContent ng-if=!missingContent></div></div>");
    $templateCache.put("components/deps/uib.0.12.1/datepicker.html","<div ng-switch=datepickerMode role=application ng-keydown=keydown($event)><customdaypicker ng-switch-when=day tabindex=0></customdaypicker><custommonthpicker ng-switch-when=month tabindex=0></custommonthpicker><customyearpicker ng-switch-when=year tabindex=0></customyearpicker></div>");
    $templateCache.put("components/deps/uib.0.12.1/day.html","<div><table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}} class=date-picker><thead><tr class=gray-bg-tint-90><th><button type=button ng-click=move(-1) tabindex=-1><span></span></button></th><th colspan=\"{{5 + showWeeks}}\"><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button class=date-picker-header ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button ng-click=move(1) tabindex=-1><span></span></button></th></tr><tr><th ng-show=showWeeks></th><th ng-repeat=\"label in labels track by $index\"><small aria-label={{label.full}}>{{label.abbr}}</small></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-show=showWeeks>{{ weekNumbers[$index] }}</td><td ng-repeat=\"dt in row track by dt.date\" role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button ng-class=\"{\'text-light\': dt.secondary, active: isActive(dt), \'today\': isToday(dt)}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table></div>");
    $templateCache.put("components/deps/uib.0.12.1/month.html","<div><table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}} class=date-picker><thead><tr class=gray-bg-tint-90><th><button type=button ng-click=move(-1) tabindex=-1><span></span></button></th><th><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button class=date-picker-header ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button ng-click=move(1) tabindex=-1><span></span></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button class=month ng-class=\"{active: isActive(dt), \'today\': isToday(dt)}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table></div>");
    $templateCache.put("components/deps/uib.0.12.1/popup.html","<div ng-style=\"{display: (isOpen && \'block\') || \'none\'}\" class=date-picker-container ng-keydown=keydown($event)><ng-transclude></ng-transclude><div class=row ng-if=showButtonBar><button type=button ng-click=\"select(\'today\')\">{{ getText(\'current\') }}</button> <button type=button ng-click=select(null)>{{ getText(\'clear\') }}</button></div></div>");
    $templateCache.put("components/deps/uib.0.12.1/year.html","<table role=grid aria-labelledby={{uniqueId}}-title aria-activedescendant={{activeDateId}} class=date-picker><thead><tr class=gray-bg-tint-90><th><button type=button ng-click=move(-1) tabindex=-1><span></span></button></th><th colspan=3><button id={{uniqueId}}-title role=heading aria-live=assertive aria-atomic=true type=button class=date-picker-header ng-click=toggleMode() tabindex=-1>{{title}}</button></th><th><button type=button ng-click=move(1) tabindex=-1><span></span></button></th></tr></thead><tbody><tr ng-repeat=\"row in rows track by $index\"><td ng-repeat=\"dt in row track by dt.date\" role=gridcell id={{dt.uid}} aria-disabled={{!!dt.disabled}}><button type=button class=year ng-class=\"{active: isActive(dt), \'today\': isToday(dt)}\" ng-click=select(dt.date) ng-disabled=dt.disabled tabindex=-1>{{dt.label}}</button></td></tr></tbody></table>");
    $templateCache.put("components/feedback/messaging/snapFixedMessage.html","<div class=fixed-message-container ng-class=\"{\'active\': (vm.types[0].alerts.length > 0) || (vm.types[1].alerts.length > 0)}\" data-test=snapFixedMessage_container><div id=\"{{type.header + \'DIV\'}}\" ng-class=\"[type.messageType + \'-message\', {\'active\':type.alerts.length > 0}]\" ng-repeat=\"type in vm.types track by $index\" data-test=snapFixedMessage_message_type{{$index}}><span class=message-icon data-test=snapFixedMessage_message_icon></span> <strong ng-bind=type.header ng-if=type.header data-test=snapFixedMessage_header></strong> <a href=# class=close ng-click=vm.clearAll(type.messageType); data-test=snapFixedMessage_clearAllATag></a><div class=message ng-repeat=\"alert in type.alerts track by $index\" ng-bind-html=alert.message data-test=snapFixedMessage_alert_number{{$index}}></div></div></div>");
    $templateCache.put("components/feedback/messaging/snapInlineMessage.html","<div ng-class=\"[(vm.messageType + \'-message\')]\" ng-show=\"vm.isVisible && !vm.isCleared\" data-test=snapInlineMessage_{{vm.messageType}}_container><a href class=close ng-if=vm.isDismissible ng-click=vm.hideParent($event) data-test=snapInlineMessage_close></a> <span class=message-icon data-test=snapInlineMessage_icon></span> <strong ng-bind=vm.header ng-if=vm.header data-test=snapInlineMessage_header></strong><ng-transclude></ng-transclude></div>");
    $templateCache.put("components/feedback/progressIndicator/progressIndicator.html","<div class=progress-indicator data-test=snapProgressIndicator_Wrap><div class=progress-bg data-test=snapProgress_BG><div class=progress-bar ng-style=\"{ width: vm.progress + \'%\' }\" data-test=snapProgress_Bar></div></div><span class=value data-test=snapProgress_Value>{{vm.progress + \'%\'}}</span></div>");
    $templateCache.put("components/feedback/spinner/spinner.html","<div class=spinner-container data-test=snapSpinner_Container><svg class=status-spinner><circle class=spinner-path cx=50 cy=50 r=10></circle><circle class=spinner-color cx=50 cy=50 r=10 stroke-miterlimit=10></circle></svg></div>");
    $templateCache.put("components/forms/comboBox/snapComboBox.html","<label for={{vm.id}}_value ng-if=vm.label>{{vm.label}} <abbr ng-show=vm.fieldRequired title=Required>*</abbr></label><div class=\"auto-suggest row\" ng-init=vm.init()><input id={{vm.id}} name={{vm.id}} ng-model=vm.searchStr ng-disabled=vm.disableInput type={{type}} placeholder={{vm.placeholder}} maxlength={{vm.maxLength}} ng-focus=vm.inputFocusHandler() ng-change=vm.inputChangeHandler() ng-keydown=vm.inputKeydownHandler($event) ng-keyup=vm.inputKeyupHandler($event) ng-blur=vm.inputBlurHandler($event) ng-class=\"{\'unselected-input\': !vm.selectedObject, \'invalid-input\': vm.isInvalid}\" ng-required=vm.fieldRequired validate-on=blur autocapitalize=none autocorrect=off autocomplete=off ng-pattern=vm.pattern title={{vm.title}} data-test=\"{{\'snap\' + vm.id}}\" invalid-message=\"\'Valid Selection Required\'\"><ng-transclude></ng-transclude><ul id={{vm.id}}_dropdown ng-show=vm.showDropdown ng-class=\"{\'display-block\': vm.showDropdown, \'searching\': vm.searching}\" data-test=\"{{\'snap\' + vm.name}}\"><li class=searching ng-show=vm.searching><div snap-status-spinner spinner-key=\"{{vm.id + \'Spinner\'}}\" class=spinner-lightbox is-nested=true wire-intercept=false delay-in=0></div></li><li class=no-results ng-show=vm.noResultsFound ng-bind-html=vm.textNoResults></li><li ng-repeat=\"result in vm.results\" ng-click=vm.rowClickHandler() ng-mouseenter=vm.rowMouseEnterHandler($index) ng-mouseleave=vm.rowMouseLeaveHandler($index) ng-class=\"{\'selection\': $index == vm.currentIndex}\"><span ng-repeat=\"field in result.formattedFields track by $index\"><span class=text-medium ng-if=\"field != \'\'\" ng-bind-html=field ng-class=vm.resultClasses[$index]></span><br></span></li></ul></div>");
    $templateCache.put("components/forms/dropDownSelect/snapDropDownSelect.html","<div class=\"multi-line-select z-index-200\" ng-keydown=vm.keyUpFunction($event) data-test=snapMultiLineSelectDropDown ng-class=\"{\'multi-select\': vm.isMulti}\"><snap-info-box id=dropDownInfoBox icon-class ng-click=vm.toggleActive($event)><div><div ng-repeat=\"string in vm.tooltipString track by $index\" ng-if=vm.tooltipString.length ng-bind=string></div></div></snap-info-box><span ng-mouseenter=vm.activateTooltip() ng-mouseleave=vm.activateTooltip()><input type=text ng-disabled=true ng-model=vm.selectedOptionConcat ng-class=vm.inputClass data-test=snapMultiLineSelectDropDown></span> <a href=# class=select-button ng-click=vm.toggleActive($event) data-test=snapMultiLineATag><span class=icon></span></a><ul ng-class=\"[{\'display-block\': vm.dropDownActive}, vm.dropDownClass]\" id=multiLineSelectDropDown><li ng-repeat=\"option in vm.options track by $index\" ng-click=vm.selectOption(option); ng-class=\"{\'yellow-bg-tint-75\':option === vm.selectedOption, \'yellow-bg-tint-90\':(vm.selectedIndex === $index) && (vm.selectedOption !== option)}\" data-test=\"{{snapMultiSelectOption + $index}}\"><input type=checkbox ng-model=option.isSelected ng-if=vm.isMulti id=\"{{\'checkbox\' + $index}}\"><div ng-repeat=\"line in option.lines track by $index\" ng-if=!vm.isMulti><span ng-class=vm.getClass($index) ng-bind=line></span><br></div><label ng-if=vm.isMulti for=\"{{\'checkbox\' + $index}}\"><span ng-repeat=\"line in option.lines track by $index\"><span ng-class=vm.getClass($index) ng-bind=line></span><br></span></label></li></ul></div>");
    $templateCache.put("components/forms/dropDownSelect/snapMultiLineSelect.html","<label>Multi-select</label><div class=\"multi-line-select multi-select\"><input type=text><a href=# class=select-button><span class=icon></span></a><ul class=\"width-25em display-block\"><li><input type=checkbox id=checkbox1> <label for=checkbox1><span class=text-size-150>Alex Lovato</span><br><span class=text-light>alovato@arrow.com</span></label></li><li><input type=checkbox id=checkbox2> <label for=checkbox2><span class=text-size-150>Robyn Brechun</span><br><span class=text-light>rbrechun@arrow.com</span></label></li></ul></div>");
    $templateCache.put("components/forms/fileUpload/snapFileUpload.html","<div id={{::vm.id}} class ng-class=\"{\'file-upload\': !vm.isStacked, \'file-upload-stacked\': vm.isStacked}\" data-test=snapFileUpload_Wrap><div class=upload-area><div class=upload-box ngf-drop ngf-select ng-model=vm.files ngf-drag-over-class=\"\'drag-over\'\" ngf-multiple=true ngf-allow-dir=true accept={{::vm.acceptFilter}} ngf-pattern=\"\'{{::vm.acceptFilter}}\'\" ng-change=vm.uploadFiles() ng-show=vm.isUploadBoxShown data-test=snapFileUpload_UploadBox><div class=squared-content data-test=snapFileUpload_DragToUpload><span class=\"fa fa-upload\"></span><h4>Drag Files to Upload</h4></div></div><button class=secondary-button ngf-select ng-model=vm.files ngf-multiple=true ngf-allow-dir=true accept={{::vm.acceptFilter}} ngf-accept=\"\'{{::vm.acceptFilter}}\'\" ng-change=vm.uploadFiles() data-test=snapFileUpload_Browse>Browse</button></div><div class=upload-item-list ng-show=vm.isFileListShown ng-class=\"{\'{{::vm.listClasses}}\': vm.listClasses !== undefined}\" data-test=snapFileUpload_ItemsWrap><ul class=item-list-bordered data-test=snapFileUpload_ItemsListUL><li ng-repeat=\"fileUpload in vm.fileUploads track by $index\" data-test=snapFileUpload_ItemsListLI{{$index}}><span class=\"file-type fa fa-{{::fileUpload.fileType}}\" data-test=snapFileUpload_Item{{$index}}Filetype></span> <span class=file-name data-test=snapFileUpload_Item_Name><a href=javascript:void(0); class=file-delete title=\"Delete File\" ng-click=vm.deleteFile(fileUpload) ng-show=\"!fileUpload.complete || vm.isRemoveable\"><span class=icon></span></a> <span class=\"display-block truncate\"><a href=javascript:void(0); ng-click=vm.downloadFile(fileUpload)>{{::fileUpload.fileObj.name}}</a></span> <span class=text-light>{{::fileUpload.fileSize}}</span><snap-progress-indicator total=fileUpload.totalFileSize current=fileUpload.transferred ng-show=!fileUpload.complete></snap-progress-indicator></span></li></ul></div></div>");
    $templateCache.put("components/forms/validation/snapFormErrors.html","<div class=\"error-message margin-bottom-2x\" ng-show=vm.checkForErrors() data-test=snapFormErrors_Wrap><span class=message-icon data-test=snapFormErrors_Icon></span> <strong data-test=snapFormErrors_Title>Form Validation Errors</strong><div ng-repeat=\"form in vm.forms track by $index\" ng-show=vm.showFormErrors(form) data-test=snapFormErrors_Form_Number_{{$index}}><ul ng-repeat=\"(key, errors) in form.$error track by $index\" ng-hide=\"key === \'valid\'\" class=margin-top-none data-test=snapFormValidationErrorsUl><li ng-repeat=\"e in errors\"><a ng-click=\"vm.focusInput(e.$name, form.$name, form)\" href data-test=snapFormValidationErrorsLi>{{ vm.getTitle(e.$name) }}</a>: {{ vm.getMessage(key, e.$name) }}</li></ul></div></div>");
    $templateCache.put("components/navigation/breadcrumbs/snapBreadCrumbs.html","<ol class=breadcrumbs data-test=snapBreadcrumbs><li ng-repeat=\"crumb in breadcrumbs track by $index\" ng-class=\"{ active: $last }\" data-test=snapBreadcrumbsLI_{{$index}}><a ui-sref=\"{{ crumb.route }}\" ng-if=!$last data-test=\"{{\'snapBreadcrumb\' + crumb}}\">{{ crumb.displayName }}&nbsp;</a><span ng-show=$last>{{ crumb.displayName }}</span></li></ol>");
    $templateCache.put("components/page-layout/collapsible-content-blocks/collapsibleBlock.html","<section class=collapsible-content-blocks data-test=snapCollapsibleContentBlocks_Wrap><section class=content-block ng-class=\"{\'active\': isActive, \'padding-none\': disablePadding, \'border-bottom-none\': disableBorder}\" data-test=snapCollapsibleContentBlocks_Section><div bind-html-compile=htmlContent[0] ng-if=\"htmlContent && htmlContent[0]\" data-test=snapCollapsibleContentBlocks_Top_Content></div><header class=content-block-header ng-click=\"isActive = !isActive\" data-test=snapCollapsibleContentBlocks_Header><div class=content-block-icon><span class=icon></span></div><div class=content-block-title bind-html-compile=htmlContent[1] ng-if=\"htmlContent && htmlContent[1]\" data-test=snapCollapsibleContentBlocks_Alt_Content></div></header><article class=content-block-body ng-class=\"{\'padding-none\': disablePadding}\" data-test=snapCollapsibleContentBlocks_Body_Content><ng-transclude></ng-transclude></article></section></section>");
    $templateCache.put("components/page-layout/global-header/snapGlobalHeader.html","<ul class=header-color-bar data-test=snapGlobalHeader_ColorBar><li></li><li></li><li></li><li></li><li></li></ul><div class=header-wrap data-test=snapGlobalHeader_Wrap><header role=banner class=\"global-header clearfix\"><a class=navicon><span></span></a><div class=\"global-branding hidden-xs col-sm-6 col-md-4 col-lg-3\"><div class=logo data-test=snapGlobalHeader_Logo><h1 ng-if=!vm.logoUrl>My Arrow</h1><h2 ng-if=!vm.logoUrl>Enterprise Computing Solutions NA</h2><img ng-src={{vm.logoUrl}} ng-if=vm.logoUrl data-test=snapGlobalHeader_Logo_IMG></div></div><div class=\"global-navigation col-sm-10 col-md-12 col-lg-13\" ng-class=\"{\'alt-nav\': vm.isGlobalNavMegaMenu}\" data-test=snapGlobalHeader_Nav&Utilities_Wrap><snap-global-nav tabs=vm.globalNavTabs is-mega-menu=vm.isGlobalNavMegaMenu nav-class={{vm.globalNavClass}}></snap-global-nav><snap-utility-nav app-settings-tabs=vm.appSettingsTabs user-settings-tabs=vm.userSettingsTabs user-name=vm.userName on-sign-out=vm.onSignOut()></snap-utility-nav></div><div class=\"product-header col-sm-16 col-md-12 col-lg-13\"><div class=\"product-title col-sm-6 col-md-7 col-lg-9\" data-test=snapGlobalHeader_ProductTitle><h1 ng-bind=vm.productTitle></h1></div><nav class=\"product-navigation col-sm-10 col-md-9 col-lg-7\" data-test=snapGlobalHeader_ProductTabs><ul data-test=snapGlobalHeader_ProductTabsUL><li ng-repeat=\"tab in vm.productTabs track by $index\" ng-class=\"{ active: vm.activeProductPage === $index }\" ng-click=\"vm.activeProductPage = $index\" ui-sref-active=active data-test=snapGlobalHeader_ProductTab_Number_{{$index}}><a ui-sref={{tab.srefTarget}} ng-if=tab.srefTarget><span ng-class=tab.class></span> {{tab.name}} <span class=count-badge ng-show=tab.count>{{tab.count}}</span></a> <a ng-href={{tab.target}} ng-if=tab.target><span ng-class=tab.class></span> {{tab.name}} <span class=count-badge ng-show=tab.count>{{tab.count}}</span></a></li></ul></nav></div></header></div>");
    $templateCache.put("components/page-layout/global-navigation/snapGlobalNavigation.html","<nav class={{vm.navClass}} data-test=snapGlobalNavigation_Nav><ul data-test=snapGlobalNavigation_Tabs><li><a href><span class=\"nav-icon fa-home\"></span></a></li><li class=drop-down-menu ng-repeat=\"tab in vm.groupedMegaMenuTabs track by $index\" ng-class=\"{\'active\': vm.activeTab === tab.name}\" data-test=snapGlobalNavigation_Tab_Number_{$index}}_Li><a href ng-click=vm.activateTab(tab.name) data-test=snapGlobalNavigation_Tab_Number_{$index}}_ATag><span class=\"nav-icon fa-leaf\"></span><u><span class=no-wrap>{{vm.removeHTML(tab.name)}} <span class=icon></span></span></u></a><div class=mega-menu ng-if=\"vm.isMegaMenu && (vm.activeTab === tab.name)\" data-test=snapGlobalNavigation_MegaMenu><div class=row ng-repeat=\"group in tab.groups track by $index\" data-test=snapGlobalNavigation_MegaMenu_Group_Number_{{$index}}><div class=\"col-sm-8 col-md-4 padding-all\" ng-repeat=\"subNode in group.nodes track by $index\"><h6>{{vm.removeHTML(subNode.name)}}</h6><ul><li ng-repeat=\"subSubNode in subNode.nodes\"><a ng-href={{subSubNode.target}}>{{vm.removeHTML(subSubNode.name)}}</a><ul ng-repeat=\"subSubSubNode in subSubNode.nodes\"><li><a ng-href={{subSubSubNode.target}}>{{vm.removeHTML(subSubSubNode.name)}}</a><ul ng-repeat=\"subSubSubSubNode in subSubSubNode.nodes\"><li><a ng-href={{subSubSubSubNode.target}}>{{vm.removeHTML(subSubSubSubNode.name)}}</a></li></ul></li></ul></li></ul></div></div></div><ul ng-if=!vm.isMegaMenu data-test=snapGlobalNavigation_SingleLevelMenu><li ng-repeat=\"node in tab.nodes track by $index\" data-test=snapGlobalNavigation_SingleLevel_Li_Number_{{$index}}><a ng-href={{node.target}} data-test=snapGlobalNavigation_SingleLevel_Li_Target_{{$index}}><span class=\"nav-icon fa-rocket\"></span> {{vm.removeHTML(node.name)}}</a></li></ul></li></ul></nav>");
    $templateCache.put("components/page-layout/global-utility-nav/snapUtilityNav.html","<div class=\"user-account hidden-xs col-sm-16 col-md-7\"><ul><li class=drop-down-menu ng-class=\"{\'active\': vm.activeTab === \'appSettings\'}\" ng-if=\"vm.appSettingsTabs && vm.appSettingsTabs.length\"><a href ng-click=\"vm.activateTab(\'appSettings\')\"><span class=\"fa fa-cogs\"></span></a><ul><li ng-repeat=\"node in vm.appSettingsTabs\"><a ng-href={{node.target}}>{{node.name}}</a></li></ul></li><li class=\"drop-down-menu width-70-percent\" ng-class=\"{\'active\': vm.activeTab === \'userSettings\'}\" ng-if=\"vm.userSettingsTabs && vm.userSettingsTabs.length || vm.onSignOut\"><div class=\"display-block truncate width-100-percent\"><a href ng-click=\"vm.activateTab(\'userSettings\')\" class=margin-right-half><span class=\"fa fa-user\"></span></a> Welcome, {{vm.userName}}</div><ul><li ng-repeat=\"node in vm.userSettingsTabs\"><a ng-href={{node.target}}>{{node.name}}</a></li><li ng-if=vm.onSignOut><a href ng-click=vm.onSignOut()>Logout</a></li></ul></li></ul></div>");
    $templateCache.put("components/page-layout/lightbox/snapLightbox.html","<div esc-key id={{vm.boxId}} ng-class=\"[((vm.boxType === \'right\' && !vm.rightClass) ? \'col-xs-16 col-sm-8 col-md-4\' : \'\'), ((vm.boxType === \'top\') && !vm.isConfirm ? \'top-lightbox\' : \'\'), (vm.boxType === \'right\' ? \'right-lightbox\' : \'\'), (!vm.boxType ? \'top-lightbox\' : \'\'), (vm.isModal ? \'modal-lightbox\' : \'\'), (vm.rightClass ? vm.rightClass : \'\'), (vm.isConfirm ? \'confirmation-lightbox\' : \'\')]\"><div id=shadeDiv class=lightbox-shade></div><span data-test=snapCloseLightbox class=\"icon close-lightbox\" snap-lightbox-close ng-hide=vm.hideX></span><h2 ng-bind=vm.boxTitle></h2><ng-transclude></ng-transclude></div>");
    $templateCache.put("components/search/searchCriteria/snapSearchCriteria.html","<div class=search-criteria ng-show=\"vm.terms && vm.terms.length\"><label class=base-label>Search For:</label> <span class=search-term ng-repeat=\"term in vm.terms track by $index\"><label class=base-label ng-show=term.label data-test=\"{{snapSearchLabel + $index}}\">{{term.label}}:</label> {{term.label ? term.term : term}} <a href title=\"Clear Search Term\" ng-click=\"vm.clearTerm($index, term)\" data-test=\"{{snapClearSearchTermButton + $index}}\"><span class=icon></span></a></span> <a href ng-click=vm.clearAllTerms(); ng-show=\"vm.terms && vm.terms.length\" data-test=snapSearchTermClearAllButton>Clear All</a></div>");
    $templateCache.put("components/search/searchFilters/baseSearchFilter.html","<section class=filters><header class=filter-header ng-if=vm.header><h4>{{vm.header}}</h4></header><article ng-class=\"{\'filter-section\': (vm.sections && (vm.sections.length > 1))}\" ng-repeat=\"section in vm.sections\"><h5 ng-if=\"section.sectionTitle !==\'\'\">{{section.sectionTitle}}</h5><ul class={{section.style}}><li ng-repeat=\"filter in section.filters\"><span ng-if=filter.color class=\"filter-color {{filter.color}}\"></span> <label class=truncate><span><input type=checkbox ng-model=filter.isSelected ng-change=vm.onSelectionChange() data-test=\"{{\'snapSearchFilter\' + filter.option}}\"></span> {{filter.option}}{{filter.count ? \' (\' + filter.count + \')\' : \'\'}}</label></li></ul></article></section>");
    $templateCache.put("components/search/searchFilters/squareSearchFilter.html","<header class=filter-header ng-if=vm.header><h4>{{vm.header}}</h4></header><section class=filters><ul class=linear-list ng-repeat=\"section in vm.sections\"><li ng-repeat=\"filter in section.filters\" ng-if=filter.color class=\"square-filter {{filter.color}}\"><input type=checkbox ng-model=filter.isSelected ng-change=vm.onSelectionChange()><div class=filter-content ng-click=\"filter.isSelected = !filter.isSelected\"><span class=text-light>{{filter.count}}</span> <label>{{filter.option}}</label></div></li></ul></section>");
    $templateCache.put("components/tables/grid/snapGriddiv.html","<div ng-class=vm.gridConfig.divClass data-test=snapGridDiv><div class=\"table-row table-header\" data-test=snapGridDiv_Header><div ng-repeat=\"gridColumn in vm.gridConfig.columnDefinitions\" bind-html-compile=gridColumn.displayName class=table-cell></div></div><div ng-transclude class=table-row-group data-test=snapGridDiv_TranscludedGridContent></div></div>");
    $templateCache.put("components/tables/grid/snapGridtable.html","<table class={{vm.gridConfig.tableClass}} data-test=snapGridTable><thead data-test=snapGridTable_Header><tr data-test=snapGridTable_Header_Row><th ng-repeat=\"gridColumn in vm.gridConfig.columnDefinitions\"><div bind-html-compile=gridColumn.displayName></div></th></tr></thead><tbody data-test=snapGridTable_Body><tr ng-repeat=\"gridRow in vm.gridConfig.data\" ng-hide=vm.gridConfig.isRowHidden(gridRow) ng-class=vm.gridConfig.getRowClass(gridRow)><td ng-repeat=\"gridColumn in vm.gridConfig.columnDefinitions\" data-th={{gridColumn.displayName}} ng-class=gridColumn.columnClass bind-html-compile=gridColumn.cellTemplate></td></tr></tbody></table>");
    $templateCache.put("components/tables/pagination/snapPagination.html","<div class=table-pagination ng-init=vm.init() id=\"{{vm.id + \'div\'}}\"><label>Results per page<select data-test=snapPaginationPageSize ng-model=vm.pageObject.currentPageSize ng-change=vm.pageSizeChanged(); ng-options=\"size for size in vm.pageSizes\"></select></label><ul><li data-test=snapPaginationFirstPageLi ng-click=vm.goToFirstPage() ng-disabled=\"vm.pageObject.currentPage === 1\"><a href=javascript:; title=\"First Page\" class=icon></a></li><li data-test=snapPaginationPrevPageLi ng-click=vm.goToPrevPage() ng-disabled=\"vm.pageObject.currentPage === 1\"><a href=javascript:; title=\"Previous Page\" class=icon ng-class=\"{\'disabled\': (vm.pageObject.currentPage === 1)}\"></a></li><li ng-click=vm.goToPage(1) ng-show=vm.showFirstPage><a href ng-bind=(1)></a></li><li class=ellipsis ng-show=vm.showFirstEllipsis><span class=icon></span></li><li ng-repeat=\"num in [6,5,4,3,2,1]\" ng-click=\"vm.goToPage(vm.pageObject.currentPage - num)\" ng-show=\"vm[\'showCurrentMinus\' + num]\"><a href ng-bind=\"(vm.pageObject.currentPage - num)\"></a></li><li data-test=snapPaginationCurrentPageLi class=active><a href ng-bind=vm.pageObject.currentPage></a></li><li ng-repeat=\"num in [1,2,3,4,5,6]\" ng-click=\"vm.goToPage(vm.pageObject.currentPage + num)\" ng-show=\"vm[\'showCurrentPlus\' + num]\"><a href ng-bind=\"(vm.pageObject.currentPage + num)\"></a></li><li class=ellipsis ng-show=vm.showLastEllipsis><span class=icon></span></li><li ng-click=vm.goToPage(vm.pageObject.lastPage) ng-show=vm.showLastPage><a href ng-bind=(vm.pageObject.lastPage)></a></li><li data-test=snapPaginationNextPageLi ng-click=vm.goToNextPage() ng-disabled=\"(vm.pageObject.currentPage === vm.pageObject.lastPage) || (vm.pageObject.lastPage === 0)\"><a href=javascript:; title=\"Next Page\" class=icon ng-class=\"{\'disabled\': (vm.pageObject.currentPage === vm.pageObject.lastPage) || (vm.pageObject.lastPage === 0)}\"></a></li><li data-test=snapPaginationLastPageLi2 ng-click=vm.goToLastPage() ng-disabled=\"vm.pageObject.currentPage === vm.pageObject.lastPage\"><a href=javascript:; title=\"Last Page\" class=icon></a></li></ul></div>");
    $templateCache.put("components/tables/sorting/snapSorting.html","<ul class=sorting ng-class=[vm.listClasses] ng-init=vm.init(); data-test=snapSortingUL id=\"{{vm.id + \'ul\'}}\"><li ng-repeat=\"category in vm.sortCategories\" ng-class=vm.getClass(category.name) data-test=\"{{\'snapSortingLi\' + category.name}}\"><a href ng-bind=category.name ng-click=\"vm.setActive(category.name, category.value)\"></a></li></ul>");
    $templateCache.put("components/page-layout/lightbox/confirmation/confirmation.html","<div id={{confirmCtrl.boxId}} class=\"modal-lightbox confirmation-lightbox\" data-test=snapConfirmationBox_{{confirmCtrl.boxId}}><div id=shadeDiv class=lightbox-shade data-test=snapConfirmation_box_shade></div><h2 ng-bind=confirmCtrl.boxTitle data-test=snapConfirmation_box_title></h2><ng-transclude></ng-transclude><div class=button-row data-test=snapConfirmation_box_buttons><button ng-repeat=\"button in confirmCtrl.buttonOptionsArray track by $index\" ng-class=button.class ng-click=button.callbackFn() snap-lightbox-close data-test=snapConfirmationBox_button{{$index}}>{{button.label}}</button></div></div>");}]);
(function() {
    'use strict';

    angular
        .module('tables')
        .directive('snapSorting', snapSorting);

    /**
     * Internal function that returns the snapSorting directive.
     * @returns {Object} the angular directive
     */
    function snapSorting() {
        return {
            restrict: 'EA',
            scope: {
                sortCategories: '=',
                listClasses: '@',
                id: '@',
                searchFunction: '&'
            },
            templateUrl: 'components/tables/sorting/snapSorting.html',
            controller: SortingCtrl,
            controllerAs: 'vm',
            bindToController: true
        };
    }

    /** @ngInject **/
    function SortingCtrl() {
        var vm = this;

        vm.setActive = setActive;
        vm.init = init;
        vm.getClass =  getClass;

        function init() {
            //init active category object
            vm.activeCategory = {};
            //only call this if not already selected?
            setActive(vm.sortCategories[0].name, vm.sortCategories[0].value, true);
        }

        function setActive(cat, val, calledFromInitFunction) {
            //if it's the same name, then toggle asc/desc
            if (vm.activeCategory.categoryName === cat) {
                vm.activeCategory.sort = (vm.activeCategory.sort === 'desc' ? 'asc' : 'desc');
            } else {
                //else set the name and then set descending
                vm.activeCategory.categoryName = cat;
                vm.activeCategory.categoryVal = val;
                vm.activeCategory.sort = 'desc';
            }
            if (!calledFromInitFunction) {
                executeSearch();
            }
        }

        function getClass(cat) {
            //test for current active category name against iteration, and check sorting asc/desc
            if (vm.activeCategory.categoryName === cat) {
                return (vm.activeCategory.sort === 'desc' ? 'descending' : 'ascending');
            }
        }

        function executeSearch() {
            //if there's a search function call it passing catName and sort type
            if (vm.searchFunction && vm.searchFunction()) {
                vm.searchFunction()(vm.activeCategory.categoryVal, vm.activeCategory.sort)
            }
        }
    }
})();
(function() {
    'use strict';
    //lightbox directive
    ConfirmationController.$inject = ["$document", "$element", "$timeout"];
    angular.module('pageLayout')
        .directive('snapConfirmationBox', confirmationBox);

    /* @ngInject */
    function confirmationBox() {
        var directive = {
            controller: ConfirmationController,
            controllerAs: 'confirmCtrl',
            transclude: true,
            scope: {
                boxId: '@',
                boxTitle: '@',
                boxType: '@',
                callbackOne: '&',
                callbackTwo: '&'
            },
            bindToController: true,
            restrict: 'E',
            templateUrl: 'components/page-layout/lightbox/confirmation/confirmation.html'
        };
        return directive;
    }

    /* @ngInject */
    function ConfirmationController($document, $element, $timeout) {
        var vm = this,
            actionArray = [
                {class: 'xz primary-button', label: 'Yes', callbackFn: vm.callbackOne},
                {class: 'tertiary-button', label: 'No', callbackFn: vm.callbackTwo}
            ],
            criticalArray = [
                {class: 'xz primary-button', label: 'OK', callbackFn: vm.callbackOne}
            ];
        vm.buttonOptionsArray = vm.boxType === 'action' ? actionArray : criticalArray;

        $document.on("keyup", function(event) {
                //scope.$apply(function() {
                if (event.keyCode == 13 && $element[0].getElementsByClassName('launch-lightbox').length) {
                    $timeout(function() {
                        $element[0].getElementsByClassName('xz primary-button')[0].click();
                    })
                }
            }
        );
    }
})();
(function() {
    'use strict';
    angular.module('services', []);
})();
(function() {
    'use strict';
    /**
     * arSessionStorageService
     *
     * The arSessionStorageService service provides wrapper functions for working with session storage.
     */
    snapSessionStorageService.$inject = ["snapStorageService"];
    angular
        .module('services')
        .factory('snapSessionStorageService', snapSessionStorageService);

    // Internal function that returns the sessionStorageService factory function.
    /* @ngInject */
    function snapSessionStorageService(snapStorageService) {
        return snapStorageService.session;
    }
})();
//(function() {
//    'use strict';
//    angular
//        .module('services')
//        .factory('arSharedService', arSharedService);
//
//    function arSharedService() {
//        var service = {
//            setNewPagination: setNewPagination
//        };
//
//        return service;
//
//        function setNewPagination(page, currentPage, totalPages) {
//            var i = 0,
//                count = 0,
//                limitTo = 5;
//
//            page.currentPage = currentPage;
//            page.lastPage = totalPages - 1;
//            page.totalPages = [];
//
//            //set the pagination to display only 5 pages
//            //center current page to the middle of pagination if possible
//            //current page starts from 0 as page 1
//            if (totalPages > limitTo) {
//                if (currentPage > 2 && currentPage < (totalPages - 2)) {
//                    i = currentPage - 2;
//                } else if (currentPage > (totalPages / 2)) {
//                    i = totalPages - limitTo;
//                }
//            }
//
//            while (i < totalPages) {
//                if (count === limitTo) {
//                    break;
//                }
//
//                page.totalPages.push(i);
//
//                count++;
//                i++;
//            }
//        }
//    }
//})();
(function() {
    'use strict';
    /**
     * storageService
     *
     * The storageService service provides wrapper functions for working with session and local storage.
     */
    storageService.$inject = ["arUtil"];
    angular
        .module('services')
        .factory('snapStorageService', storageService);

    /**
     * Internal function that returns the storageService factory function.
     * @param {Object} util
     * @returns {Object} the angular factory function
     * @ngInject
     */
    function storageService(arUtil) {

        var service = {
            session: getService('session'),
            local: getService('local')
        };

        return service;

        /////////////////////

        /**
         * Returns a wrapper around sessionStorage or localStorage.
         * @param {String} type the type of storage wrapper to return
         * @returns {Object}
         */
        function getService(type) {
            var storage = (type === 'session' ? sessionStorage : localStorage);

            var service = {
                setItem: setItem,
                setItems: setItems,
                getItem: getItem,
                removeItem: removeItem,
                clear: clear,
                containsKey: containsKey
            };

            return service;

            /////////////////////

            /**
             * Adds an item to storage.
             * @param {String} key
             * @param {String|Object} value
             * @returns {Boolean} true if the value was successfully stored, otherwise false
             */
            function setItem(key, value) {
                if (!arUtil.isString(key) || arUtil.isEmpty(key)) {
                    return false;
                }

                if (arUtil.isObject(value) || arUtil.isArray(value)) {
                    storage.setItem(key, JSON.stringify(value));
                } else {
                    storage.setItem(key, value);
                }
                return true;
            }

            /**
             * Add multiple items to session storage. The items array must consist of objects that have
             * either a 'key' or 'id' property (for the item key) and a 'value' property (for the value).
             * @param {Object[]} items
             */
            function setItems(items) {
                angular.forEach(items, function (item) {
                    setItem(item.key || item.id, item.value);
                });
            }

            /**
             * Gets an item from session storage.
             * @param {String} key
             * @returns {*}
             */
            function getItem(key) {
                var value;

                if (!arUtil.isString(key) || arUtil.isEmpty(key)) {
                    return null;
                }

                value = storage.getItem(key);
                try {
                    //try to convert to object
                    return JSON.parse(value);
                }
                catch (err) {
                }

                return value;
            }

            /**
             * Removes an item from session storage.
             * @param {String} key
             * @returns {Boolean} true if the value was successfully removed, otherwise false
             */
            function removeItem(key) {
                if (!arUtil.isString(key) || arUtil.isEmpty(key)) {
                    return false;
                }
                storage.removeItem(key);
                return true;
            }

            /**
             * Clears all values from session storage.
             */
            function clear() {
                storage.clear();
            }

            /**
             * Determines if the specified key is in session storage.
             * @param {String} key
             * @returns {Boolean}
             */
            function containsKey(key) {
                var i, len;

                if (!arUtil.isString(key) || arUtil.isEmpty(key)) {
                    return false;
                }

                for (i = 0, len = storage.length; i < len; i++) {
                    if (storage.key(i) === key) {
                        return true;
                    }
                }
                return false;
            }
        }
    }
})();
(function() {
    'use strict';
    angular
        .module('services')
        .factory('arUtil', util);

    function util() {

        var service = {
            isObject: isObject,
            isFunction: isFunction,
            isString: isString,
            isBoolean: isBoolean,
            isNumber: isNumber,
            isArray: isArray,
            isDefined: isDefined,
            isEmpty: isEmpty,
            getOwnProperties: getOwnProperties,
            formatCurrency: formatCurrency,
            round: round,
            pathJoin: pathJoin,
            detokenize: detokenize,
            countProperties: countProperties
        };

        return service;

        /////////////////////

        /**
         * Determines if the given value is an object.
         * @param {*} val
         * @returns {Boolean}
         */
        function isObject(val) {
            return typeof val === 'object' && !Array.isArray(val);
        }

        /**
         * Determines if the given value is a function.
         * @param {*} val
         * @returns {Boolean}
         */
        function isFunction(val) {
            return val && Object.prototype.toString.call(val) === '[object Function]';
        }

        /**
         * Determines if the given value is a string.
         * @param {*} val
         * @returns {Boolean}
         */
        function isString(val) {
            return typeof val === 'string';
        }

        /**
         * Determines if the given value is a boolean.
         * @param {*} val
         * @returns {Boolean}
         */
        function isBoolean(val) {
            return typeof val === 'boolean';
        }

        /**
         * Determines if the given value is a number.
         * @param {*} val
         * @returns {Boolean}
         */
        function isNumber(val) {
            return typeof val === 'number';
        }

        /**
         * Determines if the given value is an array.
         * @param {*} val
         * @returns {Boolean}
         */
        function isArray(val) {
            return Array.isArray(val);
        }

        /**
         * Determines if the given value is defined (e.g. not undefined, null or an empty string).
         * @param {*} val
         * @returns {Boolean}
         */
        function isDefined(val) {
            return (val !== null && val !== undefined && val !== '');
        }

        /**
         * Determines if the given value is empty or consists only of whitespace characters.
         * @param {String|Array|Object} val
         * @returns {Boolean}
         */
        function isEmpty(val) {
            var str;

            if (!val) {
                return true;
            }

            if (isString(val)) {
                return val.trim().length === 0;
            } else if (isArray(val)) {
                return val.length === 0;
            } else if (isObject(val)) {
                str = JSON.stringify(val);
                return (str === '{}' || str === '[]');
            }
            return false;
        }

        /**
         * Retrieves an array containing the names of all properties owned by the given object.
         * @param {Object} obj
         * @returns {Array}
         */
        function getOwnProperties(obj) {
            var prop, result = [];

            if (isObject(obj)) {
                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        result.push(prop);
                    }
                }
            }
            return result;
        }
        /**
         * Rounds and formats a number to a US currency value.
         * @param {Number} num the number to convert to a currency value
         * @param {Number} places the number of decimal places to round to
         * @returns {String} the rounded currency value
         */
        function formatCurrency(num, places) {
            return '$' + num.toFixed(places).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }

        /**
         * Rounds a number to the specified number of decimal places.
         * @param {Number} num the number to round
         * @param {Number} places the number of decimal places to round to
         * @returns {Number} the rounded number
         */
        function round(num, places) {
            if (!places || places < 0) {
                return Math.round(num);
            }
            var m = Math.pow(10, places);
            return Math.round(num * m) / m;
        }

        /**
         * Joins two or more parts of a path.
         * @param {string[]} parts the parts of the path to join
         * @param {string=} sep the separator to use (default: '/')
         * @returns {string} the joined path
         */
        function pathJoin(parts, sep) {
            var separator = sep || '/';
            return parts.map(function(path) {
                if (path[0] === separator) {
                    path = path.slice(1);
                }
                if (path[path.length - 1] === separator) {
                    path = path.slice(0, path.length - 1);
                }
                return path;
            }).join(separator);
        }

        /**
         * Replaces named tokens (surrounded by curly braces) with values from the given map.
         * @param {string} text the tokenized string
         * @param {object} valueMap the map containing token values
         * @returns {string}
         */
        function detokenize(text, valueMap) {
            var prop;
            for (prop in valueMap) {
                if (valueMap.hasOwnProperty(prop)) {
                    text = text.replace('{' + prop + '}', valueMap[prop]);
                }
            }
            return text;
        }

        /**
         * Returns the number of properties (e.g. keys) in an object.
         * @param {object} obj
         * @returns {number}
         */
        function countProperties(obj) {
            var prop, count;

            count = 0;
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    count++;
                }
            }
            return count;
        }
    }
})();
(function() {
    'use strict';

    //TODO: add unit tests

    /**
     * notificationService
     *
     * The notificationService service provides a central service for submitting user notifications.
     */
    MessageService.$inject = ["$timeout"];
    angular
        .module('feedback')
        .factory('snapMessageService', MessageService);

    /**
     * Internal function that returns the notificationService factory function.
     * @returns {Object} the angular factory function
     * @ngInject
     */
    function MessageService($timeout) {

        var seq = 0;

        var service = {
            successAlerts: [],
            errorAlerts: [],
            addAlert: addAlert,
            removeAlert: removeAlert
        };

        return service;

        /////////////////////

        /**
         * Adds an alert to the end of the notification list.
         * @param {String} message the alert message
         * @param {String} type the type of alert to add (i.e. 'warning', 'success')
         * @param {String=} uniqueId the unique identifier - if set, only one alert will exist with this identifier at
         *        a time; if an alert is added and one already exists with the same uniqueId, the existing one will
         *        be removed
         * @returns {Number} the id of the newly added alert
         */
        function addAlert(message, type, uniqueId) {
            /* jshint validthis:true */
            var
                i,
                len,
                alert;
            if ((type.toLowerCase() !== 'error') && (type.toLowerCase() !== 'success')) {
                type = 'error';
                console.log('Defaulting to error type. Please pass only error or ')
            }

            alert = {
                message: message,
                uniqueId: uniqueId,
                type: type,
                created: new Date(),
                id: seq++
            };

            if (uniqueId !== undefined && service[type + 'Alerts'].length > 0) {
                var existing = service[type + 'Alerts'].filter(function(alert) {
                    return alert.uniqueId === uniqueId;
                });
                for (i = 0, len = existing.length; i < len; i++) {
                    removeAlert(existing[i].id, existing[i].type);
                }
            }
            service[type + 'Alerts'].push(alert);
            $timeout(function() {
                removeAlert(alert.id, type);
            }, type === 'error' ? 5000 : 10000);
            return alert.id;
        }

        /**
         * Removes an alert from the notification list.
         * @param {Number} id the id of the alert to remove
         * @param {Type} type of the alert to remove
         * @returns {Boolean} true if the alert was found and removed, false if the alert does not exist
         */
        function removeAlert(id, type) {
            /* jshint validthis:true */
            var i, len, index;

            index = -1;

            for (i = 0, len = service[type + 'Alerts'].length; i < len; i++) {
                if (service[type + 'Alerts'][i].id === id) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                service[type + 'Alerts'].splice(index, 1);
                return true;
            }
            return false;
        }
    }

})();

(function() {
    'use strict';

    //TODO: add unit tests

    snapSpinnerService.$inject = ["$rootScope"];
    angular
        .module('feedback')
        .factory('snapSpinnerService', snapSpinnerService);

    /* @ngInject */
    function snapSpinnerService($rootScope) {
        var spinners = {};

        var config = {
            mainSpinner: 'main-spinner',
            noSpinner: 'no-spinner',
            start: start,
            stop: stop
        };

        return config;

        /////////////////////

        function start(key) {
            if (spinners[key] === undefined) {
                spinners[key] = 0;
            }
            spinners[key]++;
            $rootScope.$broadcast('us-spinner:spin', key);
        }

        function stop(key) {
            spinners[key]--;
            if (spinners[key] === 0) {
                $rootScope.$broadcast('us-spinner:stop', key);
            }
        }
    }
})();

(function () {
    'use strict';

    //TODO: add unit tests

    /**
     * fileUploadService
     *
     * The fileUploadService service provides a central service for uploading files to GFU.
     */
    FileUploadService.$inject = ["Upload", "$timeout", "$rootScope", "snapMessageService", "config", "$http"];
    angular
        .module('services')
        .factory('snapFileUploadService', FileUploadService);

    /**
     * Internal function that returns the fileUploadService factory function.
     * @returns {Object} the angular factory function
     * @ngInject
     */
    function FileUploadService(Upload, $timeout, $rootScope, snapMessageService, config, $http) {

        var service = {
            fileUploads: {},
            baseSvc: '/common/fileUpload/api/v1/files',
            deleteFile: deleteFile,
            downloadFile: downloadFile,
            startUpload: startUpload,
            uploadHandler: uploadHandler
        };

        return service;

        /////////////////////

        /**
         * Fetch a file given a file ID.
         * @param {String} file ID to download
         */
        function downloadFile(fileId) {
            $http.get(config.wlsUrl + this.baseSvc + '/' + fileId, {withCredentials: true});
        }

        /**
         * Send delete request for given file ID.
         * @param {String} file ID to delete
         */
        function deleteFile(elementId, file) {
            if (file.complete) {
                // file upload finished
                $http.delete(config.wlsUrl + this.baseSvc + '/' + file.fileId, {withCredentials: true});
            }
            this.fileUploads[elementId].files = this.fileUploads[elementId].files.filter(function (el) {
                return el.fileId !== file.fileId;
            });
        }

        /**
         * Begins an upload for a list of files given a particular element ID.
         * @param {String} element ID - used for storing status of multiple file upload directives
         * @param {String} template ID - the template ID obtained from the GFU service
         * @param {Array} array of File objects to upload
         */
        function startUpload(elementId, templateId, files) {

            if (typeof this.fileUploads[elementId].files === undefined) {
                this.fileUploads[elementId].files = [];
            }

            for (var i = 0; i < files.length; i++) {

                if (files[i].size > this.fileUploads[elementId].maxSize) {
                    snapMessageService.addAlert('File ' + files[i].name + ' is too large.', 'error');
                } else {

                    var fileId = 'tmp-' + this.fileUploads[elementId].files.length;
                    files[i].complete = false;
                    files[i].transferred = 0;
                    this.fileUploads[elementId].files.push({
                        fileObj: files[i],
                        fileSize: binarySize(files[i].size),
                        fileId: fileId,
                        complete: files[i].complete,
                        fileType: getFileType(files[i].type),
                        transferred: files[i].transferred,
                        totalFileSize: files[i].size
                    });

                    this.uploadHandler(this.fileUploads[elementId].files[this.fileUploads[elementId].files.length - 1], templateId, config.wlsUrl + this.baseSvc);
                }
            }
        }

        function uploadHandler(file, templateId, baseUrl) {
            file.upload = Upload.upload({
                url: baseUrl,
                data: {file: file.fileObj, templateId: templateId},
                withCredentials: true
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    file.fileId = response.data.fileId;
                    $rootScope.$broadcast('snapFileUploadComplete', file.result);
                });
            }, function (response) {
                if (response.status > 0)
                    $rootScope.$broadcast('snapFileUploadFailure', response.status, response.data);
            }, function (evt) {
                file.transferred = evt.loaded;
                file.complete = (file.transferred === evt.total);
            });
        }

        function getFileType(mimeType) {
            var retval;

            switch (mimeType) {
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                case 'application/vnd.ms-excel':
                    retval = 'file-excel-o';
                    break;
                case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                case 'application/vnd.ms-powerpoint':
                    retval = 'file-powerpoint-o';
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                case 'application/msword':
                    retval = 'file-word-o';
                    break;
                case 'application/pdf':
                    retval = 'file-pdf-o';
                    break;
                case 'application/x-zip-compressed':
                case 'application/x-gzip':
                    retval = 'file-archive-o';
                    break;
                case 'image/jpeg':
                case 'image/png':
                    retval = 'file-image-o';
                    break;
                case 'text/plain':
                    retval = 'file-text-o';
                    break;
                default:
                    retval = 'file-o';
                    break;
            }
            return retval;
        }

        function binarySize(size) {
            var suffixes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

            var suffixCtr = 0;
            while (size > 1000) {
                size /= 1000;
                suffixCtr++;
            }

            return size.toFixed(0) + suffixes[suffixCtr];
        }
    }

})();

(function() {
    'use strict';
    angular.module('services')
        .service('snapFormErrorsService', snapFormErrorsService);

    /* @ngInject */
    function snapFormErrorsService() {
        var service = {
            errors: []
        };

        return service;
    }
})();
(function() {
    'use strict';
    angular.module('services')
        .service('snapHeaderService', snapHeaderService);

    /* @ngInject */
    function snapHeaderService() {
        var service = {
            getHeaderData: getHeaderData,
            getUserData: getUserData,
            getAppData: getAppData,
            data: {
                userSettingsData: [],
                appSettingsData: [],
                globalNavData: []
            }
        };

        function getHeaderData() {
            throw 'Please rewrite this method before calling.';
        }

        function getUserData() {
            throw 'Please rewrite this method before calling.';
        }

        function getAppData() {
            throw 'Please rewrite this method before calling.';
        }

        return service;
    }
})();
(function() {
    'use strict';
    angular.module('pageLayout')
        .factory('snapLightboxService', snapLightboxService);

    function snapLightboxService() {
        var service = {
            open: openLightbox,
            close: closeLightbox
        };

        return service;

        /////////////////////

        function openLightbox(rootScope, selector) {
            var modalContainerEl,
            //find the modal element
                modalEl = angular.element(document.querySelector(selector)),
            //find the body to disable scroll
                bodyEl = angular.element(document.querySelector('#appBody')),
                othersOpen;

            // find modal container
            var el = modalEl.parent();
            //traverse up and check for lightbox-container class
            while (el[0] !== undefined && el[0].localName !== 'html') {
                if (el.hasClass('lightbox-container')) {
                    modalContainerEl = el;
                    break;
                }
                el = el.parent();
            }
            //if not found, return
            if (!modalContainerEl) {
                return;
            }
            // determine classes to add
            if (!modalEl.hasClass('launch-lightbox')) {
                //check for already open lightboxes, if so, add second-lightbox class, and modal-lightbox class
                if (angular.element(document.getElementsByClassName('launch-lightbox')).length){
                    modalEl.addClass('second-lightbox');
                    modalEl.addClass('modal-lightbox');
                    othersOpen = true;
                }
                modalEl.addClass('launch-lightbox');
            }
            if (othersOpen) {
                var allBoxes = document.getElementsByClassName('launch-lightbox');

                //convert to array instead of HTML element array
                allBoxes = [].slice.call(allBoxes);

                for (var x = 0; x < allBoxes.length; x++ ){
                    if (angular.element(allBoxes[x]).hasClass('lightbox-container') || (angular.element(allBoxes[x]).hasClass('modal-lightbox'))){
                        allBoxes.splice(x, 1);
                    }
                }

                for (var i = 0; i < allBoxes.length; i++ ){
                    angular.element(allBoxes[i]).find('div').addClass('active');
                }
            }

            //add scroll disable if not there
            if (!bodyEl.hasClass('overflow-hidden')) {
                bodyEl.addClass('overflow-hidden');
            }
            //add launch-lightbox if needed
            if (!modalContainerEl.hasClass('launch-lightbox')) {
                modalContainerEl.addClass('launch-lightbox');
            }
            //broadcast to kick off watchers in individual lightboxes
            rootScope.$broadcast('openLightbox:' + modalEl[0].id, modalEl[0].id);
            var focusEl = angular.element(document.querySelector('#' + modalEl[0].id + ' .modal-focus'));
            //sets focus to new lightbox just in case you selected some input from page beneath
            if (focusEl && focusEl.focus) {
                focusEl.focus();
            }
        }

        function closeLightbox(rootScope, element, closingType) {
            var el = element,
                container,
                closed = false,
                others = false,
                closedEl, children, i, len,
            //find the body to enable scrolling
                bodyEl = angular.element(document.querySelector('#appBody'));

            if (typeof element === 'string') {
                el = angular.element(document.querySelector(element));
            }

            // find modal element to close
            while (el[0] !== undefined && el[0].localName !== 'html') {
                //determine classes to remove
                if (!closed && (el.hasClass('launch-lightbox'))) {
                    el.removeClass('launch-lightbox');
                    closed = true;
                    closedEl = el;
                }
                if (el.hasClass('lightbox-container')) {
                    container = el;
                    break;
                }
                el = el.parent();
            }

            if (closed && container) {
                // determine if other modal elements in the modal container are open
                children = container.find('div');
                for (i = 0, len = children.length; i < len; i++) {
                    var child = angular.element(children[i]);
                    if (child.hasClass('right-lightbox') && child.hasClass('launch-lightbox')) {
                        others = true;
                        break;
                    }
                    if (child.hasClass('confirmation-lightbox') && child.hasClass('launch-lightbox')) {
                        others = true;
                        break;
                    }
                }

                // if no other open modals, close the parent modal container and remove the scroll disable class
                if (!others) {
                    container.removeClass('launch-lightbox');
                    bodyEl.removeClass('overflow-hidden');
                } else {
                    var shadedBoxes = document.getElementsByClassName('lightbox-shade');
                    shadedBoxes = [].slice.call(shadedBoxes);
                    angular.forEach(shadedBoxes, function(box) {
                        angular.element(box).removeClass('active');
                    });
                }
            }
            //broadcast close lightbox
            rootScope.$broadcast('closeLightbox:' + closedEl[0].id, {id: closedEl[0].id, type: closingType});
        }
    }
})();