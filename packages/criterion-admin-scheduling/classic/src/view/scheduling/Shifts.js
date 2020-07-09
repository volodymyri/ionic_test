Ext.define('criterion.view.scheduling.Shifts', {

    extend : 'criterion.view.GridView',

    alias : 'widget.criterion_scheduling_shifts',

    requires : [
        'criterion.controller.scheduling.Shifts',
        'criterion.store.employer.ShiftGroups',
        'criterion.store.employer.WorkLocations',
        'criterion.store.workLocation.Areas',
        'criterion.view.scheduling.ShiftGroup'
    ],

    viewModel : {
        stores : {
            shiftGroups : {
                type : 'criterion_employer_shift_groups'
            },

            employerWorkLocations : {
                type : 'employer_work_locations'
            },
            workLocationAreas : {
                type : 'work_location_areas'
            }
        }
    },

    tbar : null,

    controller : {
        type : 'criterion_scheduling_shifts',
        baseRoute : criterion.consts.Route.SCHEDULING.SHIFT,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_scheduling_shift_group',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    bind : {
        store : '{shiftGroups}'
    },

    dockedItems : [
        {
            xtype : 'panel',
            dock : 'left',

            cls : 'criterion-side-panel',

            width : 300,

            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            autoScroll : true,

            items : [
                {
                    layout : 'hbox',
                    cls : 'criterion-side-field',
                    padding : '26 20',

                    items : [
                        {
                            xtype : 'button',
                            flex : 1,
                            text : i18n.gettext('Add Shift Group'),
                            textAlign : 'left',
                            handler : 'handleAddClick',
                            cls : 'criterion-btn-side-add',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.CREATE, true)
                            }
                        }
                    ]
                },
                {
                    xtype : 'form',
                    reference : 'searchForm',

                    defaults : {
                        labelAlign : 'top',
                        width : '100%',
                        cls : 'criterion-side-field'
                    },

                    items : [
                        {
                            xtype : 'criterion_employer_combo',
                            fieldLabel : i18n.gettext('Employer'),
                            name : 'employerId',
                            autoSetFirst : true,
                            reference : 'employerCombo',
                            listeners : {
                                change : 'handleSearchComboChange'
                            },
                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            },
                            bind : {
                                value : '{employerId}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n.gettext('Shift Group'),
                            name : 'groupName',
                            enableKeyEvents : true,
                            listeners : {
                                keypress : 'onKeyPress'
                            }
                        },
                        {
                            xtype : 'combobox',
                            fieldLabel : i18n.gettext('Work Location'),
                            displayField : 'description',
                            valueField : 'id',
                            queryMode : 'local',
                            name : 'employerWorkLocationId',
                            reference : 'workLocation',
                            forceSelection : true,
                            bind : {
                                store : '{employerWorkLocations}',
                                value : '{employerWorkLocationId}',
                                filters : {
                                    property : 'employerId',
                                    value : '{employerId}',
                                    exactMatch : true,
                                    disableOnEmpty : true
                                }
                            },
                            listeners : {
                                change : 'handleSearchComboChange'
                            },
                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            }
                        },
                        {
                            xtype : 'combobox',
                            fieldLabel : i18n.gettext('Work Area'),
                            displayField : 'name',
                            valueField : 'id',
                            queryMode : 'local',
                            name : 'workLocationAreaId',
                            forceSelection : true,
                            hidden : true,
                            bind : {
                                store : '{workLocationAreas}',
                                disabled : '{!employerWorkLocationId}',
                                hidden : '{!employerWorkLocationId}',
                                filters : {
                                    property : 'workLocationId',
                                    value : '{workLocation.selection.workLocationId}',
                                    exactMatch : true
                                }
                            },
                            listeners : {
                                change : 'handleSearchComboChange'
                            },
                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            }
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    padding : 20,
                    items : [
                        {
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Search'),
                            cls : 'criterion-btn-primary',
                            listeners : {
                                click : 'handleSearchButtonClick'
                            }
                        }
                    ]
                }
            ]
        }
    ],

    columns : [
        {
            text : i18n.gettext('Shift Group'),
            dataIndex : 'name',
            flex : 2,
            minWidth : 170
        },
        {
            text : i18n.gettext('Start Day'),
            dataIndex : 'startingDay',
            width : 170,
            renderer : value => criterion.Consts.DAYS_OF_WEEK_ARRAY[value - 1]
        },
        {
            text : i18n.gettext('Shift Count'),
            dataIndex : 'shiftCount',
            width : 150
        },
        {
            text : i18n.gettext('Work Location'),
            dataIndex : 'employerWorkLocation',
            flex : 1,
            minWidth : 170
        },
        {
            text : i18n.gettext('Work Area'),
            dataIndex : 'workLocationArea',
            flex : 1,
            minWidth : 170
        },
        {
            xtype : 'booleancolumn',
            header : i18n.gettext('Rotation'),
            align : 'center',
            dataIndex : 'isRotating',
            trueText : '✓',
            falseText : '-',
            width : 170
        }
    ]

});
