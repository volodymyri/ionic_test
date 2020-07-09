Ext.define('criterion.controller.mixin.ChangeEmployee', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'Ext.Mixin',

        mixinId : 'criterion_change_employee',

        requires : [
            'criterion.view.common.ChangeEmployeeForm'
        ],

        changeEmployeeAction : function(role, employee, person, isWorkflowAction) {
            var me = this,
                dfd = Ext.create('Ext.promise.Deferred'),
                currentEmployeeId = employee.getId(),
                textConfIdent = {
                    isHiringManager : 'HiringManager',
                    isSupervisor : 'Supervisor'
                },
                method = {
                    isHiringManager : 'onManagerChange',
                    isSupervisor : 'onSupervisorChange'
                };

            if (employee.get(role)) {
                var wnd = Ext.create('criterion.view.common.ChangeEmployeeForm', {
                    textConfIdent : textConfIdent[role],
                    viewModel : {
                        data : {
                            currentEmployeeId : currentEmployeeId,
                            employeeId : currentEmployeeId,
                            employeeFullName : person.get('fullName')
                        }
                    }
                });
                wnd.on('save', function(newEmployeeId) {
                    me[method[role]](currentEmployeeId, newEmployeeId, isWorkflowAction).then(function(datas) {
                        dfd.resolve(datas);
                    });
                }, me);
                wnd.on('close', function() {
                    dfd.reject();
                });
                wnd.show();
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        onManagerChange : function(currentEmployeeId, newManagerId, isWorkflowAction) {
            if (!isWorkflowAction) {
                return criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : API.EMPLOYER_JOB_POSTING_UPDATE_MANAGER,
                    jsonData : {
                        oldHiringManagerId : currentEmployeeId,
                        newHiringManagerId : newManagerId
                    }
                });
            } else {
                var dfd = Ext.create('Ext.Deferred');

                Ext.defer(function() {
                    dfd.resolve({
                        newHiringManagerId : parseInt(newManagerId, 10)
                    });
                }, 1);

                return dfd.promise;
            }
        },

        onSupervisorChange : function(currentEmployeeId, newEmployeeId, isWorkflowAction) {
            if (!isWorkflowAction) {
                return criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : API.EMPLOYEE_CHANGE_SUPERVISOR,
                    jsonData : {
                        fromEmployeeId : currentEmployeeId,
                        toEmployeeId : newEmployeeId
                    }
                });
            } else {
                var dfd = Ext.create('Ext.Deferred');

                Ext.defer(function() {
                    dfd.resolve({
                        newSupervisorId : parseInt(newEmployeeId, 10)
                    });
                }, 1);

                return dfd.promise;
            }
        }
    }

});
