Ext.define('criterion.controller.reports.dataGrid.ColumnCriteriaEditor', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_reports_data_grid_column_criteria_editor',

        handleShow() {
            let vm = this.getViewModel(),
                criteriaTypes = vm.get('criteriaTypes'),
                criteria = vm.get('criteria'),
                type = vm.get('columnData.type');

            criteria.add(vm.get('columnData')['criteria']);

            criteriaTypes.addFilter(function(rec) {
                return Ext.Array.contains(rec.get('types'), type);
            });

            this.lookup('sortField').focus();
        },

        handleAddCriteria() {
            let vm = this.getViewModel(),
                view = this.getView(),
                criteriaValue,
                isSpecial = vm.get('criteriaField.selection.special');

            if (vm.get('isDateCriteria')) {
                criteriaValue = Ext.Date.format(vm.get('criteriaValue'), criterion.consts.Api.DATE_FORMAT);
            } else if (vm.get('isTimeCriteria')) {
                criteriaValue = Ext.Date.format(vm.get('criteriaValue'), criterion.consts.Api.TIME_FORMAT);
            } else {
                criteriaValue = vm.get('criteriaValue');
            }

            if (view.isValid()) {
                vm.get('criteria').add({
                    operator : vm.get('criteriaType'),
                    value : !isSpecial ? criteriaValue : null
                });

                vm.set({
                    criteriaType : null,
                    criteriaValue : null
                })
            } else {
                this.focusInvalidField();
            }
        },

        handleCancel() {
            this.getView().close();
        },

        findInvalidField() {
            return this.getView().getForm().getFields().findBy(function(field) {
                return !field.isValid();
            });
        },

        focusInvalidField() {
            let field = this.findInvalidField();

            field && field.focus();
        },

        handleChange() {
            let view = this.getView(),
                vm = this.getViewModel(),
                columnData = vm.get('columnData'),
                criteria = vm.get('criteria'),
                aCriteria = [];

            criteria.each(function(val) {
                aCriteria.push({
                    operator : val.get('operator'),
                    value : val.get('value')
                });
            });

            columnData['criteria'] = aCriteria;

            view.fireEvent('save', columnData);

            view.close();
        }

    }
});
