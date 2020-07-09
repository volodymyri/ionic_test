Ext.define('criterion.view.employee.benefit.TimeOff', {

    alias : 'widget.criterion_employee_benefit_time_off',

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.controller.employee.benefit.TimeOff',
        'criterion.view.employee.benefit.TimeOffList',
        'criterion.view.employee.benefit.TimeOffCalendar',
        'criterion.store.employer.WorkLocations'
    ],

    title : i18n.gettext('Time Off'),

    viewModel : {
        data : {
            activeViewIdx : 0,
            year : (new Date()).getFullYear(),
            showLegend : false
        },
        formulas : {
            legendButtonText : function(get) {
                return get('showLegend') ? i18n.gettext('Hide Legend') : i18n.gettext('Show Legend');
            },
            isList : function(get) {
                return get('activeViewIdx') === 0;
            }
        },
        stores : {
            employerWorkLocations : {
                type : 'employer_work_locations'
            }
        }
    },

    listeners : {
        scope : 'controller',
        activate : 'handleActivate'
    },

    controller : {
        type : 'criterion_employee_benefit_time_off'
    },

    layout : 'card',

    bind : {
        activeItem : '{activeViewIdx}'
    },

    tbar : [
        {
            xtype : 'button',
            reference : 'addButton',
            text : i18n.gettext('Add'),
            cls : 'criterion-btn-feature',
            listeners : {
                click : 'handleAddClick'
            },
            hidden : true,
            bind : {
                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.CREATE, true)
            }
        },
        '->',
        {
            glyph : criterion.consts.Glyph['ios7-arrow-left'],
            cls : 'criterion-btn-transparent',
            listeners : {
                click : 'onYearPrev'
            }
        },
        {
            xtype : 'component',
            bind : {
                html : '{year}'
            }
        },
        {
            glyph : criterion.consts.Glyph['ios7-arrow-right'],
            cls : 'criterion-btn-transparent',
            listeners : {
                click : 'onYearNext'
            }
        },
        '->',
        {
            xtype : 'button',
            scale : 'medium',
            reference : 'legendToggle',
            enableToggle : true,
            cls : 'criterion-btn-transparent',
            glyph : criterion.consts.Glyph['ios7-help-outline'],
            bind : {
                pressed : '{showLegend}',
                tooltip : '{legendButtonText}',
                hidden : '{isList}'
            }
        },
        {
            xtype : 'button',
            cls : 'criterion-btn-transparent',
            glyph : criterion.consts.Glyph['grid'],
            scale : 'medium',
            tooltip : i18n.gettext('Show Grid'),
            listeners : {
                click : 'handleSwitchToGridView'
            },
            bind : {
                hidden : '{isList}'
            }
        },
        {
            xtype : 'button',
            tooltip : i18n.gettext('Show Calendar'),
            cls : 'criterion-btn-transparent',
            glyph : criterion.consts.Glyph['ios7-calendar-outline'],
            scale : 'medium',
            listeners : {
                click : 'handleSwitchToCalendarView'
            },
            bind : {
                hidden : '{!isList}'
            }
        }
    ],

    items : [
        {
            xtype : 'criterion_employee_benefit_time_off_list',
            reference : 'list',
            viewModel : {
                data : {
                    showApproved : true
                }
            }
        },
        {
            xtype : 'criterion_employee_benefit_time_off_calendar',
            reference : 'calendar',
            overflowY : 'auto',
            viewModel : {
                data : {
                    showApproved : true
                }
            }
        },
        {
            html : Ext.util.Format.format('<p>{0}</p>', i18n.gettext('No assignments found. Assign employee to a position before manage Time Offs.')),
            margin: 10
        }
    ]

});
