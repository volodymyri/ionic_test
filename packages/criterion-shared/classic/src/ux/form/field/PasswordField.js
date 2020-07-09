Ext.define('criterion.view.ux.form.field.PasswordField', function() {

    return {

        extend : 'Ext.form.field.Text',

        alias : 'widget.criterion_passwordfield',

        config : {
            hideText : true
        },

        triggers: {

            showText: {
                cls: 'x-fa fa-eye-slash',
                hideOnReadOnly : false,
                hidden : true,
                handler: function(field) {
                    field.setHideText(false);
                }
            },

            hideText: {
                cls: 'x-fa fa-eye x-hidden',
                hideOnReadOnly : false,
                hidden : true,
                handler: function(field) {
                    field.setHideText(true);
                }
            }
        },

        inputType : 'password',

        // Manage trigger visibility by style to not interfere with hiding triggers by readOnly
        triggerHideCls : function(trigger, hide) {
            if (hide) {
                trigger.el.addCls('x-hidden');
            } else {
                trigger.el.removeCls('x-hidden');
            }
        },

        updateHideText : function(hideText) {
            var me = this,
                triggers = me.getTriggers();
            if (me.rendered) {
                me.triggerHideCls(triggers.showText, !hideText);
                me.triggerHideCls(triggers.hideText, hideText);
                me.inputEl.dom.type = hideText ? 'password' : 'text';
            }
        },

        setValue : function(value) {
            this.checkEyeVisibility(value, this.readOnly);
            this.callParent(arguments);
        },

        setReadOnly : function(readOnly) {
            this.checkEyeVisibility(this.getValue(), readOnly);
            this.callParent(arguments);
        },

        checkEyeVisibility : function(value, readOnly) {
            var triggers = this.getTriggers(),
                hidden = !value && readOnly;

            triggers.showText.setHidden(hidden);
            triggers.hideText.setHidden(hidden);
        }
    };
});
