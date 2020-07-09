Ext.define('criterion.view.settings.payroll.shiftRate.Detail', function() {

    var moveMidnightTime = function(field) {
        var picker = field.picker,
            store = picker.store;

        store.insert(store.getCount() - 1, store.getAt(0));
    };

    var calculateTimeDiff = function(startTime, endTime) {
        if (Ext.isDate(startTime) && Ext.isDate(endTime)) {
            var hourDiff = endTime.getHours() - startTime.getHours(),
                minDiff = endTime.getMinutes() - startTime.getMinutes();

            if (endTime.getHours() === 0) {
                hourDiff += 24;
            }

            return {
                hours : minDiff < 0 ? hourDiff - 1 : hourDiff,
                minutes : Math.abs(minDiff)
            };
        } else {
            return {
                hours : null,
                minutes : null
            };
        }

    };

    return {
        alias : 'widget.criterion_settings_shift_rate_detail',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.shiftRate.Detail',
            'criterion.store.WeekDays'
        ],

        controller : {
            type : 'criterion_settings_shift_rate_detail',
            externalUpdate : true
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Shift Period'),

        allowDelete : true,
        modal : true,
        draggable : true,

        viewModel : {
            formulas : {
                endTime : {
                    bind : {
                        bindTo : {
                            startTime : '{record.startTime}',
                            hours : '{record.hours}',
                            minutes : '{record.minutes}'
                        }
                    },
                    get : function(bind) {
                        var startTime = bind.startTime;

                        return startTime && new Date(startTime.getTime() + bind.hours * 1000 * 60 * 60 + bind.minutes * 1000 * 60);
                    },
                    set : function(endTime) {
                        var record = this.get('record'),
                            startTime = record.get('startTime'),
                            timeDiff = calculateTimeDiff(startTime, endTime);

                        record.set(timeDiff);
                    }
                },
                // allowDeletePhantom doesn't work when we are on new parent form, as it's isPhantom : true inherited and
                // prevent fire calculation of hideDelete, based on isPhantom, so have to do workaround
                hideDelete : function() {
                    return false;
                }
            },
            stores : {
                weekDays : {
                    type : 'criterion_weekdays'
                }
            }
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                bind : {
                    value : '{record.name}'
                }
            },
            {
                xtype : 'tagfield',
                reference : 'weekDaysCombo',
                bind : {
                    store : '{weekDays}'
                },
                disableDirtyCheck : true,
                fieldLabel : i18n.gettext('Days of Week'),
                sortByDisplayField : false,
                displayField : 'name',
                valueField : 'value',
                allowBlank : true,
                editable : false,
                queryMode : 'local'
            },
            {
                xtype : 'timefield',
                fieldLabel : i18n.gettext('Start Time'),
                bind : {
                    value : '{record.startTime}'
                },
                allowBlank : false,
                increment : 30,
                flex : 1,
                listeners : {
                    beforeselect : function(field, dateRecord) {
                        var vm = this.lookupViewModel(),
                            record = vm.get('record'),
                            startTime = dateRecord.get('date'),
                            endTime = vm.get('endTime');

                        if (startTime && endTime) {
                            record.set(calculateTimeDiff(startTime, endTime));
                        }
                    }
                }
            },
            {
                xtype : 'timefield',
                fieldLabel : i18n.gettext('End Time'),
                bind : {
                    value : '{endTime}'
                },
                allowBlank : false,
                increment : 30,
                flex : 1,
                listeners : {
                    afterrender : moveMidnightTime,
                    beforeselect : 'onBeforeSelectEndTime'
                }
            },
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Premium'),
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    value : 'true',
                                    text : i18n.gettext('Percentage')
                                },
                                {
                                    value : 'false',
                                    text : i18n.gettext('Amount')
                                }
                            ]
                        }),
                        sortByDisplayField : false,
                        valueField : 'value',
                        allowBlank : true,
                        editable : false,
                        value : true,
                        bind : {
                            value : '{record.isPercentage}'
                        },
                        width : 280,
                        margin : '0 20 0 0'
                    },
                    {
                        xtype : 'criterion_percentagefield',
                        maxValue : 1,
                        fieldLabel : '',
                        labelWidth : 0,
                        hideLabel : true,
                        hidden : true,
                        allowBlank : false,
                        bind : {
                            value : '{record.amount}',
                            hidden : '{!record.isPercentage}',
                            disabled : '{!record.isPercentage}'
                        },
                        width : 130
                    },
                    {
                        xtype : 'criterion_currencyfield',
                        fieldLabel : '',
                        labelWidth : 0,
                        hideLabel : true,
                        hidden : false,
                        allowBlank : false,
                        bind : {
                            value : '{record.amount}',
                            hidden : '{record.isPercentage}',
                            disabled : '{record.isPercentage}'
                        },
                        width : 130
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.callParent(arguments);
            this.getController() && this.getController().loadRecord(record);
        }
    }
});
