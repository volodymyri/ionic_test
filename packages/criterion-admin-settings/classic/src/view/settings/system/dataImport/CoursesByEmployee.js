Ext.define('criterion.view.settings.system.dataImport.CoursesByEmployee', function() {

    return {

        alias : 'widget.criterion_settings_data_import_courses_by_employee',

        extend : 'criterion.view.settings.system.dataImport.Base',

        requires : [
            'criterion.controller.settings.system.dataImport.CoursesByEmployee'
        ],

        controller : 'criterion_settings_data_import_courses_by_employee'
    }
});