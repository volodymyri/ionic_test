/**
 */
Ext.define('criterion.view.worker.compensation.claim.GridView', function() {

    return {
        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.worker.compensation.claim.GridView'
        ],

        controller : {
            type : 'criterion_worker_compensation_claim_gridview'
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                cls : 'criterion-btn-transparent',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ]
    }
});
