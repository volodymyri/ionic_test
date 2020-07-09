Ext.define('criterion.controller.common.AssignBase', function() {

    return {
        alias : 'controller.criterion_common_assign_base',

        extend : 'criterion.app.ViewController',

        init() {
            this.searchTextHandler = Ext.Function.createBuffered(this.searchTextHandler, 300);
        },

        handleShow() {
            Ext.Function.defer(function() {
                this.getView().getPlugins()[0].reCenter();
                this.lookup('closeBtn').focus();
            }, 200, this);
        },

        handleCancel() {
            let vm = this.getViewModel();

            if (vm.get('selectEmployeesMode')) {
                this.switchFormBackFromEmployeeSearchMode();
                vm.set('activeViewIdx', 0);
            } else {
                this.getView().destroy();
            }
        },

        switchFormToEmployeeSearchMode() {
            let plugin = this.getView().getPlugins()[0];

            plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH);
            plugin.changeHeight('90%');
        },

        switchFormBackFromEmployeeSearchMode() {
            let plugin = this.getView().getPlugins()[0];

            plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH);
            plugin.changeHeight(criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_FIXED_HEIGHT);
        },

        handleAssign() {
            // should be filled in a child class
        },

        handleEmployeeSearch() {
            let vm = this.getViewModel();

            this.switchFormToEmployeeSearchMode();

            vm.set('activeViewIdx', 1);

            this.loadEmployees();
        },

        getInternalEmployerId : function() {
            return this.getViewModel().get('employerId')
        },

        loadEmployees() {
            let vm = this.getViewModel(),
                view = this.getView(),
                employees = vm.get('employees'),
                criteria = vm.get('criteria'),
                filterBy = vm.get('filterBy'),
                searchAdditionalData = Ext.clone(vm.get('searchAdditionalData') || {}),
                params = {
                    employerId : this.getInternalEmployerId()
                };

            if (vm.get('activeViewIdx') !== 1) {
                return;
            }

            const CRITERIA = Ext.Array.toValueMap(Ext.Object.getValues(view.FILTER_CRITERIA), 'value');

            if (criteria && filterBy) {
                params[CRITERIA[filterBy].paramName] = criteria;
            }

            employees.getProxy().setExtraParams(Ext.Object.merge(params, searchAdditionalData));

            employees.loadWithPromise();
        },

        reloadEmployees() {
            let vm = this.getViewModel(),
                view = this.getView(),
                employees = vm.get('employees');

            employees.on('load', function() {
                view.setLoading(false);
            }, this, {single : true});

            view.setLoading(true);
            employees.reload();
        },

        handleChangeSelectedEmployees(cmp, vals, oldVals) {
            let vm = this.getViewModel();

            if (vm.get('selectEmployeesMode')) {
                this.reloadEmployees();
            }
        },

        handleSelectEmployee(record) {
            let vm = this.getViewModel(),
                employeeId = record.get('employeeId'),
                employeeIds = Ext.clone(vm.get('employeeIds'));

            vm.get('employeeSelected').add({
                id : employeeId,
                name : record.get('fullName')
            });

            employeeIds.push(employeeId);
            vm.set('employeeIds', employeeIds);
        },

        handleChangeSearchCriteria(cmp, val) {
            this.getViewModel().set('criteria', '');
            this.loadEmployees();
        },

        searchTextHandler(cmp, newValue) {
            this.handleSearch();
        },

        handleSearch() {
            this.loadEmployees();
        }
    }
});
