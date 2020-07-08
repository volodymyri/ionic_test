i18n = function() {
    var _i18n,
        _hashToken = {},
        SIMPLE_GETTXT = 'txt',
        PGETTEXT = 'pgt';

    var hashCode = function(s, prefix) {
        return (prefix || '') + s.split("").reduce(function(a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);

            return a & a
        }, 0);
    };

    return {
        init : function() {
            _i18n = new Jed(criterion.locales[criterion.LOCALE || 'en']);
        },

        loadCustomTranslations : function(readycallback, moduleIdent) {
            var script = document.createElement('script'),
                prefix = criterion.API_URL_PREFIX ? criterion.API_URL_PREFIX : '/api',
                dc = +(new Date()),
                customLocalizationsLoaded = function() {
                    // time for eval
                    setTimeout(function() {
                        readycallback && readycallback();
                    }, 100);
                };

            script.type = 'text/javascript';
            script.src = prefix + '/' + moduleIdent + '/translation?_dc=' + dc;

            script.onreadystatechange = function() {
                if (this.readyState === 'complete') {
                    customLocalizationsLoaded();
                }
            };
            script.onload = customLocalizationsLoaded;
            script.onerror = function() {
                console && console.warn('[WARN] Custom localization file not loaded by BE error!');
                customLocalizationsLoaded();
            };

            document.head.appendChild(script);
        },

        rebuild : function() {
            delete _i18n;

            _i18n = new Jed(criterion.locales[criterion.LOCALE || 'en']);

            this.rebuildInnerTokens(document);
        },

        rebuildInnerTokens : function(cmp) {
            var elements, i, el, token, hash, result;

            if (!cmp) {
                return;
            }

            elements = cmp.querySelectorAll('figure.lngtoken');

            for (i = 0; i < elements.length; i++) {
                el = elements[i];
                hash = el.getAttribute('data-lng');
                token = _hashToken[hash];

                switch (hash.substr(0, 3)) {
                    case PGETTEXT:
                        result = _i18n.pgettext(token[0], token[1]);
                        if (result === token[1]) {
                            result = _i18n.gettext(token[1]);
                        }

                        el.innerText = result;
                        break;

                    case SIMPLE_GETTXT:
                    default:
                        el.innerText = _i18n.gettext(token);
                        break;
                }

            }
        },

        /**
         * https://www.gnu.org/software/gettext/manual/html_node/xgettext-Invocation.html
         * For JavaScript: _, gettext, dgettext:2, dcgettext:2, ngettext:1,2, dngettext:2,3, pgettext:1c,2, dpgettext:2c,3.
         *
         * @param {string} key
         * @returns {string}
         */
        _ : function(key) {
            var hash = hashCode(key, SIMPLE_GETTXT);

            _hashToken[hash] = key;

            return '<figure class="lngtoken" data-lng="' + hash + '">' + _i18n.gettext(key) + '</figure>';
        },

        gtoken : function(ltoken) {
            var cont = document.createElement('div'),
                token;

            cont.innerHTML = ltoken;
            token = _hashToken[cont.querySelector('figure').getAttribute('data-lng')];
            cont.remove && cont.remove();

            return token;
        },

        pgettext : function(context, key) {
            var result = _i18n.pgettext(context, key),
                hash = hashCode((context || '') + '|' + key, PGETTEXT);

            _hashToken[hash] = [context, key];

            if (result === key) {
                result = _i18n.gettext(key);
            }

            return '<figure class="lngtoken" data-lng="' + hash + '">' + result + '</figure>';
        },

        // proxy

        gettext : function(key) {
            return _i18n.gettext(key);
        },

        ngettext : function(skey, pkey, val) {
            return _i18n.ngettext(skey, pkey, val);
        }

    }
}();
