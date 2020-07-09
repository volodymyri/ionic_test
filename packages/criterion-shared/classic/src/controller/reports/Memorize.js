Ext.define('criterion.controller.reports.Memorize', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_reports_memorize',

        onShow : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            this.getStore('reportGroups').loadWithPromise().always(
                function() {
                    view.setLoading(false);
                }
            );
        }
    };

});