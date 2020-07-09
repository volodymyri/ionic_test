Ext.define('criterion.overrides.ux.window.MessageBox', {

    override : 'criterion.ux.window.MessageBox',

    buttonDefaultUIs : {
        ok : 'default',
        yes : 'default',
        no : 'light',
        cancel : 'light'
    },

    buttonConfirmDeleteUIs : {
        ok : 'default',
        yes : 'default',
        no : 'light',
        cancel : 'light'
    },

    makeButton : function(btnIdx) {
        var btnId = this.buttonIds[btnIdx];

        return new Ext.button.Button({
            handler : this.btnCallback,
            itemId : btnId,
            scope : this,
            text : this.buttonText[btnId],
            ui : this.buttonDefaultUIs[btnId],
            minWidth : this.buttonMinWidth
        });
    },

    reconfigureButtonUI : function(ui) {
        var me = this;

        Ext.each(me.buttonIds, function(buttonId, index) {
            me.msgButtons[index].setUI(ui[buttonId]);
            me.msgButtons[buttonId].setUI(ui[buttonId]);
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

        if (cfg.isCustomUI !== true) {
            this.reconfigureButtonUI(this.buttonDefaultUIs);
        }

        return this.show(cfg);
    },

    confirmDelete : function(cfg, fn, scope) {
        this.reconfigureButtonUI(this.buttonConfirmDeleteUIs);

        var defaultCfg = {
            isCustomUI : true,
            title : this.windowTitle.confirmDelete,
            message : this.wrapperText.confirmDelete,
            cls : this.windowCls.confirmDelete,
            buttons : this.YESNO,
            icon : this.QUESTION,
            closable : false,
            callback : fn,
            scope : scope
        };

        Ext.applyIf(cfg, defaultCfg);

        return this._show(cfg);
    }
});
