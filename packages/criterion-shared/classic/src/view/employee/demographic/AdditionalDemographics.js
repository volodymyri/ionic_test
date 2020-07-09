Ext.define('criterion.view.employee.demographic.AdditionalDemographics', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_employee_demographic_additional_demographics',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.demographic.AdditionalDemographics',
            'criterion.view.CustomFieldsContainer'
        ],

        title : i18n._('Additional Demographics'),

        controller : {
            type : 'criterion_employee_demographic_additional_demographics',
            closeFormAfterCancel : false
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                text : i18n._('Cancel'),
                handler : 'onCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n._('Save'),
                scale : 'small',
                handler : 'handleSave',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_DEMOGRAPHICS, criterion.SecurityManager.UPDATE, true)
                }
            }
        ],

        modelValidation : true,

        scrollable : true,

        items : [
            {
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
                                codeDataId : DICT.MILITARY_STATUS,
                                fieldLabel : i18n._('Military Status'),
                                bind : {
                                    value : '{person.militaryStatusCd}'
                                },
                                editable : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.LANGUAGE,
                                fieldLabel : i18n._('Primary Language'),
                                bind : {
                                    value : '{person.primaryLanguageCd}'
                                },
                                allowBlank : true,
                                editable : false
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.COUNTRY,
                                fieldLabel : i18n._('Dual Citizenship'),
                                bind : {
                                    value : '{person.dualCitizenshipCountryCd}'
                                },
                                allowBlank : true,
                                editable : false
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Tobacco User'),
                                bind : {
                                    value : '{person.isTobaccoUser}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Handicapped'),
                                bind : {
                                    value : '{person.isHandicapped}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Substance Abuse'),
                                bind : {
                                    value : '{person.isSubstanceAbuse}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n._('Last Military Separation'),
                                bind : {
                                    value : '{person.lastMilitarySeparation}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Former Name'),
                                bind : {
                                    value : '{person.formerName}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n._('Date of Death'),
                                bind : {
                                    value : '{person.dateOfDeath}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.DISABILITY,
                                fieldLabel : i18n._('Disability'),
                                bind : {
                                    value : '{person.disabilityCd}'
                                },
                                allowBlank : true,
                                editable : false
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_customfields_container',
                reference : 'customfieldsAddlDemographics',
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_ADDL_DEMOGRAPHICS
            }
        ]
    };

});
