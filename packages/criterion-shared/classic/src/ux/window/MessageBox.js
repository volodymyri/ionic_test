Ext.define('criterion.ux.window.MessageBox', {

    extend : 'Ext.window.MessageBox',

    alternateClassName : [
        'criterion.MessageBox',
        'criterion.Msg'
    ],

    buttonMinWidth : 100,

    cls : 'criterion-message-box criterion-modal',

    defaultMinWidth : 300,

    alwaysOnTop : 10,

    draggable : false,

    windowTitle : {
        confirmDelete : i18n.gettext('Delete record')
    },

    wrapperText : {
        confirmDelete : i18n.gettext('Do you want to delete the record?')
    },

    windowCls : {
        confirmDelete : 'criterion-modal-delete'
    },

    buttonDefaultCls : {
        ok : 'criterion-btn-primary',
        yes : 'criterion-btn-primary',
        no : 'criterion-btn-light',
        cancel : 'criterion-btn-light'
    },

    buttonConfirmDeleteCls : {
        ok : 'criterion-btn-remove',
        yes : 'criterion-btn-remove',
        no : 'criterion-btn-light',
        cancel : 'criterion-btn-light'
    },

    buttonText : {
        ok : i18n.gettext('OK'),
        yes : i18n.gettext('Yes'),
        no : i18n.gettext('No'),
        cancel : i18n.gettext('Cancel')
    },

    stackedMessages : [],

    initComponent : function() {
        this.callParent(arguments);

        this.bottomTb.setLayout({
            pack : 'end'
        });
        this.topContainer.cls = 'text-container';
    },

    makeButton : function(btnIdx) {
        var btnId = this.buttonIds[btnIdx];

        return new Ext.button.Button({
            handler : this.btnCallback,
            itemId : btnId,
            scope : this,
            text : this.buttonText[btnId],
            cls : this.buttonDefaultCls[btnId],
            minWidth : this.buttonMinWidth
        });
    },

    removeAllButtonClasses : function() {
        var me = this;

        Ext.each(me.buttonIds, function(buttonId, index) {
            me.msgButtons[index].removeCls([me.buttonDefaultCls[buttonId], me.buttonConfirmDeleteCls[buttonId]]);
            me.msgButtons[buttonId].removeCls(me.buttonDefaultCls[buttonId], me.buttonConfirmDeleteCls[buttonId]);
        });
    },

    reconfigureButtonClasses : function(clases) {
        var me = this;

        me.removeAllButtonClasses();

        Ext.each(me.buttonIds, function(buttonId, index) {
            me.msgButtons[index].addCls(clases[buttonId]);
            me.msgButtons[buttonId].addCls(clases[buttonId]);
        });
    },

    _show : function(cfg) {
        if (cfg.wrapCls && Ext.isString(cfg.message)) {
            cfg.message = Ext.util.Format.format('<span class="{0}">{1}</span>', cfg.wrapCls, cfg.message);
        }

        if (cfg.stack === true && Ext.isString(cfg.message)) {
            this.stackedMessages.push(cfg.message);

            cfg.message = Ext.Array.unique(this.stackedMessages).join('<br /><br />');
        } else {
            this.stackedMessages = [];
        }

        if (cfg.isCustomClasses !== true) {
            this.reconfigureButtonClasses(this.buttonDefaultCls);
        }

        return this.show(cfg);
    },

    hide : function() {
        this.stackedMessages = [];

        this.callParent(arguments);
    },

    confirm : function(cfg, message, fn, scope) {
        if (Ext.isString(cfg)) {
            cfg = {
                title : cfg,
                icon : this.QUESTION,
                message : message,
                buttons : this.YESNO,
                closable : false,
                callback : fn,
                scope : scope
            };
        }

        return this._show(cfg);
    },

    confirmDelete : function(cfg, fn, scope) {
        this.reconfigureButtonClasses(this.buttonConfirmDeleteCls);

        var defaultCfg = {
            isCustomClasses : true,
            title : this.windowTitle.confirmDelete,
            message : this.wrapperText.confirmDelete,
            cls : this.windowCls.confirmDelete,
            buttons : this.YESNO,
            closable : false,
            callback : fn,
            scope : scope
        };

        Ext.applyIf(cfg, defaultCfg);

        let me = this,
            w = this._show(cfg);

        Ext.defer(_ => {
            me.msgButtons.no && me.msgButtons.no.focus();
        }, 100);

        return w;
    },

    onEsc : function(e) {
        e.stopEvent();
        this.close();

        return false;
    },

    prompt : function(title, message, fn, scope, multiline, value) {
        if (Ext.isString(title)) {
            title = {
                prompt : true,
                title : title,
                minWidth : this.minPromptWidth,
                message : message,
                buttons : this.OKCANCEL,
                closable : false,
                callback : fn,
                scope : scope,
                multiline : multiline,
                value : value
            };
        }

        return this._show(title);
    },

    /**
     * @private
     */
    showMsg : function(title, message, icon, fn, scope, cls, stack) {
        var me = this;

        if (Ext.isString(message)) {
            message = {
                message : message
            };
        }

        Ext.applyIf(message, {
            callback : fn,
            scope : scope,
            wrapCls : cls,
            stack : Boolean(stack)
        });

        Ext.Function.defer(function() {
            me.updateLayout();
        }, 1, this);

        return this._show(Ext.apply({
            title : title,
            icon : icon,
            buttonText : {
                ok : 'Close'
            },
            buttons : this.OK,
            closable : false,
            scrollable : true
        }, Ext.clone(message)));
    },

    warning : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Warning'), message, this.WARNING, fn, scope);
    },

    error : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Error'), message, this.ERROR, fn, scope, 'error', true);
    },

    info : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Info'), message, this.INFO, fn, scope);
    },

    success : function(message, fn, scope) {
        return this.showMsg(i18n.gettext('Success'), message, this.INFO, fn, scope);
    },

    progress : function(title, message, text) {
        return this._show({
            title : title,
            message : message,
            progress : true,
            progressText : text,
            closable : false,
            icon : this.INFO
        });
    }
}, function(СriterionMessageBox) {
    Ext.onInternalReady(function() {
        criterion.Msg = new СriterionMessageBox();
    });
});
