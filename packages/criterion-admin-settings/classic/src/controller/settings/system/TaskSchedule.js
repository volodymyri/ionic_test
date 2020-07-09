Ext.define('criterion.controller.settings.system.TaskSchedule', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_task_schedule',

        requires : [
            'criterion.view.settings.system.taskSchedule.TaskForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleAddTask : function() {
            let vm = this.getViewModel(),
                store = vm.get('record.tasks');

            this.editTask(store.add({
                scheduleId : vm.get('record.id')
            })[0]);
        },

        handleEditTask : function(grid, td, cellIndex, record) {
            this.editTask(record);
        },

        editTask : function(record) {
            let me = this,
                vm = this.getViewModel(),
                editor = Ext.create('criterion.view.settings.system.taskSchedule.TaskForm', {
                viewModel : {
                    data : {
                        record : record,
                        employerId : vm.get('record.employerId')
                    },
                    stores : {
                        employeeGroups : vm.getStore('employeeGroups')
                    }
                }
            });

            editor.on({
                cancel : function(form, record) {
                    me.cancelTaskEdit(record);
                },
                delete : function(record) {
                    me.handleRemoveTaskAction(record);
                },
                destroy : function() {
                    me.setCorrectMaskZIndex(false);
                }
            });

            editor.show();
            this.setCorrectMaskZIndex(true);
        },

        cancelTaskEdit : function(record) {
            if (record && record.phantom && !record.$relatedPhantom) {
                record.store ? record.store.remove(record) : record.erase();
            }

            if (record && !record.phantom) {
                record.reject();
            }
        },

        handleRemoveTaskAction : function(record) {
            record.store ? record.store.remove(record) : record.erase();
        },

        handleRecordLoad : function(record) {
            let me = this,
                superFn = this.superclass.handleRecordLoad,
                vm = this.getViewModel();

            vm.getStore('employeeGroups').loadWithPromise({
                params : {
                    employerId : record.get('employerId')
                }
            }).then(function() {
                superFn.call(me, record);
            });
        },

        handleChangeDailySystemTask : function(cmp, value) {
            if (value) {
                this.getViewModel().get('record').set({
                    recurrenceCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.RECURRENCE_TYPES.DAILY, criterion.consts.Dict.RECURRENCE_TYPE).getId(),
                    startTime : new Date(1970, 0, 1, 0, 0, 0)
                });
            }
        }

    };

});
