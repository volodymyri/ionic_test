Ext.define('criterion.ux.Msg', {
    extend : 'Ext.MessageBox',

    showMsg : function(title, message, fn, scope) {
        if (Ext.isString(message)) {
            message = {
                message : message
            };
        }

        return this.show(Ext.apply({
            title : title,
            buttons : Ext.MessageBox.OK,
            prompt : false,
            scope : scope,
            fn : function() {
                if (fn) {
                    Ext.callback(fn, scope, arguments);
                }
            }
        }, message));
    },

    warning : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Warning'), message, fn, scope);
    },

    error : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Error'), message, fn, scope);
    },

    info : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Info'), message, fn, scope);
    },

    success : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Success'), message, fn, scope);
    }

}, function(MessageBox) {
    Ext.onInternalReady(function() {
        criterion.Msg = new criterion.ux.Msg({
            id : 'criterion-messagebox'
        });
    });
});
