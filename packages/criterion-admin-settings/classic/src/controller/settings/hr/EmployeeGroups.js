Ext.define('criterion.controller.settings.hr.EmployeeGroups', function() {

    return {
        alias : 'controller.criterion_settings_employee_groups',

        extend : 'criterion.controller.employer.GridView',

        checkCalculateProcessInterval : 1000,

        init : function() {
            let me = this;

            me.callParent(arguments);
            me.getView().getStore().on('load', 'onLoadCheckCalculateProcess', me);
        },

        _onCallbackLoad : function(editor, record) {
            this.callParent(arguments);

            editor.on({
                afterSave : this.saveEmployeesInGroup,
                afterDelete : this.onGroupDelete,
                scope : this
            });
        },

        saveEmployeesInGroup : function(view, record, employees) {
            var employeeGroupId = record.getId(),
                me = this;

            employees.each(function(rec) {
                rec.set('employeeGroupId', employeeGroupId);
            });
            employees.syncWithPromise().then(function() {
                view && view.destroy();
                me.load();
            });
        },

        onEmployerChange : function() {
            this.load();
        },

        onGroupDelete :  function() {
            this.load();
        },

        onLoadCheckCalculateProcess : function(grid, records, success) {
            let me = this;

            if (success) {
                if (!Ext.Array.every(records, function(item) {
                    return !item.get('isInProcess');
                })) {
                    me.checkCalculateProcess();
                }
            }
        },

        checkCalculateProcess : function() {
            let me = this;

            Ext.defer(function() {
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_GROUP,
                    method : 'GET',
                    params : {
                        isInProgress : true,
                        employerId : me.getEmployerId()
                    }
                }).then(function(res) {
                    if (Ext.isArray(res)) {
                        if (Ext.Array.every(res, function(item) {
                            return !item.isInProcess;
                        })) {
                            me.load();
                        } else {
                            me.checkCalculateProcess();
                        }
                    }
                });
            }, me.checkCalculateProcessInterval);
        }
    };

});
