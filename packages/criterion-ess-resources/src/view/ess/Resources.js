Ext.define('criterion.view.ess.Resources', function() {

    return {
        alias : 'widget.criterion_selfservice_resources',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Resources',
            'criterion.view.ess.resources.*',
            'criterion.view.ess.Team'
        ],

        controller : {
            type : 'criterion_selfservice_resources'
        },

        viewModel : {},

        showHeaders : true,

        layout : {
            type : 'card',
            deferredRender : true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',

                items : [
                    {
                        xtype : 'criterion_selfservice_resources_my_documents',
                        itemId : 'myDocuments',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_DOCUMENTS)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_company_documents',
                        itemId : 'companyDocuments',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.COMPANY_DOCUMENTS)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_team_documents',
                        itemId : 'teamDocuments',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_DOCUMENTS)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_company_videos',
                        itemId : 'companyVideos',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.COMPANY_VIDEOS)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_company_directory',
                        itemId : 'companyDirectory',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.COMPANY_DIRECTORY)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_reports',
                        itemId : 'reports',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.REPORTS)
                    },
                    {
                        xtype : 'criterion_selfservice_resources_forms',
                        itemId : 'forms',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.FORM)
                    },
                    {
                        xtype : 'criterion_selfservice_team',
                        reference : 'team',
                        itemId : 'team',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.ORGANIZATION_VIEW)
                    }
                ]
            }
        ]
    }
});
