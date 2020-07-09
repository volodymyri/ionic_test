Ext.define('criterion.view.settings.recruiting.questionSet.Questions', function() {

    const columns = function(defRenderer) {
        return function(languageCd) {
            const noValue = '<span class="criterion-darken-gray">&mdash;</span>';

            return [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Label'),
                    dataIndex : 'label',
                    flex : 1,
                    encodeHtml : false,
                    renderer : defRenderer ? function(value) {
                        let languageCd = this.getViewModel().get('languageCd'),
                            languageCode = languageCd ? criterion.CodeDataManager.getCodeDetailRecord('id', languageCd, criterion.consts.Dict.LOCALIZATION_LANGUAGE).get('code') : criterion.Consts.LOCALIZATION_LANGUAGE_EN,
                            val = Ext.isObject(value) ? value[languageCode] : value;

                        return val ? val : noValue;
                    } : function(value) {
                        let languageCode = languageCd ? criterion.CodeDataManager.getCodeDetailRecord('id', languageCd, criterion.consts.Dict.LOCALIZATION_LANGUAGE).get('code') : criterion.Consts.LOCALIZATION_LANGUAGE_EN,
                            val = Ext.isObject(value) ? value[languageCode] : value;

                        return val ? val : noValue;
                    }
                },
                {
                    xtype : 'booleancolumn',
                    text : i18n.gettext('Response Required'),
                    dataIndex : 'isResponseRequired',
                    align : 'center',
                    trueText : '✓',
                    falseText : '',
                    width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                },
                {
                    xtype : 'booleancolumn',
                    text : i18n.gettext('Hidden'),
                    dataIndex : 'isHidden',
                    align : 'center',
                    trueText : '✓',
                    falseText : '',
                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                },
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                            tooltip : i18n.gettext('Move Up'),
                            text : '',
                            action : 'moveupaction'
                        },
                        {
                            glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                            tooltip : i18n.gettext('Move Down'),
                            text : '',
                            action : 'movedownaction'
                        }
                    ]
                }
            ]
        };
    };

    return {
        alias : 'widget.criterion_settings_recruiting_question_set_questions',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.settings.recruiting.questionSet.Questions',
            'criterion.view.settings.recruiting.questionSet.Question'
        ],

        viewModel : {
            data : {
                showHiddenQuestions : false
            },
            stores : {
                questions : {
                    source : '{record.questions}',
                    sorters : [
                        {
                            property : 'sequence',
                            direction : 'ASC'
                        }
                    ],
                    filters : [{
                        disabled : '{showHiddenQuestions}',
                        property : 'isHidden',
                        value : '{showHiddenQuestions}'
                    }]
                }
            },

            formulas : {
                gridColumns : {
                    bind : {
                        bindTo : '{languageCd}',
                        deep : true
                    },
                    get : languageCd => columns(false)(languageCd)
                }
            }
        },

        controller : {
            type : 'criterion_settings_recruiting_question_set_questions',
            connectParentView : false,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_settings_recruiting_question_set_question',
                allowDelete : true
            }
        },

        bind : {
            store : '{questions}',
            columns : '{gridColumns}'
        },

        tbar : [
            {
                xtype : 'button',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            '->',
            {
                xtype : 'toggleslidefield',
                labelWidth : 180,
                fieldLabel : i18n.gettext('Show Hidden Questions'),
                value : false,
                bind : {
                    value : '{showHiddenQuestions}'
                }
            }
        ],

        columns : columns(true)()
    };

});
