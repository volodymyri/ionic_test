Ext.define('criterion.view.ess.recruiting.candidate.CoverLetter', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_cover_letter',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.CoverLetter',
            'criterion.ux.SimpleIframe',
            'criterion.view.ess.recruiting.candidate.Toolbar'
        ],

        viewModel : {
            data : {}
        },

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_cover_letter'
        },

        listeners : {
            activate : 'handleActivate'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        frame : true,

        header : {
            title : {
                bind : {
                    text : '{jobPosting.title} &bull; {jobPostingCandidate.candidate.firstName} {jobPostingCandidate.candidate.lastName}'
                }
            }
        },

        tbar : {
            xtype : 'criterion_selfservice_recruiting_candidate_toolbar'
        },

        bbar : [
            '->',
            {
                xtype : 'criterion_button_back',
                handler : 'handleBack'
            }
        ],

        items : [
            {
                xtype : 'criterion_simple_iframe',
                reference : 'coverLetter',
                flex : 1,
                hidden : true,
                bind : {
                    hidden : '{!jobPostingCandidate.candidate.hasCoverLetter}'
                }
            },
            {
                xtype : 'component',
                hidden : true,
                padding : 10,
                bind : {
                    html : '{jobPostingCandidate.candidate.coverLetterText}',
                    hidden : '{jobPostingCandidate.candidate.hasCoverLetter}'
                }
            }
        ],

        flush : function() {
            var coverLetter = this.down('[reference=coverLetter]');

            coverLetter.flush.apply(coverLetter, arguments);
        },

        setSrc : function() {
            var coverLetter = this.down('[reference=coverLetter]');

            coverLetter.setSrc.apply(coverLetter, arguments);
        }
    }
});
