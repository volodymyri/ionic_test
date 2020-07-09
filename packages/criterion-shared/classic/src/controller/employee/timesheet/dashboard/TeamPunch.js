Ext.define('criterion.controller.employee.timesheet.dashboard.TeamPunch', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_dashboard_team_punch',

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 1000, this);

            this.callParent(arguments);
        },

        handleShow : function() {
            this.loadFieldsData().then(() => {
                this.load()
            });
        },

        handleCancel : function() {
            this.getView().fireEvent('cancel')
        },

        getPunchParams : function() {
            let vm = this.getViewModel(),
                params = {
                    date : Ext.Date.format(vm.get('date'), criterion.consts.Api.DATE_FORMAT)
                },
                layoutVals = ['entityRef', 'projectId', 'taskId', 'workLocationId', 'workAreaId'],
                paycodeCombo = this.lookup('paycodeCombo'),
                selectedPaycode = paycodeCombo.getSelection(),
                paycode = selectedPaycode && selectedPaycode.get('paycode');

            if (vm.get('isHoursPunch')) {
                params['hours'] = vm.get('hours');
            } else if (vm.get('isDaysPunch')) {
                params['days'] = vm.get('days');
            } else {
                params['isIn'] = vm.get('isIn');
                params['time'] = Ext.Date.format(vm.get('time'), criterion.consts.Api.TIME_FORMAT);
            }

            if (paycode) {
                params['paycodeId'] = paycode;
            }

            Ext.each(layoutVals, (layoutVal) => {
                let val = vm.get(layoutVal);

                val && (params[layoutVal] = val);
            });

            return params;
        },

        handleExecutePunch : function() {
            let view = this.getView(),
                selections = this.lookup('teamGrid').getSelection(),
                employeeIds;

            employeeIds = Ext.Array.map(selections, function(val) {
                return val.get('employeeId');
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_TEAM_PUNCH,
                method : 'POST',
                jsonData : Ext.Object.merge(this.getPunchParams(), {employeeIds : employeeIds})
            }).then(function(count) {
                criterion.Msg.showMsg(
                    i18n.gettext('Success'),
                    count + ' ' + i18n.gettext(i18n.gettext('timesheets updated')),
                    criterion.Msg.INFO,
                    function() {
                        view.fireEvent('afterExecute');
                    }
                );
            }, function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            });
        },

        handleChanged : function(cmp, val) {
            if (cmp.isValid()) {
                this.load();
            }
        },

        loadFieldsData : function() {
            let vm = this.getViewModel(),
                paycodeCombo = this.lookup('paycodeCombo'),
                availablePayCodes = vm.getStore('availablePayCodes'),
                defaultIncomeId, defaultIncome;

            return criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_AVAILABLE_DATA,
                method : 'GET',
                params : vm.get('loadParams')
            }).then(result => {
                availablePayCodes.loadData(result.availablePaycodes);
                vm.getStore('availableProjects').loadData(result.availableProjects);
                vm.getStore('availableWorkLocations').loadData(result.availableWorkLocations);
                vm.getStore('availableAreas').loadData(result.availableAreas);
                vm.getStore('availableTasks').loadData(result.availableTasks);

                defaultIncomeId = availablePayCodes.findBy(record => {
                    return record.get('paycode') === 1 && record.get('isDefault') && record.get('isActive');
                });

                if (defaultIncomeId > -1) {
                    defaultIncome = availablePayCodes.getAt(defaultIncomeId);
                    defaultIncome && paycodeCombo.setSelection(defaultIncome);
                }
            });
        },

        load : function() {
            let vm = this.getViewModel(),
                employeesGrid = this.lookup('teamGrid'),
                teamPunch = vm.getStore('teamPunch'),
                form = this.lookup('mainForm');

            if (!form.isValid()) {
                return;
            }

            teamPunch.loadWithPromise({
                params : Ext.Object.merge(this.getPunchParams(), vm.get('loadParams'))
            }).then(() => {
                if (vm.get('loadParams.employeeGroups')) {
                    let selections = [];

                    teamPunch.each((rec) => {
                        if (!rec.get('skipped')) {
                            selections.push(rec);
                        }
                    });

                    employeesGrid.getSelectionModel().doSelect(selections, true);
                }
            });
        },

        handleEmployeesSelectionChange : function(columns, selected) {
            this.getViewModel().set('employeesSelected', selected.length)
        }
    }
});
