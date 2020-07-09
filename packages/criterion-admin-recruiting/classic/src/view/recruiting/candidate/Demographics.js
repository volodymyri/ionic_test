Ext.define('criterion.view.recruiting.candidate.Demographics', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_recruiting_candidate_demographics',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.Demographics',
            'criterion.model.Candidate',
            'criterion.view.ux.form.field.Format',
            'criterion.view.ux.form.field.SSN',
            'criterion.ux.form.field.plugin.DisplayOnly',
            'criterion.ux.plugin.Affix',
            'criterion.ux.HorizontalDivider'
        ],

        viewModel : {
            formulas : {
                getCandidateFullName : data => [
                    data('candidate.firstName'),
                    data('candidate.middleName'),
                    data('candidate.lastName')
                ].join(' '),

                getCandidateLocation : data => [
                    data('candidate.address1'),
                    data('candidate.address2'),
                    data('candidate.city'),
                    data('candidate.stateDescription'),
                    data('candidate.countryDescription'),
                    data('candidate.postalCode')
                ].filter(val => val).join(', ')
            }
        },

        controller : {
            type : 'criterion_recruiting_candidate_demographics'
        },

        listeners : {
            scope : 'controller',
            addResume : 'showUploadResumeForm'
        },

        layout : 'fit',

        items : [
            {
                // container for keep top bar visible while editing
                xtype : 'container',
                reference : 'formContainer',
                layout : 'vbox',
                scrollable : 'vertical',
                defaults : {
                    cls : 'transparent-bg-header minimized-header',
                    width : '100%',
                    margin : '15 0 0 20',
                    bodyPadding : '10 0 0 0',
                    header : {
                        padding : '0 0 8'
                    },
                    defaults : {
                        margin : '10 0'
                    }
                },
                items : [
                    {
                        header : {
                            title : i18n.gettext('Demographics'),
                            padding : 0,
                            items : [
                                {
                                    xtype : 'button',
                                    cls : 'criterion-btn-round-new-primary',
                                    glyph : criterion.consts.Glyph['edit'],
                                    scale : 'small',
                                    listeners : {
                                        click : 'handleEditClick'
                                    },
                                    hidden : true,
                                    margin : '0 35 10 0',
                                    bind : {
                                        hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                            rules : {
                                                OR : [
                                                    {
                                                        key : criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES,
                                                        actName : criterion.SecurityManager.UPDATE,
                                                        reverse : true
                                                    },
                                                    {
                                                        key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE,
                                                        actName : criterion.SecurityManager.UPDATE,
                                                        reverse : true
                                                    }
                                                ]
                                            }
                                        })
                                    }
                                }
                            ]
                        },

                        items : [
                            {
                                xtype : 'displayfield',
                                fieldLabel : i18n.gettext('Full Name'),
                                bind : '{getCandidateFullName}'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date of Birth'),
                                bind : '{candidate.dateOfBirth}',
                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    }
                                ]
                            },
                            {
                                xtype : 'criterion_field_ssn',
                                fieldLabel : i18n.gettext('SSN'),
                                hidden : true,
                                grow : true,
                                plugins : [
                                    {
                                        ptype : 'criterion_display_only',
                                        hideTriggers : false
                                    }
                                ],
                                bind : {
                                    value : '{candidate.ssn}',
                                    hidden : '{!candidate.ssn}'
                                }
                            },
                            {
                                xtype : 'criterion_display_field_cd',
                                fieldLabel : i18n.gettext('Gender'),
                                codeDataId : DICT.GENDER,
                                bind : {
                                    value : '{candidate.genderCd}'
                                }
                            },
                            {
                                xtype : 'criterion_display_field_cd',
                                fieldLabel : i18n.gettext('Ethnicity'),
                                codeDataId : DICT.ETHNICITY,
                                bind : {
                                    value : '{candidate.ethnicityCd}'
                                }
                            },
                            {
                                xtype : 'criterion_display_field_cd',
                                fieldLabel : i18n.gettext('Military Status'),
                                codeDataId : DICT.MILITARY_STATUS,
                                bind : {
                                    value : '{candidate.militaryStatusCd}'
                                }
                            },
                            {
                                xtype : 'criterion_display_field_cd',
                                fieldLabel : i18n.gettext('Disability'),
                                codeDataId : DICT.DISABILITY,
                                bind : {
                                    value : '{candidate.disabilityCd}'
                                }
                            }
                        ]
                    },
                    {
                        title : i18n.gettext('Contacts'),
                        items : [
                            {
                                xtype : 'criterion_person_phone_number',
                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    },
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-home'
                                        }
                                    }
                                ],
                                fieldLabel : '',
                                hideLabel : true,
                                hidden : true,
                                formatParams : {
                                    countryCode : 'US'
                                },
                                bind : {
                                    rawNumber : '{candidate.homePhone}',
                                    displayNumber : '{candidate.homePhoneUS}',
                                    hidden : '{!candidate.homePhoneUS}'
                                }
                            },
                            {
                                xtype : 'criterion_person_phone_number',
                                plugins : [
                                    {
                                        ptype : 'criterion_display_only'
                                    },
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-android-phone-portrait'
                                        }
                                    }
                                ],
                                fieldLabel : '',
                                hideLabel : true,
                                hidden : true,
                                formatParams : {
                                    countryCode : 'US'
                                },
                                bind : {
                                    rawNumber : '{candidate.mobilePhone}',
                                    displayNumber : '{candidate.mobilePhoneUS}',
                                    hidden : '{!candidate.mobilePhoneUS}'
                                }
                            },
                            {
                                xtype : 'displayfield',
                                plugins : [
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-email'
                                        }
                                    }
                                ],
                                bind : '{candidate.email}'
                            },
                            {
                                xtype : 'displayfield',
                                plugins : [
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-social-linkedin'
                                        }
                                    }
                                ],
                                hidden : true,
                                bind : {
                                    value : '{candidate.website2}',
                                    hidden : '{!candidate.website2}'
                                }
                            },
                            {
                                xtype : 'displayfield',
                                plugins : [
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-world-outline'
                                        }
                                    }
                                ],
                                hidden : true,
                                bind : {
                                    value : '{candidate.website1}',
                                    hidden : '{!candidate.website1}'
                                }
                            }
                        ]
                    },
                    {
                        title : i18n.gettext('Address'),
                        hidden : true,
                        bind : {
                            hidden : '{!getCandidateLocation}'
                        },
                        items : [
                            {
                                xtype : 'displayfield',
                                plugins : [
                                    {
                                        ptype : 'criterion_affix',
                                        prefix : {
                                            cls : 'criterion-list-item-icon criterion-darken-gray ion ion-ios7-location'
                                        }
                                    }
                                ],
                                bind : '{getCandidateLocation}'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
