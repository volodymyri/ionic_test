Ext.define('criterion.view.settings.hr.Onboardings', function() {

    return {
        alias : 'widget.criterion_settings_onboardings',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.Onboardings',
            'criterion.view.settings.hr.Onboarding'
        ],

        title : i18n.gettext('Onboarding'),

        layout : 'fit',

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,

            connectParentView : {
                parentForSpecified : true
            },
            editor : {
                xtype : 'criterion_settings_onboarding',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_employer_onboardings',
            listeners : {
                datachanged : function(store) {
                    store.each(function(rec) {
                        var details = rec.details();

                        details.sort('sequence', 'ASC');
                        details.group('onboardingGroupCd', 'ASC');
                    })
                }
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 2
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Number of Tasks'),
                dataIndex : 'countTasks',
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Pre Hire'),
                align : 'center',
                dataIndex : 'isPreHire',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };

})
;
