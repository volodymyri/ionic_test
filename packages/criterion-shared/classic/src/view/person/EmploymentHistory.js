Ext.define('criterion.view.person.EmploymentHistory', function() {

    return {

        alias : 'widget.criterion_person_employment_history',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.person.EmploymentHistory',
            'criterion.controller.person.EmploymentHistory'
        ],

        viewModel : {
            stores : {
                history : {
                    type : 'criterion_person_employment_history'
                }
            }
        },

        listeners : {
            scope : 'controller',
            editaction : 'handleEmployeeSelectAction'
        },

        bind : {
            store : '{history}'
        },

        controller : {
            type : 'criterion_person_employment_history'
        },

        sortableColumns : false,

        disableGrouping : true,

        tbar : null,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                dataIndex : 'employerName',
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Number'),
                dataIndex : 'employeeNumber',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Start Date'),
                dataIndex : 'startDate',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate',
                flex : 1
            }
        ]
    }
});
