Ext.define('criterion.view.settings.system.dataImport.CoursesByEmployer', function() {

    return {

        alias : 'widget.criterion_settings_data_import_courses_by_employer',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.CoursesByEmployer'
        ],

        controller : 'criterion_settings_data_import_courses_by_employer'
    }
});