Ext.define('criterion.controller.ess.resources.CompanyVideos', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_selfservice_resources_company_videos',

        load(opts = {}) {
            let employerId = this.getViewModel().get('employerId');

            if (!employerId) {
                return;
            }

            this.callParent([
                Ext.apply({}, Ext.merge(opts, {
                    params : {
                        employerId : employerId,
                        isShare : true
                    }
                }))
            ]);
        },

        handleBeforeCellClick(grid, td, cellIndex, record, tr, rowIndex, e) {
            let column = e.position && e.position.column,
                dataIndex = column && column.dataIndex,
                isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander'),
                xtype = column && e.position.column.xtype;

            if (
                !xtype ||
                xtype === 'criterion_actioncolumn' ||
                !dataIndex || isExpanderClick
            ) {
                return;
            }

            this.handleVideoView(record);
        },

        handleVideoView(record) {
            let newWin = window.open(record.get('url'),
                "Video",
                "width=600,height=500,resizable=yes,scrollbars=yes,status=yes"
            );

            newWin.focus()
        }
    };

});
