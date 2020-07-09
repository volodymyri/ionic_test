Ext.define('criterion.view.settings.hr.onboarding.Form', function() {

    return {

        alias : 'widget.criterion_settings_onboarding_form',

        extend : 'criterion.view.common.OnboardingForm',

        requires : [
            'criterion.controller.settings.hr.onboarding.Form'
        ],

        controller : {
            type : 'criterion_settings_onboarding_form'
        },

        header : {
            title : i18n.gettext('Onboarding Task'),
            padding : '10 10 10 15',
            margin : 0,
            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Assign'),
                    handler : 'handleAssign',
                    margin : '0 20 0 0',
                    hidden : true,
                    bind : {
                        hidden : '{isPhantom}'
                    }
                }
            ]
        }

    }
});
