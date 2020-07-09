Ext.define('criterion.view.settings.recruiting.QuestionSet', function() {

    const EN = criterion.Consts.LOCALIZATION_LANGUAGE_EN;

    return {

        alias : 'widget.criterion_settings_recruiting_question_set',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.Questions',
            'criterion.controller.settings.recruiting.QuestionSet',
            'criterion.view.settings.recruiting.questionSet.Questions'
        ],

        title : i18n.gettext('Publishing Site'),

        controller : {
            type : 'criterion_settings_recruiting_question_set',
            externalUpdate : false
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            formulas : {
                description : {
                    get : function(get) {
                        let code = get('languageField.selection.code') || EN;

                        return get('record.description')[code] || '';
                    },
                    set : function(val) {
                        if (val === '[object Object]') {
                            return;
                        }

                        let code = this.get('languageField.selection.code') || EN,
                            descriptionObj = Ext.clone(this.get('record.description'));

                        descriptionObj[code] = val;

                        this.get('record').set('description', Ext.encode(descriptionObj));
                    }
                }
            }
        },

        header : {
            title : i18n.gettext('Question Set Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',

                    text : i18n.gettext('Jobs'),
                    handler : 'handleSelectJobs',
                    cls : 'criterion-btn-feature'
                }
            ]
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'container',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                disabled : true,
                                hideTrigger : true,
                                bind : '{record.employerId}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                allowBlank : false,
                                bind : '{record.name}'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Enabled'),
                                bind : '{record.isEnabled}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                reference : 'languageField',
                                codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                                fieldLabel : i18n.gettext('Language'),
                                valueCode : EN,
                                bind : {
                                    value : '{languageCd}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'container',

                plugins : [
                    'criterion_responsive_column'
                ],

                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                padding : '0 15 20 15',

                items : [
                    {
                        xtype : 'container',
                        flex : 4,
                        layout : 'fit',
                        items : [
                            {
                                xtype : 'textarea',
                                fieldLabel : i18n.gettext('Description'),
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                height : 150,
                                allowBlank : false,
                                bind : '{description}'
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_settings_recruiting_question_set_questions'
            }
        ]
    }

});

