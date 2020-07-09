Ext.define('criterion.view.common.EmployeeBenefitDocuments', function() {

    const API = criterion.consts.Api.API;

    return {

        alias : 'widget.criterion_common_employee_benefit_documents',

        extend : 'criterion.ux.grid.Panel',

        requires : [
            'criterion.controller.common.EmployeeBenefitDocuments',
            'criterion.store.employee.benefit.Documents'
        ],

        controller : {
            type : 'criterion_common_employee_benefit_documents'
        },

        listeners : {
            removeaction : 'handleRemove',
            downloadAction : 'handleDownload'
        },

        config : {
            downloadURL : API.EMPLOYEE_BENEFIT_DOCUMENT_DOWNLOAD
        },

        store : {
            type : 'criterion_employee_benefit_documents'
        },

        viewModel : {
            data : {
                readOnly : false
            },

            formulas : {
                columns : data => {
                    let actions = data('readOnly') ? [
                        {
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            tooltip : i18n.gettext('Download'),
                            action : 'downloadAction',
                            permissionAction : (v, cellValues, record, i, k, e, view) => !record.phantom
                        }
                    ] : [
                        {
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            tooltip : i18n.gettext('Download'),
                            action : 'downloadAction',
                            permissionAction : (v, cellValues, record, i, k, e, view) => !record.phantom
                        },
                        {
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            tooltip : i18n.gettext('Delete'),
                            action : 'removeaction'
                        }
                    ]

                    return [
                        {
                            xtype : 'gridcolumn',
                            dataIndex : 'documentName',
                            text : i18n.gettext('Name'),
                            flex : 1
                        },
                        {
                            xtype : 'criterion_actioncolumn',
                            width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * actions.length,
                            items : actions
                        }
                    ]
                }
            }
        },

        bind : {
            columns : '{columns}'
        },

        uploadStorage : null,

        load(employeeBenefitId) {
            return this.getController().load(employeeBenefitId);
        },

        syncDocuments(employeeBenefitId) {
            return this.getController().syncDocuments(employeeBenefitId);
        },

        getDocuments() {
            return this.uploadStorage;
        },

        setReadOnlyMode(readOnly) {
            this.getViewModel().set('readOnly', readOnly);
        }
    };

});
