Ext.define('criterion.controller.recruiting.candidate.Notes', function() {

    return {
        alias : 'controller.criterion_recruiting_candidate_notes',

        extend : 'criterion.controller.GridView',

        getEmptyRecord() {
            let vm = this.getViewModel(),
                date = new Date()

            return {
                notesDate : date,
                notesDateDate : date,
                notesDateTime : date,
                jobPostingCandidateId : vm.get('currentJobPostingCandidate.id')
            };
        },

        handleEditAction(record) {
            let date = record.get('notesDate');

            record.set({
                notesDateDate : date,
                notesDateTime : date
            });

            this.callParent(arguments);
        }

    };

});
