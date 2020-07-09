Ext.define('criterion.view.person.Contact', function() {

    return {
        alias : 'widget.criterion_person_contact',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.Contact',
            'criterion.view.ux.form.field.SSN',
            'criterion.view.CustomFieldsContainer'
        ],

        controller : {
            type : 'criterion_person_contact',
            externalUpdate : false
        },

        viewModel : {
            data : {
                /**
                 * @see criterion.model.person.Contact
                 */
                record : null
            },
            formulas : {
                phoneFormatParams : function(get) {
                    let countryCd = get('record.countryCode'),
                        employer,
                        employerCountryCode,
                        formatParams;

                    if (countryCd) {
                        formatParams = {
                            countryCode : countryCd
                        };
                    } else {
                        employer = this.get('employer');
                        employerCountryCode = employer && employer.get('countryCode');

                        formatParams = employerCountryCode ? {
                            countryCode : employerCountryCode
                        } : null;
                    }

                    return formatParams;
                },
                homePhoneSecurity : criterion.SecurityManager.generateSecurityFormula('record', 'person_contact.home_phone'),

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEPENDENTS_CONTACTS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEPENDENTS_CONTACTS, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        modelValidation : true,

        title : i18n.gettext('Contact'),

        initComponent : function() {
            var me = this,
                DICT = criterion.consts.Dict;

            me.items = [
                {
                    xtype : 'criterion_panel',

                    layout : 'hbox',

                    ui : 'clean',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            ui : 'clean',

                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.RELATIONSHIP_TYPE,
                                    fieldLabel : i18n.gettext('Relationship'),
                                    bind : {
                                        value : '{record.relationshipTypeCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'relationshipTypeCd',
                                    allowBlank : false,
                                    listeners : {
                                        change : 'handleChangeContactType'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.SALUTATION,
                                    fieldLabel : i18n.gettext('Prefix'),
                                    bind : {
                                        value : '{record.prefixCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'prefixCd',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('First Name'),
                                    name : 'firstName',
                                    bind : {
                                        value : '{record.firstName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Middle Name'),
                                    name : 'middleName',
                                    bind : {
                                        value : '{record.middleName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Last Name'),
                                    name : 'lastName',
                                    bind : {
                                        value : '{record.lastName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.GENERATION,
                                    fieldLabel : i18n.gettext('Suffix'),
                                    bind : {
                                        value : '{record.suffixCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'suffixCd',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Nickname'),
                                    name : 'nickName',
                                    bind : {
                                        value : '{record.nickName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Date of Birth'),
                                    name : 'dateOfBirth',
                                    bind : {
                                        value : '{record.dateOfBirth}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.GENDER,
                                    fieldLabel : i18n.gettext('Gender'),
                                    bind : {
                                        value : '{record.genderCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'genderCd',
                                    allowBlank : false,
                                    forceSelection : true
                                },
                                {
                                    xtype : 'criterion_field_ssn',
                                    flex : 1,
                                    fieldLabel : i18n.gettext('Social Security Number'),
                                    allowBlank : true,
                                    bind : {
                                        value : '{record.nationalIdentifier}',
                                        activateHideValue : '{!isPhantom}',
                                        readOnly : '{readOnly}'
                                    },
                                    reference : 'nationalIdentifier'
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('E-mail'),
                                    bind : {
                                        value : '{record.email}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'email',
                                    vtype : 'email'
                                }
                            ]
                        },
                        {
                            ui : 'clean',

                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Dependent'),
                                    reference : 'dependent',
                                    name : 'isDependent',
                                    bind : {
                                        value : '{record.isDependent}',
                                        disabled : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Emergency'),
                                    reference : 'emergency',
                                    name : 'isEmergency',
                                    bind : {
                                        value : '{record.isEmergency}',
                                        disabled : '{readOnly}'
                                    },
                                    listeners : {
                                        change : 'handleChangeEmergency'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Tobacco User'),
                                    reference : 'isTobaccoUser',
                                    name : 'isTobaccoUser',
                                    bind : {
                                        value : '{record.isTobaccoUser}',
                                        disabled : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Handicapped'),
                                    reference : 'isHandicapped',
                                    name : 'isHandicapped',
                                    bind : {
                                        value : '{record.isHandicapped}',
                                        disabled : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('Substance Abuse'),
                                    reference : 'isSubstanceAbuse',
                                    name : 'isSubstanceAbuse',
                                    bind : {
                                        value : '{record.isSubstanceAbuse}',
                                        disabled : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.STUDENT_STATUS,
                                    fieldLabel : i18n.gettext('Student Status'),
                                    bind : {
                                        value : '{record.studentStatusCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'studentStatusCd',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('School Name'),
                                    bind : {
                                        value : '{record.schoolName}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'schoolName'
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Education End Date'),
                                    name : 'educationEndDate',
                                    bind : {
                                        value : '{record.educationEndDate}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.DISABILITY,
                                    fieldLabel : i18n.gettext('Disability'),
                                    bind : {
                                        value : '{record.disabilityCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'disabilityCd',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n.gettext('Work Phone'),
                                    reference : 'workPhone',
                                    staticToken : 'person_contact.work_phone',
                                    bind : {
                                        rawNumber : '{record.workPhone}',
                                        displayNumber : '{record.workPhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n.gettext('Home Phone'),
                                    reference : 'homePhone',
                                    staticToken : 'person_contact.home_phone',
                                    bind : {
                                        rawNumber : '{record.homePhone}',
                                        displayNumber : '{record.homePhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        securityDescriptor : '{homePhoneSecurity}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n.gettext('Mobile Phone'),
                                    reference : 'mobilePhone',
                                    staticToken : 'person_contact.mobile_phone',
                                    bind : {
                                        rawNumber : '{record.mobilePhone}',
                                        displayNumber : '{record.mobilePhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_panel',

                    ui : 'clean',

                    layout : 'hbox',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    title : i18n.gettext('Address'),

                    items : [
                        {
                            ui : 'clean',

                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.COUNTRY,
                                    fieldLabel : i18n.gettext('Country'),
                                    reference : 'countryCDField',
                                    bind : {
                                        value : '{record.countryCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    name : 'countryCd',
                                    allowBlank : true
                                },
                                {
                                    xtype : 'textareafield',
                                    fieldLabel : i18n.gettext('Address 1'),
                                    name : 'address1',
                                    bind : {
                                        value : '{record.address1}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textareafield',
                                    fieldLabel : i18n.gettext('Address 2'),
                                    name : 'address2',
                                    bind : {
                                        value : '{record.address2}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            ui : 'clean',

                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Zip Code'),
                                    name : 'postalCode',
                                    bind : {
                                        value : '{record.postalCode}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('City'),
                                    name : 'city',
                                    bind : {
                                        value : '{record.city}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.STATE,
                                    fieldLabel : i18n.gettext('State'),
                                    name : 'stateCd',
                                    bind : {
                                        value : '{record.stateCd}',
                                        filterValues : {
                                            attribute : 'attribute1',
                                            value : '{countryCDField.selection.code}'
                                        },
                                        readOnly : '{readOnly}'
                                    },
                                    allowBlank : true
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_customfields_container',
                    reference : 'customfieldsDependents',
                    entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_DEPENDENTS,
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                    bind : {
                        readOnly : '{readOnly}'
                    }
                }

            ];

            me.callParent(arguments);
        }
    };

});
