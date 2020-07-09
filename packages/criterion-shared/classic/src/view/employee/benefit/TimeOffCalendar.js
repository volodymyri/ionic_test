Ext.define('criterion.view.employee.benefit.TimeOffCalendar', {

    alias : 'widget.criterion_employee_benefit_time_off_calendar',

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.controller.employee.benefit.TimeOffCalendar',
        'criterion.ux.picker.Date',
        'criterion.ux.ColorLegend',

        'criterion.store.employee.timeOff.Details',
        'criterion.store.employer.HolidayDetails'
    ],

    viewModel : {
        data : {
            legendValues : [],
            showApproved : false
        },
        stores : {
            timeOffDetails : {
                type : 'criterion_employee_time_off_details'
            },
            holidays : {
                type : 'criterion_employer_holiday_details',
                proxy : {
                    url : criterion.consts.Api.API.EMPLOYER_HOLIDAY_DETAIL_FOR_EMPLOYEE
                }
            }
        }
    },

    config : {
        itemsInRow : 4,
        filterTimeOffTypeIds : null
    },

    controller : {
        type : 'criterion_employee_benefit_time_off_calendar'
    },

    listeners : {
        scope : 'controller',
        loadAction : 'load',
        updateCalendar : 'createCalendars'
    },

    layout : {
        type : 'hbox',
        pack : 'center'
    },

    scrollable : true,

    items : [
        {
            xtype : 'container',
            reference : 'calendars',
            layout : 'vbox'
        },
        {
            xtype : 'criterion_color_legend',
            reference : 'legend',

            bind : {
                data : {
                    values : '{legendValues}'
                },
                hidden : '{!showLegend}'
            }
        }
    ],

    updateFilterTimeOffTypeIds : function(filterTimeOffTypeIds) {
        this.lookupController().doFilterTimeOffTypeIds(filterTimeOffTypeIds);
    }

});
