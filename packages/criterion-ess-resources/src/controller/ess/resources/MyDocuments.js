Ext.define('criterion.controller.ess.resources.MyDocuments', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_resources_my_documents',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onEmployeeChange() {
            this.load();
        },

        load(opts) {
            let vm = this.getViewModel(),
                documentLocation = vm.get('documentLocation'),
                documentLocations = vm.getStore('documentLocations'),
                employeeId = this.getEmployeeId();

            if (!documentLocation) {
                if (documentLocations.count()) {
                    vm.set('documentLocation', documentLocations.first().getId())
                }

                return;
            }

            employeeId && this.callParent([
                {
                    params : Ext.apply({
                        documentLocationCd : documentLocation,
                        employeeId : employeeId,
                        isShare : true
                    }, opts || {})
                }
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
            let url = record.get('documentLocationCode') === criterion.Consts.DOCUMENT_LOCATION_TYPE_CODE.ONBOARDING ?
                criterion.consts.Api.API.EMPLOYEE_ONBOARDING_DOWNLOAD : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DOWNLOAD;

            window.open(criterion.Api.getSecureResourceUrl(url + record.getId()));
        },

        handleChangeDocumentLocation() {
            this.load();
        }
    };

});
