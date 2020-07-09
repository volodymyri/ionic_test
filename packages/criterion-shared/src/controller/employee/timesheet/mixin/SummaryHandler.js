Ext.define('criterion.controller.employee.timesheet.mixin.SummaryHandler', function() {

    const ALL_WEEKS_NUMBER = 1000,
          PAYCODE_GROUPER_FIELD = 'paycode',
          ASSIGNMENT_GROUPER_FIELD = 'assignmentId';

    return {

        mixinId : 'criterion_employee_timesheet_mixin_summary_handler',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        getPaycodeFields() {
            return [
                {
                    name : 'paycodeId',
                    type : 'integer'
                },
                {
                    name : 'paycodeName',
                    type : 'string'
                },
                {
                    name : 'hours',
                    type : 'float'
                },
                {
                    name : 'hoursVal',
                    type : 'float',
                    depends : 'hours',
                    calculate : data => criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse(((data && data.hours) || 0) + '', true))
                },
                {
                    name : 'days',
                    type : 'float'
                },
                {
                    name : 'units',
                    type : 'float'
                },
                {
                    name : 'week',
                    type : 'integer'
                }
            ];
        },

        getAssignmentFields() {
            return [
                {
                    name : 'assignmentId',
                    type : 'integer'
                },
                {
                    name : 'name',
                    type : 'string'
                },
                {
                    name : 'hours',
                    type : 'float'
                },
                {
                    name : 'hoursVal',
                    type : 'float',
                    depends : 'hours',
                    calculate : data => criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse(((data && data.hours) || 0) + '', true))
                },
                {
                    name : 'days',
                    type : 'float'
                },
                {
                    name : 'units',
                    type : 'float'
                },
                {
                    name : 'week',
                    type : 'integer'
                }
            ];
        },

        getSummaryWnd(isMultiPosition, isManualDay) {
            return Ext.create('criterion.ux.window.Window', {
                title : i18n.gettext('Summary'),
                resizable : false,
                bodyPadding : 10,
                modal : true,
                draggable : false,
                plugins : {
                    ptype : 'criterion_sidebar',
                    width : 1100,
                    height : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_HEIGHT,
                    modal : true
                },
                cls : 'criterion-modal',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                scrollable : 'vertical',

                viewModel : {
                    data : {
                        weekNumber : 1,
                        showWeekSelector : false,

                        hideAssignmentSummary : false,
                        hidePaycodeSummaryUnit : false,
                        hideAssignmentSummaryUnit : false,
                        hidePaycodeSummaryDays : true,
                        hideAssignmentSummaryDays : true,
                        isMultiPosition : isMultiPosition,
                        isManualDay : isManualDay
                    },
                    stores : {
                        weeks : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            sorters : [{
                                property : 'number',
                                direction : 'ASC'
                            }],
                            fields : [
                                {
                                    name : 'number',
                                    type : 'integer'
                                },
                                {
                                    name : 'startDate',
                                    type : 'date',
                                    allowNull : true,
                                    dateFormat : criterion.consts.Api.DATE_FORMAT
                                },
                                {
                                    name : 'endDate',
                                    type : 'date',
                                    allowNull : true,
                                    dateFormat : criterion.consts.Api.DATE_FORMAT
                                },
                                {
                                    name : 'title',
                                    type : 'string',
                                    calculate : (data) => {
                                        let title = data.number === ALL_WEEKS_NUMBER ? i18n.gettext('Summary') : i18n.gettext('Week');

                                        return Ext.String.format(
                                            title + ' {0} ({1}) - {2} ({3})',
                                            Ext.Date.format(data.startDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                                            Ext.Date.format(data.startDate, 'D'),
                                            Ext.Date.format(data.endDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                                            Ext.Date.format(data.endDate, 'D')
                                        );
                                    }
                                }
                            ]
                        },

                        paycodesAll : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getPaycodeFields(),
                            grouper : {
                                property : PAYCODE_GROUPER_FIELD
                            }
                        },

                        paycodesCurrent : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getPaycodeFields(),
                            grouper : {
                                property : PAYCODE_GROUPER_FIELD
                            }
                        },

                        paycodesSum : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getPaycodeFields()
                        },

                        assignmentsDataAll : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getAssignmentFields(),
                            grouper : {
                                property : ASSIGNMENT_GROUPER_FIELD
                            }
                        },

                        assignmentsDataCurrent : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getAssignmentFields(),
                            grouper : {
                                property : ASSIGNMENT_GROUPER_FIELD
                            }
                        },

                        assignmentsSum : {
                            type : 'store',
                            proxy : {
                                type : 'memory'
                            },
                            fields : this.getAssignmentFields()
                        }
                    }
                },

                tbar : [
                    '->',
                    {
                        xtype : 'combobox',
                        reference : 'weekSelector',
                        fieldLabel : i18n.gettext('Select period'),
                        allowBlank : false,
                        editable : false,
                        queryMode : 'local',
                        valueField : 'number',
                        displayField : 'title',
                        width : 500,
                        hidden : true,
                        sortByDisplayField : false,
                        bind : {
                            value : '{weekNumber}',
                            store : '{weeks}',
                            hidden : '{!showWeekSelector}'
                        },
                        listeners : {
                            change : function(cmp, value) {
                                cmp.up('criterion_window').fireEvent('selectWeek', value);
                            }
                        }
                    },
                    '->'
                ],

                items : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'criterion_panel',
                                margin : 20,
                                flex : 1,
                                layout : 'fit',
                                title : i18n.gettext('Paycode Summary'),
                                items : [
                                    {
                                        xtype : 'criterion_gridpanel',
                                        ref : 'paycodesGrid',
                                        bind : {
                                            store : '{paycodesAll}'
                                        },
                                        padding : 10,
                                        columns : [
                                            {
                                                dataIndex : 'paycodeName',
                                                text : i18n.gettext('Paycode'),
                                                flex : 2
                                            },
                                            {
                                                dataIndex : 'hoursVal',
                                                text : i18n.gettext('Hours'),
                                                flex : 1,
                                                hidden : false,
                                                bind : {
                                                    hidden : '{!hidePaycodeSummaryDays}'
                                                }
                                            },
                                            {
                                                dataIndex : 'days',
                                                text : i18n.gettext('Days'),
                                                flex : 1,
                                                hidden : true,
                                                bind : {
                                                    hidden : '{hidePaycodeSummaryDays}'
                                                }
                                            },
                                            {
                                                dataIndex : 'units',
                                                text : i18n.gettext('Units'),
                                                flex : 1,
                                                hidden : true,
                                                bind : {
                                                    hidden : '{hidePaycodeSummaryUnit}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype : 'criterion_panel',
                                margin : 20,
                                flex : 1,
                                layout : 'fit',
                                title : i18n.gettext('Assignment Summary'),
                                hidden : true,
                                bind : {
                                    hidden : '{hideAssignmentSummary}'
                                },
                                items : [
                                    {
                                        xtype : 'criterion_gridpanel',
                                        ref : 'assignmentsGrid',
                                        bind : {
                                            store : '{assignmentsDataAll}'
                                        },
                                        padding : 10,
                                        columns : [
                                            {
                                                dataIndex : 'name',
                                                text : i18n.gettext('Assignment'),
                                                flex : 2
                                            },
                                            {
                                                dataIndex : 'hoursVal',
                                                text : i18n.gettext('Hours'),
                                                flex : 1,
                                                hidden : false,
                                                bind : {
                                                    hidden : '{!hideAssignmentSummaryDays}'
                                                }
                                            },
                                            {
                                                dataIndex : 'days',
                                                text : i18n.gettext('Days'),
                                                flex : 1,
                                                hidden : true,
                                                bind : {
                                                    hidden : '{hideAssignmentSummaryDays}'
                                                }
                                            },
                                            {
                                                dataIndex : 'units',
                                                text : i18n.gettext('Units'),
                                                flex : 1,
                                                hidden : true,
                                                bind : {
                                                    hidden : '{hideAssignmentSummaryUnit}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],

                bbar : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        ui : 'light',
                        listeners : {
                            click : function() {
                                this.up('criterion_window').fireEvent('close');
                            }
                        }
                    }
                ]
            });
        },

        onShowSummary() {
            let me = this,
                vm = this.getViewModel(),
                employerId = vm.get('employerId'),
                employer = employerId && ess.getApplication().getEmployersStore().getById(employerId),
                isMultiPosition = employer && employer.get('isMultiPosition'),
                timesheet = vm.get('timesheetVertical') || vm.get('timesheetRecord'),
                timesheetType = timesheet && Ext.isFunction(timesheet['getTimesheetType']) && timesheet.getTimesheetType(),
                isManualDay = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY),
                wnd = this.getSummaryWnd(isMultiPosition, isManualDay);

            this.prepareDataForSummary(wnd);

            wnd.on('selectWeek', me.onSelectWeek, wnd);

            wnd.on('close', () => {
                me.setCorrectMaskZIndex(false);
                wnd.destroy();
            });

            wnd.show();

            me.setCorrectMaskZIndex(true);
        },

        onSelectWeek(value) {
            let wnd = this,
                pickerVm = wnd.getViewModel(),
                paycodesGrid = wnd.down('[ref=paycodesGrid]'),
                assignmentsGrid = wnd.down('[ref=assignmentsGrid]'),
                paycodesSum = pickerVm.getStore('paycodesSum'),
                assignmentsSum = pickerVm.getStore('assignmentsSum'),
                paycodesAll = pickerVm.get('paycodesAll'),
                assignmentsDataAll = pickerVm.get('assignmentsDataAll'),
                isMultiPosition = pickerVm.get('isMultiPosition'),
                isManualDay = pickerVm.get('isManualDay'),
                hideDays = !isManualDay;

            if (value) {
                pickerVm.set('weekNumber', value);

                if (value === ALL_WEEKS_NUMBER) {
                    paycodesGrid.setStore(paycodesSum);
                    assignmentsGrid.setStore(assignmentsSum);

                    pickerVm.set({
                        hideAssignmentSummary : !isMultiPosition && assignmentsSum.count() < 2,
                        hidePaycodeSummaryUnit : paycodesSum.sum('units') === 0 || isManualDay,
                        hideAssignmentSummaryUnit : assignmentsSum.sum('units') === 0 || isManualDay,
                        hidePaycodeSummaryDays : hideDays,
                        hideAssignmentSummaryDays : hideDays
                    });
                } else {
                    paycodesGrid.setStore(pickerVm.getStore('paycodesAll'));

                    paycodesAll.clearFilter();
                    paycodesAll.setFilters([
                        {
                            property : 'week',
                            value : value
                        }
                    ]);

                    assignmentsGrid.setStore(pickerVm.getStore('assignmentsDataAll'));

                    assignmentsDataAll.clearFilter();
                    assignmentsDataAll.setFilters([
                        {
                            property : 'week',
                            value : value
                        }
                    ]);

                    pickerVm.set({
                        hideAssignmentSummary : !isMultiPosition && assignmentsDataAll.count() < 2,
                        hidePaycodeSummaryUnit : paycodesAll.sum('units') === 0 || isManualDay,
                        hideAssignmentSummaryUnit : assignmentsDataAll.sum('units') === 0 || isManualDay,
                        hidePaycodeSummaryDays : hideDays,
                        hideAssignmentSummaryDays : hideDays
                    });
                }
            }
        },

        prepareDataForSummary(picker) {
            let vm = this.getViewModel(),
                timesheet = vm.get('timesheetVertical') || vm.get('timesheetRecord'),
                pickerVm = picker.getViewModel(),
                weeks = pickerVm.getStore('weeks'),
                paycodesAll = pickerVm.getStore('paycodesAll'),
                paycodesCurrent = pickerVm.getStore('paycodesCurrent'),
                paycodeSum = pickerVm.getStore('paycodesSum'),
                assignmentsDataAll = pickerVm.getStore('assignmentsDataAll'),
                assignmentsDataCurrent = pickerVm.getStore('assignmentsDataCurrent'),
                assignmentsSum = pickerVm.getStore('assignmentsSum'),
                psh, psd, psu, ash, asd, asu;

            weeks.removeAll();
            if (timesheet.data.weekSummary) {
                // we must always show it, because even one week can contain previous data
                pickerVm.set('showWeekSelector', true);

                Ext.each(Ext.clone(timesheet.data.weekSummary), (ws) => {
                    weeks.add(ws);
                });

                weeks.add({
                    number : ALL_WEEKS_NUMBER,
                    startDate : timesheet.data.startDate,
                    endDate : timesheet.data.endDate
                });
            }

            // paycodes all
            paycodesAll.removeAll();
            if (timesheet.data.paycodeSummaryAll) {
                Ext.each(Ext.clone(timesheet.data.paycodeSummaryAll), (ps) => {
                    paycodesAll.add(ps);
                });
            }
            paycodesAll.clearFilter();

            paycodesAll.setFilters([
                {
                    property : 'week',
                    value : pickerVm.get('weekNumber')
                }
            ]);

            // paycodes current
            paycodesCurrent.removeAll();
            if (timesheet.data.paycodeSummaryCurrent) {
                Ext.each(Ext.clone(timesheet.data.paycodeSummaryCurrent), (ps) => {
                    paycodesCurrent.add(ps);
                });
            }
            paycodesCurrent.clearFilter();

            psh = paycodesCurrent.sum('hours', true);
            psd = paycodesCurrent.sum('days', true);
            psu = paycodesCurrent.sum('units', true);

            paycodesCurrent.getGroups().each(group => {
                let first = group.first(),
                    ident = first.get(PAYCODE_GROUPER_FIELD);

                paycodeSum.add({
                    paycodeId : first.get('paycodeId'),
                    paycodeName : first.get('paycodeName'),
                    hours : psh[ident],
                    days : psd[ident],
                    units : psu[ident]
                });
            });

            // assignments all
            assignmentsDataAll.removeAll();
            if (timesheet.data.assignmentSummaryAll) {
                Ext.each(Ext.clone(timesheet.data.assignmentSummaryAll), (as) => {
                    assignmentsDataAll.add(as);
                });
            }
            assignmentsDataAll.clearFilter();

            assignmentsDataAll.setFilters([
                {
                    property : 'week',
                    value : pickerVm.get('weekNumber')
                }
            ]);

            // assignments current
            assignmentsDataCurrent.removeAll();
            if (timesheet.data.assignmentSummaryCurrent) {
                Ext.each(Ext.clone(timesheet.data.assignmentSummaryCurrent), (as) => {
                    assignmentsDataCurrent.add(as);
                });
            }
            assignmentsDataCurrent.clearFilter();

            ash = assignmentsDataCurrent.sum('hours', true);
            asd = assignmentsDataCurrent.sum('days', true);
            asu = assignmentsDataCurrent.sum('units', true);

            assignmentsDataCurrent.getGroups().each(group => {
                let first = group.first(),
                    ident = first.get(ASSIGNMENT_GROUPER_FIELD);

                assignmentsSum.add({
                    assignmentId : first.get('assignmentId'),
                    name : first.get('name'),
                    hours : ash[ident],
                    days : asd[ident],
                    units : asu[ident]
                });
            });
        }
    }
});
