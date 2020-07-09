Ext.define('criterion.view.settings.benefits.DeductionFrequencies', function() {

    return {
        alias : 'widget.criterion_settings_deduction_frequencies',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.DeductionFrequencies',
            'criterion.view.settings.benefits.DeductionFrequency'
        ],

        title : i18n.gettext('Deduction Frequency'),

        store : {
            type : 'criterion_deduction_frequencies'
        },

        controller : {
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_deduction_frequency',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '60%'
                    }
                ],
                controller : {
                    externalUpdate : false
                }
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Code'),
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                flex : 2,
                text : i18n.gettext('Description'),
                dataIndex : 'description'
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.RATE_UNIT,
                flex : 1,
                text : i18n.gettext('Rate Unit'),
                dataIndex : 'rateUnitCd'
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Active'),
                dataIndex : 'isActive',
                trueText : '✓',
                falseText : '-',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]

    };

});
