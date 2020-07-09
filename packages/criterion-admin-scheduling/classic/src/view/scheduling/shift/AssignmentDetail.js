Ext.define('criterion.view.scheduling.shift.AssignmentDetail', function() {

    return {

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.scheduling.shift.AssignmentDetail'
        ],

        alias : 'widget.criterion_scheduling_shift_assignment_detail',

        plugins : [
            {
                ptype : 'criterion_sidebar'
            }
        ],

        noButtons : true,

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onCancel'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'onSave'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.UPDATE, true)
                }
            }
        ],

        viewModel : {
            data : {
                record : null
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
                            operator : '!=',
                            value : criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.CREATE_BLANK.value
                        }
                    ]
                }
            },
            formulas : {
                title : get => {
                    let startDate = get('record.startDate');

                    return Ext.String.format('{0}: {1} {2} {3}',
                        get('record.shiftGroupName'),
                        Ext.Date.format(startDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                        i18n.gettext('to'),
                        Ext.Date.format(
                            Ext.Date.add(startDate, Ext.Date.DAY, 6), criterion.consts.Api.SHOW_DATE_FORMAT
                        )
                    );
                }
            }
        },

        controller : {
            type : 'criterion_scheduling_shift_assignment_detail'
        },

        header : {
            bind : {
                title : '{title}'
            },
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'combo',
                    reference : 'actionType',
                    sortByDisplayField : false,
                    hidden : true,
                    bind : {
                        store : '{actionTypes}',
                        hidden : '{!record.canUsePrevious}'
                    },
                    valueField : 'value',
                    displayField : 'text',
                    queryMode : 'local',
                    listeners : {
                        change : 'onActionChange'
                    }
                }
            ]
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        scrollable : true,

        items : [],

        loadRecord : function(record) {
            this.getController() && this.getController().loadRecord(record);
        }
    }
});
