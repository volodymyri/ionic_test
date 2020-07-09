Ext.define('criterion.view.settings.employeeEngagement.Badge', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'widget.criterion_settings_badge',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.employeeEngagement.Badge',
            'criterion.ux.form.ImageField'
        ],

        controller : {
            type : 'criterion_settings_badge',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        bodyPadding : 0,

        title : i18n.gettext('Badge Details'),

        items : [
            {
                xtype : 'criterion_panel',

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

                bodyPadding : '15 10',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        xtype : 'criterion_image_field',
                        reference : 'badgeImage',
                        fieldLabel : i18n.gettext('Image'),
                        url : API.COMMUNITY_BADGE_IMAGE,
                        buttonText : i18n.gettext('Change'),
                        bind : {
                            value : '{record.id}'
                        },
                        listeners : {
                            imageClick : 'handleChange'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        allowBlank : false,
                        name : 'description'
                    }
                ]
            }
        ]
    };

});
