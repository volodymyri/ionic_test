Ext.require(['criterion.Consts', 'criterion.LocalizationManager', 'criterion.JWT'], function() {

    const ApiConfig = criterion.consts.Api,
        API = ApiConfig.API,
        RECONNECTS = '_reconnects',
        WAITING_SERVICE_ATTEMPTS = '_waitingServiceAttempt';

    Ext.define('criterion.Api', function() {

        let noCache = {
                toString : function() {
                    return Number(new Date()).toString(36);
                }
            },

            /**
             * User is authenticated.
             */
            authenticated,

            /**
             * Authorized person
             */
            currentPerson,

            isSandbox,

            isProduction,

            personModules,

            authenticationType,

            isExternalAuth,

            usingExternalAuth,

            subordinatesCount,

            personFunctions,

            requiredFields = [],

            activeRequests = new Ext.util.HashMap(),

            hasCertifiedRate,

            suppressErrors = false;

        function setToken(token) {
            if (token) {
                criterion.JWT.setToken(token);
            } else {
                criterion.JWT.clearToken();
            }
        }

        function setCurrentPerson(value) {
            currentPerson = value;
        }

        function setPersonModules(value) {
            personModules = value;
        }

        function setAuthenticationType(value) {
            authenticationType = value;
        }

        function setIsExternalAuth(value) {
            isExternalAuth = value;
        }

        function setUsingExternalAuth(value) {
            usingExternalAuth = value;
        }

        function setSandBox(isSandboxV) {
            isSandbox = isSandboxV;
            Ext.GlobalEvents.fireEvent('isSandbox', isSandbox);
        }

        function setIsProduction(value) {
            isProduction = value;
        }

        function setPersonFunctions(value) {
            personFunctions = value;
        }

        function setSubordinatesCount(value) {
            subordinatesCount = value;
        }

        function getAuthenticated() {
            return authenticated;
        }

        function setAuthenticated(value) {
            authenticated = !!value;
        }

        function setRequiredFields(value) {
            Ext.Object.each(value || {}, (k, v) => {
                requiredFields[k] = v.split(',');
            });
        }

        function getReason(json) {
            return json[ApiConfig.CODE_PROPERTY] || json[ApiConfig.MESSAGE_PROPERTY] || '';
        }

        function callback(options, success, response, opts) {
            Ext.callback(opts.callback, opts.scope, [opts, !!response.isSuccess, response]);
            activeRequests.removeAtKey(response.request.id);
        }

        function showServerError(response) {
            let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson);

            criterion.consts.Error.showMessage(data);

            criterion.Utils.removeMasks();
        }

        function show502ErrorMessage() {
            criterion.consts.Error.show502Error();
            criterion.Utils.removeMasks();
        }

        function checkUnauthorised(response, opts) {
            let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson),
                code;

            code = Ext.isString(data) ? data : data.code;

            if (code === criterion.consts.Error.RESULT_CODES.SESSION_WAS_EXPIRED) {
                // In case any components are still not initialized at the moment
                if (typeof criterion.Msg === 'undefined' || typeof criterion.Msg.showMsg === 'undefined' || typeof Ext.MessageBox.WARNING === 'undefined') {
                    localStorage.setItem(criterion.Consts.AUTH_FAILURE, 'Your session has timed-out. Please login to continue.');

                    if (!criterion.Application.isAdmin()) {
                        criterion.detectDirtyForms = false;
                    }

                    criterion.Api.logout();

                    return;
                }

                if (Ext.isModern) {
                    criterion.Msg.showMsg(
                        i18n.gettext('Session Timeout'),
                        {
                            message : criterion.consts.Error.getServerErrorsObject().SESSION_WAS_EXPIRED.description,
                            icon : Ext.MessageBox.WARNING
                        },
                        function() {
                            criterion.Api.logout();
                        }
                    );
                } else {
                    criterion.Msg.showMsg(
                        i18n.gettext('Session Timeout'),
                        {
                            message : criterion.consts.Error.getServerErrorsObject().SESSION_WAS_EXPIRED.description,
                            icon : Ext.MessageBox.WARNING,
                            minWidth : 480,
                            callback : function() {
                                if (!criterion.Application.isAdmin()) {
                                    criterion.detectDirtyForms = false;
                                }

                                criterion.Api.logout();
                            }
                        }
                    );
                }

                return;
            }

            if (opts.url === API.AUTHENTICATE_REMEMBERED) {
                criterion.Api.showAccessDeniedMessage();
            } else {
                if (typeof criterion.Msg === 'undefined' || criterion.Msg.warning === 'undefined' || typeof i18n.gettext === 'undefined') {
                    localStorage.setItem(criterion.Consts.AUTH_FAILURE, 'Session was renewed. Please login to continue.');
                    criterion.Api.logout();

                    return;
                }

                criterion.Msg.warning({
                    title : i18n.gettext('Unauthorised'),
                    message : i18n.gettext('Checking authentication.'),
                    wait : true,
                    waitConfig : {interval : 200}
                });

                criterion.Api.isAuthenticated(function(isAuthenticated) {
                    if (isAuthenticated) {
                        criterion.Msg.warning(i18n.gettext('Session was renewed. Please retry operation.'));
                    } else {
                        criterion.Api.showAccessDeniedMessage();
                    }
                });
            }
        }

        function failure(response, opts) {
            let silent = suppressErrors || opts.silent;

            // eslint-disable-next-line no-console
            !silent && console && console.error && console.error(response, opts);

            if (!silent) {
                switch (parseInt(response.status, 10)) {
                    case 401:
                        checkUnauthorised(response, opts);

                        return;
                    case 502:
                        show502ErrorMessage();

                        break;
                    case 400:
                    case 406:
                    case 500:
                    case 504:
                        showServerError(response, opts);

                        break;

                    // no default
                }
            }

            Ext.callback(opts.failure, opts.scope, [response, opts]);
        }

        function success(response, opts) {
            let json,
                token;

            if (!response.responseText) {
                json = response.responseJson;
            } else {
                json = Ext.decode(response.responseText, true);
            }

            token = response && response.getResponseHeader('jwt-auth');

            if (token) {
                setToken(token);
            }

            if (json === null || json[ApiConfig.SUCCESS_PROPERTY] !== true) {
                response.statusText = json ? getReason(json) : 'parse';

                return failure(response, opts);
            }

            response.isSuccess = true;
            Ext.callback(opts.success, opts.scope, [json[ApiConfig.DATA_ROOT], response, opts]);
        }

        return {
            singleton : true,

            requires : [
                'Ext.Ajax',
                'criterion.Consts',
                'criterion.consts.Api',
                'criterion.consts.Error',
                'criterion.Utils',
                'criterion.JWT'
            ],

            config : {
                employeeId : null,
                employerId : null,
                authResult : null
            },

            showAccessDeniedMessage : function(msg) {
                if (typeof criterion.Msg === 'undefined' || typeof criterion.Msg.error === 'undefined' || typeof i18n.gettext === 'undefined') {
                    localStorage.setItem(criterion.Consts.AUTH_FAILURE, 'You are not allowed to use the system.');

                    return criterion.Api.logout();
                }

                return criterion.Msg.error({
                    title : i18n.gettext('Not allowed'),
                    message : msg || i18n.gettext('You are not allowed to use<br> the system.'),
                    fn : function() {
                        criterion.Api.logout();
                    }
                });
            },

            setToken : function(token) {
                setToken(token);
            },

            getToken : function() {
                return criterion.JWT.getToken() || '';
            },

            getIsSandbox : function() {
                return isSandbox;
            },

            getIsProduction : function() {
                return isProduction;
            },

            getTenantId : function() {
                return criterion.JWT.getTenantId() || '';
            },

            getCurrentPerson : function() {
                return currentPerson;
            },

            getPersonModules : function() {
                return personModules;
            },

            getSubordinatesCount : function() {
                return subordinatesCount;
            },

            getAuthenticationType : function() {
                return authenticationType;
            },

            getIsExternalAuth : function() {
                return isExternalAuth;
            },

            getUsingExternalAuth : function() {
                return usingExternalAuth;
            },

            getCurrentPersonId : function() {
                let person = this.getCurrentPerson();

                return person ? person.id : null;
            },

            hasCertifiedRate() {
                return hasCertifiedRate;
            },

            getEmployerLogo : function(employerId, preview) {
                let src = API['EMPLOYER' + (preview ? '_PREVIEW' : '') + '_LOGO'];

                return src + (employerId ? '/' + employerId + '?' + noCache : '');
            },

            getLogo : function(entityId, entityType, preview) {
                let src = API[entityType + (preview ? '_PREVIEW' : '') + '_LOGO'];

                return src + (entityId ? '/' + entityId + '?' + noCache : '');
            },

            request(opts) {
                let HEADER = ApiConfig.HEADER,
                    data, headers,
                    me = this,
                    req;

                //<debug>
                if (!criterion.PRODUCTION) {
                    // API Imitations for testing/development purposes
                    if (Ext.isObject(opts.params) && opts.params['_fkApi_']) {
                        opts.url = opts.url.replace('api', criterion.consts.Api.API_IMITATION_CFG.prefix);
                        console.warn('%cURL replaced -> ' + opts.url, 'color:#ff8d01;font-weight:bold');
                    } else {
                        Ext.Array.each(criterion.consts.Api.API_IMITATION_CFG.URLS, function(apiUrlRegexp) {
                            if (!/-fake/.test(opts.url) && apiUrlRegexp.test(opts.url)) {
                                opts.url = opts.url.replace('api', criterion.consts.Api.API_IMITATION_CFG.prefix);
                                console.warn('%cURL replaced -> ' + opts.url, 'color:#ff8d01;font-weight:bold');

                                return false;
                            }
                        });
                    }

                    // API delay proxy
                    if (Ext.isObject(opts.params) && opts.params['_fkDelayed_']) {
                        opts.params['origUrl'] = opts.url;

                        if (!opts.params['_delay_']) {
                            opts.params['_delay_'] = 1;
                        }
                        opts.url = '/' + criterion.consts.Api.API_IMITATION_CFG.prefix + '/delayedProxyUrl';

                        console.warn(`%cURL ${opts.params['origUrl']} delayed -> ${opts.params['_delay_']}ms`, 'color:#ff8d01;font-weight:bold');
                    }
                }
                //</debug>

                data = Ext.apply({}, {
                    timeout : (5 * 60) * 1000, // 5 minutes
                    cors : true,
                    scope : this,
                    success : response => {
                        let stopTime = performance ? performance.now() : Date.now();

                        if (response.status !== 0) {
                            criterion.Log && criterion.Log.logRequestTime(
                                opts.url.replace(/_dc=[\d]*/, '').replace(/\?$/, '').replace('?&', '?'),
                                stopTime - response.request.startProcessing
                            );

                            delete opts[RECONNECTS];
                            delete opts[WAITING_SERVICE_ATTEMPTS];
                            criterion.Application.hideServiceMessage();
                            success.call(me, response, opts);
                        } else {
                            me.reconnect(opts, function() {
                                me.request(opts);
                            });
                        }
                    },
                    failure : response => {
                        if ((response.status === 0 || response.status === 502) && (!opts[RECONNECTS] || opts[RECONNECTS] < criterion.Consts.RECONNECT_ATTEMPTS - 1)) {
                            me.reconnect(opts, () => me.request(opts));
                        } else if (response.status === 503) {
                            me.waitingService(opts, () => me.request(opts));
                        } else {
                            delete opts[RECONNECTS];
                            delete opts[WAITING_SERVICE_ATTEMPTS];
                            criterion.Application.hideServiceMessage();
                            failure.call(me, response, opts);
                        }
                    },
                    callback : (options, success, response) => {
                        if (!opts[RECONNECTS] && !opts[WAITING_SERVICE_ATTEMPTS]) {
                            callback.call(me, options, success, response, opts);
                            activeRequests.removeAtKey(response.request.id);
                        }
                    }
                }, opts);

                headers = data.headers || (data.headers = {});

                headers[HEADER.AUTHORIZATION] = this.getToken();
                headers[HEADER.EMPLOYER_ID] = this.getEmployerId();
                if (opts[RECONNECTS]) {
                    headers[HEADER.CRITERION_RECONNECT_ATTEMPT] = opts[RECONNECTS];
                }
                if (opts[WAITING_SERVICE_ATTEMPTS]) {
                    headers[HEADER.CRITERION_WAITING_SERVICE_ATTEMPT] = opts[WAITING_SERVICE_ATTEMPTS];
                }

                req = Ext.Ajax.request(data);

                activeRequests.add(req.id, {req : req});
                req.startProcessing = performance ? performance.now() : Date.now();

                return req;
            },

            reconnect(opts, method) {
                if (!opts[RECONNECTS]) {
                    opts[RECONNECTS] = 1;
                    Ext.defer(() => {
                        method();
                    }, criterion.Consts.FIRST_RECONNECT_DELAY);
                } else {
                    criterion.Application.showServiceMessage(i18n.gettext('Connection Lost'), i18n.gettext('Attempting to re-establish...'), opts);

                    Ext.defer(() => {
                        opts[RECONNECTS]++;
                        method();
                    }, criterion.Consts.RECONNECT_DELAY);
                }
            },

            waitingService(opts, method) {
                if (!opts[WAITING_SERVICE_ATTEMPTS]) {
                    opts[WAITING_SERVICE_ATTEMPTS] = 1;
                    Ext.defer(() => method(), criterion.Consts.FIRST_WAITING_SERVICE_DELAY);
                } else {
                    criterion.Application.showServiceMessage(i18n.gettext('Service is busy'), i18n.gettext('Please wait...'), opts);

                    Ext.defer(() => {
                        opts[WAITING_SERVICE_ATTEMPTS]++;
                        method();
                    }, criterion.Consts.WAITING_SERVICE_DELAY);
                }
            },

            requestWithPromise(opts) {
                let dfd = Ext.create('Ext.Deferred');

                this.request(Ext.apply(opts || {}, {
                    scope : this,
                    success : function(obj, res) {
                        if (Ext.isObject(obj)) {
                            obj = Ext.Object.merge(obj, {responseStatus : res.status});
                        }

                        if (opts['rawResponse']) {
                            dfd.resolve(res);
                        } else {
                            dfd.resolve(obj);
                        }
                    },
                    failure : function(response) {
                        dfd.reject(response);
                    }
                }));

                return dfd.promise;
            },

            /**
             * Checks whether user is logged in and calls specified handler.
             *
             * @param {Function} handler
             * @param {Object} scope
             */
            isAuthenticated : function(handler, scope) {
                let me = this;

                /**
                 * @memberOf criterion.Api
                 */
                function callHandler(authenticated, result) {
                    let me1 = this;

                    setAuthenticated(authenticated);

                    if (authenticated && result) {
                        if (!result.preferences) {
                            result = Ext.apply(result, {
                                preferences : {}
                            });
                        }

                        me1.setEmployerId(result.defaultEmployerId);
                        me1.setAuthResult(Ext.clone(result));
                        setSubordinatesCount(result.subordinatesCount);
                        setCurrentPerson(result.person);
                        setPersonModules(result.module);
                        setAuthenticationType(result.authenticationType);
                        setIsExternalAuth(result.isExternalAuth);
                        setUsingExternalAuth(result.usingExternalAuth);
                        setSandBox(result.isSandbox);
                        setIsProduction(result.isProduction);

                        hasCertifiedRate = result.hasCertifiedRate;

                        setPersonFunctions(result.functions || {
                            EMPLOYEE : [1, 1, 1, 1]
                        });

                        setRequiredFields(result.requiredFields);

                        criterion.LocalizationManager.init(result.preferences.local);

                        criterion.VERSION = result.version;
                        criterion.useLogger = true;
                        (console.info || console.log).call(console, "\u2605 CriterionHCM [", criterion.VERSION, ']');
                    }

                    Ext.GlobalEvents.fireEvent('authenticated', result);

                    return Ext.callback(handler, scope, [getAuthenticated(), result]);
                }

                return me.request({
                    url : API.AUTHENTICATE_REMEMBERED,
                    method : 'POST',
                    isAuthRequest : true,
                    success : function(result) {
                        return Ext.callback(callHandler, me, [true, result]);
                    },
                    failure : function(result) {
                        if (result.status === 401) {
                            return Ext.callback(callHandler, me, [false, result]);
                        }
                    }
                });
            },

            clearCookies : function() {
                criterion.JWT.clearToken();

                criterion.Utils.removeCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYER_ID);
                criterion.Utils.removeCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYEE_ID);
                criterion.Utils.removeCookie(criterion.Consts.COOKIE.PROFILE_OVERRIDE);
            },

            logout : function(opts) {
                this.clearCookies();

                if (criterion.DIRECT_AUTH) {
                    let logoutTo = (criterion.appName === 'admin') ?
                        criterion.consts.Route.getDirect(criterion.consts.Route.HR.MAIN) :
                        './auth.html'; // criterion.consts.Route.getDirect(criterion.consts.Route.SELF_SERVICE.MAIN);

                    if (opts && opts.responseText) {
                        try {
                            let resp = JSON.parse(opts.responseText);

                            if (typeof Storage === 'undefined') {
                                localStorage.removeItem(criterion.Consts.AUTH_FAILURE);

                            } else if (!resp.success) {
                                localStorage.setItem(criterion.Consts.AUTH_FAILURE, resp.message);
                            }
                        } catch (e) {
                        }
                    }

                    location.href = logoutTo;
                    location.reload(true);
                } else {
                    location.href = location.origin + '/logout?continue=' + location.origin + location.pathname;
                }
            },

            setAuthorizationHeader : function(options) {
                if (getAuthenticated()) {
                    options.headers = options.headers || {};
                    options.headers[ApiConfig.HEADER.AUTHORIZATION] = this.getToken();
                }
            },

            ajaxRequestCompleteHandler : function(response) {
                let token = response && response.getResponseHeader('jwt-auth');

                if (getAuthenticated() && token) {
                    this.setToken(token);
                }
            },

            loadCodeData : function(ids, success, failure, scope, data) {
                this.request({
                    url : API.CODE_TABLE_DETAIL,
                    params : Ext.apply(data || {}, {
                        codeTableNames : ids.join(',')
                    }),
                    method : 'GET',
                    scope : scope,
                    success : success,
                    failure : failure
                });
            },

            saveCodeData : function(data, success, failure, scope) {
                let isNew = typeof data.id === 'undefined';

                this.request({
                    url : API.CODE_TABLE_DETAIL + (isNew ? '' : '/' + data.id),
                    method : isNew ? 'POST' : 'PUT',
                    scope : scope,
                    jsonData : data,
                    success : success,
                    failure : failure
                });
            },

            deleteCodeDataRecord : function(id, success, failure, scope) {
                let url;

                if (Ext.isArray(id)) {
                    url = API.CODE_TABLE_DETAIL + '?ids=' + id.join(',');
                } else {
                    url = API.CODE_TABLE_DETAIL + '/' + id;
                }

                this.request({
                    url : url,
                    method : 'DELETE',
                    scope : scope,
                    success : success,
                    failure : failure
                });
            },

            /**
             * Reset Person Password
             * Path: /person/resetPassword
             * Method: GET
             * Description: Reset password for corresponding person
             * Returns: Newly generated password
             */
            resetPassword : function(data, success, failure, scope) {
                this.request({
                    url : API.PERSON_RESET_PASSWORD,
                    method : 'GET',
                    token : false,
                    params : data,
                    scope : scope,
                    success : success,
                    failure : failure
                });
            },

            /**
             * Add Authorization data to path
             * @param url
             */
            getSecureResourceUrl : function(url) {
                let delimiter = (url.indexOf('?') === -1) ? '?' : '&',
                    urlRes = url + delimiter + this.getAuthorizationParameters();

                //<debug>
                if (!criterion.PRODUCTION) {
                    // API Imitations for testing/development purposes
                    Ext.Array.each(criterion.consts.Api.API_IMITATION_CFG.URLS, apiUrlRegexp => {
                        if (!/-fake/.test(urlRes) && apiUrlRegexp.test(urlRes)) {
                            urlRes = urlRes.replace('api', criterion.consts.Api.API_IMITATION_CFG.prefix);
                            console.warn('%cURL replaced -> ' + urlRes, 'color:#ff8d01;font-weight:bold');

                            return false;
                        }
                    });
                }
                //</debug>

                return urlRes;
            },

            getAuthorizationParameters : function() {
                let token = encodeURIComponent(this.getToken()),
                    employerId = encodeURIComponent(this.getEmployerId());

                return Ext.String.format('Authorization={0}&EmployerId={1}', token, employerId);
            },

            /**
             * @private
             */
            _submitFormInternal(fields, options, progressCallback) {
                let me = this,
                    formData = new FormData(),
                    extraData = options.extraData,
                    replaceNameWith = options.replaceNameWith,
                    HEADER = ApiConfig.HEADER,
                    xhr = new XMLHttpRequest();

                Ext.Array.each(fields, field => {
                    let fieldValue;

                    if (field.fileInputEl) {
                        fieldValue = !field.tmpFile && field.fileInputEl.el.dom.files[0] || field.tmpFile || '';
                    } else {
                        fieldValue = field.getSubmitValue ? field.getSubmitValue() : (field.getValue ? field.getValue() : field.value);
                    }

                    formData.append(replaceNameWith && field[replaceNameWith] ? field[replaceNameWith] : field.name, fieldValue);
                });

                Ext.Object.each(extraData, (name, value) => {
                    if (value instanceof FileList) {
                        Ext.Array.each(value, function(file) {
                            formData.append(name, file);
                        });
                    } else {
                        formData.append(name, value);
                    }
                });

                //<debug>
                if (!criterion.PRODUCTION) {
                    // API Imitations for testing/development purposes
                    Ext.Array.each(criterion.consts.Api.API_IMITATION_CFG.URLS, function(apiUrlRegexp) {
                        if (!/-fake/.test(options.url) && apiUrlRegexp.test(options.url)) {
                            options.url = options.url.replace('api', criterion.consts.Api.API_IMITATION_CFG.prefix);

                            return false;
                        }
                    });
                }
                //</debug>

                xhr.open((options.method ? options.method : 'POST'), options.url, true);

                xhr.setRequestHeader(HEADER.EMPLOYER_ID, this.getEmployerId());

                if (xhr.upload && Ext.isFunction(progressCallback)) {
                    xhr.upload.onprogress = function(event) {
                        progressCallback(event, options.owner, options.initialWidth, options.text);
                    };
                }

                xhr.onload = function() {
                    if (Ext.Array.contains([200, 201, 202], xhr.status)) {
                        delete formData[RECONNECTS];
                        delete formData[WAITING_SERVICE_ATTEMPTS];
                        criterion.Application.hideServiceMessage();
                        success.call(me, xhr, options);
                    } else if (xhr.status === 502 && (!formData[RECONNECTS] || formData[RECONNECTS] < criterion.Consts.RECONNECT_ATTEMPTS - 1)) {
                        xhr.abort();
                        xhr.open((options.method ? options.method : 'POST'), options.url, true);
                        xhr.setRequestHeader(HEADER.EMPLOYER_ID, me.getEmployerId());
                        me.reconnect(formData, () => {
                            xhr.abort();
                            xhr.open((options.method ? options.method : 'POST'), options.url, true);
                            xhr.setRequestHeader(HEADER.EMPLOYER_ID, me.getEmployerId());
                            xhr.setRequestHeader(HEADER.CRITERION_RECONNECT_ATTEMPT, formData[RECONNECTS]);
                            xhr.send(formData)
                        });
                    } else if (xhr.status === 503) {
                        me.waitingService(formData, () => {
                            xhr.abort();
                            xhr.open((options.method ? options.method : 'POST'), options.url, true);
                            xhr.setRequestHeader(HEADER.EMPLOYER_ID, me.getEmployerId());
                            xhr.setRequestHeader(HEADER.CRITERION_WAITING_SERVICE_ATTEMPT, formData[WAITING_SERVICE_ATTEMPTS]);
                            xhr.send(formData)
                        });
                    } else {
                        delete formData[RECONNECTS];
                        delete formData[WAITING_SERVICE_ATTEMPTS];
                        criterion.Application.hideServiceMessage();
                        failure.call(me, xhr, options);
                    }
                };

                xhr.onerror = function() {
                    if (!xhr.upload && !formData[RECONNECTS] || formData[RECONNECTS] < criterion.Consts.RECONNECT_ATTEMPTS - 1) {
                        me.reconnect(formData, () => {
                            xhr.abort();
                            xhr.open((options.method ? options.method : 'POST'), options.url, true);
                            xhr.setRequestHeader(HEADER.EMPLOYER_ID, me.getEmployerId());
                            xhr.send(formData)
                        });
                    } else {
                        delete formData[RECONNECTS];
                        delete formData[WAITING_SERVICE_ATTEMPTS];
                        criterion.Application.hideServiceMessage();
                        failure.call(me, xhr, options);
                    }
                };

                if (formData[RECONNECTS]) {
                    xhr.setRequestHeader(HEADER.CRITERION_RECONNECT_ATTEMPT, formData[RECONNECTS]);
                }
                if (formData[WAITING_SERVICE_ATTEMPTS]) {
                    xhr.setRequestHeader(HEADER.CRITERION_WAITING_SERVICE_ATTEMPT, formData[WAITING_SERVICE_ATTEMPTS]);
                }

                xhr.send(formData);
            },

            submitForm(options) {
                let fields = options.form ? options.form.getFields().items : options.fields;

                this._submitFormInternal(fields, options);
            },

            submitFormWithPromise(options) {
                let dfd = Ext.create('Ext.promise.Deferred');

                criterion.Api.submitForm(Ext.apply({}, {
                    success : function(scope, response) {
                        dfd.resolve(response);
                        options.success && options.success(response);
                    },
                    failure : function(response) {
                        dfd.reject(response);
                        options.failure && options.failure(response);
                    }
                }, options));

                return dfd.promise;
            },

            submitFakeFormWithPromise(fields, options, progressCallback) {
                let dfd = Ext.create('Ext.promise.Deferred');

                criterion.Api.submitFakeForm(fields, Ext.apply({}, {
                    success : function(scope, response) {
                        dfd.resolve(response);
                        options.success && options.success(response);
                    },
                    failure : function(response) {
                        dfd.reject(response);
                        options.failure && options.failure(response);
                    }
                }, options), progressCallback);

                return dfd.promise;
            },

            submitFakeForm(fields, options, progressCallback) {
                this._submitFormInternal(fields, options, progressCallback);
            },

            updateDatabase : function(dumpName) {
                return this.requestWithPromise({
                    url : API.TESTING_UPDATE_DATABASE + '/' + dumpName,
                    method : 'PUT'
                });
            },

            getRequiredField : function(keys) {
                if (!keys || keys.indexOf('.') === -1) {
                    return false;
                }

                let [key, value] = keys.split('.');

                return requiredFields[key] ? Ext.Array.contains(requiredFields[key], value) : false;
            }

        };
    });
});
