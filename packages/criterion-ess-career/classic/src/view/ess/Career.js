Ext.define('criterion.view.ess.Career', function() {

    return {
        alias : 'widget.criterion_selfservice_career',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Career',
            'criterion.view.ess.career.Educations',
            'criterion.view.ess.career.Skills',
            'criterion.view.ess.career.Certifications'
        ],

        controller : {
            type : 'criterion_selfservice_career'
        },

        viewModel : {},

        showHeaders : true,

        layout : {
            type : 'card',
            deferredRender : true
        },

        defaults : {
            frame : true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'criterion_selfservice_career_educations',
                        itemId : 'education',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.EDUCATION)
                    },
                    {
                        xtype : 'criterion_selfservice_career_skills',
                        itemId : 'skills',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.SKILL)
                    },
                    {
                        xtype : 'criterion_selfservice_career_certifications',
                        itemId : 'certifications',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.CERTIFICATION)
                    }
                ]
            }
        ]
    }
});
