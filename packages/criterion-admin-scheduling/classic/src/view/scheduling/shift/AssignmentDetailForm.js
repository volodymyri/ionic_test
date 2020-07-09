Ext.define('criterion.view.scheduling.shift.AssignmentDetailForm', function() {

    return {

        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_scheduling_shift_assignment_detail_form',

        requires : [
            'criterion.controller.scheduling.shift.AssignmentDetailForm'
        ],

        controller : {
            type : 'criterion_scheduling_shift_assignment_detail_form'
        },

        viewModel : {
            data : {
                shiftOccurrenceId : null
            },
            stores : {
                previousShifts : {
                    type : 'criterion_employer_shift_occurrence_previous_shifts'
                }
            }
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        closable : true,

        draggable : false,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        defaultListenerScope : true,

        title : i18n.gettext('Copy From Assignment'),

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    scope : 'controller',
                    click : 'handleCancel'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Copy'),
                listeners : {
                    scope : 'controller',
                    click : 'handleCopyShiftAssignmentDetails'
                }
            }
        ],

        items : [
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Shift Assignment'),
                tpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="x-boundlist-item">{dateStart:date(criterion.consts.Api.SHOW_DATE_FORMAT)} to {dateEnd:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</div>',
                    '</tpl>'
                ),
                displayTpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '{dateStart:date(criterion.consts.Api.SHOW_DATE_FORMAT)} to {dateEnd:date(criterion.consts.Api.SHOW_DATE_FORMAT)}',
                    '</tpl>'
                ),
                bind : {
                    store : '{previousShifts}',
                    value : '{previousShiftId}'
                },
                valueField : 'id',
                queryMode : 'local',
                allowBlank : false
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Clear Existing Entries'),
                bind : {
                    value : '{isClearExisting}'
                }
            }
        ]
    }
});
