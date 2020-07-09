/* eslint-disable */
/**
 * @singleton
 */
Ext.define('criterion.Utils', function() {

    let appliedThemeStyle = '',
        toolbarButton = null;

    String.prototype.toUnderscore = function() {
        return this.replace(/([A-Z])/g, function($1) {
            return "_" + $1.toLowerCase();
        });
    };

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\("|\\)/g, '$1');
        }

        return s;
    }

    function getCookie(name) {
        let cookies = document.cookie.split('; '),
            value, parts, key, cookie;

        for (let i = 0, l = cookies.length; i < l; i++) {
            parts = cookies[i].split('=');
            key = parts.shift();
            cookie = parts.join('=');

            if (key && key === name) {
                value = parseCookieValue(cookie);
                break;
            }
        }

        return value;
    }

    function setCookie(name, value, options) {
        let expires, d, cookie, propValue, _value;

        options = options || {};
        expires = options.expires;

        if (typeof expires === "number") {
            d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }

        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        // Fix to Ext.util.Cookies.clear
        if (!options.hasOwnProperty('path')) {
            options.path = '/';
        }

        _value = value;
        cookie = name + "=" + _value;

        for (let propName in options) {
            cookie += "; " + propName;

            propValue = options[propName];
            if (propValue !== true) {
                cookie += "=" + propValue;
            }
        }

        document.cookie = cookie;

        if (typeof (Storage) !== "undefined") {
            if (_value !== '') {
                localStorage.setItem('cookie-' + name, _value);
                expires && localStorage.setItem('cookie-expires', expires);
            } else {
                localStorage.removeItem('cookie-' + name);
                localStorage.removeItem('cookie-expires');
            }
        }

    }

    function removeCookie(name) {
        setCookie(name, '', {
            expires : -1
        });
    }

    /**
     * Returns session data or empty object.
     *
     * @return {Object}
     */
    function getSessionData() {
        let sessionCookie = getCookie(criterion.Consts.COOKIE.SESSION),
            session;

        if (sessionCookie) {
            session = Ext.decode(decodeURIComponent(sessionCookie), true);
        }

        return session || {};
    }

    /**
     * Stores session data
     *
     * @param {Object} data
     */
    function setSessionData(data) {
        setCookie(criterion.Consts.COOKIE.SESSION, Ext.encode(data));
    }

    return {

        singleton : true,

        setCookie : setCookie,

        getCookie : getCookie,

        removeCookie : removeCookie,

        loadMasks : [],

        runtimeValues : {},

        isLocalDev : function() {
            return window.location.hostname === 'criterionhcm.local'
        },

        /**
         * Converts hash to an array of pairs [ key, value]
         *
         * @param {Object} object
         *
         * @returns {Array}
         */
        pairs : function(object) {
            let arr = [];

            Ext.Object.each(object, function(key, value) {
                arr.push([key, value]);
            });

            return arr;
        },

        filterObject : function(obj, fn) {
            Ext.Object.each(obj, function(key, value) {
                if (!fn(key, value)) {
                    delete obj[key];
                }
            })
        },

        emptyToNull : function(value) {
            return Ext.isEmpty(value) ? null : value;
        },

        zeroToNull : function(value) {
            return value === 0 ? null : value;
        },

        isObjectEqualSimple : function(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        },

        isObjectsEqualDeep : function() {
            let i, l, leftChain, rightChain;

            function compare2Objects(x, y) {
                let p;

                // remember that NaN === NaN returns false
                // and isNaN(undefined) returns true
                if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
                    return true;
                }

                // Compare primitives and functions.
                // Check if both arguments link to the same object.
                // Especially useful on the step where we compare prototypes
                if (x === y) {
                    return true;
                }

                // Works in case when functions are created in constructor.
                // Comparing dates is a common scenario. Another built-ins?
                // We can even handle functions passed across iframes
                if ((typeof x === 'function' && typeof y === 'function') ||
                    (x instanceof Date && y instanceof Date) ||
                    (x instanceof RegExp && y instanceof RegExp) ||
                    (x instanceof String && y instanceof String) ||
                    (x instanceof Number && y instanceof Number)) {
                    return x.toString() === y.toString();
                }

                // At last checking prototypes as good as we can
                if (!(x instanceof Object && y instanceof Object)) {
                    return false;
                }

                if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
                    return false;
                }

                if (x.constructor !== y.constructor) {
                    return false;
                }

                if (x.prototype !== y.prototype) {
                    return false;
                }

                // Check for infinitive linking loops
                if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
                    return false;
                }

                // Quick checking of one object being a subset of another.
                for (p in y) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }
                }

                for (p in x) {
                    if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof y[p] !== typeof x[p]) {
                        return false;
                    }

                    switch (typeof (x[p])) {
                        case 'object':
                        case 'function':

                            leftChain.push(x);
                            rightChain.push(y);

                            if (!compare2Objects(x[p], y[p])) {
                                return false;
                            }

                            leftChain.pop();
                            rightChain.pop();
                            break;

                        default:
                            if (x[p] !== y[p]) {
                                return false;
                            }
                            break;
                    }
                }

                return true;
            }

            if (arguments.length < 1) {
                return true; //Die silently? Don't know how to handle such case, please help...
                // throw "Need two or more arguments to compare";
            }

            for (i = 1, l = arguments.length; i < l; i++) {

                leftChain = [];
                rightChain = [];

                if (!compare2Objects(arguments[0], arguments[i])) {
                    return false;
                }
            }

            return true;
        },

        /**
         * via http://stackoverflow.com/a/5624139
         *
         * @param hex
         * @returns {*}
         */
        hexToRgb : function(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return result ? {
                r : parseInt(result[1], 16),
                g : parseInt(result[2], 16),
                b : parseInt(result[3], 16)
            } : null;
        },

        rgbToString : function(rgb, alpha = 1) {
            return alpha === 1 ? Ext.String.format('rgb({0}, {1}, {2})', rgb.r, rgb.g, rgb.b) : Ext.String.format('rgba({0}, {1}, {2}, {3})', rgb.r, rgb.g, rgb.b, alpha)
        },

        /**
         * Returns wheter specified theme is supported or not.
         */
        hasTheme : function(theme) {
            return criterion.Consts.THEMES.AVAILABLE.hasOwnProperty(theme);
        },

        /**
         * Returns current theme.
         */
        getTheme : function() {
            let me = this,
                theme = getCookie(criterion.Consts.COOKIE.THEME);

            if (!me.hasTheme(theme)) {
                theme = criterion.Consts.THEMES.DEFAULT;
            }

            return theme;
        },

        setTheme : function(theme) {
            let me = this;

            if (me.hasTheme(theme) && me.getTheme() !== theme) {
                setCookie(criterion.Consts.COOKIE.THEME, theme);
            }
        },

        /**
         * @deprecated
         * @param theme
         */
        applyThemeStyle : function(theme) {
            let themeStyle = 'criterion-theme-ess-' + (theme || this.getTheme()),
                body = Ext.getBody();

            if (themeStyle !== appliedThemeStyle) {
                body.removeCls(appliedThemeStyle);
                body.addCls(themeStyle);

                appliedThemeStyle = themeStyle;
            }
        },

        /**
         * Returns stored session value.
         *
         * @param {String} name
         * @param {Object} defaultValue
         *
         * @returns {Object}
         */
        getSessionValue : function(name, defaultValue) {
            let data = getSessionData();

            return data[name] || defaultValue;
        },

        /**
         * Stores value to session cookie.
         *
         * @param name
         * @param value
         */
        setSessionValue : function(name, value) {
            let data = getSessionData();

            data[name] = value;
            setSessionData(data);
        },

        /**
         * Returns template defined in config TPL section.
         *
         * @param name
         *
         * @returns {Ext.XTemplate}
         */
        getTpl : function(name) {
            let TPL = criterion.Consts.TPL;

            if (!(TPL[name] instanceof Ext.XTemplate)) {
                TPL[name] = new Ext.XTemplate(TPL[name]);
            }

            return TPL[name];
        },

        /**
         *
         * @param {String} xtype
         *
         * @returns {String}
         */
        getClsByXType : function(xtype) {
            return xtype.toLowerCase().replace(/_/g, '-');
        },

        /**
         * Returns base class for the component.
         */
        getBaseCls : function(cmp) {
            return this.getClsByXType(cmp.xtype || '');
        },

        getAdditionalCls : function(cmp) {
            return (cmp.xtype || '').toLowerCase();
        },

        cloneNodes : function cloneNodes(sourceCmp, target) {
            let childEls = sourceCmp.items;

            childEls.each(function(item) {
                target.appendChild(item.el.dom.cloneNode(true));
            });
        },

        /**
         * credits: http://stackoverflow.com/a/4149393
         * @param str
         */
        camelToRegular : function(str) {
            return str
                // insert a space before all caps
                .replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function(str) {
                    return str.toUpperCase();
                })
        },

        snakeCaseToRegular : function(str) {
            return str.replace(/_/g, ' ').split(' ').map(this.capitalizeWord).join(' ');
        },

        capitalizeWord : function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },

        decodeHtmlEntities : (function() {
            // this prevents any overhead from creating the object each time
            let element = document.createElement('div');

            function decodeHTMLEntities(str) {
                if (str && typeof str === 'string') {
                    // strip script/html tags
                    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '').replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                    element.innerHTML = str;
                    str = element.textContent;
                    element.textContent = '';
                }

                return str;
            }

            return decodeHTMLEntities;
        })(),

        setPageTitle : function(title, append) {
            if (!append) {
                document.title = this.decodeHtmlEntities(criterion.title) || 'Criterion';
            }

            document.title = this.decodeHtmlEntities(title) + ' - ' + document.title;
        },

        /**
         * @param {String|Object}   opt string ot config object
         */
        toast : function(opt) {
            let def = {};

            if (Ext.toolkit === "classic") {
                def = {
                    align : 't',
                    closable : false,
                    slideInDuration : 200,
                    slideBackDuration : 100,
                    hideDuration : 100,
                    autoCloseDelay : 1500,
                    bodyPadding : 10,
                    paddingY : 8,
                    minHeight : 40
                }
            }

            if (Ext.isString(opt)) {
                Ext.toast(Ext.Object.merge(def, {
                    html : opt,
                    message : opt
                }));
            } else {
                Ext.toast(Ext.Object.merge(def, opt))
            }
        },

        getSecurityBinaryNames : function(config, value) {
            let res = [];

            Ext.each(Ext.Object.getValues(config), function(item) {
                if (!(~parseInt(value, 2) & item.value)) {
                    res.push(item.name);
                }
            });

            return res;
        },

        getSecurityBinaryNamesFromInt : function(config, value) {
            let res = [];

            Ext.each(Ext.Object.getValues(config), function(item) {
                if (value & item.value) {
                    res.push(item.name);
                }
            });

            return res;
        },

        createResponsiveConfig : function(configs) {
            let result = {};

            for (let i = 0; i < configs.length; i++) {
                let config = configs[i];
                result[config.rule] = config.config;
            }

            return result;
        },

        range : function(start, end) {
            let foo = [];
            for (let i = start; i <= end; i++) {
                foo.push(i);
            }
            return foo;
        },

        makePersonPhotoUrl(personId, width, height) {
            let iWidth = width || criterion.Consts.USER_PHOTO_SIZE.MIN_WIDTH,
                iHeight = height || criterion.Consts.USER_PHOTO_SIZE.MIN_HEIGHT,
                url = personId ? Ext.String.format("{0}/{1}", criterion.consts.Api.API.PERSON_LOGO, personId) : criterion.consts.Api.API.PERSON_LOGO;

            return criterion.Api.getSecureResourceUrl(
                Ext.String.format("{0}?width={2}&height={3}&_rnd={1}", url, +new Date(), iWidth, iHeight)
            );
        },

        datePlusHours : function(date, hours) {
            let newDate = null,
                MILLISECONDS_IN_HOUR = 1000 * 3600;

            if (date && hours) {
                newDate = new Date(date.getTime() + MILLISECONDS_IN_HOUR * Ext.Number.parseFloat(hours));
            }

            return newDate;
        },

        saveToolbarButton : function(button) {
            toolbarButton = button;
        },

        restoreToolbarButton : function() {
            toolbarButton && toolbarButton.setPressed(true);
        },

        upToNearCmp : function(component, selector) {
            let target = component;

            while (target = target.ownerCt) {
                if (target.down(selector)) {
                    return target.down(selector)
                }
            }

            return null;
        },

        hourStrParse : function(value, returnMinutes) {
            let _value = Ext.String.trim(value);

            if (/^(\d){0,}:(\d){0,}$/.test(_value)) {
                let vals = _value.split(':'),
                    minutes = parseInt(vals[1], 10);

                if (returnMinutes) {
                    return parseInt(vals[0], 10) * 60 + minutes;
                } else {
                    return {
                        hours : parseInt(vals[0], 10),
                        minutes : minutes > 59 ? 59 : minutes
                    }
                }
            } else if (Ext.Number.parseFloat(_value)) {
                let totalMinutes = _value * 60,
                    minutes = totalMinutes % 60,
                    hours = (totalMinutes - minutes) / 60;

                return {
                    hours : hours,
                    minutes : Math.round(minutes)
                }
            } else {
                return {
                    hours : 0,
                    minutes : 0
                }
            }
        },

        hourStrToFormattedStr : function(value) {
            let duration = this.hourStrParse(value),
                zeroTimeCls = (duration.hours === 0 && duration.minutes === 0) ? 'zeroTimeCls' : '';

            return Ext.util.Format.format(
                '<div class="hrsStr {2}">{0}<span>h</span><span>&nbsp;</span>{1}<span>m</span></div>',
                Ext.String.leftPad(duration.hours.toString(), 2, '0'),
                Ext.String.leftPad(duration.minutes.toString(), 2, '0'),
                zeroTimeCls
            );
        },

        /**
         * Converts dateTimeObj to "mm:hh" format (Days are ignored. It is possible to convert time upto 23:59 only)
         * @param dateTimeObj: Object { days: dd, hours: hh, minutes: mm }
         * @returns {string}
         */
        timeObjToStr : function(dateTimeObj) {
            return Ext.String.leftPad(dateTimeObj.hours.toString(), 2, '0') + ':' + Ext.String.leftPad(dateTimeObj.minutes.toString(), 2, '0');
        },

        /**
         * Converts dateTimeObj to "mm:hh" format (Days will be converted to hours)
         * @param dateTimeObj: Object { days: dd, hours: hh, minutes: mm }
         * @param hoursPerDay: How many hours in the one day (24 by default)
         * @returns {string}
         */
        dateTimeObjToStr : function(dateTimeObj, hoursPerDay) {
            let _hoursPerDay = typeof hoursPerDay === 'undefined' ? 24 : hoursPerDay,
                hours = dateTimeObj.days > 0 ? dateTimeObj.hours + (dateTimeObj.days * _hoursPerDay) : dateTimeObj.hours;

            return Ext.String.leftPad(hours.toString(), 2, '0') + ':' + Ext.String.leftPad(dateTimeObj.minutes.toString(), 2, '0');
        },

        minutesToTimeStr : function(minutes) {
            return Ext.util.Format.format('{0}:{1}', Ext.String.leftPad(Math.floor(minutes / 60).toString(), 2, '0'), Ext.String.leftPad((minutes % 60).toString(), 2, '0'))
        },

        timeStringToHoursMinutes(timeString) {
            let parsed, hours, minutes;

            if (timeString.search('d|h|m') > -1) {
                parsed = criterion.Utils.parseDuration(timeString, false, true);

                hours = parsed.hours;
                minutes = parsed.minutes;
            } else if (timeString.indexOf(':') > -1) {
                parsed = timeString.split(':');

                hours = parseInt(parsed[0], 10);
                minutes = parseInt(parsed[1], 10);
            } else {
                parsed = criterion.Utils.hoursToDuration(timeString);

                hours = parsed.hours;
                minutes = parsed.minutes;
            }

            return {
                hours : hours || 0,
                minutes : minutes || 0
            }
        },

        /**
         * @param {String} s
         * @param {Boolean} [useDefault] true by default
         * @returns {{days: (Number), hours: (number), minutes: (number)}}
         */
        parseDuration : function(s, useDefault, withoutDays) {
            let m = /(?:([0-9]*[.]?[0-9]*)d)?(?:([0-9]*[.]?[0-9]*)h)?(?:([0-9]*[.]?[0-9]*)m?)?/.exec(s.replace(/\s+/g, '')),
                days = Ext.Number.parseFloat(m[1]),
                hours = Ext.Number.parseFloat(m[2]),
                minutes = Ext.Number.parseFloat(m[3]);

            typeof useDefault === 'undefined' && (useDefault = true);

            if (days) {
                if (days < 1) {
                    hours = (hours || 0) + days * 24;
                    days = 0;
                }

                if (withoutDays) {
                    hours = (hours || 0) + days * 24;

                    days = null;
                }
            }

            if (hours && hours % 1 !== 0) {
                let _hours = Math.floor(hours),
                    _minutes = Math.round((hours - _hours) * 60);

                hours = _hours;
                minutes = minutes ? (minutes + _minutes) : _minutes;
            }

            return {
                days : isNaN(days) && useDefault ? 0 : days,
                hours : isNaN(hours) && useDefault || !hours ? 0 : hours,
                minutes : isNaN(minutes) && useDefault || !minutes ? 0 : minutes
            }
        },

        durationToHours : function(s) {
            let duration = this.parseDuration(s);
            return duration.days * 24 + duration.hours + duration.minutes / 60;
        },

        hoursToDuration : function(hrs) {
            let days = Math.floor(hrs / 24),
                hours = hrs && Math.floor(hrs - days * 24),
                minutes = Math.round(hrs && (hrs - days * 24 - hours) * 60);

            return {
                days : days || 0,
                hours : hours || 0,
                minutes : minutes || 0
            }
        },

        durationToMinutes : function(s) {
            let duration = this.parseDuration(s);
            return duration.days * 1440 + duration.hours * 60 + duration.minutes;
        },

        minutesToDuration : function(minutes) {
            let days = Math.floor(minutes / 1440),
                hours = minutes && Math.floor((minutes - days * 1440) / 60),
                _minutes = minutes && (minutes - days * 1440 - hours * 60);

            return {
                days : days || 0,
                hours : hours || 0,
                minutes : _minutes || 0
            }
        },

        durationToShortString : function(duration) {
            let format = '', formatCounter = 0,
                args = [];

            if (duration.days) {
                format = '{' + formatCounter + '}d';
                args.push(duration.days);
                formatCounter++;
            }
            if ((duration.days && !duration.hours && duration.minutes) || duration.hours) {
                format += '{' + formatCounter + '}h';
                args.push(duration.hours);
                formatCounter++;
            }
            if (duration.minutes) {
                format += '{' + formatCounter + '}m';
                args.push(duration.minutes);
            }
            args.unshift(format);

            return Ext.util.Format.format.apply(this, args);
        },

        durationToLongString : function(duration) {
            let output = '';

            if (duration.days) {
                output = Ext.util.Format.plural(duration.days, 'day', 'days');
            }
            if ((duration.days && !duration.hours && duration.minutes) || duration.hours) {
                output += (duration.days ? ' ' : '') + Ext.util.Format.plural(duration.hours, 'hour', 'hours');
            }
            if (duration.minutes) {
                output += ((duration.days || duration.hours) ? ' ' : '') + Ext.util.Format.plural(duration.minutes, 'minute', 'minutes');
            }
            return output;
        },

        /**
         * Calculates a difference between two dates in years, months and days (A very primitive algorithm)
         * @param {Date} dateFrom
         * @param {Date} dateTo
         * @returns {{years: (number), months: (number), days: (number)}}
         */
        getPeriodBetweenDates : function(dateFrom, dateTo) {
            let diffYears, diffMonths, diffDays;

            if (Ext.isEmpty(dateTo)) {
                dateTo = new Date();
            }

            diffYears = dateTo.getFullYear() - dateFrom.getFullYear();
            diffMonths = dateTo.getMonth() - dateFrom.getMonth();
            diffDays = dateTo.getDate() - dateFrom.getDate();

            if (diffDays < 0) {
                diffMonths -= 1;
                diffDays += 30;
            }
            if (diffMonths < 0) {
                diffYears -= 1;
                diffMonths += 12;
            }

            return {years : diffYears, months : diffMonths, days : diffDays};
        },

        /**
         * @param startDay (by default - 1 is monday)
         */
        getCurrentWeek(startDay = 1) {
            let now = new Date(),
                currDay = now.getDay(),
                start = now,
                eDate = Ext.Date,
                sub, end;

            eDate.clearTime(now);

            if (currDay !== startDay) {
                // Sunday
                if (currDay === 0) {
                    sub = 6;
                } else {
                    sub = currDay - startDay;
                }
                start = eDate.add(now, eDate.DAY, -sub);
            }
            end = eDate.add(start, eDate.DAY, 6);

            return {
                start,
                end
            }
        },

        /**
         * Converts a period object to string
         *
         * @param {years: (number), months: (number), days: (number)} period
         * @returns {string} Like `2 years 7 months 22 days`
         */
        periodToLongString : function(period) {
            let result = [];

            if (period.years > 0) {
                result.push(Ext.util.Format.plural(period.years, 'year', 'years'));
            }

            if (period.months > 0) {
                result.push(Ext.util.Format.plural(period.months, 'month', 'months'));
            }

            if (period.days > 0) {
                result.push(Ext.util.Format.plural(period.days, 'day', 'days'));
            }

            return result.join(' ');
        },

        getCurrentTimezoneCode : function() {
            let zone = '',
                tz = (new Date()).getTimezoneOffset(),
                temp = -tz / 60 * 100;

            if (temp > 0) {
                zone += '+';
            } else if (temp < 0) {
                zone += '-';
            } else {
                return 'UTC';
            }
            zone += (Math.abs(temp) < 100 ? '00' : (Math.abs(temp) < 1000 ? '0' : '')) + Math.abs(temp);

            return 'UTC' + zone.substr(0, 3) + ':' + String(temp).substr(-2);
        },

        convertTimezoneCodeToHoursMinutes : function(code) {
            let z;

            if (code === 'UTC') {
                return {
                    hours : 0,
                    minutes : 0
                }
            }

            z = code.substr(3, 1);

            return {
                hours : parseInt(code.substr(4, 2), 10) * (z === '-' ? -1 : 1),
                minutes : parseInt(code.substr(7, 2), 10)
            };
        },

        getTimezoneOffsetStr : function(code) {
            let off = code.replace('UTC', '');

            return off ? off : '+00:00';
        },

        parseDateWithTimezone : function(dateString, dateFormat, tzCode) {
            let parsedDate, tzAdd;

            dateString = dateString.replace('Z', '');

            parsedDate = Ext.Date.parse(dateString, dateFormat);
            if (tzCode) {
                tzAdd = this.convertTimezoneCodeToHoursMinutes(tzCode);
                if (tzAdd.hours) {
                    parsedDate = Ext.Date.add(parsedDate, Ext.Date.HOUR, tzAdd.hours);
                }
                if (tzAdd.minutes) {
                    parsedDate = Ext.Date.add(parsedDate, Ext.Date.MINUTE, tzAdd.minutes);
                }
            }

            return parsedDate;
        },

        /**
         * Add time from second parameter to date from first parameter, return new Date.
         *
         * @param {Date} date
         * @param {Date} time
         * @return Date
         */
        addDateAndTime : function(date, time) {
            return Ext.Date.parse( // dumb way to add date to time
                Ext.Date.format(date, 'Y-m-d') + ' ' + Ext.Date.format(time, 'g:i A'),
                'Y-m-d g:i A'
            )
        },

        /**
         * Parsing with determination of format
         *
         * @param date
         * @returns {Date|any}
         */
        parseDate(date) {
            if (Ext.isString(date)) {
                // find format
                if (/^\d{4}-[01]\d-\d{2}$/.test(date)) {
                    return Ext.Date.parse(date, criterion.consts.Api.DATE_FORMAT_ISO)
                }

                if (/^\d{4}\.[01]\d\.\d{2}$/.test(date)) {
                    return Ext.Date.parse(date, criterion.consts.Api.DATE_FORMAT);
                }

                // default
                return new Date(date);
            }

            return date;
        },

        addMask : function(mask) {
            Ext.Array.push(this.loadMasks, mask);
        },

        removeMask : function(mask) {
            Ext.Array.remove(this.loadMasks, mask);
        },

        getMasks : function() {
            return this.loadMasks;
        },

        removeMasks : function() {
            this.getMasks().map(function(mask) {
                if (!mask.destroyed) {
                    let maskOwner = mask.ownerCt;

                    maskOwner && maskOwner.setLoading(false) || mask.hide();
                }
            });
        },

        setDateAndTimeFormat : function(dateFormat, timeFormat) {
            if (!dateFormat) {
                dateFormat = Ext.Date.defaultFormat;
            }

            Ext.Date.defaultFormat = dateFormat;

            Ext.grid.column.Date.prototype.format = dateFormat;

            if (Ext.isClassic) {
                if (Ext.Array.contains(['m', 'n'], (dateFormat || '')[0])) {
                    // month first
                    Ext.form.field.Date.prototype.altFormats = 'm/d/Y|m-d-Y|m/d/y|m-d-y|n/j/Y|n/j/y|n-j-Y|n-j-y|m-d|n-j|m/d|n/j';
                } else if (Ext.Array.contains(['d', 'j'], (dateFormat || '')[0])) {
                    // date first
                    Ext.form.field.Date.prototype.altFormats = 'd/m/Y|d-m-Y|d/m/y|d-m-y|j/n/Y|j/n/y|j-n-Y|j-n-y|d-m|j-n|d/m|j/n';
                }
                Ext.form.field.Date.prototype.format = dateFormat;

                Ext.form.field.Time.prototype.format = timeFormat;
                Ext.picker.Time.prototype.format = timeFormat;
                criterion.ux.form.field.Time.prototype.format = timeFormat;

                if (criterion.ux.grid && criterion.ux.grid.column.Time) { // for tests
                    criterion.ux.grid.column.Time.prototype.format = timeFormat;
                }
            }

            criterion.consts.Api.SHOW_DATE_FORMAT = dateFormat;
            criterion.consts.Api.SHOW_TIME_FORMAT = timeFormat;

            let hourFormat = timeFormat.indexOf('g') > -1 && 'g' || timeFormat.indexOf('h') > -1 && 'h' ||
                timeFormat.indexOf('G') > -1 && 'G' || timeFormat.indexOf('H') > -1 && 'H',
                meridiemFormat = timeFormat.indexOf('a') > -1 && 'a' || timeFormat.indexOf('A') > -1 && 'A' || '';

            if (hourFormat) {
                criterion.consts.Api.SHORT_TIME_FORMAT = hourFormat + meridiemFormat;
            }

            criterion.consts.Api.DATE_AND_TIME_FORMAT = dateFormat + ' ' + timeFormat;
            Ext.ComponentQuery.query('datecolumn[lazyDTFormat=true]').forEach(function(cmp) {
                cmp.format = criterion.consts.Api.DATE_AND_TIME_FORMAT
            });

            if (Ext.isModern) {
                Ext.grid.cell.Date.prototype.format = dateFormat;

                if (criterion.ux.field.Time) {
                    criterion.ux.field.Time.prototype.displayFormat = timeFormat;

                    Ext.ComponentQuery.query('criterion_timefield').forEach(function(cmp) {
                        cmp.setStore(true);
                    });
                }

                Ext.ComponentQuery.query('datecell').forEach(function(cmp) {
                    cmp.setFormat(dateFormat);
                });

                Ext.ComponentQuery.query('datecolumn[lazyDTFormat=true]').forEach(function(cmp) {
                    cmp.setFormat(cmp.format);
                });

                Ext.ComponentQuery.query('datepickerfield').forEach(function(cmp) {
                    cmp.setDateFormat(dateFormat);
                });
            } else {
                Ext.ComponentQuery.query('datefield').forEach(function(cmp) {
                    // apply new format
                    cmp.focus();
                });
            }
        },

        createRecord : function(model, data) {
            let reader = Ext.create('Ext.data.reader.Json', {
                model : model
            });

            return reader.read(Ext.clone(data)).records[0];
        },

        /**
         * @param customField {criterion.model.CustomData}
         * @param value {criterion.data.field.CustomFieldValue}
         * @param timesheetTaskOrDetail {criterion.model.employee.timesheet.Task} {criterion.model.mobile.employee.timesheet.task.Detail} {criterion.model.employee.timesheet.vertical.TaskDetail}
         * @param fieldName {String}
         * @returns {*}
         */
        getCustomFieldEditorConfig : function(customField, value, timesheetTaskOrDetail, fieldName) {
            let config,
                dataTypeRec = criterion.CodeDataManager.getCodeDetailRecord('id', customField.get('dataTypeCd'), criterion.consts.Dict.DATA_TYPE),
                dataType = dataTypeRec && dataTypeRec.get('code'),
                codeTableId = customField && customField.get('codeTableId');

            if (timesheetTaskOrDetail && dataType) {
                timesheetTaskOrDetail.set(fieldName + 'Type', dataType);
            }

            switch (dataType) {
                default:

                case criterion.Consts.DATA_TYPE.TEXT:
                    config = {
                        xtype : 'textfield'
                    };
                    break;

                case criterion.Consts.DATA_TYPE.NUMBER:
                    config = {
                        xtype : 'numberfield'
                    };
                    break;

                case criterion.Consts.DATA_TYPE.DATE:
                    config = {
                        xtype : 'datefield',
                        value : value && new Date(value) || null
                    };
                    break;

                case criterion.Consts.DATA_TYPE.CHECKBOX:
                    config = {
                        xtype : 'combobox',
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    text : i18n.gettext('Yes'), value : true
                                },
                                {
                                    text : i18n.gettext('No'), value : false
                                }
                            ]
                        }),
                        displayField : 'text',
                        valueField : 'value',
                        queryMode : 'local',
                        forceSelection : true,
                        autoSelect : true
                    };

                    break;

                case criterion.Consts.DATA_TYPE.DROPDOWN:
                    config = {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.CodeDataManager.getCodeTableNameById(codeTableId),
                        codeTableId : codeTableId,
                        allowSetDefault : false
                    };

                    break;

                case criterion.Consts.DATA_TYPE.CURRENCY:
                    config = {
                        xtype : 'criterion_currencyfield'
                    };
                    break;
            }

            return Ext.merge(config, {
                allowBlank : customField && !customField.get('isRequired'),
                listeners : {
                    added : (cmp) => {
                        if (timesheetTaskOrDetail) {
                            if (!timesheetTaskOrDetail.customFields) {
                                timesheetTaskOrDetail.customFields = [];
                            }

                            timesheetTaskOrDetail.customFields[fieldName] = cmp;
                        }
                    }
                }
            });
        },

        getCustomFieldFilterIdent(customField, paycodeIdent) {
            let codeTableId = customField && customField.get('codeTableId'),
                attribute1Caption,
                codeTable,
                ident,
                map = {
                    'employer_work_location_id' : 'employerWorkLocationId',
                    'work_location_area_id' : 'workLocationAreaId',
                    'assignment_id' : 'assignmentId',
                    'paycode' : paycodeIdent || 'paycodeDetail.id',
                    'task_id' : 'taskId',
                    'project_id' : 'projectId',
                    'employee_task_id' : '__employeeTaskId__'
                };

            if (!codeTableId) {
                return ident;
            }

            codeTable = criterion.CodeDataManager.getCodeTableById(codeTableId);
            attribute1Caption = codeTable && codeTable.get('attribute1Caption');

            if (attribute1Caption && Ext.Array.contains(Ext.Object.getKeys(map), attribute1Caption)) {
                ident = map[attribute1Caption];
            }

            return ident;
        },

        getCustomFieldBindFilters(customField, recordName, scope, taskRef = '') {
            let ident,
                val = {};

            ident = this.getCustomFieldFilterIdent(customField);

            if (!ident || !scope) {
                return val;
            }

            if (ident !== '__employeeTaskId__') {
                ident = recordName + '.' + ident;

                val = {
                    filters : [
                        // for binding to field
                        {
                            property : 'attribute1',
                            value : '{' + ident + '}',
                            exactMatch : true,
                            disabled : true // important!
                        },
                        // for filtering
                        {
                            filterFn : record => {
                                let val = scope.isViewModel ? scope.get(ident) : scope.getViewModel().get(ident),
                                    ids = Ext.Array.map((record.get('attribute1') || '').split(','), v => parseInt(v, 10));

                                return !val ? true : Ext.Array.contains(ids, val);
                            }
                        }
                    ]
                }
            } else if (taskRef) {
                // custom binding for employee_task_id
                val = {
                    filters : [
                        // for binding to field
                        {
                            property : 'id',
                            value : '{' + recordName + '.taskId}',
                            exactMatch : true,
                            disabled : true // important!
                        },
                        // for filtering
                        {
                            filterFn : record => {
                                let vm = scope.isViewModel ? scope : scope.getViewModel(),
                                    taskId = vm.get(recordName + '.taskId'),
                                    codeTableId = customField.get('codeTableId'),
                                    codeTableDetails = Ext.Array.toValueMap(vm.get(taskRef + '.selection.codeTableDetails') || [], 'codeTableId'),
                                    ids = [];

                                if (codeTableDetails[codeTableId]) {
                                    ids = Ext.Array.map((codeTableDetails[codeTableId]['value'] || '').split(','), v => parseInt(v, 10));
                                }

                                return !taskId ? true : Ext.Array.contains(ids, record.getId());
                            }
                        }
                    ]
                }
            }

            return val;
        },

        getCustomFieldStringAndFn : function(customField, index) {
            let customFieldsStr = '',
                label = customField.get('label') || '',
                dataTypeCd = customField.get('dataTypeCd'),
                codeTableCode,
                safeCodeTableCode,
                DICT = criterion.consts.Dict,
                DATA_TYPE = criterion.Consts.DATA_TYPE,
                funcObj = {},
                dataType = criterion.CodeDataManager.getCodeDetailRecord('id', dataTypeCd, DICT.DATA_TYPE).get('code');

            switch (dataType) {
                default:
                case DATA_TYPE.TEXT:
                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{' + ('customValue' + (index + 1)) + ':htmlEncode}</span></p>';
                    break;

                case DATA_TYPE.NUMBER:
                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{' + ('customValue' + (index + 1)) + '}</span></p>';
                    break;

                case DATA_TYPE.CURRENCY:
                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{' + ('customValue' + (index + 1)) + ':currency}</span></p>';
                    break;

                case DATA_TYPE.DATE:
                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{' + ('customValue' + (index + 1)) + ':date("m/d/Y")}</span></p>';
                    break;

                case DATA_TYPE.CHECKBOX:
                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{' + ('customValue' + (index + 1)) + '}</span></p>';
                    break;

                case DATA_TYPE.DROPDOWN:
                    codeTableCode = criterion.CodeDataManager.getCodeTableNameById(customField.get('codeTableId'));
                    safeCodeTableCode = codeTableCode.replace(/[^\w]/g, '');

                    customFieldsStr += '<p class="customField"><span class="cfLabel">' + label + '</span>&nbsp;<span class="cfValue">{[this.cf' + safeCodeTableCode + '(values.' + ('customValue' + (index + 1)) + ')]}</span></p>';
                    funcObj['cf' + safeCodeTableCode] = function(value) {
                        let rec;

                        if (value && parseInt(value, 10)) {
                            rec = criterion.CodeDataManager.getCodeDetailRecord('id', parseInt(value, 10), codeTableCode);
                        }

                        return rec ? Ext.String.htmlEncode(rec.get('description')) : '&mdash;';
                    };
                    break;
            }

            return {
                customFieldsString : customFieldsStr,
                funcObj : funcObj
            };
        },

        fillCustomFieldsDefaultValuesFromCodes : (parentView, classificationCodesAndValues, fieldSelector = 'criterion_code_detail_field[codeTableId=') => {
            Ext.Array.each(classificationCodesAndValues, (classificationCodesAndValue) => {
                if (classificationCodesAndValue && classificationCodesAndValue['selectedValueId']) {
                    Ext.Array.each(parentView.query(fieldSelector + classificationCodesAndValue['codeDataTypeId'] + ']'), (customField) => {
                        if (!customField.getValue()) {
                            customField.setValue(classificationCodesAndValue['selectedValueId'])
                        }
                    });
                }
            });
        },

        hasInvalidFields : function(fields) {
            let hasInvalid = false;

            Ext.Array.each(fields, (field) => {
                if (!field['isValid']) {
                    return true;
                }

                if (!field.isValid()) {
                    hasInvalid = true;
                }
            });

            return hasInvalid;
        },

        /**
         * "file^I-9^no^Test Folder$Folder 2$Folder 3"
         * "file^103582^I-9^no^Test Folder$Folder 2$Folder 3"
         *
         * @param {string} sFileName
         * @param {boolean} forEmployee for checking employeeNumber
         *
         * @returns {{}}
         */
        parseDocumentParams : function(sFileName = '', forEmployee = false) {
            const DICT = criterion.consts.Dict,
                ATTACHMENTS_CONFIG = criterion.Consts.ATTACHMENTS_CONFIG;

            let filename = sFileName.replace(/\.[^/.]+$/, ''),
                params = filename.split('^'),
                name = params[0],
                employeeNumberGroupName = params[1],
                employeeNumber = null,
                employeeGroupName = null,
                documentTypeRecord = criterion.CodeDataManager.getCodeDetailRecord('isDefault', true, DICT.DOCUMENT_RECORD_TYPE),
                documentTypeCd = null,
                defaultDocumentTypeCd = documentTypeRecord && documentTypeRecord.getId(),
                share = null,
                defaultShare = ATTACHMENTS_CONFIG.SHARE_FLAG_NO,
                path = null;

            if (forEmployee) {
                if (/^\d+$/.test(employeeNumberGroupName)) {
                    employeeNumber = employeeNumberGroupName;
                } else {
                    employeeGroupName = employeeNumberGroupName;
                }
            }

            let checkDocumentTypeCode = str => {
                let dTRecord = criterion.CodeDataManager.getCodeDetailRecord('code', str, DICT.DOCUMENT_RECORD_TYPE);

                return documentTypeCd === null && dTRecord;
            };

            let checkShareFlag = str => share === null && Ext.Array.contains([ATTACHMENTS_CONFIG.SHARE_FLAG_NO, ATTACHMENTS_CONFIG.SHARE_FLAG_YES], str);

            let checkFolder = str => path === null && str;

            params = Ext.Array.removeAt(params, 0, forEmployee ? 2 : 1);

            if (params.length) {
                Ext.Array.each(params, (paramStr, index) => {
                    if (checkDocumentTypeCode(paramStr)) {
                        documentTypeCd = criterion.CodeDataManager.getCodeDetailRecord('code', paramStr, DICT.DOCUMENT_RECORD_TYPE).getId();
                        return;
                    }

                    if (checkShareFlag(paramStr)) {
                        share = paramStr;
                        return;
                    }

                    if (checkFolder(paramStr) && ((params.length > 1 && index !== 0) || params.length === 1)) {
                        path = paramStr.split('$');
                    }
                });
            }

            return {
                name,
                employeeNumber : employeeNumber,
                employeeGroupName : employeeGroupName,
                documentTypeCd : documentTypeCd || defaultDocumentTypeCd,
                isShare : (share || defaultShare) === ATTACHMENTS_CONFIG.SHARE_FLAG_YES,
                path
            };
        },

        /**
         * Implement format function with modificators (:date, :number, etc..)
         * @required stringToFormat {String}
         * @required data {Array}
         */
        fatFormat : function(stringToFormat, data) {
            if (data && Ext.isArray(data)) {
                let dataObject = {};
                Ext.Array.each(data, function(item, index) {
                    // All browsers except Chrome can't deal with dates like 'YYYY.MM.DD' when the ':date' formatter is used
                    if (/^\d{4}\.\d{2}\.\d{2}$/.test(item)) {
                        dataObject[index] = item.replace(/\./g, '-');
                    } else {
                        dataObject[index] = item;
                    }
                });

                return new Ext.XTemplate(stringToFormat).apply(dataObject);
            } else {
                return stringToFormat;
            }
        },

        /**
         * Sorting function for nested field
         * @required field {String}
         * @required nestedField {String}
         */
        nestedFieldSorter : function(field, nestedField) {
            return {
                sorterFn : function(record1, record2) {
                    let field1 = record1.get(field),
                        field2 = record2.get(field),
                        nestedField1 = field1 && field1[nestedField],
                        nestedField2 = field2 && field2[nestedField];

                    return nestedField1 > nestedField2 ? 1 : (nestedField1 === nestedField2) ? 0 : -1;
                }
            }
        },

        convertFieldDPI : function(field) {
            Ext.Array.each(['xPosition', 'yPosition', 'width', 'height'], function(property) {
                field[property] = this.convertDPI(field[property])
            }, this);
        },

        convertDPI : function(value) {
            return Math.round(value * (criterion.Consts.WEBFORM_DPI.PRINT / criterion.Consts.WEBFORM_DPI.DESKTOP));
        },

        serializeDPI : function(value) {
            return value / (criterion.Consts.WEBFORM_DPI.PRINT / criterion.Consts.WEBFORM_DPI.DESKTOP);
        },

        percentRenderer : function(value) {
            return Ext.util.Format.percent(value)
        },

        ratePrecisionedRenderer : function(value) {
            return Ext.util.Format.employerRatePrecision(value);
        },

        /**
         * Same as {@see Ext.route.Router#recognize} but return all recognized routes as array.
         * @param url
         * @returns {*}
         */
        routerRecognizeAll : function(url) {
            let routes = Ext.Object.getValues(Ext.route.Router.routes) || [],
                i = 0,
                len = routes.length,
                route, args, result = [];

            for (; i < len; i++) {
                route = routes[i];
                args = route.recognize(url);

                if (args) {
                    result.push({
                        route : route,
                        args : args
                    });
                }
            }

            return result.length ? result : false;
        },

        /**
         * Same as recognizeAll but filters only routes for specific controller.
         * @param url
         * @param controller
         * @returns {*}
         */
        routerRecognizeFor : function(url, controller) {
            return Ext.Array.filter(this.routerRecognizeAll(url) || [], function(recognized) {
                return recognized.route._handlers.length ? recognized.route._handlers[0]['scope'] === controller : false;
            });
        },

        formatXml : function(xml) {
            let formatted = '',
                pad = 0,
                nodes,
                reg = /(>)(<)(\/*)/g;

            xml = xml.toString().replace(reg, '$1\r\n$2$3');
            nodes = xml.split('\r\n');

            for (let n in nodes) {
                let node = nodes[n];
                let indent = 0;
                if (node.match(/.+<\/\w[^>]*>$/)) {
                    indent = 0;
                } else if (node.match(/^<\/\w/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }

                let padding = '';
                for (let i = 0; i < pad; i++) {
                    padding += '  ';
                }

                formatted += padding + node + '\r\n';
                pad += indent;
            }
            return formatted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
        },

        /**
         * dev tool
         */
        getActiveElsOnPage : function() {
            //<debug>
            let res, xtypes, rcPath = 'localhost:8091',
                classMap = {};

            res = Array.prototype.slice.call(document.getElementsByTagName('div')).map(function(node) {
                let el = Ext.getCmp(Ext.fly(node).id);

                try {
                    if (el && el.xtype && !el.canvases && ['chart', 'series', 'overlay', 'background'].indexOf(el.type) === -1 && el.isVisible(true)) {

                        return {
                            xtype : el.xtype,
                            id : el.id,
                            clsName : el.el && el.el.getAttribute && el.el.getAttribute('data-cls-name'),
                            hasController : !!el.controller,
                            controllerXtype : el.controller && el.controller.type,
                            controllerClsName : el.controller && Ext.getClassName(el.controller)
                        };
                    }
                } catch (e) {
                    return null;
                }
            });

            res = Ext.Array.clean(res);

            Ext.Array.each(res, function(re) {
                classMap[re.xtype] = re;
            });

            xtypes = Ext.Array.sort(Ext.Array.unique(Ext.Array.pluck(res, 'xtype')));

            fetch('/ui/js_files_map.json').then(function(res) {
                res.json().then(function(paths) {
                    let html = [],
                        controllerXtypes = {};

                    Ext.Array.each(xtypes, function(xtype) {
                        let nclass;

                        if (classMap[xtype].hasController) {
                            nclass = classMap[xtype].controllerClsName;

                            controllerXtypes[xtype] = [nclass, paths[nclass]];
                        }
                    });

                    Ext.Array.each(xtypes, function(xtype) {
                        let contrStr = '',
                            nclass = classMap[xtype].clsName,
                            ctrX = controllerXtypes[xtype];

                        if ((/^criterion/.test(xtype) || /^ess_/.test(xtype))) {
                            if (ctrX) {
                                contrStr = ' &bull; <a href="http://' + rcPath + '/?message=' + ctrX[1] + '" class="-">' + ctrX[0] + '</a>';
                            }

                            html.push(
                                '<div style="background-color: white">' +
                                '<a href="http://' + rcPath + '/?message=' + paths[nclass] + '" class="-" style="color: #000;text-decoration: none;">' + nclass + '</a>'
                                + contrStr +
                                '</div>'
                            );
                        }
                    });

                    if (!Ext.isModern) {
                        Ext.create({
                            xtype : 'window',
                            title : 'Page classes',
                            headerPosition : 'left',
                            maskClickAction : 'hide',
                            x : 50, y : 50,
                            modal : true,
                            bodyPadding : 10,
                            items : [{
                                html : html.join('')
                            }]
                        }).show()
                    } else {
                        Ext.Viewport.add({
                            xtype : 'panel',
                            floated : true,
                            modal : true,
                            hideOnMaskTap : true,
                            showAnimation : {
                                type : 'popIn',
                                duration : 250,
                                easing : 'ease-out'
                            },
                            hideAnimation : {
                                type : 'popOut',
                                duration : 250,
                                easing : 'ease-out'
                            },
                            centered : true,
                            width : '90%',
                            bodyPadding : 10,
                            html : html.join(''),
                            scrollable : true
                        }).show();
                    }

                })
            });
            //</debug>
        },

        /**
         * generate the UID from two parts
         *
         * @returns {number}
         */
        generateUID : function() {
            let firstPart = (Math.random() * 46656) | 0,
                secondPart = (Math.random() * 46656) | 0;

            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);

            return firstPart + '_' + secondPart;
        },

        generateRndString : function(len = 5) {
            return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
        },

        /**
         * http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
         *
         * @param str
         * @returns {number}
         */
        hashCode : function(str = '') {
            let hash = 0, i, chr;

            if (str.length === 0) {
                return hash;
            }

            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        /**
         * dev tool
         */
        fillVisibleForm : function() {
            //<debug>
            let me = this,
                res,
                seq = [];

            res = Array.prototype.slice.call(document.getElementsByTagName('div')).map(function(node) {
                let el = Ext.getCmp(Ext.fly(node).id);

                if (el && el.xtype && !el.canvases && ['chart', 'series', 'overlay', 'background'].indexOf(el.type) === -1 && el.isVisible(true) && !!el.setValue) {
                    return {
                        xtype : el.xtype,
                        id : el.id,
                        el : el
                    };
                }
            });

            res = Ext.Array.clean(res);

            Ext.each(res, function(fieldCfg) {

                seq.push(function() {
                    let dfd = Ext.create('Ext.Deferred');

                    let ell = fieldCfg.el;

                    if (ell.disabled || ell.readOnly || !ell.editable || ell.isSectionLabel) {
                        return;
                    }

                    switch (fieldCfg.xtype) {
                        case 'textfield':
                        case 'textarea':
                            ell.setValue(ell.vtype === 'email' ? 'test_' + me.generateUID() + '@test.com' : 'Test data ' + me.generateRndString(10));
                            break;

                        case 'combobox':
                        case 'criterion_code_detail_field':
                            let firstValRec = ell.getStore().first();
                            ell.setValue(firstValRec ? firstValRec.get(ell.valueField) : null);
                            break;

                        case 'datefield':
                        case 'timefield':
                        case 'criterion_timefield':
                            ell.setValue(new Date());
                            break;

                        case 'numberfield':
                        case 'criterion_currencyfield':
                            ell.setValue(Math.round(Math.random() * 10) + 1);
                            break;

                        case 'criterion_field_ssn':
                            ell.setValue('');
                            break;

                        default:
                    }

                    Ext.defer(function() {
                        ell.focus(); // for set vm
                        dfd.resolve();
                    }, 10);

                    return dfd.promise;
                });

            });

            Ext.Deferred.sequence(seq);
            //</debug>
        },

        generateTipRow : function(caption, value) {
            return Ext.String.format('<div class="tip-row"><span class="caption">{0}:</span><span class="value">{1}</span></div>', caption, value);
        },

        getClassesBlackList : function(tpl) {
            let html = tpl && tpl.html,
                blackList = [],
                tags,
                classExec,
                classStr,
                classes,
                uniq = {};

            if (html) {
                tags = html.replace(/<(\/tpl|tpl).*?>/g, '').match(/<[^/].*?>/g);
                if (tags) {
                    Ext.each(tags, function(tag) {
                        tag = tag.replace(/{(.*?)}/g, '');
                        classExec = /class="(.*?)"/g.exec(tag);
                        if (classExec && (classStr = classExec[1])) {
                            classes = classStr.split(' ');
                            classes.forEach(function(cls) {
                                uniq[cls] = true;
                            });
                        }
                    });

                    blackList = Ext.Object.getKeys(uniq);
                }
            }

            return blackList;
        },

        removeClassNames : function(input, classes) {
            let classesRe = new RegExp((classes || []).join('|'), 'g'),
                tagClassRe = new RegExp('class="[\\w- ]*?"');

            input = (input || '').replace(new RegExp('<[\\w ]*?class="[\\w- ]*?".*?>', 'g'), function(tag) {
                return tag.replace(tagClassRe, function(cls) {
                    return cls.replace(classesRe, '');
                });
            });

            return input;
        },

        isOverflowing : function(dom) {
            return dom && (dom.clientWidth < dom.scrollWidth || dom.clientHeight < dom.scrollHeight);
        },

        setRuntimeValue : function(name, value) {
            if (!name) {
                return;
            }

            if (value) {
                this.runtimeValues[name] = value;
            } else {
                delete this.runtimeValues[name];
            }
        },

        getRuntimeValue : function(name) {
            return this.runtimeValues[name];
        }

    };

});
/* eslint-disable */
