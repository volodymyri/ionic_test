Ext.define('criterion.view.reports.dataGrid.editor.Module', function() {

    return {

        extend : 'criterion.view.reports.dataGrid.editor.Base',

        alias : 'widget.criterion_reports_data_grid_editor_module',

        requires : [
            'criterion.controller.reports.dataGrid.editor.Module'
        ],

        controller : {
            type : 'criterion_reports_data_grid_editor_module'
        },

        availableName : i18n.gettext('Available Columns'),
        usedName : i18n.gettext('Column'),
        storeIdent : 'moduleColumns'

    };
});
