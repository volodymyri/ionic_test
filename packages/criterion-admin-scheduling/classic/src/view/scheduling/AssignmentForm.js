Ext.define('criterion.view.scheduling.AssignmentForm', function() {

    return {

        extend : 'criterion.ux.form.Panel',

        alias : 'widget.criterion_scheduling_assignment_form',

        requires : [
            'criterion.model.employer.ShiftOccurrence',
            'criterion.controller.scheduling.AssignmentForm'
        ],

        controller : {
            type : 'criterion_scheduling_assignment_form'
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

        viewModel : {
            data : {
                record : null,
                shiftGroup : null
            },
            stores : {
                actionTypes : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'value',
                            type : 'integer'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : Ext.Object.getValues(criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE),
                    filters : [
                        {
                            property : 'value',
                            operator : '=',
                            value : criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.CREATE_BLANK.value,
                            disabled : '{!!shiftGroup.startDate}'
                        }
                    ]
                },
                startData : {
                    type : 'criterion_employer_shift_occurrence_start_data'
                }
            },
            formulas : {
                isCopyFrom : data => data('record.actionType') === criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.COPY_FROM.value,
            }
        },

        defaultListenerScope : true,

        title : i18n.gettext('Add Assignment'),

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
                text : i18n.gettext('Add'),
                listeners : {
                    scope : 'controller',
                    click : 'handleAddShiftAssignment'
                }
            }
        ],

        items : [
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Shift Group'),
                bind : {
                    store : '{startData}',
                    value : '{record.shiftGroupId}',
                    selection : '{shiftGroup}'
                },
                valueField : 'shiftGroupId',
                displayField : 'shiftGroupName',
                queryMode : 'local',
                allowBlank : false,
                listeners : {
                    change : (cmp) => {
                        let vm = cmp.up().getViewModel(),
                            record = vm.get('record');

                        if (record && !record.get('actionType') && vm.get('shiftGroup.isRotating') && vm.get('shiftGroup.startDate')) {
                            record.set('actionType', criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.ROTATE.value);
                        }
                    }
                }
            },
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Start Date'),
                tpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="x-boundlist-item">{date:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</div>',
                    '</tpl>'
                ),
                displayTpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '{date:date(criterion.consts.Api.SHOW_DATE_FORMAT)}',
                    '</tpl>'
                ),
                bind : {
                    store : '{shiftGroup.dates}',
                    value : '{record.startDate}'
                },
                valueField : 'date',
                displayField : 'date',
                queryMode : 'local',
                allowBlank : false
            },
            {
                xtype : 'combo',
                sortByDisplayField : false,
                fieldLabel : i18n.gettext('Action Type'),
                bind : {
                    store : '{actionTypes}',
                    value : '{record.actionType}'
                },
                valueField : 'value',
                displayField : 'text',
                queryMode : 'local',
                allowBlank : false
            },
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
                hidden : true,
                bind : {
                    store : '{shiftGroup.previousShifts}',
                    value : '{record.previousShiftId}',
                    hidden : '{!isCopyFrom}'
                },
                valueField : 'id',
                queryMode : 'local'
            }
        ]
    }
});
