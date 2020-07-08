Ext.define('ess.controller.time.teamPunch.Form', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_team_punch_form',

        init() {
            this.load = Ext.Function.createBuffered(this.load, 500, this);

            this.callParent(arguments);
        },

        handleBackToFilter() {
            this.getViewModel().set('date', null);
            this.getView().fireEvent('back');
        },

        loadFieldsData() {
            let vm = this.getViewModel(),
                view = this.getView(),
                paycodeCombo = this.lookup('paycodeCombo'),
                availablePayCodes = vm.getStore('availablePayCodes'),
                defaultIncomeId, defaultIncome,
                dfd = Ext.create('Ext.promise.Deferred');

            view.setLoading(true);

            criterion.Api.requestWithPromise({
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

                view.setLoading(false);
                dfd.resolve();
            });

            return dfd.promise;
        },

        getPunchParams() {
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

        isPunchFormValid() {
            return this.lookup('punchForm').isValid();
        },

        load() {
            let me = this,
                vm = this.getViewModel(),
                teamPunch = vm.get('teamPunch'),
                form = this.lookup('punchForm');

            if (!form.isValid()) {
                return;
            }

            teamPunch.loadWithPromise({
                params : Ext.Object.merge(this.getPunchParams(), vm.get('loadParams'))
            }).then(() => {
                if (vm.get('loadParams.employeeGroups')) {
                    me.getView().fireEvent('selectAllEmployees');
                }
            });
        },

        handleChanged(cmp) {
            if (cmp.isValid()) {
                this.load();
            }
        },

        handleShowEmployees() {
            this.getView().fireEvent('showEmployees');
        },

        handlePunch() {
            this.getView().fireEvent('executePunch');
        },

        handleChangeLocation(cmp, value) {
            let availableAreas = this.getViewModel().get('availableAreas');

            availableAreas.clearFilter();

            if (value) {
                availableAreas.setFilters(
                    [
                        {
                            property : 'workLocationId',
                            value : value,
                            exactMatch : true
                        }
                    ]
                );
            }
        }
    };
});
