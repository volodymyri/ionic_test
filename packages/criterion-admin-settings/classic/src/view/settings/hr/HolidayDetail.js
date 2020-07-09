Ext.define('criterion.view.settings.hr.HolidayDetail', function() {

    return {
        alias : 'widget.criterion_settings_holiday_detail',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Holiday'),

        allowDelete : true,
        modal : true,

        items : [
            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Date'),
                bind : {
                    value : '{record.date}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('All Day'),
                inputValue : true,
                bind : '{record.isAllDay}',
                listeners : {
                    change : function(cmp, value) {
                        var vm = this.up('criterion_settings_holiday_detail').getViewModel();

                        // todo default bind value don't work properly
                        vm.set('record.isAllDay', value);
                        if (value) {
                            vm.set('record.startTime', null);
                            vm.set('record.endTime', null);
                        }
                    }
                }
            },
            {
                xtype : 'timefield',
                fieldLabel : i18n.gettext('Start'),
                hidden : true,
                disabled : true,
                allowBlank : false,
                bind : {
                    value : '{record.startTime}',
                    disabled : '{record.isAllDay}',
                    hidden : '{record.isAllDay}'
                }
            },
            {
                xtype : 'timefield',
                fieldLabel : i18n.gettext('End'),
                hidden : true,
                disabled : true,
                allowBlank : false,
                bind : {
                    value : '{record.endTime}',
                    disabled : '{record.isAllDay}',
                    hidden : '{record.isAllDay}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Description'),
                bind : {
                    value : '{record.description}'
                }
            }
        ]
    }
});
