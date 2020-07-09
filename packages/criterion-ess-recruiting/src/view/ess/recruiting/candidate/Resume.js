Ext.define('criterion.view.ess.recruiting.candidate.Resume', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting_candidate_resume',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.recruiting.candidate.Resume',
            'criterion.ux.SimpleIframe',
            'criterion.view.ess.recruiting.candidate.Toolbar'
        ],

        viewModel : {
            data : {}
        },

        controller : {
            type : 'criterion_selfservice_recruiting_candidate_resume'
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
                reference : 'iframe',
                flex : 1
            }
        ],

        flush : function() {
            var iframe = this.down('[reference=iframe]');

            iframe.flush.apply(iframe, arguments);
        },

        setSrc : function() {
            var iframe = this.down('[reference=iframe]');

            iframe.setSrc.apply(iframe, arguments);
        }
    }
});
