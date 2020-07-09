Ext.define('criterion.overrides.form.field.Base', {

    override : 'Ext.form.field.Base',

    blockBySecurityCls : 'block-by-security',

    config : {
        /**
         * By default, security token will be auto-generated. Use this config to override auto-generated value.
         * @cfg {String}
         */
        securityAccessToken : null,

        /**
         * Current security descriptor applied to field. You can set security state by setting this config.
         */
        securityDescriptor : null,

        /**
         * Allow field to publish value to underlying model even if the value is invalid.
         */
        publishInvalid : false,

        /**
         * Reset field original value after render because field data loaded after main record create and filed willl be marked as dirty otherwise.
         */
        resetOriginalValueOnRender : false
    },

    constructor : function(cfg) {
        // this way we can track when owner record of field was changed
        // Important - modelValidation should be set to true on parent form
        // Important - the method will be called only if something bound to 'value'
        Ext.Function.interceptAfter(this, 'setValidationField', this.onOwnerRecordChange);

        if (cfg) {
            this.appendRequiredMark(cfg);
        }

        this.callParent(arguments);

        if (this.resetOriginalValueOnRender) {
            this.on('beforerender', cmp => {
                Ext.defer(() => {
                    cmp.resetOriginalValue();
                }, 100);
            });
        }
    },

    appendRequiredMark(cfg) {
        if (!cfg.skipRequiredMark && !cfg._hasRequiredMark) {
            cfg.afterLabelTextTpl = '<span class="criterion-red fs-08 va-sup bold ' + (cfg.allowBlank === false ? '' : 'x-hidden') + ' requiredMark" data-qtip="' + i18n.gettext('Required') + '">*</span>' + (cfg.afterLabelTextTpl || '');
            cfg._hasRequiredMark = true;
        }
    },

    /**
     * Read and apply security data from newly attached owner record.
     */
    onOwnerRecordChange : function() {
        var record = this._ownerRecord,
            token = this.getSecurityAccessToken() || this.getFieldToken();

        this._applyFieldRequired(token);

        this.applySecurityDescriptor(null);

        if (record && token && record.getSecurityAccess) {
            var access = record.getSecurityAccess(token);

            this.applySecurityDescriptor(access);
        }
    },

    hasRequiredRuleInValidators(instanceValidators = []) {
        const VALIDATOR = criterion.Consts.getValidator();

        return Ext.Array.filter(instanceValidators, item => Ext.Array.contains([VALIDATOR.NON_EMPTY.type, VALIDATOR.PRESENCE.type], item['type'])).length;
    },

    _applyFieldRequired : function(token) {
        let valField = this.getValidationField(),
            allowBlank = this.allowBlank,
            instanceValidators = valField ? valField.instanceValidators : [],
            mark, requiredByTenant = false;

        if (!token) {
            token = this.getSecurityAccessToken() || this.getFieldToken();
        }

        if (token) {
            requiredByTenant = criterion.Api.getRequiredField(token);
        }

        if (requiredByTenant) {
            this.allowBlank = allowBlank = false;
        }

        if (this.rendered) {
            this.updateMark(allowBlank, valField, instanceValidators);
        } else {
            this.on('render', () => {
                this.updateMark(allowBlank, valField, instanceValidators);
            });
        }

    },

    updateMark : function(allowBlank, valField, instanceValidators) {
        let mark = this.el.query('.requiredMark');

        if (mark && mark.length) {
            let markEl = Ext.get(mark[0]);

            if (
                (typeof allowBlank !== 'undefined' || valField)
                &&
                (!allowBlank || (instanceValidators && this.hasRequiredRuleInValidators(instanceValidators)))
            ) {
                markEl.removeCls('x-hidden');
            } else {
                markEl.addCls('x-hidden');
            }
        }
    },

    /**
     * Holds values of properties affected by security before security rules were applied.
     * @private
     */
    preSecurityState : null,

    /**
     * @param {Object} access
     * @param {Boolean} access.view
     * @param {Boolean} access.edit
     */
    applySecurityDescriptor : function(access) {
        if (access) {
            if (access.view && !access.edit) {
                this.applySecurity(true)
            } else if (!access.view) {
                this.applySecurity()
            }
        } else {
            this.resetSecurity();
        }

        this.securityDescriptor = access;
    },

    /**
     * @private
     * @param view
     */
    applySecurity : function(view) {
        this.preSecurityState = {
            readOnly : this.readOnly,
            disabled : this.disabled
        };

        if (view) {
            this.setReadOnly(true);
        } else {
            this.disable();
            this.addCls(this.blockBySecurityCls);
        }
    },

    /**
     * @private
     */
    resetSecurity : function() {
        if (!this.preSecurityState) {
            return;
        }

        this.removeCls(this.blockBySecurityCls);
        this.setReadOnly(this.preSecurityState.readOnly);

        if (this.preSecurityState.disabled) {
            this.disable();
        } else {
            this.enable();
        }

        this.preSecurityState = null;
    },

    isBlockedBySecurity : function() {
        return !!this.preSecurityState;
    },

    validate : function() {
        var descriptor = this.isBlockedBySecurity() && this.getSecurityDescriptor(),
            validationField = this.getValidationField(),
            isValid = this.callParent(arguments);

        if (descriptor && (!descriptor.view || !descriptor.edit) && validationField) {
            if (validationField.validate(this.getValue(), null, null, this._ownerRecord) != true) {
                criterion.Utils.toast(i18n.gettext('Can\'t create/edit record; you do not have access to required field "' + this.fieldLabel + '"!'));
                isValid = false;
            }
        }

        return isValid;
    },

    /**
     * Field token should be equal to meta_table.meta_field. Used to compare with securityFields object.
     * @private
     * @returns {String|null}
     */
    getFieldToken : function() {
        var bind = this.getValueBind(),
            fieldName = bind && bind.stub.name,
            record = this._ownerRecord;

        if (fieldName && record && record.getFieldMeta) {
            return record.getFieldMeta(fieldName);
        } else {
            return null;
        }
    },

    getValueBind : function() {
        return this.bind && this.bind.value;
    },

    // overrides

    publishValue : function() {
        var me = this;

        if (me.rendered && (me.getPublishInvalid() || !me.getErrors().length)) { // <- changed (for support publishing invalid state)
            me.publishState('value', me.getValue());
        }
    },

    getRawValue : function() {
        var me = this,
            v = (me.inputEl && !me.inputEl.destroyed ? me.inputEl.getValue() : Ext.valueFrom(me.rawValue, '')); // <- changed

        me.rawValue = v;
        return v;
    },

    setRawValue : function(value) {
        var me = this,
            rawValue = me.rawValue;

        if (!me.transformRawValue.$nullFn) {
            value = me.transformRawValue(value);
        }

        value = Ext.valueFrom(value, '');

        if (rawValue === undefined || rawValue !== value) {
            me.rawValue = value;

            // Some Field subclasses may not render an inputEl
            if (me.inputEl && !me.inputEl.destroyed) {   // <- changed
                me.bindChangeEvents(false);
                me.inputEl.dom.value = value;
                me.bindChangeEvents(true);
            }
        }

        if (me.rendered && me.reference) {
            me.publishState('rawValue', value);
        }

        return value;
    }
});
