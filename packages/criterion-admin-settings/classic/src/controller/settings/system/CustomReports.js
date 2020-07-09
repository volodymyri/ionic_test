Ext.define('criterion.controller.settings.system.CustomReports', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_custom_reports',

        requires : [
            'criterion.view.settings.system.CustomReportUploadForm'
        ],

        load : function() {
            var vm = this.getViewModel(),
                reports = vm.getStore('reports');

            if (reports) {
                this.reloadGroups().then(function() {
                    reports.load();
                })
            }
        },

        reloadGroups : function() {
            var vm = this.getViewModel(),
                reportGroups = vm.getStore('reportGroups');

            if (reportGroups) {
                return reportGroups.loadWithPromise();
            }
        }
    };
});
