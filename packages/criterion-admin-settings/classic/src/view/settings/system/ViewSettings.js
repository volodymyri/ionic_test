/**
 * @deprecated
 *
 * Not used for now, but may be helpful in future.
 */
/**
 * @deprecated
 *
 * Not used for now, but may be helpful in future.
 */
Ext.define('criterion.view.settings.system.ViewSettings', function() {

    return {

        alias : 'widget.criterion_settings_view',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.system.ViewSettings'
        ],

        viewModel: {},

        controller : {
            type : 'criterion_settings_view'
        },

        listeners : {
            scope : 'controller',
            activate : 'loadSettings'
        },

        bodyPadding : '15',

        items: [
        ],

        buttons: [
            {
                text : i18n.gettext('Save'),
                cls: 'criterion-btn-primary',
                listeners: {
                    click: 'onSave'
                }
            }
        ]
    };

});
