Ext.define('criterion.view.settings.payroll.CertifiedRates', function() {

    return {
        alias : 'widget.criterion_payroll_settings_certified_rates',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.payroll.CertifiedRates',
            'criterion.view.settings.payroll.CertifiedRate',
            'criterion.store.employer.CertifiedRates'
        ],

        title : i18n.gettext('Certified Rates'),

        controller : {
            type : 'criterion_payroll_settings_certified_rates',
            loadRecordOnEdit : true,
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_certified_rate',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                }
            },
            {
                xtype : 'toggleslidefield',
                labelWidth : 100,
                fieldLabel : i18n.gettext('Show inactive'),
                reference : 'showInactive',
                inputValue : '1',
                listeners : {
                    change : 'handleChangeShowInactive'
                }
            },
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

        store : {
            type : 'employer_certified_rates'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Union'),
                dataIndex : 'union',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Local'),
                dataIndex : 'local',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Effective Date'),
                dataIndex : 'rateEffectiveDate',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                dataIndex : 'rateExpirationDate',
                flex : 1
            }
        ]
    };

});
