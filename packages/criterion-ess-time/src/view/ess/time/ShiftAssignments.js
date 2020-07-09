Ext.define('criterion.view.ess.time.ShiftAssignments', function() {

    return {

        alias : 'widget.criterion_selfservice_time_shift_assignments',

        extend : 'criterion.view.WeekView',

        requires : [
            'criterion.store.employer.shift.occurrence.Schedules',
            'criterion.controller.ess.time.ShiftAssignments',
            'criterion.view.ess.time.ShiftAssignment'
        ],

        config : {
            readOnlyMode : true
        },

        viewModel : {
            data : {
                showAddButton : false
            }
        },

        ui : 'no-footer',

        frame : true,

        store : {
            type : 'criterion_employer_shift_occurrence_schedules'
        },

        tbar : null,

        header : {

            title : i18n.gettext('My Shift Assignments'),

            layout : 'hbox',

            items : [
                {
                    xtype : 'button',
                    text : i18n.gettext('Today'),
                    ui : 'secondary',
                    glyph : criterion.consts.Glyph['android-time'],
                    iconAlign : 'right',
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
                    cls : 'criterion-my-calendar-current-week',
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
                    bind : {
                        hidden : '{!showAddButton}'
                    },
                    ui : 'feature',
                    margin : '0 20 0 0',
                    listeners : {
                        click : 'handleAddClick'
                    }
                }
            ]
        },

        controller : {
            type : 'criterion_selfservice_time_shift_assignments',
            connectParentView : false,
            editor : {
                xtype : 'criterion_selfservice_time_shift_assignment',
                allowDelete : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],
                draggable : false
            }
        }

    }
});
