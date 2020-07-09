Ext.define('criterion.controller.scheduling.Populations', function() {

    return {
        alias : 'controller.criterion_scheduling_populations',

        extend : 'criterion.controller.employer.GridView',

        load : function(opts) {
            var view = this.getView(),
                employerId = this.getEmployerId();

            if (!employerId) {
                return;
            }

            view.setLoading(true);

            Ext.promise.Promise
                .all([
                    this.getStore('populationCount').loadWithPromise({
                        params : {
                            employerId : employerId
                        }
                    }),
                    this.getStore('employerWorkLocations').loadWithPromise({
                        params : {
                            employerId : employerId
                        }
                    }),
                    this.getStore('workLocationAreas').loadWithPromise()
                ])
                .always(function() {
                    view.setLoading(false);
                });
        },

        createEditor : function(editorCfg, record) {
            var vm = this.getViewModel();

            editorCfg.viewModel = {
                stores : {
                    mainStore : vm.getStore('populationCount'),
                    employerWorkLocations : vm.getStore('employerWorkLocations'),
                    workLocationAreas : vm.getStore('workLocationAreas')
                }
            };

            return this.callParent([editorCfg, record]);
        }
    };

});
