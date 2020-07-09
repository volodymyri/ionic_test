Ext.define('criterion.view.recruiting.candidate.DemographicsForm', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_recruiting_candidate_demographics_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.view.ux.form.field.Format',
            'criterion.view.ux.form.field.SSN'
        ],

        controller : {
            externalUpdate : false
        },

        cls : 'criterion-form',

        allowDelete : true,

        modal : false,

        bodyPadding : 0,

        scrollable : true,

        viewModel : {
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        layout : 'vbox',

        defaults : {
            xtype : 'panel',
            width : '100%',
            layout : 'hbox',
            bodyPadding : '10 0 10 10',
            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
            plugins : [
                'criterion_responsive_column'
            ]
        },

        items : [
            {
                // stub. :first-child makes header styled as main header
                xtype : 'container'
            },
            {
                title : i18n.gettext('Demographics'),
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('First Name'),
                                allowOnlyWhitespace : false,
                                bind : '{record.firstName}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Middle Name'),
                                bind : '{record.middleName}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Last Name'),
                                allowOnlyWhitespace : false,
                                bind : '{record.lastName}'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date of Birth'),
                                bind : '{record.dateOfBirth}'
                            },
                            {
                                xtype : 'criterion_field_ssn',
                                fieldLabel : i18n.gettext('Social Security Number'),
                                bind : {
                                    value : '{record.ssn}',
                                    activateHideValue : '{!record.phantom}'
                                },
                                allowBlank : true
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Gender'),
                                codeDataId : DICT.GENDER,
                                bind : '{record.genderCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Military Service'),
                                codeDataId : DICT.MILITARY_STATUS,
                                bind : '{record.militaryStatusCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Ethnicity'),
                                codeDataId : DICT.ETHNICITY,
                                bind : '{record.ethnicityCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Disability'),
                                codeDataId : DICT.DISABILITY,
                                bind : '{record.disabilityCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                title : i18n.gettext('Contacts'),
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_person_phone_number',
                                fieldLabel : i18n.gettext('Home Phone'),
                                formatParams : {
                                    countryCode : 'US'
                                },
                                bind : {
                                    rawNumber : '{record.homePhone}',
                                    displayNumber : '{record.homePhoneUS}'
                                }
                            },
                            {
                                xtype : 'criterion_person_phone_number',
                                fieldLabel : i18n.gettext('Mobile Phone'),
                                formatParams : {
                                    countryCode : 'US'
                                },
                                bind : {
                                    rawNumber : '{record.mobilePhone}',
                                    displayNumber : '{record.mobilePhoneUS}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Email'),
                                bind : '{record.email}',
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Web Site'),
                                bind : '{record.website1}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Web Site 2'),
                                bind : '{record.website2}'
                            }
                        ]
                    }
                ]
            },
            {
                title : i18n.gettext('Address'),
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 1'),
                                bind : '{record.address1}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 2'),
                                bind : '{record.address2}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Postal Code'),
                                bind : '{record.postalCode}'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('City'),
                                bind : '{record.city}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('State'),
                                codeDataId : DICT.STATE,
                                bind : '{record.stateCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Country'),
                                codeDataId : DICT.COUNTRY,
                                bind : '{record.countryCd}',
                                triggers : {
                                    clear : {
                                        type : 'clear',
                                        cls : 'criterion-clear-trigger',
                                        hideWhenEmpty : true
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
