Ext.define('criterion.view.reports.Memorize', {

    extend : 'criterion.view.FormView',

    requires : [
        'criterion.controller.reports.Memorize',
        'criterion.model.reports.Memorized'
    ],

    alias : 'widget.criterion_reports_memorize',

    plugins : [
        {
            ptype : 'criterion_sidebar',
            modal : true,
            height : 'auto',
            width : criterion.Consts.UI_CONFIG.MODAL_NARROW_WIDTH
        }
    ],


    title : i18n.gettext('Memorize'),

    viewModel : {
        data : {
            name : '',
            reportGroupId : null
        },
        stores : {
            reportGroups : {
                type : 'criterion_report_groups',
                proxy : {
                    extraParams : {
                        isMemorized : true
                    }
                }
            }
        }
    },

    controller : {
        type : 'criterion_reports_memorize',
        externalUpdate : false
    },

    defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

    layout : 'vbox',

    listeners : {
        show : 'onShow'
    },

    items : [
        {
            xtype : 'textfield',
            fieldLabel : i18n.gettext('Report Name'),
            bind : '{record.name}'
        },
        {
            xtype : 'combobox',
            queryMode : 'local',
            fieldLabel : i18n.gettext('Group Name'),
            bind : {
                store : '{reportGroups}',
                value : '{record.reportGroupId}'
            },
            displayField : 'name',
            valueField : 'id',
            editable : false,
            allowBlank : false
        }
    ]
});