Ext.define('criterion.view.settings.hr.WorkArea', function() {

    return {
        alias : 'widget.criterion_settings_work_area',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Work Area'),

        allowDelete : true,
        modal : true,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Code'),
                name : 'code',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                allowBlank : false
            }
        ]
    }
});