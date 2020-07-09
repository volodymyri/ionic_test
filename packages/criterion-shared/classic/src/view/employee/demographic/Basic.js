Ext.define('criterion.view.employee.demographic.Basic', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_employee_demographic_basic',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.demographic.Basic',
            'criterion.store.FieldFormatTypes',
            'criterion.ux.form.field.plugin.InputMask',
            'criterion.ux.form.field.PersonPhoneNumber',
            'criterion.view.ux.form.field.SSN',
            'criterion.view.ux.form.field.Format',
            'criterion.view.CustomFieldsContainer'
        ],

        controller : {
            type : 'criterion_employee_demographic_basic'
        },

        title : i18n._('Demographics'),

        bodyPadding : 0,

        viewModel : {
            data : {
                hideSSNValue : true,
                hideCustomFieldContainer : false
            },

            formulas : {
                phoneFormatParams : function(get) {
                    let employer = get('employer'),
                        employerCountryCode = employer && employer.get('countryCode');

                    return employerCountryCode ? {
                        countryCode : employerCountryCode
                    } : null
                },
                homePhoneSecurity : criterion.SecurityManager.generateSecurityFormula('person', 'person.home_phone')
            }
        },

        modelValidation : true,

        listeners : {
            afterLoad : 'handleAfterLoad'
        },

        initComponent : function() {
            var me = this,
                DICT = criterion.consts.Dict;

            me.items = [
                {
                    xtype : 'container',
                    layout : 'hbox',
                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    defaultType : 'container',

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.SALUTATION,
                                    fieldLabel : i18n._('Prefix'),
                                    bind : {
                                        value : '{person.prefixCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('First Name'),
                                    bind : {
                                        value : '{person.firstName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Middle Name'),
                                    bind : {
                                        value : '{person.middleName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Last Name'),
                                    bind : {
                                        value : '{person.lastName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.GENERATION,
                                    fieldLabel : i18n._('Suffix'),
                                    bind : {
                                        value : '{person.suffixCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Nickname'),
                                    bind : {
                                        value : '{person.nickName}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n._('Date of Birth'),
                                    bind : {
                                        value : '{person.dateOfBirth}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.GENDER,
                                    fieldLabel : i18n._('Gender'),
                                    bind : {
                                        value : '{person.genderCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'hiddenfield',
                                    bind : {
                                        value : '{person.photoIdentifier}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Email'),
                                    vtype : 'email',
                                    bind : {
                                        value : '{person.email}',
                                        readOnly : '{readOnly}'
                                    },
                                    reference : 'email'
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Personal Email'),
                                    vtype : 'email',
                                    bind : {
                                        value : '{person.personalEmail}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.MARITAL_STATUS,
                                    fieldLabel : i18n._('Marital Status'),
                                    bind : {
                                        value : '{person.maritalStatusCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.COUNTRY,
                                    fieldLabel : i18n._('Citizenship'),
                                    bind : {
                                        value : '{person.citizenshipCountryCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    codeDataId : DICT.ETHNICITY,
                                    fieldLabel : i18n._('Ethnicity'),
                                    bind : {
                                        value : '{person.ethnicityCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },

                                // normal mode
                                {
                                    xtype : 'criterion_field_ssn',
                                    flex : 1,
                                    fieldLabel : i18n._('Social Security Number'),
                                    allowBlank : true,
                                    bind : {
                                        value : '{person.nationalIdentifier}',
                                        activateHideValue : '{hideSSNValue}',
                                        hidden : '{readOnly}'
                                    },
                                    reference : 'nationalIdentifier'
                                },
                                // readOnly mode
                                {
                                    xtype : 'criterion_field_ssn',
                                    flex : 1,
                                    fieldLabel : i18n._('Social Security Number'),
                                    allowBlank : true,
                                    hidden : true,
                                    readOnly : true,
                                    reference : 'nationalIdentifierRO',
                                    bind : {
                                        value : '{person.nationalIdentifier}',
                                        hidden : '{!readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n._('Work Phone'),
                                    reference : 'workPhone',
                                    staticToken : 'person.work_phone',
                                    bind : {
                                        rawNumber : '{person.workPhone}',
                                        displayNumber : '{person.workPhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n._('Home Phone'),
                                    reference : 'homePhone',
                                    staticToken : 'person.home_phone',
                                    bind : {
                                        rawNumber : '{person.homePhone}',
                                        displayNumber : '{person.homePhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}',
                                        securityDescriptor : '{homePhoneSecurity}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    reference : 'mobilePhone',
                                    fieldLabel : i18n._('Mobile Phone'),
                                    staticToken : 'person.mobile_phone',
                                    bind : {
                                        rawNumber : '{person.mobilePhone}',
                                        displayNumber : '{person.mobilePhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_person_phone_number',
                                    fieldLabel : i18n._('Additional Phone'),
                                    staticToken : 'person.additional_phone_number',
                                    bind : {
                                        rawNumber : '{person.additionalPhoneNumber}',
                                        displayNumber : '{person.additionalPhoneInternational}',
                                        formatParams : '{phoneFormatParams}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_customfields_container',
                    reference : 'customfieldsDemographics',
                    entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_DEMOGRAPHICS,
                    bind : {
                        readOnly : '{readOnly}',
                        hidden : '{hideCustomFieldContainer}'
                    }
                }
            ];

            me.callParent(arguments);
        },

        getCustomfieldsContainer : function() {
            return this.lookup('customfieldsDemographics');
        }
    };

});
