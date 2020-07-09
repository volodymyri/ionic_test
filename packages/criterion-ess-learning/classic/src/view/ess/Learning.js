Ext.define('criterion.view.ess.Learning', function() {

    return {
        alias : 'widget.criterion_selfservice_learning',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Learning',
            'criterion.view.ess.learning.Active',
            'criterion.view.ess.learning.Complete',
            'criterion.view.ess.learning.MyTeam',
            'criterion.view.ess.learning.InstructorPortalWrap'
        ],

        controller : {
            type : 'criterion_selfservice_learning'
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
                        xtype : 'criterion_selfservice_learning_active',
                        itemId : 'active',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.LEARNING_ACTIVE)
                    },
                    {
                        xtype : 'criterion_selfservice_learning_complete',
                        itemId : 'completed',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.LEARNING_COMPLETE)
                    },
                    {
                        xtype : 'criterion_selfservice_learning_my_team',
                        itemId : 'myTeam',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_TEAM)
                    },
                    {
                        xtype : 'criterion_selfservice_learning_instructor_portal_wrap',
                        itemId : 'instructorPortal',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.INSTRUCTOR_PORTAL)
                    }
                ]
            }
        ]
    }
});
