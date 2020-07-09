Ext.define('criterion.view.ess.time.timeOffHistory.TimeOffForm', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        alias : 'widget.criterion_selfservice_time_time_off_history_time_off_form',

        extend : 'criterion.view.employee.benefit.TimeOffForm',

        requires : [
            'criterion.controller.ess.time.timeOffHistory.TimeOffForm'
        ],

        controller : {
            type : 'criterion_selfservice_time_time_off_history_time_off_form',
            saveParams : null
        },

        title : i18n.gettext('Time Off'),

        frame : true,

        timeFieldXType : 'criterion_time_field',

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.TWO_COL_CONDENSED,

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.TimeOff
                 */
                record : null,

                managerMode : false,

                hideNavigationBtns : true
            },
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !data('record.isRemovable');
                },

                hideSubmit : function(data) {
                    return !data('record.canBeSubmitted');
                },

                hideSave : function(data) {
                    return !data('record.isUpdatable');
                },

                cancelBtnText : function(data) {
                    return (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED &&
                        data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED) ? i18n.gettext('Close') : i18n.gettext('Cancel');
                },

                readOnlyMode : function(data) {
                    return (!data('isPhantom') &&
                        (data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.NOT_SUBMITTED && data('record.timeOffStatusCode') !== WORKFLOW_STATUSES.REJECTED));
                },

                allowRecallBtn : function(data) {
                    return data('record.canRecall');
                }
            }
        },

        setButtonConfig : function() {
            var buttons = [];

            buttons.push(
                {
                    xtype : 'button',
                    text : i18n.gettext('Recall'),
                    ui : 'remove',
                    listeners : {
                        click : 'handleRecallRequest'
                    },
                    hidden : true,
                    bind : {
                        hidden : '{!allowRecallBtn}',
                        disabled : '{blockedState}'
                    }
                },
                {
                    xtype : 'tbspacer',
                    hidden : true,
                    bind : {
                        hidden : '{!allowRecallBtn}'
                    }
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Submit'),
                    listeners : {
                        click : 'handleSubmit'
                    },
                    hidden : true,
                    bind : {
                        hidden : '{hideSubmit}',
                        disabled : '{blockedState}'
                    }
                },
                {
                    xtype : 'tbspacer',
                    hidden : true,
                    bind : {
                        hidden : '{hideSubmit}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.gettext('Delete'),
                    ui : 'remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{blockedState}',
                        hidden : '{hideDelete}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    text : i18n.gettext('Cancel'),
                    ui : 'light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    bind : {
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}',
                        text : '{cancelBtnText}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{blockedState}',
                        hidden : '{hideSave}',
                        text : '{submitBtnText}'
                    }
                }
            );

            this.buttons = buttons;
        }

    };

});
