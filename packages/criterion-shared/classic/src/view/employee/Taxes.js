Ext.define('criterion.view.employee.Taxes', function() {

    return {
        alias : 'widget.criterion_employee_taxes',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.employee.Taxes',
            'criterion.view.employee.Tax',
            'criterion.store.employee.Taxes'
        ],

        store : {
            type : 'criterion_employee_taxes',
            sorters : [{
                property : 'taxNumber',
                direction : 'ASC'
            }]
        },

        controller : {
            type : 'criterion_employee_taxes',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_employee_tax',
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Taxes'),

        tbar : [
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAdd',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TAXES, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tax Name'),
                dataIndex : 'taxName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Filing Status'),
                dataIndex : 'filingStatus',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                dataIndex : 'effectiveDate',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                dataIndex : 'expirationDate',
                flex : 1
            }
        ]
    };
});


