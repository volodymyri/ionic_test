Ext.define('criterion.theme.classic.ess.overrides.button.Button', {

    override : 'Ext.button.Button',

    initComponent : function() {
        if (this.hasCls('criterion-btn-feature')) {
            this.removeCls('criterion-btn-feature');
            this.setUI('feature');
        }

        if (this.hasCls('criterion-btn-light')) {
            this.removeCls('criterion-btn-light');
            this.setUI('light');
        }

        this.callParent(arguments);
    }
});