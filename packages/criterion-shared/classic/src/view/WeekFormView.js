Ext.define('criterion.view.WeekFormView', function() {

    return {

        alias : 'widget.criterion_week_form_view',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.WeekFormView',
            'criterion.view.ux.form.DateTime'
        ],

        viewModel : {
            formulas : {
                readOnly : function() {
                    return false;
                },
                title : function(data) {
                    return data('isPhantom') ? i18n.gettext('Create Event') : i18n.gettext('Edit Event')
                }
            }
        },

        bind : {
            title : '{title}'
        },

        controller : {
            type : 'criterion_week_form_view',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        setButtonConfig : function() {
            if (this.getNoButtons()) {
                return;
            }

            var buttons = [];

            if (this.getAllowDelete()) {
                buttons.push(
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
                            disabled : '{disableDelete}',
                            hidden : '{hideDelete}'
                        }
                    },
                    '->'
                )
            }

            buttons.push(
                {
                    xtype : 'button',
                    reference : 'cancel',
                    ui : 'light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    }
                }
            );

            this.buttons = buttons;
        },

        getStartField : function() {
            return {
                xtype : 'criterion_ux_form_datetime',
                fieldLabel : i18n.gettext('Start'),
                reference : 'startDate',
                name : 'startTimestamp',
                requiredMark : true,
                bind : {
                    value : '{record.startTimestamp}',
                    readOnly : '{readOnly}',
                    hideTime : '{record.fullDay}'
                }
            };
        },

        getEndField : function() {
            return {
                xtype : 'criterion_ux_form_datetime',
                fieldLabel : i18n.gettext('End'),
                reference : 'endDate',
                name : 'endTimestamp',
                requiredMark : true,
                bind : {
                    value : '{record.endTimestamp}',
                    readOnly : '{readOnly}',
                    hideTime : '{record.fullDay}'
                }
            };
        },

        getFullDayField : function() {
            return {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Full Day'),
                labelAlign : 'left',
                reference : 'fullDay',
                name : 'fullDay',
                inputValue : true,
                bind : {
                    value : '{record.fullDay}',
                    readOnly : '{readOnly}'
                }
            }
        },

        getRecurrenceField : function() {
            return {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Recurring'),
                labelAlign : 'left',
                name : 'recurring',
                inputValue : true,
                bind : {
                    value : '{record.recurring}',
                    readOnly : '{readOnly}'
                }
            }
        },

        getNameField : function() {
            return {
                xtype : 'textfield',
                allowBlank : false,
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                bind : {
                    value : '{record.name}',
                    readOnly : '{readOnly}'
                }
            };
        },

        getBaseFields : function() {
            return [
                this.getNameField(),
                Ext.apply(this.getStartField(), {
                    margin : '0 0 15 0'
                }),
                Ext.apply(this.getEndField(), {
                    margin : '0 0 15 0'
                }),
                this.getFullDayField(),
                this.getRecurrenceField()
            ];
        },

        initComponent : function() {
            this.items = this.getBaseFields();
            this.callParent(arguments);
        }
    }
});
