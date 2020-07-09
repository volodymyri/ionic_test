Ext.define('criterion.view.ess.time.attendanceDashboard.OptionsOvertime', function() {

    return {

        extend : 'criterion.view.ess.time.attendanceDashboard.Options',

        alias : 'widget.criterion_selfservice_time_attendance_dashboard_options_overtime',

        viewModel : {
            data : {
                employeeGroupIds : null,
                date : null,

                dailyHrsGrt : null,
                weeklyHrsGrt : null,
                shiftGapGrt : null,
                isCurrentlyWorking : false
            },

            formulas : {
                hasAdditionalParams : data => data('dailyHrsGrt') || data('weeklyHrsGrt') || data('shiftGapGrt') || data('isCurrentlyWorking')
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                modal : true
            }
        ],

        bodyPadding : 10,

        items : [
            {
                xtype : 'panel',
                layout : {
                    type : 'accordion',
                    animate : true,
                    activeOnTop : true,
                    multi : true
                },

                items : [
                    {
                        title : i18n._('Parameters'),
                        bodyPadding : '0 ' + criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,
                        collapsible : false,
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
                        },
                        items : [
                            {
                                xtype : 'criterion_tagfield',
                                fieldLabel : i18n.gettext('Employee Groups'),
                                bind : {
                                    store : '{employeeGroups}',
                                    value : '{employeeGroupIds}'
                                },
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'nameWithEmployer'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date'),
                                bind : {
                                    value : '{date}'
                                },
                                allowBlank : false,
                                maxWidth : criterion.Consts.UI_DEFAULTS.DATE_ITEM_WIDTH
                            }
                        ]
                    },
                    {
                        title : i18n._('Filter By'),
                        bodyPadding : '0 ' + criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
                        },
                        bind : {
                            collapsed : '{!hasAdditionalParams}'
                        },
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Daily Hours Greater than'),
                                bind : {
                                    value : '{dailyHrsGrt}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Weekly Hours Greater than'),
                                bind : {
                                    value : '{weeklyHrsGrt}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Shift Gap Greater than'),
                                bind : {
                                    value : '{shiftGapGrt}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Currently Working'),
                                bind : {
                                    value : '{isCurrentlyWorking}'
                                }
                            }
                        ]
                    }
                ]
            }
        ],

        handleApply() {
            let vm = this.getViewModel(),
                datefield = this.down('datefield');

            this.fireEvent('applyOptions', {
                employeeGroupIds : vm.get('employeeGroupIds'),
                date : datefield.getValue(),

                dailyHrsGrt : vm.get('dailyHrsGrt'),
                weeklyHrsGrt : vm.get('weeklyHrsGrt'),
                shiftGapGrt : vm.get('shiftGapGrt'),
                isCurrentlyWorking : vm.get('isCurrentlyWorking')
            });
        }
    }
});
