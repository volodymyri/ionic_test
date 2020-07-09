Ext.define('criterion.overrides.form.FieldContainer', {

    override : 'Ext.form.FieldContainer',

    /**
     * add requiredMark fore required fieldcontainer
     * @param cfg
     */
    constructor : function(cfg) {
        if (cfg && cfg.requiredMark) {
            cfg.afterLabelTextTpl = '<span class="criterion-red fs-08 va-sup bold requiredMark" data-qtip="' + i18n.gettext('Required') + '">*</span>' + (cfg.afterLabelTextTpl || '');
        }

        this.callParent(arguments);
    },

    setHideRequiredMark(value) {
        this[value ? 'addCls' : 'removeCls']('skipRequiredMark');
    }
});
