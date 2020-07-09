Ext.define('criterion.view.assignment.PayInformation', function() {

    return {
        alias : 'widget.criterion_assignment_pay_information',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.assignment.PayInformation'
        ],

        controller : {
            type : 'criterion_assignment_pay_information'
        },

        closable : false,

        title : i18n.gettext('Pay Details'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_CONFIG.MODAL_NARROWER_WIDTH,
                modal : true
            }
        ],

        draggable : false,
        modal : true,

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                details : null,
                payGroupId : null,
                perPayPeriod : null,
                payFrequencyCd : null,
                showPaygroup : false
            },

            stores : {
                payGroups : {
                    type : 'store',

                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'payGroupId',
                            type : 'int'
                        },
                        {
                            name : 'payGroupName',
                            type : 'string'
                        },
                        {
                            name : 'payFrequencyCd',
                            type : 'integer'
                        },
                        {
                            name : 'perPayPeriod',
                            type : 'float'
                        }
                    ],
                    sorters : [
                        {
                            property : 'id',
                            direction : 'ASC'
                        }
                    ]
                }
            }
        },

        defaults : {
            padding : '10 10 0 10'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Close'),
                cls : 'criterion-btn-light',
                handler : 'handleClose'
            }
        ],

        items : [
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Hourly'),
                isRatePrecision : true,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                disabled : true,
                bind : '{details.hourly}'
            },
            {
                xtype : 'criterion_currencyfield',
                fieldLabel : i18n.gettext('Annual'),
                isRatePrecision : true,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                disabled : true,
                bind : '{details.annual}'
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Pay group'),
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                displayField : 'payGroupName',
                valueField : 'payGroupId',
                queryMode : 'local',
                editable : false,
                hidden : true,
                bind : {
                    value : '{payGroupId}',
                    store : '{payGroups}',
                    hidden : '{!showPaygroup}'
                },
                listeners : {
                    change : 'handleChangePaygroup'
                }
            },
            {
                xtype : 'container',
                layout : 'hbox',
                margin : 0,
                items : [
                    {
                        xtype : 'criterion_currencyfield',
                        fieldLabel : i18n.gettext('Per Pay Period'),
                        isRatePrecision : true,
                        labelWidth : 125,
                        disabled : true,
                        bind : '{perPayPeriod}',
                        margin : '0 10 0 0'
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.PAY_FREQUENCY,
                        disabled : true,
                        hideTrigger : true,
                        bind : {
                            value : '{payFrequencyCd}'
                        }
                    }
                ]
            }
        ]
    }
});
