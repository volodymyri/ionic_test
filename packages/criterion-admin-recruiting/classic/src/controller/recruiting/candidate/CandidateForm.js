Ext.define('criterion.controller.recruiting.candidate.CandidateForm', function() {

    const ROUTE = criterion.consts.Route.RECRUITING.CANDIDATES;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_form',

        requires : [
            'criterion.model.Candidate'
        ],

        load : function(id) {
            let view = this.getView(),
                vm = this.getViewModel(),
                candidateId = parseInt(id, 10);

            if (!this.checkViewIsActive()) {
                return;
            }

            if (Ext.isNumber(candidateId)) {
                if (vm.get('candidateId') === candidateId) {
                    return;
                }

                view.setTabsDisabled(false);
                view.setLoading(true);

                vm.set({
                    candidateId : candidateId,
                    candidate : null
                });

                criterion.model.Candidate.load(candidateId, {
                    success : function(record) {
                        vm.set({
                            candidate : record
                        });

                        view.setLoading(false);
                    }
                });
            } else {
                view.setTabsDisabled(true);

                vm.set({
                    candidateId : null,
                    candidate : Ext.create('criterion.model.Candidate')
                });

                let activeTab = view.getActiveTab && view.getActiveTab();

                if (activeTab && Ext.isFunction(activeTab.getController().showDemographicsForm)) {
                    activeTab.getController().showDemographicsForm();
                }
            }
        },

        onCandidateUpdated() {
            let candidate = this.getViewModel().get('candidate');

            candidate && candidate.loadWithPromise();
        },

        onCandidateSelect : function(candidateId) {
            let vm = this.getViewModel(),
                view = this.getView(),
                candidate = Ext.create('criterion.model.Candidate', {
                    id : candidateId
                }),
                activeTab = view.getActiveTab && view.getActiveTab();

            if (candidateId) {
                view.setLoading(true);
                candidate.loadWithPromise()
                    .then(function() {
                        vm.set({
                            candidate : candidate,
                            candidateId : candidateId
                        });

                        activeTab && activeTab.fireEvent('activate');
                    })
                    .always(function() {
                        view.setLoading(false);
                    });
            } else {
                vm.set({
                    candidate : null,
                    candidateId : null
                });
            }
        },

        onTabChange : function(panel, tab) {
            let vm = this.getViewModel(),
                candidateId = vm.get('candidateId') || 'new';

            if (this.getView().useRouter) {
                Ext.History.add(criterion.consts.Route.RECRUITING.CANDIDATES + '/' + candidateId + '/' + tab.itemId, true);
            }
        },

        onJpCandidateChanged(record) {
            this.getView().fireEvent('jpCandidateChanged', record)
        },

        init : function() {
            let routes = {};

            routes[ROUTE + '/:id'] = 'load';
            routes[ROUTE + '/:id/:tab'] = 'load';

            if (this.getView().useRouter) {
                this.setRoutes(routes);
            }

            this.onTabChange = Ext.Function.createBuffered(this.onTabChange, 500, this);

            this.callParent(arguments);
        }
    };
});
