Ext.define('criterion.view.ess.time.Availability', function() {

    return {

        alias : 'widget.criterion_selfservice_time_availability',

        extend : 'criterion.view.WeekView',

        requires : [
            'criterion.controller.ess.time.Availability',
            'criterion.view.ess.time.AvailabilityForm',
            'criterion.store.employee.UnavailableBlocks',
            'criterion.store.searchEmployee.ByNameEmployees',
            'criterion.store.employer.WorkLocations'
        ],

        ui : 'no-footer',

        frame : true,

        header : {

            title : {
                text : i18n.gettext('Availability'),
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Today'),
                    ui : 'secondary',
                    listeners : {
                        click : 'handleTodayClick'
                    },
                    bind : {
                        hidden : '{!showTodayButton}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-left'],
                    ui : 'secondary',
                    listeners : {
                        click : 'handlePrevWeek'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'component',
                    reference : 'currentWeek',
                    tooltipEnabled : true,
                    bind : {
                        tooltip : '{timezone}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    glyph : criterion.consts.Glyph['ios7-arrow-right'],
                    iconAlign : 'right',
                    ui : 'secondary',
                    listeners : {
                        click : 'handleNextWeek'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Add'),
                    disabled : true,
                    bind : {
                        disabled : '{!allowAddButton}'
                    },
                    ui : 'feature',
                    listeners : {
                        click : 'handleAddClick'
                    }
                }
            ]
        },

        store : {
            type : 'criterion_employee_unavailable_blocks'
        },

        cls : 'criterion-selfservice-time-availability',

        viewModel : {
            data : {
                showTodayButton : true,
                managerMode : false,
                notifyEmployee : false
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                }
            },

            formulas : {
                allowAddButton : function(data) {
                    return data('managerMode') && data('employeesCombo.selection') || !data('managerMode');
                }
            }
        },

        listeners : {
            show : 'onShow'
        },

        bind : {
            title : '{titleText}'
        },

        controller : {
            type : 'criterion_selfservice_time_availability',
            editor : {
                xtype : 'criterion_selfservice_time_availability_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                draggable : false
            }
        },

        tbar : null,

        dockedItems: [
            {
                xtype : 'toolbar',
                dock : 'top',
                bind : {
                    hidden : '{!managerMode}'
                },

                items : [
                    {
                        xtype : 'combo',
                        reference : 'employeesCombo',
                        store : {
                            type : 'criterion_search_employee_by_name_employees',
                            proxy: { extraParams: { isActive: true } }, 
                            filters : function(employee) {
                                return employee.get('personId') !== criterion.Api.getCurrentPersonId();
                            },
                            pageSize : criterion.Consts.PAGE_SIZE.NONE
                        },
                        labelWidth : 80,
                        padding : '0 20 0',
                        fieldLabel : i18n.gettext('Employee'),
                        displayField : 'fullName',
                        valueField : 'employeeId',
                        queryParam : 'name',
                        minChars : 1,
                        listeners : {
                            change : 'onEmployeeComboChange'
                        }
                    },
                    '->',
                    {
                        xtype : 'toggleslidefield',
                        fieldLabel : i18n.gettext('Notify Employee of Changes'),
                        margin : '0 0 0 10',
                        labelWidth : 200,
                        bind : {
                            value : '{notifyEmployee}'
                        }
                    }
                ]
            }
        ]
    }
});
