Ext.define('criterion.view.reports.dataGrid.editor.Form', function() {

    return {

        extend : 'criterion.view.reports.dataGrid.editor.Base',

        alias : 'widget.criterion_reports_data_grid_editor_form',

        requires : [
            'criterion.controller.reports.dataGrid.editor.Form'
        ],

        controller : {
            type : 'criterion_reports_data_grid_editor_form'
        },

        availableName : i18n.gettext('Available Field'),
        usedName : i18n.gettext('Field'),
        storeIdent : 'formsFields'

    };
});
