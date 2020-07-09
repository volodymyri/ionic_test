Ext.define('criterion.view.hr.dashboard.ValueEditor', function() {

    return {
        extend : 'criterion.ux.form.Panel',

        requires : [
            'Ext.form.RadioGroup',
            'criterion.controller.hr.dashboard.ValueEditor',
            'criterion.store.dashboard.Metrics'
        ],

        bodyPadding : 10,

        alias : 'widget.criterion_hr_dashboard_value_editor',

        controller : {
            type : 'criterion_hr_dashboard_value_editor'
        },

        defaults : {
            anchor : '100%',
            labelWidth : 150
        },

        initComponent : function () {
            var me = this;

            me.items = [
                {
                    xtype : 'combobox',
                    allowBlank : false,
                    fieldLabel : i18n.gettext('KPI'),
                    name : 'metric_id',
                    reference : 'metricField',
                    store : {
                        type : 'criterion_dashboard_metrics',
                        data : criterion.consts.Dashboard.getValueMetrics()
                    },
                    displayField : 'name',
                    valueField : 'id',
                    editable: false,
                    listeners : {
                        change : 'handleChangeMetrics'
                    }
                },
                {
                    xtype : 'container',
                    reference : 'additionalFields',
                    layout : 'fit',
                    defaults : {
                        labelWidth : 150
                    },
                    items : []
                }
            ];

            me.callParent(arguments);
        }

    };

});
