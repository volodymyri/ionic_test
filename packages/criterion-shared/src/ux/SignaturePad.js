Ext.define('criterion.ux.SignaturePad', {

    extend : 'Ext.Component',

    alias : 'widget.criterion_signature_pad',

    // for classic
    autoEl : {
        tag : 'div',
        children : [
            {
                reference : 'canvas',
                tag : 'canvas'
            },

            {
                tag : 'div',
                reference : 'cleartrigger',
                cls : 'clear-trigger',
                'data-qtip' : i18n.gettext('Clear')
            }
        ]
    },

    // for modern
    element : {
        reference : 'element',
        html : i18n.gettext('Signature'),
        cls : 'criterion-signature-pad',
        children : [
            {
                cls : 'criterion-signature-pad-canvas',
                children : [
                    {
                        reference : 'canvas',
                        tag : 'canvas'
                    },

                    {
                        tag : 'div',
                        reference : 'cleartrigger',
                        cls : 'clear-trigger'
                    }
                ]
            }
        ]
    },

    cls : Ext.baseCSSPrefix + 'form-trigger-wrap-default',

    padInvalidCls : Ext.baseCSSPrefix + 'form-trigger-wrap-invalid',

    config : {
        value : null,
        oldValue : undefined,
        lastValue : undefined,
        readOnly : false,
        isFormField : true,
        allowBlank : true
    },

    pad : null,
    clearTrigger : null,

    _getCanvas() {
        return Ext.isModern ? this.canvas : this.getEl().down('[reference=canvas]');
    },

    _getClearTrigger() {
        return Ext.isModern ? this.cleartrigger : this.getEl().down('[reference=cleartrigger]');
    },

    afterRender() {
        this.callParent(arguments);

        this.pad = new SignaturePad(this._getCanvas().dom);
        this.clearTrigger = this._getClearTrigger();

        this.clearTrigger.on('click', this.clear, this);

        if (this.getReadOnly()) {
            this.pad.off();
            this.clearTrigger.hide();
        } else {
            this.pad.on();
            this.clearTrigger.show();
        }
    },

    updateReadOnly(readOnly) {
        if (this.pad) {
            if (readOnly) {
                this.pad.off();
                this.clearTrigger.hide();
            } else {
                this.pad.on();
                this.clearTrigger.show();
            }
        }
    },

    setValue(value) {
        if (this.pad) {
            if (value) {
                this.pad.fromDataURL(Ext.util.Format.format('data:image/png;base64,{0}', value));
            } else {
                this.pad.clear();
            }
        }

        this.callParent(arguments);

        if (this.oldValue !== undefined && this.didValueChange(value, this.lastValue)) {
            this.validate();
        }

        this.setOldValue(value);
        this.setLastValue(value);
    },

    getValue() {
        let value = null;

        if (this.pad && !this.pad.isEmpty()) {
            value = this.pad.toDataURL().replace('data:image/png;base64,', '');
        }

        return value;
    },

    didValueChange(newVal, oldVal) {
        return !this.isEqual(newVal, oldVal);
    },

    isEqual(value1, value2) {
        return String(value1) === String(value2);
    },

    isDirty() {
        return !this.isEqual(this.getValue(), this.getOldValue());
    },

    validate() {
        let isValid = true;

        if (!this.allowBlank && !this.getValue()) {
            isValid = false;
        }

        this.toggleInvalidCls(!isValid);

        return isValid;
    },

    isValid() {
        let me = this,
            disabled = me.disabled,
            validate = me.forceValidation || !disabled;

        return validate ? me.validate() : disabled;
    },

    toggleInvalidCls(hasError) {
        this[hasError ? 'addCls' : 'removeCls'](this.padInvalidCls);
    },

    clear() {
        this.setValue();
    },

    onResize(width, height) {
        let canvasDom = this._getCanvas().dom;

        canvasDom.width = width;
        canvasDom.height = height;
        canvasDom.getContext("2d").scale(1, 1);

        this.setValue(this.value);
    }

});
