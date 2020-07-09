Ext.define('criterion.controller.mixin.WorkflowConfirmation', function() {

    const MIXIN_ID = 'workflowConfirmation';

    return {

        extend : 'Ext.Mixin',

        requires : [
            'criterion.view.employee.SubmitConfirm'
        ],

        mixinConfig : {
            id : MIXIN_ID,

            after : {
                constructor : 'initMixin'
            }
        },

        initMixin : function() {},

        loadWorkflowData : function(employeeId, workflowTypeCode, delegatedByEmployeeId, workflowId) {
            let me = this,
                dfd = Ext.create('Ext.Deferred'),
                workflowVmIdent = me.getWorkflowVmIdent(employeeId, workflowTypeCode),
                workflowTypeCd,
                workflowData;

            if (!this.checkWorkflowDataPresent(workflowVmIdent)) {
                Ext.Deferred.sequence([
                    function() {
                        return criterion.CodeDataManager.getCodeDetailRecordStrict('code', workflowTypeCode, criterion.consts.Dict.WORKFLOW).then(function(workflowTypeRec) {
                            workflowTypeCd = workflowTypeRec.getId();
                        });
                    },
                    function() {
                        return criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.WORKFLOW_FOR_EMPLOYEE,
                            method : 'GET',
                            params : Ext.Object.merge(
                                {
                                    employeeId : employeeId,
                                    workflowTypeCd : workflowTypeCd
                                },
                                (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {}),
                                (workflowId ? {workflowId : workflowId} : {})
                            )
                        }).then(function(res) {
                            workflowData = res;
                        });
                    }
                ]).then(function() {
                    me.getViewModel().set(workflowVmIdent, (Ext.isObject(workflowData) && workflowData.isActive) ? Ext.clone(workflowData) : null);
                    dfd.resolve();
                });
            } else {
                // already present in vm
                dfd.resolve();
            }

            return dfd.promise;
        },

        checkWorkflowDataPresent : function(workflowVmIdent) {
            return Ext.Array.contains(Ext.Object.getKeys(this.getViewModel().getData()), workflowVmIdent);
        },

        getWorkflowVmIdent : function(employeeId, workflowTypeCode) {
            return 'workflowData_' + employeeId + '_' + workflowTypeCode;
        },

        /**
         * @param employeeId
         * @param workflowTypeCode
         * @param skip
         * @param defaultConfirmMessage
         * @param defaultActBtnText
         * @param {Object} options
         * @param {Boolean} [options.noSignature] true to prevent show signature
         * @returns {*}
         */
        actWorkflowConfirm : function(employeeId, workflowTypeCode, skip, defaultConfirmMessage, defaultActBtnText = i18n.gettext('Submit'), options = {}) {
            let key = this.getWorkflowVmIdent(employeeId, workflowTypeCode),
                dfd = Ext.create('Ext.Deferred');

            if (!this.checkWorkflowDataPresent(key)) {
                //<debug>
                console.error('Key ' + key + ' not found! Check workflow data loading!');
                //</debug>
            }

            if (skip) {
                dfd.resolve();

                return dfd.promise;
            }

            return this['_act' + (Ext.isModern ? 'Modern' : 'Classic')](employeeId, workflowTypeCode, defaultConfirmMessage, defaultActBtnText, options);
        },

        _actClassic : function(employeeId, workflowTypeCode, defaultConfirmMessage, defaultActBtnText, options = {}) {
            let vm = this.getViewModel(),
                workflowData = vm.get(this.getWorkflowVmIdent(employeeId, workflowTypeCode)),
                confirmText = workflowData && workflowData['confirmText'] ? workflowData['confirmText'] : (defaultConfirmMessage || ''),
                isSignature = !options.noSignature && (workflowData ? workflowData['isSignature'] : false),
                dfd = Ext.create('Ext.Deferred'),
                confirmWindow;

            if (confirmText) {
                confirmWindow = Ext.create('criterion.view.employee.SubmitConfirm', {
                    viewModel : {
                        data : {
                            confirmText : confirmText,
                            isSignature : isSignature,
                            defaultActBtnText : defaultActBtnText || i18n.gettext('Submit')
                        }
                    }
                });
                confirmWindow.on('confirmSubmit', function(signature) {
                    dfd.resolve(signature);
                    confirmWindow.destroy();
                });
                confirmWindow.on('cancelSubmit', function() {
                    dfd.reject();
                });
                confirmWindow.show();

            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        _actModern : function(employeeId, workflowTypeCode, defaultConfirmMessage, defaultActBtnText, options = {}) {
            let vm = this.getViewModel(),
                submitConfirm = Ext.create('criterion.view.employee.SubmitConfirm'),
                workflowData = vm.get(this.getWorkflowVmIdent(employeeId, workflowTypeCode)),
                confirmText = workflowData ? workflowData['confirmText'] : null,
                isSignature = !options.noSignature && (workflowData ? workflowData['isSignature'] : false),
                dfd = Ext.create('Ext.Deferred');

            if (Ext.isString(confirmText)) {
                submitConfirm.show({
                    title : i18n.gettext('Submit'),
                    ui : 'rounded',
                    message : confirmText || defaultConfirmMessage || i18n.gettext('Do you want to submit the record?'),
                    buttons : [
                        {text : i18n.gettext('Cancel'), itemId : 'no', cls : 'cancel-btn'},
                        {
                            text : defaultActBtnText || i18n.gettext('Submit'),
                            itemId : 'yes'
                        }
                    ],
                    prompt : isSignature,
                    scope : this,
                    fn : function(btn, signature) {
                        if (btn === 'yes') {
                            if (isSignature && !signature) {
                                criterion.Utils.toast(i18n.gettext('Please fill signature field!'));
                                dfd.reject();
                                return;
                            }

                            dfd.resolve(signature);
                        } else {
                            dfd.reject();
                        }
                    }
                });
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        }

    }

});
