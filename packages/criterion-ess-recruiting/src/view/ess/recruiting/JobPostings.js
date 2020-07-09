Ext.define('criterion.view.ess.recruiting.JobPostings', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_job_postings',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.controller.ess.recruiting.JobPostings',
            'criterion.view.ess.recruiting.JobPostingsList',
            'criterion.view.ess.recruiting.JobPostingDetail',
            'criterion.view.ess.recruiting.JobPostingCandidates',

            'criterion.view.ess.recruiting.candidate.Detail',
            'criterion.view.ess.recruiting.candidate.AdditionalDetails',
            'criterion.view.ess.recruiting.candidate.Resume',
            'criterion.view.ess.recruiting.candidate.CoverLetter',
            'criterion.view.ess.recruiting.candidate.QuestionResponses',
            'criterion.view.ess.recruiting.candidate.Interview',
            'criterion.view.ess.recruiting.candidate.Notes'
        ],

        controller : {
            type : 'criterion_selfservice_recruiting_job_postings'
        },

        viewModel : {},

        listeners : {
            activate : 'handleActivate'
        },

        plugins : {
            ptype : 'criterion_lazyitems',

            items : [
                {
                    xtype : 'criterion_selfservice_recruiting_job_postings_list',
                    itemId : 'jobPostings'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_job_posting_detail',
                    itemId : 'detail'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_job_posting_candidates',
                    itemId : 'candidates'
                },

                {
                    xtype : 'criterion_selfservice_recruiting_candidate_detail',
                    itemId : 'candidateDetail'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_additional_details',
                    itemId : 'candidateAdditionalDetails'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_resume',
                    itemId : 'candidateResume'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_cover_letter',
                    itemId : 'candidateCoverLetter'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_question_responses',
                    itemId : 'candidateQuestionResponses'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_interview',
                    itemId : 'candidateInterview'
                },
                {
                    xtype : 'criterion_selfservice_recruiting_candidate_notes',
                    itemId : 'candidateNotes'
                }
            ]
        }
    };

});
