Ext.define('criterion.view.settings.hr.Project', function() {

    return {

        alias : 'widget.criterion_settings_project',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.hr.Project',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employer.CertifiedRates'
        ],

        controller : {
            type : 'criterion_settings_project',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        viewModel : {
            formulas : {
                certifiedRateIds : {
                    bind : {
                        bindTo : '{record.certifiedRate}',
                        deep : true
                    },
                    get : certifiedRates => {
                        let ids = [];

                        if (certifiedRates) {
                            certifiedRates.each(rec => {
                                ids.push(rec.get('certifiedRateId'));
                            });
                        }

                        return ids.join(',');
                    }
                }
            },

            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                certifiedRates : {
                    type : 'employer_certified_rates'
                }
            }
        },

        title : i18n._('Project'),

        allowDelete : true,

        initComponent() {
            let me = this;

            this.items = [
                {
                    scrollable : 'vertical',

                    items : [
                        {
                            layout : 'hbox',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            bodyPadding : '0 10',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_employer_combo',
                                            fieldLabel : i18n._('Employer'),
                                            name : 'employerId',
                                            disabled : true,
                                            hideTrigger : true
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Project Code'),
                                            name : 'code',
                                            bind : '{record.code}'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Project Name'),
                                            name : 'name',
                                            bind : '{record.name}'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Project Description'),
                                            name : 'description',
                                            bind : '{record.description}'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_placeholder_field'
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n._('Work Location'),
                                            bind : {
                                                store : '{employerWorkLocations}',
                                                value : '{record.employerWorkLocationId}'
                                            },
                                            name : 'employerWorkLocationId',
                                            displayField : 'description',
                                            valueField : 'id',
                                            queryMode : 'local',
                                            allowBlank : true,
                                            editable : true
                                        },
                                        {
                                            xtype : 'tagfield',
                                            fieldLabel : i18n._('Certified Rate'),
                                            reference : 'certifiedRateField',
                                            displayField : 'name',
                                            valueField : 'id',
                                            queryMode : 'local',
                                            name : 'certifiedRateId',
                                            allowBlank : true,
                                            bind : {
                                                value : '{certifiedRateIds}',
                                                store : '{certifiedRates}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype : 'component',
                            autoEl : 'hr',
                            cls : 'criterion-horizontal-ruler'
                        },

                        // custom values
                        {
                            layout : 'hbox',

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            bodyPadding : '0 10',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Custom Value 1'),
                                            name : 'customValue1',
                                            bind : '{record.customValue1}'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Custom Value 2'),
                                            name : 'customValue2',
                                            bind : '{record.customValue2}'
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Custom Value 3'),
                                            name : 'customValue3',
                                            bind : '{record.customValue3}'
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n._('Custom Value 4'),
                                            name : 'customValue4',
                                            bind : '{record.customValue4}'
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype : 'component',
                            autoEl : 'hr',
                            cls : 'criterion-horizontal-ruler'
                        },

                        {
                            xtype : 'criterion_gridview',
                            margin : '5 0 0 0',
                            maxHeight : 300,

                            bind : {
                                store : '{record.tasks}'
                            },

                            tbar : [
                                {
                                    xtype : 'component',
                                    html : '<span class="bold">' + i18n._('Tasks') + '</span>'
                                },
                                '->',
                                {
                                    xtype : 'button',
                                    reference : 'addButton',
                                    text : i18n._('Add'),
                                    cls : 'criterion-btn-feature',
                                    handler : _ => {
                                        me.getController().handleAddTask()
                                    }
                                }
                            ],
                            preventStoreLoad : true,

                            columns : [
                                {
                                    text : i18n._('Code'),
                                    dataIndex : 'code',
                                    flex : 1
                                },
                                {
                                    text : i18n._('Name'),
                                    dataIndex : 'name',
                                    flex : 2
                                },
                                {
                                    xtype : 'criterion_actioncolumn',
                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                    items : [
                                        {
                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                            tooltip : i18n._('Delete'),
                                            action : 'removeaction'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }

    }

});
