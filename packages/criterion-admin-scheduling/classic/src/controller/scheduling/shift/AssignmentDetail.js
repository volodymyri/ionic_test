Ext.define('criterion.controller.scheduling.shift.AssignmentDetail', function() {

    const generateDayColumn = day => {
        const dataIndex = `day${day + 1}details`;

        return {
            xtype : 'templatecolumn',

            text : criterion.Consts.DAYS_OF_WEEK_ARRAY[day],

            dataIndex : dataIndex,

            flex : 1,

            tpl : new Ext.XTemplate(
                '<tpl for=".">',
                '<tpl if="!!this.getValue(values)">',
                '<div data-qtip="' + i18n.gettext('Edit') + '"><span class="criterion-darken-gray">&#8986;</span>&nbsp;{[this.getValue(values)]}</div>',
                '<tpl else><span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Add Schedule') + '">+</span>',
                '</tpl>',
                '</tpl>',
                {
                    getValue : function(values) {
                        const data = values[dataIndex];

                        if (data && data.length) {
                            return Ext.Array.map(data, entry => {
                                let title = entry.title,
                                    startTime = entry.startTime,
                                    endTime = entry.endTime,
                                    timeText;

                                if (title) {
                                    timeText = Ext.String.format('<small>{0}<BR/>{1}</small>', title,
                                        (startTime && endTime) ? Ext.String.format('{0} {1} {2}',
                                            Ext.Date.format(startTime, criterion.consts.Api.SHOW_TIME_FORMAT),
                                            i18n.gettext('to'),
                                            Ext.Date.format(endTime, criterion.consts.Api.SHOW_TIME_FORMAT)) : i18n.gettext('All Day')
                                    );
                                } else {
                                    timeText = Ext.String.format('{0} {1} {2}',
                                        Ext.Date.format(startTime, criterion.consts.Api.SHOW_TIME_FORMAT),
                                        i18n.gettext('to'),
                                        Ext.Date.format(endTime, criterion.consts.Api.SHOW_TIME_FORMAT)
                                    );
                                }

                                return timeText;
                            }).join('</BR>');
                        }
                    }
                }
            )
        }
    };

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_assignment_detail',

        requires : [
            'criterion.view.employee.EmployeePicker',
            'criterion.view.scheduling.shiftGroup.ShiftSchedule',
            'criterion.store.employer.shift.occurrence.PreviousShifts',
            'criterion.view.scheduling.shift.AssignmentDetailForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        loadRecord(record) {
            let view = this.getView(),
                employerId = record.get('employerId'),
                startingDay = record.get('startingDay') - 1,
                columns = [];

            columns.push(...Ext.Array.map(criterion.Utils.range(startingDay, 6), generateDayColumn));

            if (startingDay > 0) {
                columns.push(...Ext.Array.map(criterion.Utils.range(0, startingDay - 1), generateDayColumn));
            }

            this.getViewModel().set('record', record);

            record.shifts().each(shift => {
                let employees = shift.employees(),
                    shiftGroupId = shift.get('shiftGroupId');

                view.add({
                    xtype : 'criterion_gridpanel',

                    cls : 'criterion-panel-small-header',

                    tbar : [
                        '->',
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-feature',
                            glyph : criterion.consts.Glyph['android-add'],
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.CREATE, true)
                            },
                            handler : _ => {
                                let picker = Ext.create('criterion.view.employee.EmployeePicker', {
                                    employerId : employerId,
                                    isActive : true,
                                    alwaysOnTop : true,
                                    extraItems : [
                                        {
                                            xtype : 'toolbar',
                                            flex : 1,
                                            items : [
                                                '->',
                                                {
                                                    xtype : 'toggleslidefield',
                                                    fieldLabel : i18n._('Use shift requirements'),
                                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                                    value : true,
                                                    handler : (_, value) => {
                                                        let store = picker && picker.getStore(),
                                                            proxy = store && store.getProxy();

                                                        if (!proxy) {
                                                            return;
                                                        }

                                                        if (value) {
                                                            proxy.setExtraParam('shiftGroupReguirements', shiftGroupId);
                                                        } else {
                                                            delete proxy.getExtraParams()['shiftGroupReguirements'];
                                                        }

                                                        picker.handleSearchClick();
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    extraParams : {
                                        excludeEmployeeIds : Ext.Array.map(employees.getRange(), ee => ee.get('employeeId')).join(','),
                                        shiftGroupReguirements : shiftGroupId
                                    },

                                    listeners : {
                                        select : employee => {
                                            criterion.Api.requestWithPromise({
                                                url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_GET_EMPLOYEE,
                                                method : 'GET',
                                                params : {
                                                    employeeId : employee.get('employeeId'),
                                                    shiftOccurrenceId : record.getId(),
                                                    shiftId : shift.getId()
                                                }
                                            }).then(resp => {
                                                delete resp.responseStatus;

                                                employees.add(criterion.model.employer.shift.occurrence.Employee.loadData(resp));
                                            });

                                            shift.dirty = true;
                                        }
                                    }
                                });

                                picker.show();
                            }
                        }
                    ],

                    title : shift.get('name'),

                    store : employees,

                    columns : [
                        {
                            text : i18n.gettext('Employee Name'),

                            dataIndex : 'employeeName',

                            flex : 1,

                            encodeHtml : false,

                            renderer : (value, md, record) => {
                                let overtimeMinutes = record.get('overtimeMinutes'),
                                    overtimeMinutesString = overtimeMinutes ?
                                        `<br/><span class="column-sub-warning">${i18n.gettext('Overtime:')} ${criterion.Utils.minutesToTimeStr(overtimeMinutes)}</span>` : '';

                                return `${value}${overtimeMinutesString}`;
                            }
                        },
                        ...columns,
                        {
                            xtype : 'criterion_actioncolumn',
                            items : [
                                {
                                    glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                    tooltip : i18n.gettext('Delete'),
                                    action : 'removeaction'
                                }
                            ],
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.DELETE, true)
                            }
                        }
                    ],

                    listeners : {
                        beforecellclick : function(grid, td, cellIndex, record, tr, rowIndex, e) {
                            let column = e.position && e.position.column,
                                dataIndex = column && column.dataIndex,
                                dayData = record[dataIndex] && record[dataIndex](),
                                shiftId = record.get('shiftId'),
                                day = dataIndex && parseInt(dataIndex.replace(/[^0-9\.]+/g, ''), 10),
                                editor = dayData && Ext.create('criterion.view.scheduling.shiftGroup.ShiftSchedule',
                                    {
                                        viewModel : {
                                            data : {
                                                title : Ext.String.format('{0} - {1}', record.get('employeeName'), column.text),
                                                day : day,
                                                shiftId : shiftId
                                            },
                                            stores : {
                                                shiftSchedule : dayData
                                            }
                                        },

                                        modal : true,

                                        alwaysOnTop : true,

                                        listeners : {
                                            changeState() {
                                                dayData.each(rec => {
                                                    rec.set('isAddedManually', false);
                                                });

                                                editor.close();
                                            },
                                            cancel() {
                                                dayData.each(rec => {
                                                    if (rec.get('isAddedManually')) {
                                                        rec.erase();
                                                    }
                                                });

                                                editor.close();
                                            },
                                            close() {
                                                record.dirty = true;
                                                shift.dirty = true;

                                                grid.ownerCt.reconfigure();
                                            }
                                        },

                                        dockedItems : [
                                            {
                                                xtype : 'container',
                                                layout : 'hbox',
                                                dock : 'top',
                                                margin : '5 0 0 5',
                                                items : [
                                                    {
                                                        xtype : 'button',
                                                        cls : 'criterion-btn-feature',
                                                        glyph : criterion.consts.Glyph['android-add'],
                                                        handler : _ => {
                                                            dayData.add({
                                                                day : day,
                                                                shiftId : shiftId,
                                                                isAddedManually : true
                                                            });
                                                        },
                                                        hidden : true,
                                                        bind : {
                                                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.UPDATE, true)
                                                        }
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        html : '<span class="criterion-darken-gray">' + i18n.gettext('Add an Interval') + '</span>',
                                                        margin : '10 0 0 10',
                                                        bind : {
                                                            hidden : '{shiftSchedule.count}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    });

                            if (editor) {
                                editor.show();
                                return false;
                            }
                        },
                        removeaction : rec => {
                            rec.drop();

                            record.dirty = true;
                            shift.dirty = true;
                        }
                    }
                });
            });
        },

        onCancel() {
            this.getView().close();
        },

        onSave() {
            let view = this.getView(),
                record = this.getViewModel().get('record');

            record.shifts().each(shift => shift.employees().each(employee => {
                Ext.Array.map(criterion.Utils.range(1, 7), day => {
                    employee[`day${day}details`]().each(dayRec => {
                        if (dayRec.phantom && dayRec.get('title')) {
                            dayRec.drop();
                        }
                    });
                });
            }));

            record.saveWithPromise().then(_ => {
                view.fireEvent('afterSave');
                view.close();
            });
        },

        onActionChange(cmp, value) {
            if (!value) {
                return;
            }

            let me = this,
                view = this.getView(),
                record = this.getViewModel().get('record'),
                recordShifts = record.shifts(),
                [url, isCopy] = value === criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.COPY_FROM.value ? [criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_COPY_FROM, true] :
                    (value === criterion.Consts.SHIFT_ASSIGNMENT_ACTION_TYPE.ROTATE.value ? [criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_ROTATE, false] : [null, false]),
                copyAssignmentDetailForm;

            if (isCopy) {
                copyAssignmentDetailForm = Ext.create('criterion.view.scheduling.shift.AssignmentDetailForm', {
                    viewModel : {
                        data : {
                            shiftOccurrenceId : record.getId()
                        }
                    }
                });

                copyAssignmentDetailForm.on({
                    afterLoad : () => {
                        me.setCorrectMaskZIndex(true);
                    },
                    copy : resp => {
                        copyAssignmentDetailForm.destroy();

                        view.setLoading(true);

                        url && criterion.Api.requestWithPromise({
                            url : url,
                            method : 'GET',
                            params : {
                                currentShiftOccurrenceId : record.getId(),
                                previousShiftOccurrenceId : resp.previousShiftId
                            }
                        }).then(data => {
                            if (resp.isClearExisting === true) {
                                me.clearShifts(recordShifts);
                            }

                            me.processRecords(data, recordShifts);
                        }).always(() => {
                            view.setLoading(false);
                        });
                    },
                    destroy : () => {
                        me.setCorrectMaskZIndex(false);
                    }
                });

                copyAssignmentDetailForm.show();
            } else {
                url && criterion.Api.requestWithPromise({
                    url : url,
                    method : 'GET',
                    params : {
                        shiftOccurrenceId : record.getId()
                    }
                }).then(data => {
                    me.clearShifts(recordShifts);
                    me.processRecords(data, recordShifts);
                });
            }

            cmp.reset();
        },

        clearShifts(recordShifts) {
            recordShifts.each(shift => {
                shift.employees().removeAll();
                shift.dirty = true;
            });
        },

        processRecords(data, recordShifts) {
            if (data && data.length) {
                Ext.Array.each(data, rec => {
                    let existingShift = recordShifts.getById(rec.id);

                    if (existingShift) {
                        if (rec.employees) {
                            Ext.Array.each(rec.employees, employee => {
                                existingShift.employees().add(
                                    criterion.model.employer.shift.occurrence.Employee.loadData(employee)
                                );
                            });
                        }

                        existingShift.dirty = true;
                    }
                });
            }
        }
    };
});
