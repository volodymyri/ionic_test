Ext.define('criterion.view.reports.ReportOptions', function() {

    return {

        extend : 'Ext.form.Panel',
        alias : 'widget.criterion_reports_options',

        requires : [
            'criterion.model.reports.Options',
            'criterion.model.reports.AvailableOptions',
            'criterion.controller.reports.ReportOptions',
            'criterion.ux.form.ReportFilter',
            'criterion.ux.form.ReportParameter'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto'
            }
        ],

        title : '',

        draggable : true,

        viewModel : {
            data : {
                optionsRecord : null,
                availOptionsRecord : null,
                reportId : null,
                advancedMode : false,
                isMemorized : false,
                currentOptions : null,
                employerId : null,
                reportPeriod : 'payDate',
                payDateValue : null,
                startDate : null,
                endDate : null,
                firstTimeRun : false,
                showFormats : false
            },
            formulas : {
                editingText : function(vmget) {
                    return vmget('advancedMode') ? 'Hide Advanced Filters...' : 'Advanced Filters...';
                },
                saveButtonTitle : function(vmget) {
                    return vmget('isMemorized') ? 'Save' : 'Apply';
                },
                usePayDate : function(vmget) {
                    return vmget('reportPeriod') === 'payDate';
                },
                disableDates : function(vmget) {
                    return vmget('optionsRecord.showPeriods') && vmget('reportPeriod') !== 'custom';
                }
            },
            stores : {
                availableFormatsStore : {
                    proxy : {
                        type : 'memory'
                    },
                    sortOnLoad : false,
                    fields : [
                        {
                            name : 'id',
                            type : 'string'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : []
                }
            }
        },

        controller : {
            type : 'criterion_reports_options'
        },

        listeners : {
            scope : 'controller',
            resize : 'onResize',
            show : 'onShow',
            onEsc : 'onEsc'
        },

        scrollable : 'y',

        cls : ['criterion-form'],

        items : [
            {
                layout : {
                    type : 'accordion',
                    titleCollapse : true,
                    multi : true
                },

                defaults : {
                    bodyPadding : 20,
                    collapsed : true,
                    hidden : true
                },

                items : [
                    {
                        title : '',
                        reference : 'outputFormat',
                        collapsible : false,
                        collapsed : false,
                        bind : {
                            hidden : '{!showFormats}'
                        },
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel :  i18n.gettext('Output Format'),
                                reference : 'reportFormat',
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'text',
                                editable : false,
                                sortByDisplayField : false,
                                bind : {
                                    store : '{availableFormatsStore}',
                                    allowBlank : '{!showFormats}'
                                }
                            }
                        ]
                    },
                    {
                        title : '',
                        header : {
                            hidden : true
                        },
                        reference : 'employer',
                        collapsible : false,
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                reference : 'employerCombo',
                                allowBlank : true,
                                fieldLabel : i18n.gettext('Employer'),
                                bind : {
                                    value : '{optionsRecord.employerId}'
                                }
                            }
                        ]
                    },
                    {
                        title : i18n.gettext('Parameters'),
                        reference : 'parameters',
                        collapsed : false,
                        defaults : {
                            flex : 1
                        }
                    },
                    {
                        title : i18n.gettext('Group By'),
                        reference : 'groupers',
                        layout : 'hbox',
                        defaults : {
                            flex : 1
                        }
                    },
                    {
                        title : i18n.gettext('Sort By'),
                        reference : 'sorters',
                        layout : 'vbox',
                        defaults : {
                            flex : 1
                        }
                    },
                    {
                        title : i18n.gettext('Display Columns'),
                        reference : 'columns',
                        layout : 'vbox',
                        defaults : {
                            flex : 1
                        }
                    },
                    {
                        title : i18n.gettext('Filters'),
                        reference : 'filters',
                        collapsed : false,
                        defaults : {
                            margin : '0 0 10 0',
                            flex : 1
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!advancedMode}'
                        }
                    }
                ]
            }
        ],

        buttons : [
            {
                text : i18n.gettext('Advanced Filters...'),
                cls : 'criterion-btn-primary',
                bind : {
                    text : '{editingText}'
                },
                listeners : {
                    click : 'onAdvancedClick'
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                hidden : false,
                bind : {
                    hidden : '{firstTimeRun}'
                },
                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',
                reference : 'submit',
                bind : {
                    text : '{saveButtonTitle}'
                },
                listeners : {
                    click : 'handleSubmitClick'
                }
            }
        ],

        initComponent : function() {
            var me = this;

            me.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [{
                    key : Ext.event.Event.ESC,
                    handler : function() {
                        me.fireEvent('onEsc')
                    }
                }]
            });

            me.callParent(arguments);
        }
    }
});
