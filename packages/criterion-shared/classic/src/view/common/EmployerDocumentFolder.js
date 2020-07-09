Ext.define('criterion.view.common.EmployerDocumentFolder', function() {

    return {
        alias : 'widget.criterion_common_employer_document_folder',

        extend : 'criterion.view.common.DocumentFolder',

        requires : [
            'criterion.controller.common.EmployerDocumentFolder',
            'criterion.store.employeeGroup.EmployerDocuments'
        ],

        controller : {
            type : 'criterion_common_employer_document_folder',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                employeeGroupEmployerDocuments : {
                    type : 'criterion_employee_group_employer_document'
                }
            }
        },

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                allowBlank : false,
                name : 'description'
            },
            {
                xtype : 'criterion_employee_group_combobox',
                reference : 'employeeGroupCombo',
                fieldLabel : i18n._('Employee Groups'),
                objectParam : 'employerDocumentId',
                bind : {
                    valuesStore : '{employeeGroupEmployerDocuments}'
                }
            }
        ]
    };

});
