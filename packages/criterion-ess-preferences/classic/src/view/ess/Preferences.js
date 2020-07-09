Ext.define('criterion.view.ess.Preferences', function() {

    return {
        alias : 'widget.criterion_selfservice_preferences',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Preferences',
            'criterion.view.ess.preferences.*'
        ],

        controller : {
            type : 'criterion_selfservice_preferences'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        listeners : {
            activate : 'handleActivate'
        },

        viewModel : {},

        defaults : {
            scrollable : true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'criterion_ess_preferences_security',
                        itemId : 'security',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.SECURITY)
                    },
                    {
                        xtype : 'criterion_ess_preferences_look_and_feel',
                        itemId : 'lookAndFeel',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.LOOK_AND_FEEL)
                    },
                    {
                        xtype : 'criterion_ess_preferences_calendars',
                        itemId : 'calendar',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.CALENDAR)
                    },

                    {
                        xtype : 'criterion_ess_preferences_delegation',
                        itemId : 'delegation',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.DELEGATION)
                    },
                    {
                        xtype : 'criterion_ess_preferences_team_delegation',
                        itemId : 'teamDelegation',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_DELEGATION)
                    }
                ]
            }
        ]
    };

});
