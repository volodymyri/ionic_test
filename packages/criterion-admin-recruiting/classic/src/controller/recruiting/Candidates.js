Ext.define('criterion.controller.recruiting.Candidates', function() {

    const ROUTE = criterion.consts.Route.RECRUITING.CANDIDATES,
        CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE = 'CustomDateRange';

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidates',

        requires : [
            'criterion.model.Candidate'
        ],

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        _beforeViewer : null,

        showGrid : function(noReload) {
            this.getView().setActiveItem(this.lookup('candidateList'));
            !noReload && this.onSearch();
        },

        showForm : function(id, tab) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                candidateDetails = this.lookup('candidateDetails'),
                nForm = this.lookup('newCandidateForm');

            if (id === 'new') {
                nForm.getViewModel().set('record', Ext.create('criterion.model.Candidate'));
                this.getView().setActiveItem(nForm);

                nForm.on({
                    cancel : me.handleCloseNewCandidateForm,
                    afterSave : me.handleCloseNewCandidateForm,
                    afterDelete : me.handleCloseNewCandidateForm,
                    single : true,
                    scope : me
                })
            } else {
                let candidates = this.lookup('gridCandidates').getStore(),
                    candidatesGrid = vm.getStore('candidatesGrid'),
                    candidateIds = [];

                if (!candidates.count() && id) {
                    // empty state
                    candidatesGrid.loadWithPromise({
                        params : {
                            nearCandidateId : id
                        }
                    }).then(() => {
                        candidatesGrid.each(candidate => {
                            candidates.add(candidate.get('candidate'));
                        });

                        candidateDetails.loadData(id, candidates, candidatesGrid);
                        view.setActiveItem(candidateDetails);
                    });
                } else {
                    candidateIds.push(id);

                    candidates.each(rec => {
                        candidateIds.push(rec.getId());
                    });

                    candidatesGrid.loadWithPromise({
                        params : {
                            candidateId : Ext.Array.unique(candidateIds).join(',')
                        }
                    }).then(() => {
                        candidateDetails.loadData(id, candidates, candidatesGrid);
                        view.setActiveItem(candidateDetails);
                    });
                }
            }
        },

        showViewer : function(url, isExternalSite, candidate) {
            let viewer = this.lookup('viewer');

            this._beforeViewer = this.getView().getLayout().getActiveItem();

            this.getView().setActiveItem(viewer);
            viewer.setSrc(url);

            viewer.getViewModel().set({
                isExternalSite : isExternalSite,
                candidate : candidate
            });
        },

        onViewerClose : function() {
            this.lookup('viewer').flush();
            this.getView().setActiveItem(this._beforeViewer);

            return false;
        },

        onSearch : function() {
            let form = this.lookup('searchForm'),
                searchCriteria = form && form.getValues(),
                gridCandidates = this.lookup('gridCandidates'),
                appliedField = this.lookup('appliedField'),
                appliedStartDateField = this.lookup('appliedStartDateField'),
                appliedEndDateField = this.lookup('appliedEndDateField'),
                jobCandidates = gridCandidates && gridCandidates.getStore();

            if (!searchCriteria || !gridCandidates || (jobCandidates && jobCandidates.isLoading())) {
                return;
            }

            if (
                appliedField.getValue() === CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE &&
                (!appliedStartDateField.isValid() || !appliedEndDateField.isValid())
            ) {
                return;
            }

            Ext.Object.each(searchCriteria, function(key, value) {
                if (key === 'showAdvanced') {
                    delete searchCriteria['showAdvanced'];
                }

                if (key === 'locationAddress' && (value === '' || value === false)){
                    delete searchCriteria['locationDistance'];
                }

                if (value === '' || value === false) {
                    // remove empty choices from criteria
                    delete searchCriteria[key];
                }
            });

            jobCandidates.getProxy().setExtraParams(searchCriteria);
            jobCandidates.loadPage(1);
        },

        onRecordEdit : function(record) {
            this.redirectTo(ROUTE + '/' + record.getId(), null);
        },

        handleCandidateAdd() {
            this.redirectTo(ROUTE + '/new', null);
        },

        init : function() {
            let routes = {};

            routes[ROUTE] = 'showGrid';
            routes[ROUTE + '/:id'] = 'showForm';
            routes[ROUTE + '/:id/:tab'] = 'showForm';

            this.setRoutes(routes);
            this.setReRouting();

            this.onSearch = Ext.Function.createDelayed(this.onSearch, 100, this);

            this.callParent(arguments);
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.onSearch();
            }
        },

        handleSearchComboChange : function() {
            this.onSearch();
        },

        handleSearchAppliedComboChange : function(combo, value) {
            let me = this,
                appliedStartDateField = this.lookup('appliedStartDateField');

            if (value === CANDIDATE_SEARCH_APPLIED_CUSTOM_DATE_RANGE) {
                Ext.defer(function() {
                    appliedStartDateField.focus();
                }, 100);
            } else {
                me.onSearch();
            }
        },

        handleSearchAppliedDateChange : function() {
            let appliedStartDateField = this.lookup('appliedStartDateField'),
                appliedEndDateField = this.lookup('appliedEndDateField'),
                appliedStartDateFieldValid = appliedStartDateField.isValid(),
                appliedEndDateFieldValid = appliedEndDateField.isValid();

            if (appliedStartDateFieldValid && appliedEndDateFieldValid) {
                this.onSearch();
            } else if (!appliedStartDateFieldValid) {
                Ext.defer(function() {
                    appliedStartDateField.focus();
                }, 100);
            } else {
                Ext.defer(function() {
                    appliedEndDateField.focus();
                }, 100);
            }
        },

        showResume : function(record) {
            if (record.get('hasResume')) {
                if (!record.get('isPdfResume')) {
                    window.open(criterion.consts.Api.API.CANDIDATE_RESUME_DOWNLOAD + '/' + record.getId())
                } else {
                    this.showViewer(
                        criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.CANDIDATE_RESUME_SHOW + '/' + record.getId()),
                        false,
                        record
                    );
                }
            }
        },

        sendEmail : function(record) {
            window.open('mailto:' + record.get('email'));
        },

        handleCloseNewCandidateForm() {
            this.redirectTo(ROUTE, null);
        }
    };
});
