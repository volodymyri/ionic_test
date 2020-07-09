Ext.define('criterion.Log', function() {

    const LOG_TYPE = 'UI',
        LOGGED_MARK = '__logged__',
        LOGGER_PATH = criterion.consts.Api.API.ROOT + '/' + 'errorLog',
        SETTING_LOG_REQUEST_TIME_NAME = 'logRequestTime',
        REQUEST_MAX_TIME = 700; // ms

    let _loggerHashCache = [],
        logSettings;

    return {

        singleton : true,

        requires : [
            'Ext.util.LocalStorage',
            'criterion.Consts',
            'criterion.Api',
            'criterion.Utils'
        ],

        mixins : {
            observable : 'Ext.mixin.Observable'
        },

        constructor(config) {
            this.mixins.observable.constructor.call(this, config);

            logSettings = new Ext.util.LocalStorage({
                id : 'logSettings'
            });
        },

        init() {
            let me = this,
                _onerror = window.onerror;

            window.onerror = function(message, url, line, col, error) {
                if (error && !error[LOGGED_MARK]) {
                    me.logError(error, '');
                }

                if (_onerror && typeof _onerror === 'function') {
                    _onerror.apply(window, arguments);
                }

                return true;
            };

            window.onunhandledrejection = function(event) {
                let error = event.reason;

                if (error && !error[LOGGED_MARK]) {
                    me.logError(error, 'onunhandledrejection');
                }

                return true;
            };
        },

        logError(error, mark) {
            error[LOGGED_MARK] = true;

            let me = this,
                stack = me.processStack(error.stack),
                hash = me.getHash(error.message, stack);

            if (criterion.PRODUCTION) {
                me.actSendLog(error.message, stack, hash);
            } else {
                me.fireEvent('afterErrorLog');
            }

            if ((!criterion.PRODUCTION || me.isTuring()) && console) {
                console.warn(
                    '%c\u2639 An error occurred!' + (mark ? ' [' + mark + ']' : '') + ' \u2639',
                    'color:red;font-size:1.5em;font-weight:bold'
                );
                console.error(
                    '%c' + error.message + ' :: ' + hash,
                    'font-weight:bold'
                );
                console.table ? console.table(stack) : console.error(stack);
            }
        },

        getAllowLogRequestTime() {
            return !!logSettings.getItem(SETTING_LOG_REQUEST_TIME_NAME);
        },

        onLogLongRequestTime() {
            logSettings.setItem(SETTING_LOG_REQUEST_TIME_NAME, 1);
            console && console.log('Logging long requests is switched on.');

            return true;
        },

        offLogLongRequestTime() {
            logSettings.removeItem(SETTING_LOG_REQUEST_TIME_NAME);
            console && console.log('Logging long requests is switched off.');

            return true;
        },

        logRequestTime(url = '', time = 0) {
            if ((!criterion.PRODUCTION || this.isTuring()) && this.getAllowLogRequestTime() && time > REQUEST_MAX_TIME && console) {
                console.warn(
                    `%c\u25F4 [TIME] ${url} time ${Math.ceil(time)}ms is over ${REQUEST_MAX_TIME}ms`,
                    'color:#26C6DA;font-size:0.9em;'
                );
            }
        },

        getHash(message, stack = []) {
            let _stack = Ext.Array.map(stack, st => ({
                file : st.file,
                method : st.method
            }));

            return LOG_TYPE + criterion.Utils.hashCode(Ext.encode({
                stack : _stack,
                message : message
            }));
        },

        isTuring() {
            let hostnameParts = window.location.hostname.split('.'),
                hostnameTenant = (hostnameParts[0] !== 'www' ? hostnameParts[0] : hostnameParts[1]).toLowerCase();

            return hostnameTenant === criterion.Consts.TURING_IDENT;
        },

        actSendLog(message, stack, hash= '') {
            let me = this,
                hostnameParts = window.location.hostname.split('.'),
                hostnameTenant = (hostnameParts[0] !== 'www' ? hostnameParts[0] : hostnameParts[1]).toLowerCase();

            if (!Ext.Array.contains(_loggerHashCache, hash)) {
                _loggerHashCache.push(hash);

                criterion.Api.request({
                    url : LOGGER_PATH,
                    method : 'POST',
                    jsonData : {
                        category : LOG_TYPE,
                        tenantCode : hostnameTenant,
                        message,
                        url : window.location.hash,
                        source : window.hasOwnProperty('device') && Ext.encode(window['device']) || Ext.String.ellipsis(Ext.browser.identity + ' ' + Ext.os.name + ' ' + Ext.os.deviceType, 100),
                        log : Ext.encode(stack),
                        hash
                    },
                    callback : function(options, success, response) {
                        let msgConf = {};

                        if (success) {
                            try {
                                let resultId = Ext.decode(response.responseText).result.id;

                                criterion.Msg.error(Ext.Object.merge(msgConf, {
                                    message : Ext.util.Format.format(i18n.gettext('Unhandled internal error. Reference: {0}-{1}, Hash: {2}'), hostnameTenant, resultId, hash)
                                }));
                            } catch (e) {
                                criterion.Msg.error(Ext.Object.merge(msgConf, {
                                    message : i18n.gettext('Unhandled internal error.')
                                }));
                            }
                        } else {
                            criterion.Msg.error(Ext.Object.merge(msgConf, {
                                message : i18n.gettext('Unhandled internal error. Logging server unavailable.')
                            }));
                        }

                        me.fireEvent('afterErrorLog');
                    }
                });
            }
        },

        processStack(_stack = '') {
            let stack = this.parse(_stack);

            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//"
                    + window.location.hostname
                    + (window.location.port ? ':' + window.location.port : '');
            }

            return Ext.Array.map(stack, el => ({
                file : el.file.replace(window.location.origin, '').replace(/\?_dc.*$/, ''),
                method : el.methodName,
                line : el.lineNumber + ':' + el.column
            }));
        },

        /**
         * https://github.com/errwischt/stacktrace-parser/blob/master/src/stack-trace-parser.js
         *
         * @param stackString
         * @returns {*}
         */
        parse(stackString) {
            const UNKNOWN_FUNCTION = '<unknown>',
                chromeRe = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                chromeEvalRe = /\((\S*)(?::(\d+))(?::(\d+))\)/;

            function parseChrome(line) {
                const parts = chromeRe.exec(line);

                if (!parts) {
                    return null;
                }

                const isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
                const isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
                const submatch = chromeEvalRe.exec(parts[2]);

                if (isEval && submatch != null) {
                    // throw out eval line/column and use top-most line/column number
                    parts[2] = submatch[1]; // url
                    parts[3] = submatch[2]; // line
                    parts[4] = submatch[3]; // column
                }

                return {
                    file : !isNative ? parts[2] : null,
                    methodName : parts[1] || UNKNOWN_FUNCTION,
                    arguments : isNative ? [parts[2]] : [],
                    lineNumber : parts[3] ? +parts[3] : null,
                    column : parts[4] ? +parts[4] : null,
                };
            }

            const winjsRe = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;

            function parseWinjs(line) {
                const parts = winjsRe.exec(line);

                if (!parts) {
                    return null;
                }

                return {
                    file : parts[2],
                    methodName : parts[1] || UNKNOWN_FUNCTION,
                    arguments : [],
                    lineNumber : +parts[3],
                    column : parts[4] ? +parts[4] : null,
                };
            }

            const geckoRe = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
            const geckoEvalRe = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;

            function parseGecko(line) {
                const parts = geckoRe.exec(line);

                if (!parts) {
                    return null;
                }

                const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;

                const submatch = geckoEvalRe.exec(parts[3]);
                if (isEval && submatch != null) {
                    // throw out eval line/column and use top-most line number
                    parts[3] = submatch[1];
                    parts[4] = submatch[2];
                    parts[5] = null; // no column when eval
                }

                return {
                    file : parts[3],
                    methodName : parts[1] || UNKNOWN_FUNCTION,
                    arguments : parts[2] ? parts[2].split(',') : [],
                    lineNumber : parts[4] ? +parts[4] : null,
                    column : parts[5] ? +parts[5] : null,
                };
            }

            const javaScriptCoreRe = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;

            function parseJSC(line) {
                const parts = javaScriptCoreRe.exec(line);

                if (!parts) {
                    return null;
                }

                return {
                    file : parts[3],
                    methodName : parts[1] || UNKNOWN_FUNCTION,
                    arguments : [],
                    lineNumber : +parts[4],
                    column : parts[5] ? +parts[5] : null,
                };
            }

            const nodeRe = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;

            function parseNode(line) {
                const parts = nodeRe.exec(line);

                if (!parts) {
                    return null;
                }

                return {
                    file : parts[2],
                    methodName : parts[1] || UNKNOWN_FUNCTION,
                    arguments : [],
                    lineNumber : +parts[3],
                    column : parts[4] ? +parts[4] : null,
                };
            }

            const lines = stackString.split('\n');

            return lines.reduce((stack, line) => {
                const parseResult =
                    parseChrome(line) ||
                    parseWinjs(line) ||
                    parseGecko(line) ||
                    parseNode(line) ||
                    parseJSC(line);

                if (parseResult) {
                    stack.push(parseResult);
                }

                return stack;
            }, []);
        }
    };
});
