Ext.define('criterion.grid.plugin.PagingToolbar', {

    extend : 'Ext.grid.plugin.PagingToolbar',

    alias : 'plugin.criterion_pagingtoolbar',

    privates : {
        syncSummary : function() {
            let me = this,
                toolbar = me.getToolbar(),
                currentPage = me.getCurrentPage(),
                totalPages = me.getTotalPages();

            this.callParent(arguments);

            toolbar.getNextButton().setDisabled(!totalPages || (currentPage === totalPages));
            toolbar[totalPages ? 'show' : 'hide']();
        }
    }
});
