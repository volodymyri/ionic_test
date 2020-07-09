Ext.define('criterion.controller.recruiting.candidate.Interviews', function() {

    return {
        alias : 'controller.criterion_recruiting_candidate_interviews',

        extend : 'criterion.controller.GridView',

        getEmptyRecord() {
            let vm = this.getViewModel(),
                date = new Date()

            return {
                interviewDate : date,
                interviewDateDate : date,
                interviewDateTime : date,
                jobPostingCandidateId : vm.get('currentJobPostingCandidate.id')
            };
        },

        handleEditAction(record) {
            let date = record.get('interviewDate');

            record.set({
                interviewDateDate : date,
                interviewDateTime : date
            });

            this.callParent(arguments);
        },

        handleDownloadAction(record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_DOWNLOAD + '/' + record.getId()));
        }

    };

});
