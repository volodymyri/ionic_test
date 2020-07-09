Ext.define('criterion.controller.settings.hr.onboarding.Details', function() {

    return {

        alias : 'controller.criterion_settings_onboarding_details',

        extend : 'criterion.controller.GridView',

        createEditor : function(editorCfg, record) {
            let editor = this.callParent(arguments);

            editor.getViewModel().set({
                employerId : this.getViewModel().get('record.employerId')
            });

            return editor;
        }

    }
});
