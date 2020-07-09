Ext.define('criterion.view.settings.recruiting.QuestionSets', function() {

    return {
        alias : 'widget.criterion_settings_recruiting_question_sets',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.QuestionSets',
            'criterion.view.settings.recruiting.QuestionSet',
            'criterion.controller.settings.recruiting.QuestionSets'
        ],

        title : i18n.gettext('Question Sets'),

        controller : {
            type : 'criterion_settings_recruiting_question_sets',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_recruiting_question_set',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_question_sets'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1,
                filter : true
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'isEnabled',
                align : 'center',
                trueText : 'Enabled',
                falseText : 'Disabled',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                filter : false
            }
        ]
    };

});


