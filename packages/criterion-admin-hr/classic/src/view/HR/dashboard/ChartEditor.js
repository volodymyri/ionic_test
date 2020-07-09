Ext.define('criterion.view.hr.dashboard.ChartEditor', function() {

    return {
        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_hr_dashboard_chart_editor',

        requires : [
            'criterion.store.dashboard.Colors',
            'criterion.controller.hr.dashboard.ChartEditor',
            'criterion.store.dashboard.Metrics'
        ],

        defaults : {
            anchor : '100%',
            labelWidth : 150
        },

        bodyPadding : 10,

        viewModel : {
            data : {
                typeVisibility : true,
                countTypes : 0,
                typeFieldGroupValue : null
            },
            formulas : {
                typeHide : function(data) {
                    return !data('typeVisibility') || data('countTypes') < 2;
                }
            }
        },

        controller : {
            type : 'criterion_hr_dashboard_chart_editor'
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'combobox',
                    allowBlank : false,
                    fieldLabel : i18n.gettext('Chart'),
                    name : 'metric_id',
                    reference : 'metricField',
                    store : {
                        type : 'criterion_dashboard_metrics',
                        data : criterion.consts.Dashboard.getChartMetrics()
                    },
                    displayField : 'name',
                    valueField : 'id',
                    editable: false,
                    listeners : {
                        change : 'handleChangeMetrics'
                    }
                },
                {
                    xtype : 'radiogroup',
                    fieldLabel : i18n.gettext('Type'),
                    reference : 'typeFieldGroup',
                    vertical : true,
                    columns : 1,
                    allowBlank : false,
                    items : [],
                    bind : {
                        hidden : '{typeHide}'
                    }
                },
                {
                    xtype : 'container',
                    reference : 'additionalFields',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },
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
