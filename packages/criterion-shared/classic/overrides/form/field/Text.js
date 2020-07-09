Ext.define('criterion.overrides.form.field.Text', {

    override : 'Ext.form.field.Text',

    clearTriggerHiddenCls : '',
    clearTriggerHidden : false,
    _allowBlankIfActive : true,

    constructor : function(cfg) {
        if (cfg && cfg.allowBlank) {
            this._allowBlankIfActive = cfg.allowBlank;
        }

        this.callParent(arguments);
    },

    setClearTriggerHidden : function(value) {
        this.clearTriggerHidden = value;

        this[value ? 'addCls' : 'removeCls'](this.clearTriggerHiddenCls);
        this.fireEvent('clearhiddenchange');
    },

    onChange : function(newValue) {
        if (this['vtype'] && this['vtype'] === 'email') {
            this.setValue(newValue.trim());
        }

        this.callParent(arguments);
    },

    setAllowBlank : function(value) {
        this.allowBlank = this._allowBlankIfActive = value;
        this._applyFieldRequired();
    },

    setAllowOnlyWhitespace : function(value) {
        this.allowOnlyWhitespace = value;
    },

    refreshEmptyText : function() {
        var me = this,
            inputEl = me.inputEl,
            emptyClsElements = me.emptyClsElements,
            value, isEmpty, i;

        if (inputEl && !inputEl.destroyed) { // <-------------- changed
            value = me.getValue();
            isEmpty = !(inputEl.dom.value || (Ext.isArray(value) && value.length));

            if (me.placeholderLabel) {
                me.placeholderLabel.setDisplayed(isEmpty);
            }

            for (i = 0; i < emptyClsElements.length; i++) {
                emptyClsElements[i].toggleCls(me.emptyUICls, isEmpty);
            }
        }
    },

    setReadOnly(readOnly) {
        if (readOnly) {
            this._allowBlankIfActive = this.allowBlank;
            this.allowBlank = true;
            this.validateOnBlur = false;
            !this._allowBlankIfActive && this.validate();
        } else {
            this.validateOnBlur = true;
            if (Ext.isDefined(this._allowBlankIfActive)) {
                this.allowBlank = this._allowBlankIfActive;
            }
        }
        this.callParent(arguments);

        this._applyFieldRequired();
    }
});
