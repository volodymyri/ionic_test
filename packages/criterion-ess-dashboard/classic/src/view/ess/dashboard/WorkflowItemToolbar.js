Ext.define('criterion.view.ess.dashboard.WorkflowItemToolbar', function() {

    return {
        alias : 'widget.criterion_selfservice_dashboard_workflow_item_toolbar',

        extend : 'Ext.toolbar.Toolbar',

        cls : 'workflow-item-toolbar',

        addedItems : [],

        initComponent() {
            this.items = Ext.Array.clean([
                ...this.addedItems,
                !this.addedItems.length ? '->' : null,
                {
                    xtype : 'button',
                    enableToggle : true,
                    ui : 'glyph',
                    bind : {
                        pressed : '{fullPageMode}',
                        glyph : '{getGlyph}'
                    },
                    viewModel : {
                        formulas : {
                            getGlyph : function(get) {
                                return get('fullPageMode') ? criterion.consts.Glyph['android-contract'] : criterion.consts.Glyph['android-expand']
                            }
                        }
                    }
                }
            ]);

            this.callParent(arguments);
        }
    }
});
