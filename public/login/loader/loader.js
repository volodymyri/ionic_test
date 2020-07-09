var i18n, tenants = [], selectedTenant = null, thirdPartyIsActive = false, globalLoginTenants = [];

!function() {

    var PREFIX = 'criterion',
        BUILD = this.BUILD,
        mode = 'login',
        resetHash,
        resetHashTenantId,
        userLogin,
        isGlobalLogin = false,
        COOKIE = {
            API_TOKEN : 'Authorization',
            API_TENANT_URL : PREFIX + '-tenant_url',
            RESET_HASH : 'resetHash',
            RESET_HASH_TENANT_ID : 'resetHashTenantId',
            IS_GLOBAL_LOGIN : 'isGlobalLogin',
            TENANT_ID : 'tenantId',
            TENANT_MAX_ID : 'tenantMaxId',
            LOGIN : 'login',
            AUTH_FAILURE : 'authFailure',
            API_URL_PREFIX : PREFIX + '-apiUrlPrefix',
            WEB_SOCKET_PREFIX : PREFIX + '-wsPrefix',
            LOCALE : PREFIX + '-locale',
            PROFILE_OVERRIDE : PREFIX + '-profile-override',
            SESSION : 'session',
            IS_EXTERNAL_AUTH : 'isExternalAuth'
        },
        SEC_IN_MONTH = 60 * 60 * 24 * 30,
        EXTERNAL_AUTH_TYPE = {
            AZURE_AD : 1,
            ADFS : 2,
            OKTA : 3
        },
        refTenantId,
        tenantMaxId,
        isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
        flexStyle = isSafari ? '-webkit-flex' : 'flex';

    var loadFonts = function(resourcePath, profile) {
        var fonts = profile === 'modern' ? [
            'fonts/MaterialIcons-Regular.ttf',
            'fonts/roboto/Roboto-Regular.ttf',
            'fonts/roboto/Roboto-Medium.ttf',
            'fonts/roboto/Roboto-Bold.ttf'
        ] : [
            'font-open-sans/fonts/OpenSans-Regular.ttf',
            'font-open-sans/fonts/OpenSans-Bold.ttf',
            'font-open-sans/fonts/OpenSans-Semibold.ttf',
            'font-ionicons/fonts/ionicons.ttf?v=2.0.0',
            'font-icomoon/fonts/icomoon.ttf?1521445140304'
        ];

        fonts.forEach(function(font) {
            var link = document.createElement('link');

            link.href = resourcePath + '/' + font;
            link.rel = "preload";
            link.as = "font";
            link.type = "font/ttf";
            link.crossOrigin = "anonymous";

            document.head.appendChild(link);
        });
    };

    // !!!
    // TODO see loadCustomTranslations
    // don't forget to move this
    // !!!

    function firstArrayElementIndex(array) {
        for (var index in array)
            return parseInt(index, 10);
    }

    // TODO refactor
    function changeTenant(id, login) {
        if (!id) {
            return;
        }

        if (!selectedTenant || !selectedTenant['infoRequired']) {
            selectedTenant = tenants[id];

            if (selectedTenant.webUrl) {
                criterion.AUTH_URL = selectedTenant.webUrl;
            } else {
                criterion.AUTH_URL = new URL(selectedTenant.tenantWebUrl).origin;
            }

            criterion.buildAuthCfg();
        }

        sendRequest(criterion.AUTH.DIRECT_AUTH_INFO, {
            login : login || $('#auth_info [name="login"]').val()
        }, 'GET', function(response) {
            try {
                var resp = JSON.parse(response);

                if (resp.success) {
                    setHTMLToEl('info_message', '');

                    resp.result['tenants'].forEach(function(_tenant) {
                        tenants[_tenant.tenant.id] = merge_objects(tenants[_tenant.tenant.id], _tenant.tenant);

                        if (_tenant.tenant.id === id) {
                            if (_tenant.tenant.isExternalAuth) {
                                hideElement('passCont');
                            } else {
                                showElement('passCont', flexStyle);
                            }
                        }
                    });

                    selectedTenant = tenants[id];

                    selectTenant(resp, true);
                } else {
                    showElement('info_message');
                    setHTMLToEl('info_message', getErrorMessage(resp.code, resp.fields) || resp.message || resp.error);
                }

            } catch (e) {
            }

        });

        setTimeout(function() {
            $('.field-radio:not(.checked)').css('background-color', '#CED3DF');
        }, 10);

        sendRequest(criterion.AUTH.TENANT_STYLE + id, {}, 'GET', function(response) {
            try {
                var resp = JSON.parse(response);

                if (resp.success && resp.result) {
                    $('.company-logo').css('background-image', !!resp.result.logo ? 'url(data:image/png;base64,' + resp.result.logo + ')' : 'none');

                    if (!!resp.result.footer) {
                        $('.links').html(resp.result.footer);
                    } else {
                        $('.links').html(defaultFooter);
                    }

                    if (!!resp.result.color) {
                        $('.cancel').css('color', resp.result.color);
                        $('.btn-auth').css('background-color', resp.result.color);
                        $('.field-radio.checked').css('background-color', resp.result.color);
                        $('.field-checkbox.checked').css('background-color', resp.result.color);
                        $('#info_submit').css('border', '1px solid ' + resp.result.color);
                        $('#form-top').find('#logo-bg').attr('fill', resp.result.color);
                    } else {
                        $('.cancel').css('color', defaultColor);
                        $('.btn-auth').css('background-color', defaultColor);
                        $('.field-radio.checked').css('background-color', defaultColor);
                        $('.field-checkbox.checked').css('background-color', defaultColor);
                        $('#info_submit').css('border', '1px solid ' + defaultColor);
                        $('#form-top').find('#logo-bg').attr('fill', defaultColor);
                    }

                    if (!md || !md.mobile()) {
                        $('.field').on('focus', function() {
                            $(this).css({
                                'border-color' : resp.result.color,
                                'box-shadow' : 'inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 5px ' + resp.result.color
                            });
                        }).on('blur', function() {
                            $(this).css({
                                'border-color' : defaultColor,
                                'box-shadow' : 'none'
                            });
                        });
                    }

                    if (!!resp.result.bodyBackground) {
                        $('.page').css('background-image', 'url(data:image/png;base64,' + resp.result.bodyBackground + ')');
                        $('ul.links li, ul.links li a').css('color', '#ffffff');
                    } else {
                        $('.page').css('background-image', 'none');
                        $('ul.links li, ul.links li a').css('color', defaultFooterColor);

                    }
                }

            } catch (e) {
            }

        });
    }

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

        if (!cookies || !cookies.length || cookies[0] === '') {
            if (typeof Storage !== 'undefined') {
                value = localStorage.getItem('cookie-' + name);

                if (value) {
                    return value;
                }

                return;
            }
        }

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

        if (document.cookie != cookie) {
            if (typeof Storage !== 'undefined') {
                if (value === '') {
                    localStorage.removeItem('cookie-' + name);
                    localStorage.removeItem('cookie-expires');
                } else {
                    localStorage.setItem('cookie-' + name, value);
                    expires && localStorage.setItem('cookie-expires', expires);
                }
            }
        }
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
            setCookie(COOKIE.API_TOKEN, value, !!getCookie(COOKIE.SESSION) ? {
                expires : SEC_IN_MONTH,
                'max-age' : SEC_IN_MONTH
            } : {});
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

    function getElement(id) {
        return document.getElementById(id);
    }

    function showElement(id, showStyle) {
        var el = getElement(id);

        el && (el.style.display = showStyle || 'block');
    }

    function setHTMLToEl(id, html) {
        var el = getElement(id);

        el && (el.innerHTML = html);
    }

    function hideElement(id) {
        var el = getElement(id);

        el && (el.style.display = 'none');
    }

    function isWebClient() {
        return !(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1);
    }

    function sendRequest(url, params, method, callback) {
        var xhr = new XMLHttpRequest(),
            handledCodes = [200, 400, 401, 500],
            _url = url,
            _method = method;

        document.body.className = 'busy';

        if (!_method) {
            _method = 'POST';
        } else if (_method === 'GET') {
            if (_url.charAt(_url.length - 1) !== '?') {
                _url += '?';
            }

            _url += Object.keys(params).map(function(key) {
                return key + '=' + params[key];
            }).join('&');
        }

        xhr.open(_method, _url, true);

        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                return;
            }

            document.body.className = '';

            if (handledCodes.indexOf(xhr.status) === -1) {
                // eslint-disable-next-line no-console
                console.error(xhr.statusText);
            } else {
                callback && callback(xhr.responseText);
            }
        };

        xhr.send((_method === 'GET') ? null : JSON.stringify(params));
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

    function selectTenant(resp, noFillSelectors) {
        if (!resp.result['tenants'] && !!resp.result['secretUserKey']) {
            sendRequest(criterion.AUTH.DIRECT_AUTH_TENANT, {
                tenantId : !!resetHashTenantId ? resetHashTenantId : selectedTenant.id, // eslint-disable-line no-undef
                userId : getTokenPayloadValue('userId') || (selectedTenant && selectedTenant.userId) || resp.result.userId, // eslint-disable-line no-undef
                secretUserKey : resp.result.secretUserKey,
                returnUrl : queryStringObj ? queryStringObj['return_to'] : null
            }, 'POST', function(responseTenant) {
                try {
                    var respTenant = JSON.parse(responseTenant),
                        companyId = $('#info_company_id').val();

                    removeCookie('ext-cache');

                    $('body').fadeOut();

                    if (!isGlobalLogin && respTenant.result.tenant.tenantWebUrl.indexOf(location.origin) === 0) {
                        setCookie(COOKIE.API_TOKEN, respTenant.result.accessToken);
                        setCookie(COOKIE.API_TENANT_URL, respTenant.result.tenant.tenantWebUrl);

                    }

                    if (companyId && window['plugins'] && plugins.appPreferences) {
                        var appPreferences = plugins.appPreferences;

                        appPreferences.store(
                            function() {
                                location.href = './index.html';
                                location.reload();
                            },
                            function() {
                                location.href = './index.html';
                                location.reload();
                            },
                            'companyId',
                            companyId
                        );
                    } else {
                        if (criterion.DIRECT_AUTH === 1) {
                            location.href = './index.html';
                            location.reload();
                        } else {
                            var redirect = queryStringObj && queryStringObj['continue'] ? queryStringObj['continue'] : respTenant.result.tenant.tenantWebUrl,
                                returnTo = queryStringObj && queryStringObj['return_to'],
                                hash = /#(.*)/.exec(redirect),
                                initial = redirect;

                            if (hash && (isGlobalLogin || respTenant.result.tenant.tenantWebUrl.indexOf(location.origin) === -1)) {
                                if (!!returnTo && respTenant.result.isZendeskAccess) {
                                    location.href = respTenant.result.tenant.tenantApiHrUrl + '/zenDesk/goExternal?url=' + encodeURIComponent(returnTo) + '&Authorization=' + respTenant.result.accessToken;
                                } else {
                                    location.href = redirect.replace(hash[0], '') + '#{"tenantId":' + respTenant.result.tenant.id + ',"token":"' + respTenant.result.accessToken + '","redirect":"' + initial + '"}';
                                }
                            } else if (isGlobalLogin || respTenant.result.tenant.tenantWebUrl.indexOf(location.origin) === -1) {
                                if (!!returnTo && respTenant.result.isZendeskAccess) {
                                    location.href = respTenant.result.tenant.tenantApiHrUrl + '/zenDesk/goExternal?url=' + encodeURIComponent(returnTo) + '&Authorization=' + respTenant.result.accessToken;
                                } else {
                                    location.href = redirect + '#{"tenantId":' + respTenant.result.tenant.id + ',"token":"' + respTenant.result.accessToken + '"}';
                                }
                            } else {
                                location.href = redirect;
                            }
                        }
                    }
                } catch (e) {
                }
            });
        }

        if (resp.result.tenants && resp.result.tenants.length && !noFillSelectors) {
            var tenantSelect = getElement('tenant_select');

            if (resp.result.tenants.length < 2) {
                hideElement('tenant_container');
            } else {
                showElement('tenant_container', flexStyle);
            }

            tenantSelect.addEventListener('change', function() {
                changeTenant(parseInt(this.value, 10));
            });

            resp.result.tenants.forEach(function(_t, idx) {
                var tenantOption = document.createElement('option'),
                    tenant = !!_t.tenant ? _t.tenant : _t;

                if (!tenant.id) {
                    tenant.id = tenant.tenantId;
                    delete tenant.tenantId;
                }

                /* eslint-disable no-undef */
                tenants[tenant.id] = tenant;
                tenants[tenant.id]['userId'] = _t.userId;
                /* eslint-enable no-undef */

                tenantOption.setAttribute('class', 'field ');
                tenantOption.setAttribute('id', 'radio-' + tenant.id);
                tenantOption.setAttribute('value', tenant.id);
                tenantOption.innerHTML = tenant.name;

                tenantSelect.appendChild(tenantOption);
            });

            if (refTenantId) {
                tenantSelect.value = refTenantId;
                tenantSelect.disabled = true;
            } else {
                tenantSelect.value = firstArrayElementIndex(tenants);
            }

            changeTenant(parseInt(tenantSelect.value, 10));
        }

        if (resp.result.tenants &&
            (
                (resp.result.tenants.length === 1 && selectedTenant['isExternalAuth']) ||
                (resp.result.tenants.length > 1 && selectedTenant['isExternalAuth'] && selectedTenant['id'] === refTenantId)
            )
        ) {
            setTimeout(function() {
                getElement('login_submit').click();
            }, 100);
        }
    }

    var hash = location.hash.replace(/^#/, ''),
        params = parse(hash),
        queryStringObj = parseQueryString(location.search.substring(1)),
        defaultColor = '#0096EB',
        defaultFooter = '<li>© ' + new Date().getFullYear() + ' Criterion, Inc.</li><li><a href="https://www.criterionhcm.com/company/service-level-agreement/" target="_blank">SLA</a></li>',
        defaultFooterColor = '#414042',
        defaultBodyBg = 'linear-gradient(219.1deg, #0096EB 13.68%, #0168C8 81.53%)';

    if (window['$']) {
        var showPassword = $('.show-password');

        $('.links').html(defaultFooter);

        showPassword.on('tap click', function(event) {
            var passwordField = showPassword.prev();

            if (passwordField.attr('type') === 'password') {
                passwordField.attr('type', 'text');
                showPassword.addClass('active');
            } else {
                passwordField.attr('type', 'password');
                showPassword.removeClass('active');
            }
        });

        $(document).ready(function() {
            var wnd = $(window),
                _originalSize = wnd.width() + wnd.height();

            if (window['device']) {
                wnd.resize(function() {
                    if (wnd.width() + wnd.height() !== _originalSize) {
                        var input = $('input:focus');

                        if (!input.length) {
                            input = $('input:first')
                        }

                        if (input) {
                            $('html, body').animate({
                                scrollTop : input.offset().top
                            }, 100);

                            input.focus();
                        }
                    }
                });
            }

            $('.field-checkbox').on('change', function() {
                var checkbox = $(this);

                if (checkbox.prop('checked')) {
                    checkbox.addClass('checked');
                } else {
                    checkbox.removeClass('checked');
                }
            });

            document.addEventListener('deviceready', function() {
                var appPreferences;

                if (window['plugins'] && plugins.appPreferences) {
                    var imageLogo = $('.image_logo'),
                        companyId = $('.company_id');

                    appPreferences = plugins.appPreferences;

                    appPreferences.fetch(
                        function(value) {
                            if (value) {
                                $('#info_company_id').val(value);
                                criterion.AUTH_URL = 'https://' + value + '.criterionhcm.com';
                                criterion.buildAuthCfg();
                            } else {
                                companyId.show();
                            }
                        },
                        function() {
                            companyId.show();
                        }, 'companyId');

                    imageLogo.dblclick(function() {
                        var counter = imageLogo._counter || 0;

                        counter++;

                        imageLogo._counter = counter;

                        if (counter > 1) {
                            delete (imageLogo._counter);
                            companyId.toggle();
                        }
                    });
                }

                if (window['Fingerprint']) {
                    Fingerprint.isAvailable(function() {
                        if (appPreferences) {
                            appPreferences.fetch(
                                function(value) {
                                    if (value) {
                                        $('.biometric-wrapper').fadeIn();

                                        $('#info_submit').css({
                                            backgroundColor : '#ffffff',
                                            color : '#0096EB',
                                            border : '1px solid #0096EB'
                                        });

                                        $('#biometric_submit').on('tap click', function() {
                                            Fingerprint.show({
                                                clientId : $('#auth_info [name="login"]').val() || Math.floor(Math.random() * 9000000 + 1000000),
                                                clientSecret : Math.floor(Math.random() * 9000000 + 1000000),
                                                disableBackup : true,
                                                localizedFallbackTitle : 'Cancel'
                                            }, function() {
                                                sendRequest(criterion.AUTH.BIOMETRIC_LOGIN, {
                                                    deviceId : device.uuid
                                                }, 'POST', function(response) {
                                                    try {
                                                        var parsedResponse = JSON.parse(response),
                                                            tenant = parsedResponse.result && parsedResponse.result.tenant && parsedResponse.result.tenant.length && parsedResponse.result.tenant[0];

                                                        if (!!tenant) {
                                                            sendRequest(criterion.AUTH.DIRECT_AUTH_TENANT, {
                                                                tenantId : tenant.id, // eslint-disable-line no-undef
                                                                userId : getTokenPayloadValue('userId') || parsedResponse.result.userId, // eslint-disable-line no-undef
                                                                secretUserKey : parsedResponse.result.secretUserKey
                                                            }, 'POST', function(responseTenant) {
                                                                try {
                                                                    var respTenant = JSON.parse(responseTenant);

                                                                    removeCookie('ext-cache');

                                                                    setCookie(COOKIE.API_TOKEN, respTenant.result.accessToken);
                                                                    setCookie(COOKIE.API_TENANT_URL, respTenant.result.tenant.tenantWebUrl);

                                                                    $('body').fadeOut();

                                                                    location.href = './index.html';
                                                                    location.reload();
                                                                } catch (e) {
                                                                }
                                                            })
                                                        } else {
                                                            location.reload();
                                                        }
                                                    } catch (e) {
                                                        location.href = './index.html';
                                                        location.reload();
                                                    }
                                                });
                                            }, function() {

                                            });
                                        });
                                    }
                                },
                                function() {
                                }, 'scanningEnabled');
                        }
                    }, function() {
                    });
                }
            });
        });
    }

    if (queryStringObj && queryStringObj['_rnd'] !== undefined) {
        var rndSearchString = '_rnd=' + queryStringObj['_rnd'],
            newHref;

        if (Object.keys(queryStringObj).length === 1) {
            rndSearchString = '?' + rndSearchString;
        }

        newHref = location.href.replace(rndSearchString, '');

        location.href = newHref;
    }

    if (params && params.redirect) {
        var redirectHash = /#(.*)/.exec(params.redirect);

        location.hash = redirectHash ? redirectHash[1] : '';
    }

    if (params && params.token) {
        setToken(params.token);
        location.href = location.href.replace(hash, '');
    } else {
        this.API_TENANT_URL = getCookie(COOKIE.API_TENANT_URL);
        this.API_URL_PREFIX = getCookie(COOKIE.API_URL_PREFIX);
        this.WEB_SOCKET_PREFIX = getCookie(COOKIE.WEB_SOCKET_PREFIX);
    }

    resetHash = getCookie(COOKIE.RESET_HASH);
    resetHashTenantId = getCookie(COOKIE.RESET_HASH_TENANT_ID);
    isGlobalLogin = getCookie(COOKIE.IS_GLOBAL_LOGIN) === 'true';
    refTenantId = getCookie(COOKIE.TENANT_ID);
    userLogin = getCookie(COOKIE.LOGIN);

    if (refTenantId) {
        refTenantId = parseInt(refTenantId, 10);
    }

    removeCookie(COOKIE.RESET_HASH);
    removeCookie(COOKIE.RESET_HASH_TENANT_ID);

    var authFailure = getCookie(COOKIE.AUTH_FAILURE);

    removeCookie(COOKIE.AUTH_FAILURE);

    if (!authFailure && typeof Storage !== 'undefined') {
        authFailure = localStorage.getItem('AUTH_FAILURE');
    }

    if (authFailure) {
        if (isWebClient()) {
            showElement('info_message');
            setHTMLToEl('info_message', decodeURIComponent(authFailure).replace('+', ' '));
        } else {
            // eslint-disable-next-line no-alert
            alert(authFailure);
        }

        localStorage.removeItem('AUTH_FAILURE');
    }

    clearToken();
    removeCookie(COOKIE.API_TENANT_URL);

    if (criterion.DIRECT_AUTH !== false) {
        if (criterion.DIRECT_AUTH === 1 && location.href.indexOf('auth.html') === -1) {
            location.href = './auth.html';
        }

        var infoSubmit = getElement('info_submit'),
            loginSubmit = getElement('login_submit');

        showElement('auth', flexStyle);
        showElement('auth_info');

        if (!infoSubmit) {
            return;
        }

        if (typeof Storage !== 'undefined') {
            var login = $('#auth_info [name="login"]'),
                authLogin = $('#auth_login [name="login"]'),

                lastLogin = localStorage.getItem('lastLogin');

            if (lastLogin !== undefined) {
                login && login.val(lastLogin);
                authLogin && authLogin.val(lastLogin);
            }
        }

        if (!!resetHash && resetHashTenantId) {
            mode = 'reset';
            hideElement('info_message');
            hideElement('login_wrapper');
            hideElement('info_submit');
            hideElement('auth_info');

            hideElement('passCont');
            hideElement('forgotCont');
            hideElement('tenant_container');
            showElement('auth_login');
            showElement('password1Cont', flexStyle);
            showElement('password2Cont', flexStyle);
            showElement('pinCont');

            getElement('login_submit').value = 'Reset Password';
        }

        if (criterion.DIRECT_AUTH > 0) {
            criterion.AUTH_URL = 'https://login.criterionhcm.com';
        } else {
            criterion.AUTH_URL = window.location.origin;
        }

        criterion.buildAuthCfg();

        infoSubmit.onclick = function() {
            var login = $('#auth_info [name="login"]').val();

            infoSubmit.disabled = true;

            if (window['device']) {
                var companyId = $('#info_company_id').val();

                if (!companyId) {
                    return;
                }

                criterion.AUTH_URL = 'https://' + companyId + '.criterionhcm.com';
            } else {
                if (criterion.DIRECT_AUTH > 0) {
                    criterion.AUTH_URL = 'https://login.criterionhcm.com';
                } else {
                    criterion.AUTH_URL = window.location.origin;
                }
            }

            criterion.buildAuthCfg();

            sendRequest(isGlobalLogin ? criterion.AUTH.GLOBAL_AUTH_INFO : criterion.AUTH.DIRECT_AUTH_INFO, {
                login : login
            }, 'GET', function(response) {
                var resp;

                infoSubmit.disabled = false;

                setHTMLToEl('info_message', '');

                try {
                    resp = JSON.parse(response);
                } catch (e) {
                }

                if (!resp) {
                    return;
                }

                if (resp.success) {
                    hideElement('info_message');
                    hideElement('auth_info');

                    if (typeof Storage !== 'undefined') {
                        localStorage.setItem('lastLogin', login);
                    }

                    var loginInput = $('#auth_login [name="login"]');

                    loginInput.val(resp.result.login);
                    loginInput.attr('disabled', true);

                    showElement('auth_login');

                    selectTenant(resp);

                } else {
                    showElement('info_message');
                    setHTMLToEl('info_message', getErrorMessage(resp.code, resp.fields) || resp.message || resp.error);
                }
            });
        };

        if (userLogin) {
            $('#auth_info [name="login"]').val(userLogin);
            infoSubmit.click();
        }

        loginSubmit.onclick = function() {
            getElement('login_message').innerHTML = '';
            hideElement('login_message');

            loginSubmit.disabled = true;

            if (selectedTenant && selectedTenant['isExternalAuth']) {
                if (!selectedTenant['infoRequired']) {
                    if (window['device']) {
                        if (selectedTenant['isCommonMobileAuth']) {
                            if (!thirdPartyIsActive) {
                                var externalAuthMobileRedirectUrl = selectedTenant['externalAuthMobileRedirectUrl'],
                                    browser;

                                hideElement('auth');

                                browser = cordova.InAppBrowser.open(externalAuthMobileRedirectUrl, '_blank', 'hideurlbar=yes,closebuttoncaption=Cancel');

                                browser.show();

                                thirdPartyIsActive = true;

                                browser.addEventListener('loadstop', function(evt) {
                                    if (evt.url.endsWith(selectedTenant['externalAuthMobileResponseRedirectUrl'])) {
                                        browser.executeScript({
                                            code : "document.getElementById('token').innerHTML"
                                        }, function(token) {
                                            setCookie(COOKIE.API_TOKEN, token);
                                            setCookie(COOKIE.API_TENANT_URL, selectedTenant.webUrl);
                                            browser.close();
                                            location.href = './index.html';
                                            location.reload();
                                        });
                                    }

                                    if (evt.url.includes('/logout')) {
                                        setTimeout(function() {
                                            browser.executeScript({
                                                code : "location.href='" + externalAuthMobileRedirectUrl + "'"
                                            });
                                        }, 2000);
                                    }
                                });

                                browser.addEventListener('loaderror', function(err) {
                                    thirdPartyIsActive = false;
                                    showElement('info_message');
                                    showElement('auth', flexStyle);
                                    setHTMLToEl('info_message', err.message);
                                    browser.close();
                                });

                                browser.addEventListener('exit', function() {
                                    location.reload();
                                });
                            }
                        } else {
                            if (selectedTenant['authenticationTypeCd'] === EXTERNAL_AUTH_TYPE.ADFS) {
                                if (!thirdPartyIsActive) {
                                    thirdPartyIsActive = true;
                                    hideElement('auth');

                                    var authContext = new Microsoft.ADAL.AuthenticationContext('https://login.windows.net/common');

                                    authContext.acquireTokenAsync('https://graph.windows.net', selectedTenant['externalAuthAttribute3'], 'http://CriterionHCM', $('#auth_login [name="login"]').val())
                                        .then(function(authResponse) {
                                            thirdPartyIsActive = false;
                                            sendRequest(criterion.AUTH.DIRECT_AUTH_AZURE, {
                                                azureJWT : authResponse.accessToken,
                                                userId : selectedTenant.userId
                                            }, 'POST', function(response) {
                                                try {
                                                    var parsedResponse = JSON.parse(response);

                                                    setCookie(COOKIE.API_TOKEN, parsedResponse.result.accessToken);
                                                    setCookie(COOKIE.API_TENANT_URL, parsedResponse.result.webUrl);

                                                    $('body').fadeOut();

                                                    location.href = './index.html';
                                                    location.reload();
                                                } catch (e) {
                                                    showElement('auth', flexStyle);
                                                    return;
                                                }
                                            });
                                        }, function(err) {
                                            thirdPartyIsActive = false;
                                            showElement('auth', flexStyle);
                                            showElement('login_message');
                                            getElement('login_message').innerHTML = err.message;
                                        });

                                    return;
                                }
                            }
                        }
                    } else {
                        if (isGlobalLogin) {
                            location.href = selectedTenant.webUrl + '?login=' + $('#auth_login [name="login"]').val() + '&tenantId=' + selectedTenant.id;
                        } else {
                            sendRequest(criterion.AUTH.EXTERNAL_AUTH_LOGIN, {
                                login : $('#auth_login [name="login"]').val(),
                                tenantId : selectedTenant.id
                            }, 'POST', function(response) {
                                var resp;

                                loginSubmit.disabled = false;

                                try {
                                    resp = JSON.parse(response);
                                } catch (e) {
                                    error.html('Unknown error occurred.');
                                }

                                if (!resp) {
                                    return;
                                }

                                if (resp.success) {
                                    location.href = resp.result.redirect;
                                } else {
                                    showElement('info_message');
                                    setHTMLToEl('info_message', getErrorMessage(resp.code, resp.fields) || resp.message || resp.error);
                                }
                            });
                        }
                    }
                } else {
                    loginSubmit.disabled = false;
                    changeTenant(selectedTenant['id'], $('#auth_login [name="login"]').val());
                }

                return;
            }

            sendRequest(
                mode === 'login' ? criterion.AUTH.DIRECT_AUTH_LOGIN : criterion.AUTH.DIRECT_AUTH_SET_PASSWORD,
                mode === 'login' ? {
                    login : $('#auth_login [name="login"]').val(),
                    password : getElement('password').value,
                    tenantId : selectedTenant.id, // eslint-disable-line no-undef
                    rememberMe : getElement('rememberMe').checked
                } : {
                    newPassword1 : getElement('password1').value,
                    newPassword2 : getElement('password2').value,
                    pin : getElement('pin').value,
                    hash : resetHash,
                    tenantId : resetHashTenantId ? resetHashTenantId : selectedTenant.id // eslint-disable-line no-undef
                }, 'POST', function(responseLoginSubmit) {
                    var _resp;

                    loginSubmit.disabled = false;
                    getElement('login_message').innerHTML = '';

                    try {
                        _resp = JSON.parse(responseLoginSubmit);
                    } catch (e) {
                    }

                    if (!_resp) {
                        return;
                    }

                    if (_resp.success) {
                        if (_resp.result.expired) {
                            hideElement('info_message');
                            hideElement('auth_info');

                            hideElement('passCont');
                            hideElement('forgotCont');
                            showElement('auth_login');
                            showElement('password1Cont', flexStyle);
                            showElement('password2Cont', flexStyle);
                            showElement('pinCont');

                            loginSubmit.value = 'Reset Password';
                            var tenantInputs = getElement('tenant_container').getElementsByTagName('input');

                            for (var i = 0; i < tenantInputs.length; i++) {
                                tenantInputs[i].disabled = true;
                            }

                            mode = 'reset';
                            resetHash = _resp.result.hash;
                        } else {
                            if (typeof Storage !== 'undefined') {
                                localStorage.setItem('lastLogin', $('#auth_login [name="login"]').val());
                            }

                            if (_resp.result.required2FA) {
                                $('#password').hide();
                                $('#authenticationCode').show();

                                if (_resp.result.faSeed) {
                                    $('#enableAuthentication').show();
                                    $('#qrImage').attr('src', 'data:image/jpg;base64,' + _resp.result.qrImage);
                                    $('#faSeed').html(_resp.result.faSeed);
                                    // $('.links').hide();
                                }

                                $('.rememberHolder').removeClass('hidden').show().css('display', 'block');
                                $('#rememberMeForgot').hide();
                                $('#tenant-select').prop('disabled', true);
                                mode = '2fa';

                                hideElement('login_message');
                                hideElement('auth_login');
                                var submit2fa = getElement('submit_2fa');

                                showElement('auth_2fa');

                                submit2fa.onclick = function() {
                                    submit2fa.disabled = true;
                                    getElement('2fa_message').innerHTML = '';
                                    sendRequest(criterion.AUTH.DIRECT_AUTH_2FA, {
                                        code : getElement('code').value,
                                        userId : _resp.result.userId,
                                        secretUserKey : _resp.result.secretUserKey,
                                        rememberDevice : getElement('rememberDevice').checked
                                    }, 'POST', function(response2fa) {
                                        var resp2fa;

                                        submit2fa.disabled = false;

                                        try {
                                            resp2fa = JSON.parse(response2fa);
                                        } catch (e) {
                                        }

                                        if (!resp2fa) {
                                            return;
                                        }

                                        if (resp2fa.success) {
                                            selectTenant(resp2fa);
                                        } else {
                                            showElement('2fa_message');
                                            getElement('2fa_message').innerHTML = getErrorMessage(resp2fa.code, resp2fa.fields) || resp2fa.message;
                                        }
                                    });
                                };
                            } else {
                                selectTenant(_resp);
                            }
                        }
                    } else {
                        showElement('login_message');
                        getElement('login_message').innerHTML = getErrorMessage(_resp.code, _resp.fields) || _resp.message || _resp.error;
                    }
                }
            );
        };

        var forgotSubmit = getElement('forgot_submit'),
            forgotMessage = getElement('forgot_message');

        if (!forgotSubmit) {
            return;
        }

        forgotSubmit.onclick = function() {
            forgotSubmit.disabled = true;
            sendRequest(criterion.AUTH.DIRECT_AUTH_FORGOT, {
                login : getElement('forgot_login').value,
                tenantId : selectedTenant.id // eslint-disable-line no-undef
            }, 'POST', function(response) {
                var resp;

                forgotSubmit.disabled = false;
                getElement('forgot_message').innerHTML = '';

                try {
                    resp = JSON.parse(response);
                } catch (e) {
                }

                if (!resp) {
                    return;
                }

                if (resp.success) {
                    showElement('forgot_message');
                    // forgotMessage.className = '';
                    forgotMessage.innerHTML = resp['result'] && resp['result']['message'] || resp['message'];
                } else {
                    showElement('forgot_message');
                    // forgotMessage.className = 'error';
                    forgotMessage.innerHTML = resp['result'] && getErrorMessage(resp['result']['code'], resp['result']['fields']) || resp['result']['message'] || resp['message'] || resp['message'] || resp['code'];
                }
            });
        };
    } else {
        location.href = this.AUTH_URL + '?continue=' + encodeURIComponent(location.href) + '&_rnd=' + new Date().getTime();
    }

    if (refTenantId) {
        var isExternalAuth = getCookie(COOKIE.IS_EXTERNAL_AUTH) === 'true';

        if (isExternalAuth) {
            hideElement('auth_info');
            hideElement('tenant_container');
            hideElement('passCont');
            showElement('auth_login');
        } else {
            hideElement('auth_info');
            hideElement('tenant_container');
            showElement('auth_login');
        }

        selectedTenant = {
            id : refTenantId,
            isExternalAuth : isExternalAuth,
            infoRequired : true
        };

        sendRequest(criterion.AUTH.TENANT_STYLE + refTenantId, {}, 'GET', function(response) {
            try {
                var resp = JSON.parse(response);

                if (resp.success && resp.result) {
                    $('.company-logo').css('background-image', !!resp.result.logo ? 'url(data:image/png;base64,' + resp.result.logo + ')' : 'none');

                    if (!!resp.result.footer) {
                        $('.links').html(resp.result.footer);
                    } else {
                        $('.links').html(defaultFooter);
                    }

                    if (!!resp.result.color) {
                        $('.cancel').css('color', resp.result.color);
                        $('.btn-auth').css('background-color', resp.result.color);
                        $('.field-radio.checked').css('background-color', resp.result.color);
                        $('.field-checkbox.checked').css('background-color', resp.result.color);
                        $('#info_submit').css('border', '1px solid ' + resp.result.color);
                        $('#form-top').find('#logo-bg').attr('fill', resp.result.color);
                    } else {
                        $('.cancel').css('color', defaultColor);
                        $('.btn-auth').css('background-color', defaultColor);
                        $('.field-radio.checked').css('background-color', defaultColor);
                        $('.field-checkbox.checked').css('background-color', defaultColor);
                        $('#info_submit').css('border', '1px solid ' + defaultColor);
                        $('#form-top').find('#logo-bg').attr('fill', defaultColor);
                    }

                    if (!md || !md.mobile()) {
                        $('.field').on('focus', function() {
                            $(this).css({
                                'border-color' : resp.result.color,
                                'box-shadow' : 'inset 0 1px 2px rgba(0, 0, 0, 0.075), 0 0 5px ' + resp.result.color
                            });
                        }).on('blur', function() {
                            $(this).css({
                                'border-color' : defaultColor,
                                'box-shadow' : 'none'
                            });
                        });
                    }

                    if (!!resp.result.bodyBackground) {
                        $('.page').css('background-image', 'url(data:image/png;base64,' + resp.result.bodyBackground + ')');
                        $('ul.links li, ul.links li a').css('color', '#ffffff');
                    } else {
                        $('.page').css('background-image', 'none');
                        $('ul.links li, ul.links li a').css('color', defaultFooterColor);

                    }
                }

            } catch (e) {
            }

        });
    }

}.call(criterion);
