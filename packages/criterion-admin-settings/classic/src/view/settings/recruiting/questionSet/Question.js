Ext.define('criterion.view.settings.recruiting.questionSet.Question', function() {

    const DICT = criterion.consts.Dict,
        QUESTION_TYPE_CODE = criterion.Consts.QUESTION_TYPE_CODE,
        EN = criterion.Consts.LOCALIZATION_LANGUAGE_EN;

    return {

        alias : 'widget.criterion_settings_recruiting_question_set_question',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.QuestionSets',
            'criterion.controller.settings.recruiting.questionSet.Question'
        ],

        controller : {
            type : 'criterion_settings_recruiting_question_set_question',
            externalUpdate : true
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        viewModel : {
            formulas : {
                showResponseCd : get => Ext.Array.contains([QUESTION_TYPE_CODE.SELECT, QUESTION_TYPE_CODE.MULTISELECT], get('record.questionTypeCode')),
                showMaxSize : get => Ext.Array.contains([QUESTION_TYPE_CODE.TEXT, QUESTION_TYPE_CODE.TEXTAREA], get('record.questionTypeCode')),
                maxSizeLabel : get => get('record.questionTypeCode') === QUESTION_TYPE_CODE.TEXT ? i18n.gettext('Max Length') : i18n.gettext('Lines'),
                showDocumentType : get => get('record.questionTypeCode') === QUESTION_TYPE_CODE.FILE_ATTACHMENT,
                showSubQuestionSet : get => get('record.questionTypeCode') === QUESTION_TYPE_CODE.SUB_QUESTION_SET,

                fieldLabel : {
                    get : function(get) {
                        let code = get('languageField.selection.code') || EN,
                            lab = get('record.label');

                        return lab[code] || '';
                    },
                    set : function(val) {
                        if (val === '[object Object]') {
                            return;
                        }

                        let code = this.get('languageField.selection.code') || EN,
                            labelObj = Ext.clone(this.get('record.label'));

                        labelObj[code] = val;

                        this.get('record').set('label', Ext.encode(labelObj));
                    }
                }
            }
        },

        bodyPadding : 20,

        title : i18n.gettext('Question'),

        defaults : {
            labelWidth : 180
        },

        items : [
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.QUESTION_TYPE,
                fieldLabel : i18n.gettext('Data Type'),
                name : 'questionTypeCd',
                allowBlank : false,
                bind : '{record.questionTypeCd}'
            },
            {
                xtype : 'fieldcontainer',
                fieldLabel : i18n.gettext('Label'),
                layout : 'hbox',
                hidden : true,
                bind : {
                    hidden : '{showSubQuestionSet}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        allowBlank : false,
                        flex : 1,
                        bind : {
                            value : '{fieldLabel}',
                            disabled : '{showSubQuestionSet}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        reference : 'languageField',
                        codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                        valueCode : EN,
                        width : 120,
                        bind : {
                            value : '{languageCd}'
                        }
                    }
                ]
            },

            {
                xtype : 'numberfield',
                name : 'maximumSize',
                allowBlank : false,
                hidden : true,
                bind : {
                    fieldLabel : '{maxSizeLabel}',
                    hidden : '{!showMaxSize}',
                    disabled : '{!showMaxSize}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Code Table'),
                store : criterion.CodeDataManager.getCodeTablesStore(),
                queryMode : 'local',
                valueField : 'id',
                displayField : 'description',
                name : 'responseCd',
                allowBlank : false,
                hidden : true,
                bind : {
                    hidden : '{!showResponseCd}',
                    disabled : '{!showResponseCd}'
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                name : 'documentTypeCd',
                fieldLabel : i18n.gettext('Document Type'),
                allowBlank : false,
                hidden : true,
                disabled : true,
                bind : {
                    hidden : '{!showDocumentType}',
                    disabled : '{!showDocumentType}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Sub Question Set'),
                reference : 'subQuestionField',
                queryMode : 'local',
                displayField : 'name',
                valueField : 'id',
                editable : false,
                allowBlank : false,
                name : 'subQuestionSetId',
                hidden : true,
                store : {
                    type : 'criterion_question_sets'
                },
                bind : {
                    hidden : '{!showSubQuestionSet}',
                    disabled : '{!showSubQuestionSet}'
                },
                listeners : {
                    change : 'handleChangeSubQuestionSet'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Hidden'),
                name : 'isHidden'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Response Required'),
                name : 'isResponseRequired'
            }
        ]
    };

});

