!function () {

    var PREFIX = 'criterion',
        BUILD = this.BUILD;

    /**
     * Cookies to store info.
     */
    var COOKIE = {
        API_TOKEN : 'Authorization',
        API_URL_PREFIX : PREFIX + '-apiUrlPrefix',
        WEB_SOCKET_PREFIX : PREFIX + '-wsPrefix',
        THEME : PREFIX + '-theme',
        LOCALE : PREFIX + '-locale',
        LOGIN_HOST : 'loginHost'
    };

    var DEFAULT_THEME = 'default';

    var loadFonts = function(resourcePath) {
        var fonts = [
            'font-open-sans/fonts/OpenSans-Regular.ttf',
            'font-open-sans/fonts/OpenSans-Bold.ttf',
            'font-open-sans/fonts/OpenSans-Semibold.ttf',
            'font-ionicons/fonts/ionicons.ttf?v=2.0.0'
        ];

        fonts.forEach(function(font) {
            var link = document.createElement('link');

            link.href = resourcePath + '/' + font;
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/ttf';
            link.crossOrigin = 'anonymous';

            document.head.appendChild(link);
        });
    };

    function parse(str) {
        var value = null;

        try {
            value = JSON.parse(decodeURIComponent(str));
        } catch (err) {
        }

        return value;
    }

    function parseCookieValue(s) {
        var result = s;

        if (result.indexOf('"') === 0) {
            result = result.slice(1, -1).replace(/\\("|\\)/g, '$1');
        }

        return result;
    }

    function getCookie(name) {
        var cookies = document.cookie.split('; '),
            value, parts, key, cookie;

        for (var i = 0, l = cookies.length; i < l; i++) {
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
        var expires, d, cookie, propName, propValue,
            opts = options || {};

        expires = opts.expires;

        if (typeof expires === 'number') {
            d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = opts.expires = d;
        }

        if (expires && expires.toUTCString) {
            opts.expires = expires.toUTCString();
        }

        // Fix to Ext.util.Cookies.clear
        if (!opts.hasOwnProperty('path')) {
            opts.path = '/';
        }

        cookie = name + '=' + value;

        for (propName in opts) {
            if (opts.hasOwnProperty(propName)) {
                cookie += '; ' + propName;

                propValue = opts[propName];

                if (propValue !== true) {
                    cookie += '=' + propValue;
                }
            }
        }

        document.cookie = cookie;
    }

    function removeCookie(name) {
        setCookie(name, '', {
            expires : -1
        });
    }

    function getToken() {
        return getCookie(COOKIE.API_TOKEN);
    }

    function clearToken() {
        removeCookie(COOKIE.API_TOKEN);
    }

    function setToken(value) {
        if (value) {
            setCookie(COOKIE.API_TOKEN, value);
        } else {
            clearToken();
        }
    }

    function getTokenPayloadValue(name) {
        var token = getToken(),
            base64 = token && token.split('.').length > 1 && token.split('.')[1].replace('-', '+').replace('_', '/'),
            payload = base64 && JSON.parse(atob(base64));

        return payload && payload[name];
    }

    function getTenantId() {
        return getTokenPayloadValue('tenantId');
    }

    function parseQueryString(query) {
        var vars = query.split('&'),
            queryStringObj = {};

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');

            // If first entry with this name
            if (typeof queryStringObj[pair[0]] === 'undefined') {
                queryStringObj[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof queryStringObj[pair[0]] === 'string') {
                queryStringObj[pair[0]] = [queryStringObj[pair[0]], decodeURIComponent(pair[1])];
                // If third or later entry with this name
            } else {
                queryStringObj[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }

        return queryStringObj;
    }

    var hash = location.hash.replace(/^#/, ''),
        params = parse(hash),
        queryStringObj = parseQueryString(location.search.substring(1));

    if (queryStringObj && queryStringObj['_rnd'] !== undefined) {
        var rndSearchString = '_rnd=' + queryStringObj['_rnd'];

        if (Object.keys(queryStringObj).length === 1) {
            rndSearchString = '?' + rndSearchString;
        }

        location.href = location.href.replace(rndSearchString, '');
    }

    if (params && params.redirect) {
        var redirectHash = /#(.*)/.exec(params.redirect);

        location.hash = redirectHash ? redirectHash[1] : '';
    }

    if (params && params.token) {
        setToken(params.token);
        location.href = location.href.replace(hash, '');
    } else if (!this.TEST_MODE) {
        this.API_URL_PREFIX = getCookie(COOKIE.API_URL_PREFIX);
        this.WEB_SOCKET_PREFIX = getCookie(COOKIE.WEB_SOCKET_PREFIX);
    }

    if (!getTenantId()) {
        var loginHost = getCookie(COOKIE.LOGIN_HOST) || this.AUTH_URL;

        clearToken();

        location.href = loginHost + '?continue=' + encodeURIComponent(location.href);

        return;
    }

    // Disable caching
    removeCookie('ext-cache');

    this.LOCALE = getCookie(COOKIE.LOCALE) || 'en';

    window.Ext = window.Ext || {};

    // This function is called by the Microloader after it has performed basic
    // device detection. The results are provided in the 'tags' object. You can
    // use these tags here or even add custom tags. These can be used by platform
    // filters in your manifest or by platformConfig expressions in your app.
    //
    Ext.beforeLoad = function () {
        return function (manifest) {

            i18n.init();
            i18n.loadCustomTranslations(function() {
                i18n.rebuild();
                Ext.GlobalEvents && Ext.GlobalEvents.fireEvent('customTranslationReady');
            }, 'hr');

            loadFonts(manifest.content.resources.path);
        };
    };

}.call(criterion);
