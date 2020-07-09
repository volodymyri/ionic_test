Ext.define('criterion.view.settings.payroll.timesheetLayout.BreakConfigurationForm', function() {

    return {
        alias : 'widget.criterion_settings_timesheet_layout_break_configuration_form',

        extend : 'criterion.view.FormView',
        
        requires : [
            'criterion.controller.settings.payroll.timesheetLayout.BreakConfigurationForm'
        ],
        
        controller : {
            type : 'criterion_settings_payroll_timesheet_layout_break_configuration_form'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        modal : true,

        viewModel : {
            stores : {
                incomeLists : {
                    type : 'employer_income_lists',
                    extraParams : {
                        isActive : true
                    }
                }
            }
        },

        title : i18n.gettext('Break'),

        allowDelete : true,
        
        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                bind : {
                    value : '{record.name}'
                }
            },
            {
                xtype : 'combo',
                name : 'incomeListId',
                fieldLabel : i18n.gettext('Income'),
                bind : {
                    store : '{incomeLists}',
                    value : '{record.incomeListId}'
                },
                displayField : 'description',
                valueField : 'id',
                queryMode : 'local'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Is Paid'),
                name : 'isPaid',
                bind : {
                    value : '{record.isPaid}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Minimum Elapse'),
                name : 'minElapseHours',
                allowBlank : false,
                bind : '{record.minElapseHours:hoursToShortString}'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Break'),
                name : 'breakHours',
                allowBlank : false,
                bind : '{record.breakHours:hoursToShortString}'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Minimum Return'),
                name : 'minReturnHours',
                allowBlank : false,
                bind : '{record.minReturnHours:hoursToShortString}'
            }
        ]
    };

});
