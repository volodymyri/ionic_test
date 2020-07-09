Ext.define('criterion.controller.common.EmployerDocumentFolder', function() {

    return {
        alias : 'controller.criterion_common_employer_document_folder',

        extend : 'criterion.controller.FormView',

        handleAfterRecordLoad : function(record) {
            this.lookup('employeeGroupCombo').loadValuesForRecord(record);
        },

        onAfterSave(view, folder) {
            let me = this,
                vm = this.getViewModel();

            me.lookup('employeeGroupCombo').saveValuesForRecord(vm.get('record')).then(function() {
                view.fireEvent('afterSave', view, folder);
                me.close();
            });
        }
    };
});
