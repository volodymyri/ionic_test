Ext.define('criterion.view.settings.hr.TaskGroupDetail', function() {

    return {
        alias : 'widget.criterion_settings_task_group_detail',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Task Detail'),

        modal : true,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Task Name'),
                name : 'name',
                readOnly : true,
                bind : '{record.name}'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Auto Allocate'),
                name : 'autoAllocate',
                bind : '{record.autoAllocate}',
                inputValue : true
            },
            {
                xtype : 'criterion_percentage_precision_field',
                fieldLabel : i18n.gettext('Allocation'),
                name : 'allocation',
                allowBlank : false,
                minValue : 0.0001,
                hidden : true,
                bind : {
                    disabled : '{!record.autoAllocate}',
                    hidden : '{!record.autoAllocate}',
                    value : '{record.allocation}'
                }
            },
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Start Date'),
                name : 'startDate',
                bind : '{record.startDate}'
            },
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('End Date'),
                name : 'endDate',
                bind : '{record.endDate}'
            }
        ]
    }
});
