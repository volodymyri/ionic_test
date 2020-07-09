Ext.define('criterion.ux.form.field.PersonPhoneNumber', function() {

    const API = criterion.consts.Api.API;

    return {
        alternateClassName : 'criterion.form.field.PersonPhoneNumber',

        alias : 'widget.criterion_person_phone_number',

        extend : 'Ext.form.field.Text',

        config : {
            formatParams : {
                countryCode : 'ZZ'
            },
            validatePhone : true,
            rawNumber : null,
            displayNumber : null
        },

        lastNumber : null,

        pendingValidationRequest : false,

        pendingFormatRequest : false,

        twoWayBindable : ['rawNumber', 'displayNumber'],

        staticToken : null,

        constructor : function() {
            this.callParent(arguments);

            this._applyFieldRequired();
        },

        _applyFieldRequired : function() {
            this.callParent([this.staticToken]);
        },

        setFormatParams : function(params) {
            if (!params) {
                return
            }

            let rawNumber = this.getRawNumber(),
                oldParams = this.getFormatParams();

            this.callParent(arguments);
            if (!this.readOnly && rawNumber && oldParams
                && oldParams.countryCode !== params.countryCode) {

                this.formatNumber(rawNumber, params);
            }
        },

        setDisplayNumber : function(value) {
            this.validNumber = true;
            this.setValue(value);
            this.resetOriginalValue();

            this.callParent(arguments);
        },

        onFocus : function() {
            if (!this.readOnly) {
                this.setValue(this.getRawNumber());
            }

            this.callParent(arguments);
        },

        onBlur : function() {
            if (!this.readOnly) {

                let value = this.getValue(),
                    rawNumber = this.getRawNumber(),
                    displayNumber = this.getDisplayNumber(),
                    formatParams = this.getFormatParams();

                if (rawNumber === value && displayNumber) {
                    this.setValue(displayNumber);
                } else if (value && formatParams) {
                    this.formatNumber(value, formatParams);
                } else {
                    this.setDisplayNumber(value);
                    this.validateNumber();
                }

                this.setRawNumber(value);
            }

            this.callParent(arguments);
        },

        formatNumber : function(value, formatParams) {
            let me = this;

            if (formatParams.countryCode === 'ZZ') {
                value = value.trim();
                if (value.indexOf('+') !== 0) {
                    value = '+' + value;
                }
            }

            me.pendingFormatRequest = true;
            criterion.Api.requestWithPromise({
                    url : API.PERSON_FORMAT_PHONE,
                    params : Ext.Object.merge({
                        phone : value
                    }, formatParams),
                    method : 'GET'
                }
            ).then({
                success : function(formatted) {
                    if (me.rendered) {
                        me.setDisplayNumber(formatted);
                        me.validateNumber();
                    }
                }
            }).always(function() {
                me.pendingFormatRequest = false;
            });
        },

        validateNumber : function() {
            let me = this,
                formatParams = me.getFormatParams(),
                value = this.getValue(),
                dfd = Ext.create('Ext.Deferred');

            if (!me.getValidatePhone()) {
                me.validNumber = true;
                dfd.resolve();
            } else if (me.lastNumber === value) {
                me.validNumber ? dfd.resolve() : dfd.reject();
            } else if (value && formatParams) {
                me.pendingValidationRequest = true;
                criterion.Api.requestWithPromise({
                        url : API.PERSON_VALIDATE_PHONE,
                        params : Ext.Object.merge({
                            phone : value
                        }, formatParams),
                        method : 'GET'
                    }
                )
                    .then({
                        success : function(isValid) {
                            if (isValid) {
                                me.rendered && me.clearInvalid();
                                me.validNumber = true;
                                me.lastNumber = value;
                                dfd.resolve();
                            } else {
                                me.rendered && me.markInvalid(i18n.gettext('Phone number is incorrect'));
                                me.validNumber = false;
                                me.lastNumber = null;
                                dfd.reject();
                            }
                        },
                        failure : function() {
                            me.rendered && me.markInvalid(i18n.gettext('Phone number is incorrect'));
                            me.validNumber = false;
                            me.lastNumber = null;
                            dfd.reject();
                        }
                    }).always(function() {
                    me.pendingValidationRequest = false;
                });
            } else {
                me.clearInvalid();
                me.validNumber = true;

                dfd.resolve();
            }

            return dfd.promise;
        },

        validateValue : function(value) {
            let me = this,
                errors = me.getErrors(value),
                isValid = Ext.isEmpty(errors);

            if (!me.preventMark) {
                if (!me.validNumber) {
                    errors.push(i18n.gettext('Phone number is incorrect'));
                    isValid = false;
                }
                if (isValid) {
                    me.clearInvalid();
                } else {
                    me.markInvalid(errors);
                }
            }

            return isValid && me.validNumber && !me.pendingValidationRequest && !me.pendingFormatRequest;
        }
    };
});
