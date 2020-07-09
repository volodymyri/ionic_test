Ext.define('criterion.view.ess.payroll.Taxes', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_selfservice_payroll_taxes',

        extend : 'criterion.view.employee.Taxes',

        requires : [
            'criterion.view.ess.payroll.Tax',
            'criterion.controller.ess.payroll.Taxes'
        ],

        controller : {
            type : 'criterion_selfservice_payroll_taxes',
            baseRoute : criterion.consts.Route.SELF_SERVICE.PAYROLL_TAXES,
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,

            editor : {
                xtype : 'criterion_selfservice_payroll_tax',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        header : {
            title : i18n.gettext('Taxes'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    handler : 'handleAdd'
                }
            ]
        },

        tbar : null,

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tax Name'),
                dataIndex : 'taxName',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Filing Status'),
                dataIndex : 'filingStatus'
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
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'statusCd',
                text : i18n.gettext('Status'),
                unselectedText : '',
                codeDataId : DICT.WORKFLOW_STATE,
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            }
        ]
    }
});
