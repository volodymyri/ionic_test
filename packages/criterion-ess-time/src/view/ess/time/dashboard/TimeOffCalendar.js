Ext.define('criterion.view.ess.time.dashboard.TimeOffCalendar', function() {

    return {
        alias : 'widget.criterion_selfservice_time_dashboard_time_off_calendar',

        extend : 'criterion.view.employee.benefit.TimeOffCalendar',

        requires : [
            'criterion.controller.ess.time.dashboard.TimeOffCalendar'
        ],

        viewModel : {
            data : {
                year : (new Date()).getFullYear(),
                managerMode : false
            }
        },

        ui : 'clean',

        controller : {
            type : 'criterion_selfservice_time_dashboard_time_off_calendar',
            showTitleInConnectedViewMode : true
        },

        tbar : [
            '->',
            {
                glyph : criterion.consts.Glyph['ios7-arrow-left'],
                ui : 'secondary',
                listeners : {
                    click : 'onYearPrev'
                }
            },
            ' ',
            {
                xtype : 'component',
                bind : {
                    html : '{year}'
                }
            },
            ' ',
            {
                glyph : criterion.consts.Glyph['ios7-arrow-right'],
                ui : 'secondary',
                listeners : {
                    click : 'onYearNext'
                }
            },
            '->'
        ],

        setManagerMode : function(managerMode) {
            this.getViewModel().set('managerMode', managerMode);
        }
    };

});
