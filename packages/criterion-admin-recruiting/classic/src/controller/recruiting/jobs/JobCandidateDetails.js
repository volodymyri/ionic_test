Ext.define('criterion.controller.recruiting.jobs.JobCandidateDetails', function() {

    return {

        alias : 'controller.criterion_recruiting_jobs_job_candidate_details',

        extend : 'criterion.app.ViewController',

        listen : {
            component : {
                '#candidateForm' : {
                    afterCandidateLoad : 'handleCandidateLoad'
                }
            }
        },

        load(record) {
            let vm = this.getViewModel(),
                detailsGrid = this.lookup('detailsGrid'),
                store = record.store;

            vm.set('_cjp', record);

            detailsGrid.reconfigure(store);

            if (vm.get('detailsGrid.selection') !== record) {
                detailsGrid.selModel.select(record);
            }
        },

        handleGoBack() {
            let detailsGrid = this.lookup('detailsGrid');

            detailsGrid.setSelection(null);
            this.getView().fireEvent('candidateSelect', null);

            this.redirectTo(Ext.History.getToken(), true);
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

        onJpCandidateChanged(record) {
            this.getView().down('criterion_recruiting_candidate_job_posting_panel').fireEvent('jpCandidateChanged', record);
        }
    };

});
