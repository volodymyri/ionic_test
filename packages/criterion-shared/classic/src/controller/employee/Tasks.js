Ext.define('criterion.controller.employee.Tasks', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_tasks',

        requires : [
            'criterion.view.TaskPicker',
            'criterion.model.employer.Task',
            'criterion.model.employer.TaskGroup',
            'criterion.model.employer.Project',
            'criterion.model.employee.Task'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        load() {
            let me = this,
                employeeId = me.getEmployeeId(),
                showInactiveField = me.lookup('showInactive'),
                employeeParams = {
                    employeeId : employeeId
                };

            if (!employeeId) {
                return false;
            }

            if (showInactiveField && !showInactiveField.getValue()) {
                employeeParams = Ext.apply(employeeParams, {activeOnly : true});
            }

            me.getStore('employeeTasks').load({
                params : employeeParams
            });
        },

        handleChangeShowInactive() {
            this.load();
        },

        handleAdd() {
            let me = this,
                taskPicker = me.createTasksPicker();

            taskPicker.on('selectRecords', me.addTasksGroups, me);
            taskPicker.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            taskPicker.show();

            me.setCorrectMaskZIndex(true);
        },

        createTasksPicker() {
            return Ext.create('criterion.view.TaskPicker', {
                viewModel : {
                    data : {
                        employeeId : this.getEmployeeId(),
                        employerId : this.getEmployerId()
                    }
                }
            })
        },

        addTasksGroups(selectedRecords) {
            let me = this,
                employeeId = me.getEmployeeId(),
                recordInsert;

            me.setCorrectMaskZIndex(false);

            Ext.Array.each(selectedRecords, function(record) {
                if (record instanceof criterion.model.employer.Task) {
                    recordInsert = Ext.create('criterion.model.employee.Task', {
                        employeeId : employeeId,
                        taskId : record.getId(),
                        taskGroupId : null,
                        projectId : null,
                        taskName : record.get('name'),
                        taskProjectName : record.get('projectName')
                    });
                } else if (record instanceof criterion.model.employer.TaskGroup) {
                    recordInsert = Ext.create('criterion.model.employee.Task', {
                        employeeId : employeeId,
                        taskId : null,
                        taskGroupId : record.getId(),
                        projectId : null,
                        taskName : record.get('name')
                    });
                } else if (record instanceof criterion.model.employer.Project) {
                    recordInsert = Ext.create('criterion.model.employee.Task', {
                        employeeId : employeeId,
                        taskId : null,
                        taskGroupId : null,
                        projectId : record.getId(),
                        taskName : record.get('name'),
                        projectName : record.get('name')
                    });
                }

                me.addRecord(recordInsert);
            });

            me.getStore('employeeTasks').sync({
                scope : this,
                success : function() {
                    me.load();
                }
            })
        },

        remove(record) {
            let me = this;

            record.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TASK);

            record.erase({
                success : function() {
                    me.load();
                }
            });
        }
    };
});

