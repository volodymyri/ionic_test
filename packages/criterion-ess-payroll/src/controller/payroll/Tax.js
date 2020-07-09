Ext.define('criterion.controller.ess.payroll.Tax', {

    alias : 'controller.criterion_selfservice_payroll_tax',

    extend : 'criterion.controller.employee.Tax',

    requires : [
        'criterion.model.employee.Tax',
        'criterion.model.WorkflowLog'
    ],

    mixins : [
        'criterion.controller.mixin.ControlMaskZIndex',
        'criterion.controller.mixin.WorkflowConfirmation'
    ],

    handleRecordLoad : function(record) {
        let view = this.getView(),
            vm = this.getViewModel(),
            employeeId = vm.get('employeeId'),
            workflowLog = Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
            isPendingWorkflow = workflowLog && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], workflowLog.get('stateCode'));

        this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_TAX);

        Ext.Array.each(view.getForm().getFields().getRange(), function(field) {
            if (field.xtype === 'criterion_placeholder_field') {
                return;
            }

            let bind = field.bind || field.getBind && field.getBind(), // bind exposed differently in modern and classic
                fieldName = bind.value.stub.name;

            if (isPendingWorkflow && Ext.Array.contains(Ext.Object.getAllKeys(workflowLog.data.request), fieldName)) {
                var value = workflowLog.data.request[fieldName];

                if (field.getXType() === 'datefield') {
                    value = Ext.Date.parse(value, criterion.consts.Api.DATE_FORMAT)
                }

                field.setValue(value);
                field.addCls('criterion-field-highlighted');
            } else {
                field.removeCls('criterion-field-highlighted');
            }
        });

        // phantom workflow doesn't have workflowLog entry yet
        if (record.phantom || !isPendingWorkflow) {
            vm.set({
                readOnly : false
            });
        }

        this.callParent(arguments);
    },

    actSaveMultipleRecords : function(records) {
        let me = this,
            view = this.getView(),
            vm = this.getViewModel(),
            employeeId = vm.get('employeeId'),
            dfd = Ext.create('Ext.Deferred'),
            recordsData = [];

        // delay for correct find the mask element
        Ext.defer(function() {
            me.setCorrectMaskZIndex(true);
        }, 10);

        me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_TAX).then(function(signature) {

            view.setLoading(true);
            me.setCorrectMaskZIndex(false);

            Ext.Array.each(records, function(record) {
                if (signature) {
                    record.set('signature', signature);
                }

                recordsData.push(record.getData({serialize : true}))
            });

            return criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_TAX,
                jsonData : Ext.JSON.encode(recordsData),
                method : 'POST'
            }).then(function() {
                dfd.resolve();
            });
        }).otherwise(function() {
            view.setLoading(false);
        });

        return dfd.promise;
    },

    actSaveSingleRecord : function(record) {
        let me = this,
            view = this.getView(),
            vm = this.getViewModel(),
            employeeId = vm.get('employeeId'),
            dfd = Ext.create('Ext.Deferred');

        // delay for correct find the mask element
        Ext.defer(function() {
            me.setCorrectMaskZIndex(true);
        }, 10);

        me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_TAX).then(function(signature) {

            view.setLoading(true);
            me.setCorrectMaskZIndex(false);

            if (signature) {
                record.set('signature', signature);
            }

            record.saveWithPromise().then(function() {
                dfd.resolve();
            });
        }).otherwise(function() {
            view.setLoading(false);
        });

        return dfd.promise;
    },

    handleRecallRequest : function() {
        let me = this,
            view = this.getView(),
            vm = this.getViewModel(),
            record = vm.get('record'),
            employeeId = vm.get('employeeId');

        criterion.Msg.confirm(
            i18n.gettext('Confirm'),
            i18n.gettext('Do you want to cancel changes?'),
            function(btn) {
                if (btn === 'yes') {
                    criterion.Api.requestWithPromise({
                        url : Ext.util.Format.format(
                            criterion.consts.Api.API.EMPLOYEE_TAX_RECALL,
                            record.getId()
                        ) + '?employeeId=' + employeeId,
                        method : 'PUT'
                    }).then({
                        success : function(result) {
                            me.fireViewEvent('afterSave');
                            view.close();
                        }
                    });
                }
            }
        );
    },

    afterExpire(date) {
        this.fireViewEvent('afterSave');
        this.getView().close();
    }
});
