Ext.define('criterion.controller.employee.Task', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_task',

        handleAfterRecordLoad(record) {
            let view = this.getView(),
                codeTableIds = record.get('codeTableIds') || [],
                employeeTaskCustomField = record.employeeTaskCustomField();

            this.prepareCodeTableDetails(employeeTaskCustomField);

            view.setLoading(true);

            if (Ext.isArray(codeTableIds) && codeTableIds.length) {
                criterion.CodeDataManager.loadByIds(codeTableIds).always(_ => {
                    view.setLoading(false);
                });
            }
        },

        prepareCodeTableDetails(employeeTaskCustomField) {
            let codeTableDetails = this.getViewModel().get('codeTableDetails'),
                data = {},
                resData = [];

            employeeTaskCustomField.each(val => {
                let codeTableId = val.get('codeTableId');

                if (!data[codeTableId]) {
                    data[codeTableId] = [];
                }

                data[codeTableId].push(val.get('codeTableDetailId'));
            });

            Ext.Object.each(data, (codeTableId, val) => {
                let v = val.join(',');

                resData.push({
                    id : v,
                    codeTableId : codeTableId,
                    value : v
                });
            });

            codeTableDetails.loadData(resData);
        },

        handleRecordUpdate(record) {
            let values = this.lookup('employee_task_code_table_details').getValue(),
                employeeTaskCustomField = record.employeeTaskCustomField();

            Ext.Object.each(values, (cTableId, v) => {
                let values = Ext.Array.map(Ext.Array.clean(v.split(',')), v => parseInt(v, 10)),
                    codeTableId = parseInt(cTableId, 10);

                if (Ext.isEmpty(values)) {
                    // clean up
                    employeeTaskCustomField.each(rec => {
                        if (rec.get('codeTableId') === codeTableId) {
                            employeeTaskCustomField.remove(rec);
                        }
                    });
                } else {
                    employeeTaskCustomField.each(rec => {
                        if (rec.get('codeTableId') === codeTableId && !Ext.Array.contains(values, rec.get('codeTableDetailId'))) {
                            // removed
                            employeeTaskCustomField.remove(rec);
                        }
                    });

                    Ext.Array.each(values, v => {
                        let codeTableDetailId = parseInt(v, 10);

                        if (employeeTaskCustomField.findBy(rec => rec.get('codeTableId') === codeTableId && rec.get('codeTableDetailId') === codeTableDetailId) === -1) {
                            // new value
                            employeeTaskCustomField.add({
                                codeTableId,
                                codeTableDetailId
                            });
                        }
                    });
                }
            });

            this.callParent(arguments);
        }
    }
});
