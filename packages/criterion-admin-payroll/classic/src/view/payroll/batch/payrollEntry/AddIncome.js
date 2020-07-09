Ext.define('criterion.view.payroll.batch.payrollEntry.AddIncome', function() {

    return {
        alias : 'widget.criterion_payroll_batch_payroll_entry_add_income',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.payrollEntry.AddIncome'
        ],

        controller : {
            type : 'criterion_payroll_batch_payroll_entry_add_income'
        },

        title : i18n.gettext('Add Income'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        layout : 'fit',
        closable : true,
        modal : true,
        alwaysOnTop : true,
        bodyPadding : 10,

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                scale : 'small',
                handler : 'handleAdd',
                disabled : true,
                bind : {
                    disabled : '{!selectedIncome}'
                }
            }
        ],

        viewModel : {
            data : {
                projectId : null,
                assignmentsStore : null,
                incomesStore : null,
                tasksStore : null,
                employeeWorkLocationsStore : null,
                workLocationAreasStore : null,
                selectedIncome : null,
                labelWorkLocation : null,
                labelWorkArea : null,
                labelAssignment : null,
                labelTask : null,
                labelProject : null,
                isShowWorkLocation : false,
                isShowWorkArea : false,
                isShowAssignment : false,
                isShowTasks : false,
                isShowProject : false
            },
            formulas : {
                hideAssignment : data => !data('assignmentsStore') || !(data('assignmentsStore').count() > 1) && !data('isShowAssignment'),
                hideWorkLocations : data => !data('employeeWorkLocationsStore') || !(data('employeeWorkLocationsStore').count() > 1) && !data('isShowWorkLocation')
            }
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'form',

                    defaults : {
                        valueField : 'id',
                        queryMode : 'local',
                        allowBlank : false,
                        labelAlign : 'top',
                        forceSelection : true,
                        listeners : {
                            afterrender : function(combo) {
                                if (combo['reference'] === 'employeeTask') {
                                    return;
                                }

                                Ext.defer(function() {
                                    var store = combo.getStore();
                                    // workaround as autoselect doesnt work with view model
                                    store && store.count() && combo.setValue(combo.getStore().getAt(0).get(combo.valueField));
                                }, 1);
                            }
                        }
                    },

                    items : [
                        {
                            xtype : 'combobox',
                            name : 'assignmentId',
                            valueField : 'assignmentId',
                            displayField : 'title',
                            bind : {
                                store : '{assignmentsStore}',
                                hidden : '{hideAssignment}',
                                fieldLabel : '{labelAssignment || "' + i18n.gettext('Title') + '"}'
                            }
                        },
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{incomesStore}',
                                selection : '{selectedIncome}'
                            },
                            name : 'incomeListId',
                            fieldLabel : i18n.gettext('Income'),
                            displayField : 'name'
                        },
                        {
                            xtype : 'combobox',
                            reference : 'workLocation',
                            bind : {
                                store : '{employeeWorkLocationsStore}',
                                hidden : '{hideWorkLocations}',
                                fieldLabel : '{labelWorkLocation || "' + i18n.gettext('Location') + '"}'
                            },
                            name : 'employerWorkLocationId',
                            displayField : 'employerLocationName',
                            valueField : 'employerWorkLocationId'
                        },
                        {
                            xtype : 'combobox',
                            bind : {
                                store : '{workLocationAreasStore}',

                                fieldLabel : '{labelWorkArea || "' + i18n.gettext('Area') + '"}',

                                filters : [
                                    {
                                        property : 'workLocationId',
                                        value : '{workLocation.selection.workLocationId}',
                                        exactMatch : true
                                    }
                                ],

                                hidden : '{!isShowWorkArea}'
                            },
                            name : 'workLocationAreaId',
                            forceSelection : true,
                            queryMode : 'local',
                            valueField : 'id',
                            displayField : 'name',
                            allowBlank : true
                        },
                        {
                            xtype : 'combobox',
                            name : 'projectId',
                            bind : {
                                value : '{projectId}',
                                store : '{projectsStore}',
                                hidden : '{!isShowProject}',
                                fieldLabel : '{labelProject || "' + i18n.gettext('Project') + '"}'
                            },
                            displayField : 'name',
                            allowBlank : true,
                            editable : true
                        },
                        {
                            xtype : 'combobox',
                            reference : 'employeeTask',
                            name : 'taskId',
                            bind : {
                                store : '{tasksStore}',
                                hidden : '{!isShowTasks}',
                                fieldLabel : '{labelTask || "' + i18n.gettext('Task') + '"}',
                                filters : [
                                    {
                                        property : 'projectId',
                                        value : '{projectId}',
                                        exactMatch : true,
                                        disabled : '{!projectId}'
                                    }
                                ]
                            },
                            displayField : 'name',
                            allowBlank : true,
                            editable : true
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };
});

