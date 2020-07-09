Ext.define('criterion.controller.settings.hr.TaskGroup', function() {

    return {
        alias : 'controller.criterion_settings_task_group',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.store.employer.Tasks',
            'criterion.model.employer.TaskGroup',
            'criterion.view.MultiRecordPickerRemote'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onAfterSave : function(view, record) {
            var me = this;

            view.fireEvent('afterSave', view, record);
            me.close();
        }
    };

});
