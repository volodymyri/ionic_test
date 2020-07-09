/**
 * @singleton
 */
Ext.define('criterion.LocalizationManager', function() {

    var LOCALIZATION_LANGUAGE = criterion.consts.Dict.LOCALIZATION_LANGUAGE;

    return {

        singleton : true,

        /**
         * @private
         */
        defaultLocale : 'en',
        defaultLocaleName : 'English',

        /**
         * @private
         */
        locale : null,

        init : function(userLocale) {
            var me = this;

            Ext.on('employerChanged', function(employer) {
                this.setGlobalFormat(employer.getData());
            }, this);

            criterion.CodeDataManager.loadIfEmpty(LOCALIZATION_LANGUAGE).then(function() {
                me.setLocale(userLocale || this.defaultLocale);
                delete criterion.LOCALE;
            });
        },

        getLocaleRecord : function(locale) {
            return criterion.CodeDataManager.getCodeDetailRecord('code', locale.toUpperCase(), LOCALIZATION_LANGUAGE);
        },

        /**
         * @param locale
         */
        setLocale : function(locale) {
            var localeRec = this.getLocaleRecord(locale),
                lngName;

            if (!localeRec) {
                locale = this.defaultLocale;
                lngName = this.defaultLocaleName;
            } else {
                lngName = localeRec.get('description');
            }

            criterion.Utils.setCookie(criterion.Consts.COOKIE.LOCALE, locale);

            if (locale !== criterion.LOCALE) {
                criterion.Msg.confirm(
                    Ext.String.format('{0} {1}', i18n.gettext('Change language to'), lngName),
                    Ext.String.format('{0}. {1}', i18n.gettext('You need to reload page in order to apply settings'), i18n.gettext('Reload Now?')),
                    function(btn) {
                        if (btn === 'yes') {
                            window.location.reload();
                        }
                    }
                );
            } else {
                this.locale = locale;
            }
        },

        currencyFormatter : function(value) {
            return Ext.util.Format.currency(value);
        },

        /**
         * @param {Object} config
         * @param config.thousandSeparator
         * @param config.decimalSeparator
         * @param config.amountPrecision
         * @param config.ratePrecision
         * @param config.currencySign
         * @param config.currencyAtEnd
         */
        setGlobalFormat : function(config) {
            var format = Ext.util.Format;

            format.thousandSeparator = config['thousandSeparator'] || ',';
            format.decimalSeparator = config['decimalSeparator'] || '.';
            format.currencyPrecision = config['currencyPrecision'] || 0;
            format.amountPrecision = config['amountPrecision'] || 0;
            format.currencyRatePrecision = config['ratePrecision'] || 0;

            format.hoursPrecision = config['hoursPrecision'] || 0;
            format.percentagePrecision = config['percentagePrecision'] || 0;

            format.currencySign = config['currencySign'] || '$';
            format.currencyAtEnd = config['currencyAtEnd'] || false;

            Ext.GlobalEvents.fireEvent('globalFormatChange');
        }
    };

});
