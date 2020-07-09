Ext.define('criterion.view.person.PriorEmployment', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_person_prioremployment',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.PriorEmployment'
        ],

        controller : 'criterion_person_prioremployment',

        title : i18n.gettext('Prior Employment'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultType : 'container',

        bodyPadding : '0 10',

        defaults : {
            xtype : 'criterion_panel',
            layout : 'hbox',

            plugins : [
                'criterion_responsive_column'
            ],

            bodyPadding : '10 0 0',

            border : true,
            bodyStyle : {
                'border-width' : '0 0 1px 0 !important'
            },

            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER
        },

        viewModel : {
            formulas : {
                phoneFormatParams : function(get) {
                    var countryCd = get('record.countryCd'),
                        country = countryCd && criterion.CodeDataManager.getCodeDetailRecord('id', countryCd, DICT.COUNTRY);

                    return (country) ? {
                        countryCode : country && country.get('attribute1')
                    } : null;
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIOR_EMPLOYMENT, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIOR_EMPLOYMENT, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Company'),
                                name : 'company'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Title'),
                                name : 'title'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Supervisor'),
                                name : 'supervisor'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Permission to Contact'),
                                name : 'permissionToContact'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Start Date'),
                                vtype : 'daterange',
                                endDateField : 'endDate',
                                name : 'startDate',
                                bind : {
                                    value : '{record.startDate}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('End Date'),
                                vtype : 'daterange',
                                startDateField : 'startDate',
                                name : 'endDate',
                                bind : '{record.endDate}'
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Starting Salary'),
                                layout : 'hbox',

                                defaults : {
                                    flex : 1
                                },

                                items : [
                                    {
                                        xtype : 'criterion_currencyfield',
                                        name : 'startingSalary',
                                        padding : '0 10 0 0',
                                        minValue : 0
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        name : 'startingSalaryRateUnitCd',
                                        codeDataId : DICT.RATE_UNIT
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Ending Salary'),
                                layout : 'hbox',

                                defaults : {
                                    flex : 1
                                },

                                items : [
                                    {
                                        xtype : 'criterion_currencyfield',
                                        name : 'endingSalary',
                                        padding : '0 10 0 0',
                                        minValue : 0
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        name : 'endingSalaryRateUnitCd',
                                        codeDataId : DICT.RATE_UNIT
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_htmleditor',
                                reference : 'description',
                                enableAlignments : false,
                                enableLists : false,
                                enableExtListMenu : true,
                                fieldLabel : i18n.gettext('Description'),
                                name : 'description',
                                bind : {
                                    value : '{record.description}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textareafield',
                                fieldLabel : i18n.gettext('Reason for Leaving'),
                                name : 'reasonForLeaving',
                                maxLength : 300
                            }
                        ]
                    }
                ]
            },
            {
                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 1'),
                                name : 'address1'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Address 2'),
                                name : 'address2'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('City'),
                                name : 'city'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('State'),
                                name : 'stateCd',
                                codeDataId : DICT.STATE,
                                bind : {
                                    filterValues : {
                                        attribute : 'attribute1',
                                        value : '{countryCDField.selection.code}'
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Country'),
                                reference : 'countryCDField',
                                name : 'countryCd',
                                codeDataId : DICT.COUNTRY,
                                bind : '{record.countryCd}'
                            },
                            {
                                xtype : 'criterion_person_phone_number',
                                reference : 'phoneField',
                                fieldLabel : i18n.gettext('Phone'),
                                staticToken : 'person_prior_employment.phone',
                                bind : {
                                    rawNumber : '{record.phone}',
                                    displayNumber : '{record.phoneInternational}',
                                    formatParams : '{phoneFormatParams}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                bodyStyle : {
                    'border-width' : '0 !important'
                },

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Website'),
                                name : 'website'
                            }
                        ]
                    },
                    {
                        items : []
                    }
                ]
            }
        ]
    };
});
