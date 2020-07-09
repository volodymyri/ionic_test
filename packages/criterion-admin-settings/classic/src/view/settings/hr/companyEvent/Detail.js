Ext.define('criterion.view.settings.hr.companyEvent.Detail', function() {

    return {
        alias : 'widget.criterion_settings_company_event_detail',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Event'),

        allowDelete : true,
        modal : true,
        draggable : true,

        items : [
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Date'),
                bind : {
                    value : '{record.date}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Description'),
                bind : {
                    value : '{record.description}'
                },
                maxLength : 100
            }
        ]
    }
});
