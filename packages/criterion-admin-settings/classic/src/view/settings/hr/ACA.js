Ext.define('criterion.view.settings.hr.ACA', function() {

    return {
        alias : 'widget.criterion_settings_aca',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.hr.ACA',
            'criterion.store.employer.ACA'
        ],

        title : i18n.gettext('ACA'),

        viewModel : {
            stores : {
                acas : {
                    type : 'employer_acas'
                }
            }
        },

        controller : {
            type : 'criterion_settings_aca',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorDelete : true,
            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{acas}'
        },

        cls : 'criterion-grid-panel criterion-grid-panel-settings_toolbar',
        tbar : [
            {
                xtype : 'criterion_settings_employer_bar',
                context : 'criterion_settings'
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Generate'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'onGenerate'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Year'),
                dataIndex : 'taxYear'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employee Count'),
                dataIndex : 'totalEmployeeCount',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Transmit Date'),
                dataIndex : 'transmitDate',
                flex : 1
            }
        ]
    };

});
