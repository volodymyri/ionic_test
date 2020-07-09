Ext.define('criterion.view.settings.EmployeeEngagement', function() {

    return {
        alias : 'widget.criterion_settings_employee_engagement',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.settings.employeeEngagement.*'
        ],

        layout: {
            type: 'card',
            deferredRender: true
        },

        title : i18n.gettext('Employee Engagement'),

        items: [
            {
                xtype : 'criterion_settings_communities',
                title : i18n.gettext('Communities'),
                reference : 'communities'
            },
            {
                xtype : 'criterion_settings_badges',
                title : i18n.gettext('Badges'),
                reference : 'badges'
            }
        ]
    };

});
