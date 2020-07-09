Ext.define('criterion.view.ess.Recruiting', function() {

    return {
        alias : 'widget.criterion_selfservice_recruiting',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.controller.ess.Recruiting',
            'criterion.view.ess.recruiting.JobPostings',
            'criterion.view.ess.recruiting.JobPortalWrap'
        ],

        controller : {
            type : 'criterion_selfservice_recruiting'
        },

        viewModel : {
            data : {}
        },

        listeners : {
            activate : 'handleActivate'
        },


        plugins : [
            {
                ptype : 'criterion_security_items'
            }
        ],

        items : [
            {
                xtype : 'criterion_selfservice_recruiting_job_postings',
                itemId : 'jobPostings',
                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.JOB_POSTINGS)
            },
            {
                xtype : 'criterion_selfservice_recruiting_job_portal_wrap',
                itemId : 'careers',
                securityAccess : () => criterion.SecurityManager.showInternalCareers()
            }
        ]
    };

});

