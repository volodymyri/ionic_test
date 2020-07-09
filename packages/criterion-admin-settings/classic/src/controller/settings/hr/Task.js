Ext.define('criterion.controller.settings.hr.Task', function() {

    return {
        alias : 'controller.criterion_settings_task',

        extend : 'criterion.controller.FormView',

        handleRecordLoad(record) {
            let vm = this.getViewModel(),
                codesStore = vm.get('codes'),
                fieldContainer = this.lookup('fieldContainer');

            codesStore.each(function(codeRecord) {
                let name = 'classificationId' + codeRecord.getId();

                fieldContainer.add({
                    xtype : 'criterion_code_detail_field',
                    fieldLabel : codeRecord.get('caption'),
                    codeDataId : criterion.CodeDataManager.getCodeTableNameById(codeRecord.get('codeDataTypeId')),
                    name : name,
                    allowBlank : true,
                    editable : false
                });
            });

            // wait vm init
            Ext.defer(() => {
                vm.get('employerProjects').loadWithPromise({
                    params : {
                        employerId : vm.get('record.employerId')
                    }
                })
            }, 100)
        }

    }

});
