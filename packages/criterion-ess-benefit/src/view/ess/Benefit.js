Ext.define('criterion.view.ess.Benefit', function() {

    return {
        alias : 'widget.criterion_selfservice_benefit',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.controller.ess.Benefit',
            'criterion.view.ess.benefits.Plans',
            'criterion.view.ess.benefits.OpenEnrollments'
        ],

        controller : {
            type : 'criterion_selfservice_benefit'
        },

        listeners : {
            activate : 'handleActivate'
        },

        viewModel : {},

        plugins : [
            {
                ptype : 'criterion_security_items'
            }
        ],

        items : [
            {
                xtype : 'criterion_selfservice_benefits_plans',
                itemId : 'plans',
                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.BENEFITS_PLANS)
            },
            {
                xtype : 'criterion_selfservice_benefits_open_enrollments',
                itemId : 'openEnrollments',
                title : i18n.gettext('Open Enrollment'),
                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.OPEN_ENROLLMENT)
            }
        ]
    };
});
