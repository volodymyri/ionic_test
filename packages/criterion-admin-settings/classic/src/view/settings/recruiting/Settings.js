Ext.define('criterion.view.settings.recruiting.Settings', function() {

    return {

        alias : 'widget.criterion_settings_recruiting_settings',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.recruiting.Settings',
            'criterion.store.employer.recruiting.Settings',
            'criterion.store.employer.QuestionSets',
            'criterion.store.WebForms',
            'criterion.store.Apps'
        ],

        controller : {
            type : 'criterion_settings_recruiting_settings'
        },

        viewModel : {
            data : {
                settingRecord : null,
                disableQuestionSetFiltering : false
            },
            stores : {
                verificationApps : {
                    type : 'criterion_apps'
                },
                settings : {
                    type : 'criterion_employer_recruiting_settings'
                },
                questionSets : {
                    type : 'criterion_question_sets'
                },
                webforms : {
                    type : 'criterion_web_forms'
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Recruiting Settings'),

        bodyPadding : 0,

        tbar : {
            padding : 0,
            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings',
                    padding : '20 25',
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
                }
            ]
        },

        items : [
            {
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDE,
                style : {
                    'border-top' : '1px solid #e8e8e8 !important'
                },

                items : [
                    {
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Question Set'),
                                        reference : 'questionSet',
                                        displayField : 'name',
                                        valueField : 'id',
                                        editable : false,
                                        name : 'questionSetId',
                                        queryMode : 'local',
                                        forceSelection : true,
                                        autoSelect : true,
                                        bind : {
                                            store : '{questionSets}',
                                            value : '{settingRecord.questionSetId}',
                                            filters : {
                                                property : 'employerId',
                                                value : '{employerId}',
                                                disabled : '{disableQuestionSetFiltering}',
                                                exactMatch : true
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Employment Application'),
                                        displayField : 'name',
                                        valueField : 'id',
                                        editable : false,
                                        name : 'employmentApplicationWebformId',
                                        queryMode : 'local',
                                        forceSelection : true,
                                        bind : {
                                            store : '{webforms}',
                                            value : '{settingRecord.employmentApplicationWebformId}'
                                        }
                                    }
                                ]
                            },
                            {
                                defaults : {
                                    labelWidth : 270
                                },
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Employment Application in Job Portal'),
                                        value : false,
                                        bind : {
                                            value : '{settingRecord.isShowEaJobPortal}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Background Verification'),
                                        valueField : 'id',
                                        displayField : 'name',
                                        allowBlank : true,
                                        editable : true,
                                        queryMode : 'local',
                                        bind : {
                                            store : '{verificationApps}',
                                            value : '{settingRecord.backgroundVerificationAppId}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Update'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleUpdate'
                }
            }
        ]
    };

});
