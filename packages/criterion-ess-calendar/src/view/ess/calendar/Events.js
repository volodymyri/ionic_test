Ext.define('criterion.view.ess.calendar.Events', function() {

    return {
        alias : 'widget.criterion_selfservice_calendar_events',

        extend : 'criterion.view.ess.calendar.event.List',

        requires : [
            'criterion.controller.ess.calendar.Events'
        ],

        controller : {
            type : 'criterion_selfservice_calendar_events'
        },

        viewModel : {
            data : {
                allowAddEvents : false
            }
        },

        listeners : {
            setCompEvents : 'handleSetCompEvents'
        },

        frame : true,

        header : {

            title : i18n.gettext('Events'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    listeners : {
                        click : 'handleAddClick'
                    },
                    disabled : true,
                    bind : {
                        disabled : '{!allowAddEvents}',
                        hidden : '{!allowAddEvents}'
                    }
                }
            ]
        }
    };

});
