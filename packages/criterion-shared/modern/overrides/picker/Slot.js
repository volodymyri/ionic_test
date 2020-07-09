Ext.define('criterion.overrides.picker.Slot', {

    override : 'Ext.picker.Slot',

    updateDisplayField : function(newDisplayField) {
        if (!this.config.itemTpl) {
            this.setItemTpl('<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl>">{' + newDisplayField + ':htmlEncode}</div>');
        }
    }
});
