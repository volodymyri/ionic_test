Ext.define('criterion.view.settings.system.dataImport.Base', function() {

    return {

        alias : 'widget.criterion_settings_data_import_base',

        extend : 'criterion.ux.form.Panel',

        bodyPadding : 0,

        viewModel : {},

        listeners : {
            submit : 'submitHandler',
            reset : 'resetData'
        }
    }
});