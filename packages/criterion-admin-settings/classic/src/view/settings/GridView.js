Ext.define('criterion.view.settings.GridView', function() {

    return {

        alias : 'widget.criterion_settings_gridview',

        extend : 'criterion.view.GridView',

        cls : 'criterion-grid-panel criterion-grid-panel-settings_toolbar',

        tbar : [
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ]
    };

});
