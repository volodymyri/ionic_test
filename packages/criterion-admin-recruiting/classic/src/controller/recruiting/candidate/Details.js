Ext.define('criterion.controller.recruiting.candidate.Details', function() {

    return {
        alias : 'controller.criterion_recruiting_candidate_details',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.view.recruiting.candidate.BackgroundReportPicker',
            'criterion.view.recruiting.candidate.BackgroundReportRequest',
            'criterion.view.recruiting.candidate.SendForm',
            'criterion.view.recruiting.candidate.UploadResumeForm',
            'criterion.view.MultiRecordPicker',
            'criterion.store.employer.jobPosting.candidate.Documents',
            'criterion.ux.form.FillableWebForm',
            'criterion.store.employer.Onboardings',
            'criterion.store.employer.jobPosting.Candidates'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        listen : {
            component : {
                '#candidateForm' : {
                    afterCandidateLoad : 'handleCandidateLoad'
                }
            }
        },

        loadData(candidateId, candidates, jobPostingCandidates) {
            let detailsGrid = this.lookup('detailsGrid'),
                rec,
                store = Ext.create('criterion.store.employer.jobPosting.Candidates');

            jobPostingCandidates.sort('appliedDate', 'DESC');

            candidates.each(candidate => {
                jobPostingCandidates.filter({
                    property : 'candidateId',
                    value : candidate.getId(),
                    exactMatch : true
                });

                if (jobPostingCandidates.count()) {
                    // latest job (appliedDate -> DESC -> first)
                    let first = jobPostingCandidates.first(),
                        result = store.getProxy().getReader().read([Ext.clone(first.getData())]);

                    store.add(result.getRecords()[0]);
                } else {
                    // add empty
                    let result = store.getProxy().getReader().read([{
                        candidateId : candidate.getId(),
                        candidate : Ext.clone(candidate.getData())
                    }]);

                    store.add(result.getRecords()[0]);
                }

                jobPostingCandidates.clearFilter();
            });

            detailsGrid.reconfigure(store);

            rec = candidateId && store.findRecord('candidateId', parseInt(candidateId, 10), 0, false, false, true);
            if (rec) {
                detailsGrid.getSelectionModel().select(rec);
                detailsGrid.getView().scrollRowIntoView(detailsGrid.getStore().indexOf(rec));
            }
        },

        handleGoBack() {
            this.redirectTo(criterion.consts.Route.RECRUITING.CANDIDATES);
        },

        handleCandidateLoad() {
            let vm = this.getViewModel(),
                detailsGrid = this.lookup('detailsGrid'),
                selectedRecord = vm.get('detailsGrid.selection'),
                selectedIndex;

            detailsGrid.reconfigure();

            if (selectedRecord) {
                selectedIndex = detailsGrid.getStore().indexOf(selectedRecord);
                detailsGrid.getView().scrollRowIntoView(selectedIndex);
            }
        },

        onJobPostingCandidateChanged(view, rec) {
            this.getViewModel().set('currentJobPostingCandidate', rec);
        },

        onCandidateUpdated() {
            this.lookup('candidateForm').onCandidateUpdated();
        },

        onJpCandidateChanged(record) {
            this.getView().down('criterion_recruiting_candidate_job_posting_panel').fireEvent('jpCandidateChanged', record);
        }
    };

});
