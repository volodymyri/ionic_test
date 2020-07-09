Ext.define('criterion.controller.settings.scheduling.RequiredCoverages', function() {

    return {
        alias : 'controller.criterion_settings_scheduling_required_coverages',

        extend : 'criterion.controller.employer.GridView',

        load : function() {
            var view = this.getView(),
                employerId = this.getEmployerId();

            if (!employerId) {
                return;
            }

            this.callParent(arguments);

            view.setLoading(true);

            Ext.promise.Promise
                .all([
                    this.getStore('positions').loadWithPromise({
                        params : {
                            employerId : employerId,
                            isApproved : true
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

        createEditor : function(editorCfg) {
            editorCfg.viewModel = {
                data : {
                    employerPositions : this.getStore('positions'),
                    employerWorkLocations : this.getStore('employerWorkLocations'),
                    workLocationAreas : this.getStore('workLocationAreas')
                }
            };

            return this.callParent(arguments);
        }
    };

});
