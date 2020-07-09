Ext.define('criterion.view.common.EmployeeBenefitDocuments', function() {

    const API = criterion.consts.Api.API;

    return {

        alias : 'widget.criterion_common_employee_benefit_documents',

        extend : 'Ext.grid.Grid',

        requires : [
            'criterion.store.employee.benefit.Documents'
        ],

        config : {
            downloadURL : API.EMPLOYEE_BENEFIT_DOCUMENT_DOWNLOAD
        },

        store : {
            type : 'criterion_employee_benefit_documents'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'documentName',
                text : i18n.gettext('Name'),
                flex : 1
            }
        ]
    };

});
