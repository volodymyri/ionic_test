Ext.define('criterion.view.ess.preferences.Calendar', function() {

    return {
        alias : 'widget.criterion_ess_preferences_calendar',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.ess.preferences.Calendar'
        ],

        controller : {
            type : 'criterion_ess_preferences_calendar',
            externalUpdate : false
        },

        title : i18n.gettext('Calendar'),

        getDeleteConfirmMessage : function(record) {
            return Ext.util.Format.format('Do you want to delete {0}?',
                record.get('isDefault') ? '<b>Default</b> calendar' : 'the record');
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        viewModel : {
            data : {
                type_1 : '',
                type_2 : '',
                type_4 : '',
                type_8 : '',
                type_16 : '',
                type_32 : '',
                type_64 : ''
            },

            formulas : {
                contentType : {
                    get : function(data) {
                        var res = 0,
                            me = this,
                            // do not delete, otherwise formula will not fire
                            i = data('type_1') + data('type_2') + data('type_4') +
                                data('type_8') + data('type_16') + data('type_32') + data('type_64');

                        Ext.Array.each([1, 2, 4, 8, 16, 32, 64], function(ind) {
                            var val = data('type_' + ind),
                                result;

                            if (val === true) {
                                result = ind.toString(2);
                                while (result.length < 4) {
                                    result = "0" + result;
                                }
                                me.set('type_' + ind, result);
                            }

                            if (val) {
                                res += parseInt(val, 2);
                            }
                        });
                        return res;
                    },

                    set : function(value) {
                        var newCheck = {};

                        Ext.Array.each([1, 2, 4, 8, 16, 32, 64], function(ind) {
                            newCheck['type_' + ind] = value & ind ?
                                (Ext.String.leftPad((ind >>> 0).toString(2), 4, '0')) : '';
                        });

                        this.set(newCheck);
                    }
                }
            }
        },

        items : [
            {
                xtype : 'hiddenfield',
                name : 'content',
                bind : {
                    value : '{contentType}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                width : '100%',
                bind : {
                    value : '{record.name}'
                }
            },
            {
                xtype : 'checkboxgroup',
                fieldLabel : i18n.gettext('Content Type'),
                columns : 1,
                vertical : true,
                items : [
                    {
                        boxLabel : i18n.gettext('My Courses'),
                        inputValue : '1000000',
                        bind : {
                            value : '{type_64}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('My Time Off'),
                        inputValue : '0001',
                        bind : {
                            value : '{type_1}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('My Team Time Off'),
                        inputValue : '0010',
                        bind : {
                            value : '{type_2}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('Company Time Off'),
                        inputValue : '100000',
                        bind : {
                            value : '{type_32}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('My Team Birthdays'),
                        inputValue : '0100',
                        bind : {
                            value : '{type_4}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('Company Holidays'),
                        inputValue : '1000',
                        bind : {
                            value : '{type_8}'
                        }
                    },
                    {
                        boxLabel : i18n.gettext('Company Events'),
                        inputValue : '10000',
                        bind : {
                            value : '{type_16}'
                        }
                    }
                ]
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Default Calendar'),
                name : 'isDefault',
                bind : {
                    value : '{record.isDefault}'
                }
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                margin : '0 0 20 0'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Enabled iCalendar'),
                name : 'isEnabledICalendar',
                handler : 'handleICalendarClick',
                bind : {
                    value : '{record.isEnabledICalendar}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Show Partial Days as All Day'),
                name : 'isConvertAllDay',
                bind : {
                    disabled : '{!record.isEnabledICalendar}',
                    value : '{record.isConvertAllDay}'
                }
            }
        ],

        loadRecord : function(record) {
            var me = this;

            this.callParent(arguments);
            Ext.Function.defer(function() {
                me.down('checkboxgroup').resetOriginalValue();
            }, 200);
        }
    }
});
