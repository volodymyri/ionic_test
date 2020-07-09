Ext.define('criterion.controller.reports.dataGrid.ColumnJoinEditor', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_reports_data_grid_column_join_editor',

        handleShow() {

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
                vm = this.getViewModel();

            view.fireEvent('save', {
                typeJoin : vm.get('typeJoin'),
                table : vm.get('table'),
                field : vm.get('field')
            });

            view.close();
        }

    }
});
