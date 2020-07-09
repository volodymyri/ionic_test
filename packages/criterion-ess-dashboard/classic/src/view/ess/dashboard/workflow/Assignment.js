Ext.define('criterion.view.ess.dashboard.workflow.Assignment', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_selfservice_workflow_assignment',

        extend : 'Ext.panel.Panel',

        requires : [
            'criterion.store.employer.WorkPeriods',
            'criterion.ux.form.HighPrecisionField',
            'criterion.view.positions.PositionReporting',
            'criterion.view.CustomFieldsContainer',
            'criterion.store.employer.CertifiedRates'
        ],

        viewModel : {
            data : {
                expirationDateFieldTitle : i18n.gettext('Expiration Date')
            },
            stores : {
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                certifiedRates : {
                    type : 'employer_certified_rates'
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        padding : 10,

        items : [
            {
                xtype : 'container',

                layout : 'hbox',

                defaultType : 'container',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true,
                        hidden : true
                    }
                }),

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        reference : 'leftContainer',
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'assignmentActionCd',
                                codeDataId : DICT.ASSIGNMENT_ACTION,
                                fieldLabel : i18n.gettext('Action'),
                                securityAccessToken : 'assignment_detail.assignment_action_cd'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'terminationCd',
                                codeDataId : DICT.TERMINATION,
                                fieldLabel : i18n.gettext('Termination Reason')
                            },
                            {
                                xtype : 'textfield',
                                name : 'positionTitle',
                                fieldLabel : i18n.gettext('Position')
                            },
                            {
                                xtype : 'textfield',
                                name : 'title',
                                fieldLabel : i18n.gettext('Title')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'departmentCd',
                                codeDataId : DICT.DEPARTMENT,
                                fieldLabel : i18n.gettext('Department')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'costCenterCd',
                                codeDataId : DICT.COST_CENTER,
                                fieldLabel : i18n.gettext('Cost Center')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Division'),
                                codeDataId : DICT.DIVISION,
                                name : 'divisionCd'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Section'),
                                codeDataId : DICT.SECTION,
                                name : 'sectionCd'
                            },
                            {
                                xtype : 'criterion_form_high_precision_field',
                                namePrecision : 'amountPrecision',
                                name : 'fullTimeEquivalency',
                                fieldLabel : i18n.gettext('Full Time Equivalency')
                            },
                            {
                                xtype : 'textfield',
                                name : 'salaryGradeName',
                                fieldLabel : i18n.gettext('Salary Grade')
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'payRate',
                                fieldLabel : i18n.gettext('Pay Rate'),
                                isRatePrecision : true,
                                securityAccessToken : 'assignment_detail.pay_rate'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'rateUnitCd',
                                codeDataId : DICT.RATE_UNIT,
                                fieldLabel : i18n.gettext('Pay Rate Unit')
                            },
                            {
                                xtype : 'numberfield',
                                name : 'averageHours',
                                fieldLabel : i18n.gettext('Hours per Day')
                            },
                            {
                                xtype : 'numberfield',
                                name : 'averageDays',
                                fieldLabel : i18n.gettext('Days per Week')
                            },
                            {
                                xtype : 'numberfield',
                                name : 'averageWeeks',
                                fieldLabel : i18n.gettext('Weeks per Year')
                            }
                        ]
                    },
                    {
                        reference : 'rightContainer',
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'effectiveDate',
                                fieldLabel : i18n.gettext('Effective Date')
                            },
                            {
                                xtype : 'datefield',
                                name : 'expirationDate',
                                fieldLabel : i18n.gettext('Expiration Date'),
                                altFormats : criterion.consts.Api.DATE_FORMAT,
                                bind : {
                                    fieldLabel : '{expirationDateFieldTitle}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isExempt',
                                fieldLabel : i18n.gettext('Exempt')
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isSalary',
                                fieldLabel : i18n.gettext('Salary')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'positionTypeCd',
                                codeDataId : DICT.POSITION_TYPE,
                                fieldLabel : i18n.gettext('Type')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'eeocCd',
                                codeDataId : DICT.EEOC,
                                fieldLabel : i18n.gettext('EEO Category')
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Work Period'),
                                name : 'workPeriodId',
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                bind : {
                                    store : '{employerWorkPeriods}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'categoryCd',
                                codeDataId : DICT.POSITION_CATEGORY,
                                fieldLabel : i18n.gettext('Category')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'workersCompensationCd',
                                codeDataId : DICT.WORKERS_COMPENSATION,
                                fieldLabel : i18n.gettext('Workers Compensation')
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Certified Rate'),
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                bind : {
                                    store : '{certifiedRates}'
                                },
                                name : 'certifiedRateId'
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isHighSalary',
                                fieldLabel : i18n.gettext('HCE'),
                                securityAccessToken : 'assignment_detail.is_high_salary'
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isSeasonal',
                                fieldLabel : i18n.gettext('Seasonal')
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isOfficer',
                                fieldLabel : i18n.gettext('Officer')
                            },
                            {
                                xtype : 'toggleslidefield',
                                name : 'isManager',
                                fieldLabel : i18n.gettext('Manager')
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                name : 'officerCodeCd',
                                codeDataId : DICT.OFFICER_CODE,
                                fieldLabel : i18n.gettext('Officer Code')
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_positions_position_reporting',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                hidden : true,
                displayOnly : true,
                responsive : false
            },
            {
                xtype : 'criterion_customfields_container',
                reference : 'customFields',
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                disabled : true
            }
        ],

        load : function(requestData, actualData, delegatedByEmployeeId) {
            let me = this,
                vm = this.getViewModel(),
                flatRequestData = Ext.Object.merge(requestData, requestData['assignmentDetails'] ? requestData['assignmentDetails'][0] : {}),
                activeDetail = actualData && actualData['assignmentDetails'] && Ext.Array.findBy(actualData['assignmentDetails'], function(detail) {
                    return detail.isActive;
                }),
                flatActualData = Ext.Object.merge(actualData, activeDetail || {});

            delete flatRequestData['assignmentDetails'];
            delete flatActualData['assignmentDetails'];

            Ext.Deferred.all([
                vm.getStore('employerWorkPeriods').loadWithPromise({
                    params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                }),
                criterion.Api.hasCertifiedRate() ? vm.getStore('certifiedRates').loadWithPromise() : null
            ]).then(function() {
                let requestKeys = Ext.Object.getKeys(flatRequestData),
                    customFields = me.down('[reference=customFields]'),

                    processFields = function(field) {
                        let fieldName = field.getName(),
                            shouldShowField =
                                Ext.Array.contains(requestKeys, fieldName) &&
                                flatActualData[fieldName] !== flatRequestData[fieldName];

                        if (fieldName === 'terminationCd') {
                            if (flatRequestData[fieldName]) {
                                shouldShowField = true;

                                vm.set('expirationDateFieldTitle', i18n.gettext('Termination Date'));
                            } else {
                                vm.set('expirationDateFieldTitle', i18n.gettext('Expiration Date'));
                            }
                        }

                        if (fieldName === 'effectiveDate') {
                            flatRequestData[fieldName] = Ext.Date.parse(flatRequestData[fieldName], criterion.consts.Api.DATE_FORMAT);
                        }

                        if (shouldShowField) {
                            field.setVisible(true);
                            field.setValue(flatRequestData[fieldName]);
                        } else {
                            field.setVisible(false);
                        }
                    };

                // form
                me.down('[reference=leftContainer]').items.each(processFields);
                me.down('[reference=rightContainer]').items.each(processFields);

                // custom fields
                if (Ext.Array.intersect(requestKeys, ['customValues', 'removedCustomValues']).length) {
                    let customValues = flatRequestData['customValues'] || [],
                        removedCustomValues = flatRequestData['removedCustomValues'] || [];

                    Ext.Array.each(removedCustomValues, function(cValue) {
                        cValue['value'] = null;
                    });

                    customFields.getController().loadChanges(Ext.Array.merge(customValues, removedCustomValues), true, delegatedByEmployeeId);
                    customFields.show();
                } else {
                    customFields.hide();
                }

                // relationships
                let reportingCmp = me.down('criterion_positions_position_reporting');

                let rKeys = Ext.Array.intersect(requestKeys, ['wf1EmployeeName', 'wf2EmployeeName', 'wf3EmployeeName', 'wf4EmployeeName']);

                if (rKeys.length) {
                    reportingCmp.show();
                    reportingCmp.init().then(function() {
                        reportingCmp.setReportingData(flatRequestData);
                    });
                } else {
                    reportingCmp.hide();
                }
            });
        }
    };
});
