/**
 * @deprecated
 */
Ext.define('criterion.view.moduleToolbar.Settings', function () {

    return {
        alias: 'widget.criterion_moduletoolbar_settings',

        extend: 'Ext.button.Button',

        reference: 'settings',

        cls: 'criterion-moduletoolbar-btn-secondary',
        glyph: criterion.consts.Glyph['ios7-gear-outline'],

        tooltip : i18n.gettext('Settings')
    };

});
