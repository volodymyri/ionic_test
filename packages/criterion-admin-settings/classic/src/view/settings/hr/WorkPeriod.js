Ext.define('criterion.view.settings.hr.WorkPeriod', function() {

    return {

        alias : 'widget.criterion_settings_work_period',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.WorkPeriod',
            'criterion.view.settings.hr.workPeriod.DaysContainer'
        ],

        bodyPadding : 0,

        title : i18n.gettext('Work Period Details'),

        controller : {
            type : 'criterion_settings_work_period',
            externalUpdate : false
        },

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employer.WorkPeriod
                 */
                record : null
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                bodyPadding : '0 10',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                bind : {
                                    value : '{record.employerId}'
                                },
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                disabled : true,
                                hideTrigger : true
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                bind : {
                                    value : '{record.name}'
                                },
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                allowBlank : false
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_settings_work_period_days_container',
                reference : 'daysContainer',
                bind : {
                    store : '{record.days}'
                }
            },

            {
                bodyPadding : 10,
                items : [
                    {
                        layout : 'fit',
                        items : [
                            {
                                layout : 'hbox',
                                items : [
                                    {
                                        layout : {
                                            type : 'vbox',
                                            align : 'middle'
                                        },

                                        bodyPadding : '0 10',

                                        margin : '0 65 0 0 ',

                                        minHeight : 150,
                                        items : [
                                            {
                                                height : 35
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.gettext('Grace Periods'),
                                                labelAlign : 'top',
                                                flex : 1,
                                                padding : '0 10 0 0',
                                                bind : {
                                                    value : '{record.isGrace}'
                                                }
                                            },
                                            {
                                                flex : 1
                                            }
                                        ]
                                    },
                                    {
                                        layout : 'vbox',
                                        items : [
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.gettext('Late Start'),
                                                labelStyle : 'padding-top: 46px;',
                                                layout : 'hbox',
                                                bind : {
                                                    disabled : '{!record.isGrace}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'numberfield',
                                                        fieldLabel : i18n.gettext('Minutes'),
                                                        labelAlign : 'top',
                                                        width : 80,
                                                        bind : {
                                                            value : '{record.startGrace}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'numberfield',
                                                        fieldLabel : i18n.gettext('Points'),
                                                        labelAlign : 'top',
                                                        margin : '0 10 0 10',
                                                        width : 80,
                                                        bind : {
                                                            value : '{record.startPoints}'
                                                        }
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.gettext('Early End'),
                                                layout : 'hbox',
                                                bind : {
                                                    disabled : '{!record.isGrace}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'numberfield',
                                                        width : 80,
                                                        bind : {
                                                            value : '{record.endGrace}'
                                                        }
                                                    },
                                                    {
                                                        xtype : 'numberfield',
                                                        margin : '0 10 0 10',
                                                        width : 80,
                                                        bind : {
                                                            value : '{record.endPoints}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
});

