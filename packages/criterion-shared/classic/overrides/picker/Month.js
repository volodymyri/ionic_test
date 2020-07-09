Ext.define('criterion.overrides.picker.Month', {

    override : 'Ext.picker.Month',

    initComponent : function() {
        this.callParent();

        this.okBtn.addCls('criterion-btn-primary');
        this.cancelBtn.addCls('criterion-btn-light');
    }
});
