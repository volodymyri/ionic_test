Ext.define('criterion.controller.ess.resources.CompanyDocuments', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_selfservice_resources_company_documents',

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

        handleCellClick(grid, td, cellIndex, record, tr, rowIndex, e) {
            let column = e.position && e.position.column,
                dataIndex = column && column.dataIndex,
                isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander'),
                xtype = column && e.position.column.xtype;

            if (
                !xtype ||
                xtype === 'criterion_actioncolumn' ||
                !dataIndex || isExpanderClick ||
                !record.get('leaf')
            ) {
                return;
            }

            this.onAttachmentView(record);
        },

        onAttachmentView(record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_DOCUMENT_DOWNLOAD + record.getId()));
        }
    };

});
