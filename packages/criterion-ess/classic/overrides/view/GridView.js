Ext.define('criterion.overrides.view.GridView', {

    override : 'criterion.view.GridView',

    ui : 'grid',

    frame : true,

    tbar : [
        {
            xtype : 'button',
            reference : 'addButton',
            ui : 'feature',
            text : i18n.gettext('Add'),
            listeners : {
                click : 'handleAddClick'
            }
        },
        '->',
        {
            xtype : 'button',
            reference : 'refreshButton',
            cls : 'criterion-btn-glyph-only',
            glyph : criterion.consts.Glyph['ios7-refresh-empty'],
            scale : 'medium',
            listeners : {
                click : 'handleRefreshClick'
            }
        }
    ]
});