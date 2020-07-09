Ext.define('criterion.controller.ess.recruiting.candidate.Notes', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_notes',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        handleActivate() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                jobPostingCandidateId = vm.get('jobPostingCandidateId'),
                candidateToolbar = view.down('criterion_selfservice_recruiting_candidate_toolbar');

            if (jobPostingCandidateId) {
                vm.set({
                    note : null,
                    activeViewIndex : 0
                });

                view.setLoading(true);

                me.loadMainData([this.loadJobPostingCandidateNotes()]).then(data => {
                    view.setLoading(false);

                    vm.set(data);
                    candidateToolbar && candidateToolbar.setPressedBtn();
                }, _ => {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    view.setLoading(false);
                });
            }
        },

        loadJobPostingCandidateNotes() {
            let vm = this.getViewModel();

            return vm.get('jobPostingCandidateNotes').loadWithPromise({
                params : {
                    jobPostingCandidateId : vm.get('jobPostingCandidateId')
                }
            });
        },

        handleViewNote(grid, td, cellIndex, record) {
            let date = record.get('notesDate');

            record.set({
                notesDateDate : date,
                notesDateTime : date
            });

            this.getViewModel().set({
                note : record,
                activeViewIndex : 1
            });
        },


        handleBack() {
            let vm = this.getViewModel();

            if (vm.get('activeViewIndex') === 1) {
                vm.set({
                    note : null,
                    activeViewIndex : 0
                });
            } else {
                this.callParent(arguments);
            }
        }
    }
});
