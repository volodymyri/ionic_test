Ext.define('criterion.view.ess.dashboard.workflow.Position', function() {

    var WORKFLOW_REQUEST_TYPE = criterion.Consts.WORKFLOW_REQUEST_TYPE;

    return {
        alias : 'widget.criterion_selfservice_workflow_position',

        extend : 'Ext.panel.Panel',

        requires : [
            'criterion.view.ess.dashboard.workflow.CustomFields',
            'criterion.view.ess.dashboard.workflow.position.Details',
            'criterion.view.ess.dashboard.workflow.position.Wage',
            'criterion.view.ess.dashboard.workflow.position.Classification',
            'criterion.view.ess.dashboard.workflow.position.Recruiting',
            'criterion.view.ess.dashboard.workflow.position.Skills',
            'criterion.store.Skills',
            'criterion.store.employer.position.Skills',
            'criterion.store.employer.WorkPeriods',
            'criterion.store.employer.WorkersCompensations'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            hidden : true
        },

        padding : 10,

        referenceHolder : true,

        viewModel : {
            data : {
                hideActualData : true,
                hideRequestData : true,
                titleActualData : i18n.gettext('Old position'),
                titleRequestData : i18n.gettext('New position')
            },
            stores : {
                skills : {
                    type : 'criterion_skills'
                },
                positionSkills : {
                    type : 'employer_position_skills'
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                workersCompensations : {
                    type : 'criterion_employer_worker_compensations'
                }
            }
        },

        items : [
            {
                xtype : 'container',
                layout : 'hbox',
                defaultType : 'panel',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : false,
                reference : 'containerHeaders',

                items : [
                    {
                        header : {
                            bind : {
                                title : '<span class="bold">{titleActualData}</span>'
                            }
                        },
                        items : [],
                        bind : {
                            hidden : '{hideActualData}'
                        }
                    },
                    {
                        header : {
                            bind : {
                                title : '<span class="bold">{titleRequestData}</span>'
                            }
                        },
                        items : [],
                        bind : {
                            hidden : '{hideRequestData}'
                        }
                    }
                ]
            },
            // Position details (main)
            {
                xtype : 'panel',

                reference : 'panelPosition',

                header : {
                    title : i18n.gettext('Position details')
                },

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaultType : 'container',
                    defaults : {
                        readOnly : true,
                        hidden : true
                    }
                }),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_position_details',
                        reference : 'actualPosition',
                        bind : {
                            hidden : '{hideActualData}'
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_position_details',
                        reference : 'requestPosition',
                        bind : {
                            hidden : '{hideRequestData}'
                        }
                    }
                ]
            },
            // Wage information
            {
                xtype : 'panel',

                reference : 'panelWage',

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true,
                        hidden : true
                    }
                }),

                title : i18n.gettext('Wage Information'),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_position_wage',
                        reference : 'actualWage',
                        bind : {
                            hidden : '{hideActualData}'
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_position_wage',
                        reference : 'requestWage',
                        bind : {
                            hidden : '{hideRequestData}'
                        }
                    }
                ]
            },
            // Custom Fields
            {
                xtype : 'panel',

                reference : 'panelCustomFields',

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true
                    }
                }),

                title : i18n.gettext('Custom Fields'),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_custom_fields',
                        reference : 'actualCustomFieldsForm',
                        bind : {
                            hidden : '{hideActualData}'
                        },
                        header : {
                            title : null,
                            hidden : true
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_custom_fields',
                        bind : {
                            hidden : '{hideRequestData}'
                        },
                        reference : 'requestCustomFieldsForm',
                        header : {
                            title : null,
                            hidden : true
                        }
                    }
                ]
            },
            // Classification
            {
                xtype : 'panel',

                reference : 'panelClassification',

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true,
                        hidden : true
                    }
                }),

                title : i18n.gettext('Classification'),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_position_classification',
                        reference : 'actualClassification',
                        bind : {
                            hidden : '{hideActualData}'
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_position_classification',
                        reference : 'requestClassification',
                        bind : {
                            hidden : '{hideRequestData}'
                        }
                    }
                ]
            },
            // Recruiting
            {
                xtype : 'panel',

                reference : 'panelRecruiting',

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true,
                        disabled : true,
                        hidden : true
                    }
                }),

                title : i18n.gettext('Recruiting'),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_position_recruiting',
                        reference : 'actualRecruiting',
                        bind : {
                            hidden : '{hideActualData}'
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_position_recruiting',
                        reference : 'requestRecruiting',
                        bind : {
                            hidden : '{hideRequestData}'
                        }
                    }
                ]
            },
            // Position Skills
            {
                xtype : 'panel',

                reference : 'panelSkills',

                layout : 'hbox',

                defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER, {
                    defaults : {
                        readOnly : true
                    }
                }),

                title : i18n.gettext('Skills'),

                items : [
                    {
                        xtype : 'criterion_selfservice_workflow_position_skills',
                        bind : {
                            hidden : '{hideActualData}'
                        },
                        reference : 'skillsFormActual',
                        header : {
                            title : null,
                            hidden : true
                        }
                    },
                    {
                        xtype : 'criterion_selfservice_workflow_position_skills',
                        bind : {
                            hidden : '{hideRequestData}'
                        },
                        reference : 'skillsFormRequest',
                        header : {
                            title : null,
                            hidden : true
                        }
                    }
                ]
            }
        ],

        load : function(requestData, actualData, workflowRequestType, delegatedByEmployeeId) {
            var vm = this.getViewModel(),
                skills = vm.getStore('skills'),
                me = this,
                requestKeys = Ext.Object.getKeys(requestData),
                fieldContainersSuffixes = ['Position', 'Wage', 'Classification', 'Recruiting'];

            switch (workflowRequestType) {
                case WORKFLOW_REQUEST_TYPE.CREATE:
                    // For new positions, show all fields
                    vm.set('hideActualData', true);
                    vm.set('hideRequestData', false);
                    this.lookup('containerHeaders').hide();
                    break;
                case WORKFLOW_REQUEST_TYPE.UPDATE:
                case WORKFLOW_REQUEST_TYPE.SUBMIT:
                    // For changed positions, show the fields that changed (old and new values)
                    vm.set('hideActualData', false);
                    vm.set('hideRequestData', false);
                    this.lookup('containerHeaders').show();
                    break;
                case WORKFLOW_REQUEST_TYPE.DELETE:
                    // For deleted positions, don't show any fields
                    this.hide();

                    // It isn't necessary to process anything more
                    return;
                default:
                    this.hide();
                    return;
            }

            this.show();

            var processFields = function(field, parentPanelName, showActual) {

                if (!Ext.isFunction(field.getName)) {
                    return;
                }

                var fieldName = field.getName(),
                    dataToShow = showActual ? actualData : requestData,
                    shouldShowField,
                    fieldValue,
                    fieldLabel,
                    employerWorkPeriods = vm.getStore('employerWorkPeriods'),
                    workersCompensations = vm.getStore('workersCompensations'),
                    promises = [],
                    dfd = Ext.create('Ext.Deferred'),
                    setFieldValueWithPromise = function(value) {
                        fieldValue = value;

                        return dfd.resolve();
                    };

                switch (workflowRequestType) {
                    case WORKFLOW_REQUEST_TYPE.CREATE:
                        // For new positions, show all fields
                        shouldShowField = true;
                        break;
                    case WORKFLOW_REQUEST_TYPE.UPDATE:
                    case WORKFLOW_REQUEST_TYPE.SUBMIT:
                        // For changed positions, show the fields that changed (old and new values)
                        shouldShowField = Ext.Array.contains(requestKeys, fieldName) && actualData[fieldName] != requestData[fieldName];
                        break;
                    default:
                        shouldShowField = false;
                }

                if (fieldName === 'payRate') {
                    var employerId = dataToShow['employerId'] ? dataToShow['employerId'] : actualData['employerId'],
                        employer = Ext.getStore('Employers').getById(employerId),
                        employerConfig = employer && employer.getData();

                    field.currencySymbol = employerConfig['currencySign'] || '$';
                    field.thousandSeparator = employerConfig['thousandSeparator'] || ',';
                    field.decimalSeparator = employerConfig['decimalSeparator'] || '.';
                    field.decimalPrecision = employerConfig['ratePrecision'] || 0;
                    field.currencySymbolPos = (employerConfig['currencyAtEnd'] || false) ? 'right' : 'left';

                    field.focus();
                } else if (fieldName === 'salaryGroupCd' && (requestData['minSalaryGroupCd'] || requestData['maxSalaryGroupCd'])) {
                    shouldShowField = true;
                }

                if (shouldShowField) {
                    if (fieldName === 'jobDescription' && dataToShow['jobCode']) {
                        promises.push(function() {
                            return setFieldValueWithPromise(Ext.util.Format.format('{0} / {1}', dataToShow['jobCode'] || '-', dataToShow['jobDescription'] || '-'))
                        });
                    } else if (fieldName === 'salaryGroupCd') {
                        promises.push(function() {
                            return setFieldValueWithPromise(dataToShow['minSalaryGroupCd'] || dataToShow['maxSalaryGroupCd'])
                        });
                    } else if (fieldName === 'workPeriod') {
                        if (!employerWorkPeriods._markLoading) {
                            employerWorkPeriods._markLoading = true;
                            promises.push(function() {
                                return employerWorkPeriods.loadWithPromise({
                                    params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                                }).then(function() {
                                    employerWorkPeriods._markLoading = false;
                                });
                            });
                        }
                        promises.push(function() {
                            var workPeriods = employerWorkPeriods && employerWorkPeriods.getById(dataToShow['workPeriodId']);

                            return setFieldValueWithPromise(workPeriods && workPeriods.get('name'));
                        });
                    } else if (fieldName === 'workerCompensationId') {
                        if (!workersCompensations._markLoading) {
                            workersCompensations._markLoading = true;
                            promises.push(function() {
                                return workersCompensations.loadWithPromise({
                                    params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                                }).then(function() {
                                    workersCompensations._markLoading = false;
                                });
                            });
                        }

                        promises.push(function() {
                            var workersCompensation = workersCompensations && workersCompensations.getById(dataToShow['workerCompensationId']);

                            return setFieldValueWithPromise(workersCompensation && workersCompensation.get('description'));
                        });
                    } else if (/org[0-9]*PositionId/.test(fieldName)) {
                        var orgStructureAttr = /org([0-9]*)PositionId/.exec(fieldName)[1],
                            fieldNameWithoutId = fieldName.substring(0, fieldName.length - 2),
                            orgStructure;

                        orgStructure = criterion.CodeDataManager.getCodeDetailRecord('attribute1', orgStructureAttr, criterion.consts.Dict.ORG_STRUCTURE);

                        if (!orgStructure) {
                            return;
                        }

                        fieldLabel = orgStructure.get('description');

                        promises.push(function() {
                            return setFieldValueWithPromise(dataToShow[fieldNameWithoutId]);
                        });
                    } else {
                        promises.push(function() {
                            return setFieldValueWithPromise(dataToShow[fieldName])
                        });
                    }

                    Ext.Deferred.sequence(promises).then({
                        scope : this,
                        success : function() {
                            field.setValue(fieldValue);
                            fieldLabel && field.setFieldLabel(fieldLabel);
                            field.setVisible(true);
                            me.lookup(parentPanelName).show();
                        }
                    });

                } else {
                    field.setVisible(false);
                }
            };

            Ext.Array.each(fieldContainersSuffixes, function(suffix) {
                var parentPanelName = 'panel' + suffix;

                // hide each container, the decision to show it will be taken later (in the process function)
                me.lookup(parentPanelName).hide();

                // fill the container's form fields
                me.lookup('actual' + suffix).items.each(function(field) {
                    processFields(field, parentPanelName, true);
                });

                me.lookup('request' + suffix).items.each(function(field) {
                    processFields(field, parentPanelName, false);
                });
            });

            // fill custom fields
            if (Ext.Array.intersect(requestKeys, ['customValues', 'removedCustomValues']).length) {
                var customValuesActual = actualData['customValues'] ? Ext.clone(actualData['customValues']) : [],
                    customValuesRequest = requestData['customValues'] ? Ext.clone(requestData['customValues']) : [],
                    removedCustomValuesRequest = requestData['removedCustomValues'] ? Ext.clone(requestData['removedCustomValues']) : [],
                    removedCustomValuesActual = Ext.clone(removedCustomValuesRequest),
                    fakeCustomValuesActual = [],
                    keysCustomValuesActual = Ext.Object.getKeys(Ext.Array.toValueMap(customValuesActual, 'customFieldId')),
                    keysCustomValueRequest = Ext.Object.getKeys(Ext.Array.toValueMap(customValuesRequest, 'customFieldId')),
                    keysOfFieldsWithNewValues = Ext.Array.intersect(keysCustomValuesActual, keysCustomValueRequest),
                    keysOfFieldsWithChangedValues = Ext.Array.difference(keysCustomValueRequest, keysOfFieldsWithNewValues),
                    shouldShowCustomFields = false;

                switch (workflowRequestType) {
                    case WORKFLOW_REQUEST_TYPE.CREATE:
                        // For new positions, show all fields
                        shouldShowCustomFields = true;
                        break;

                    case WORKFLOW_REQUEST_TYPE.UPDATE:
                    case WORKFLOW_REQUEST_TYPE.SUBMIT:
                        // Instead of showing all actual custom fields, we prepare fake copies of actual fields
                        // according to https://perfecthr.atlassian.net/browse/CRITERION-8094
                        if (keysOfFieldsWithChangedValues.length > 0) {
                            // Create fake actual fields which hadn't value before editing from request fields
                            Ext.Array.each(keysOfFieldsWithChangedValues, function(key) {
                                fakeCustomValuesActual.push(Ext.Object.merge({}, Ext.Array.findBy(customValuesRequest, function(value) {
                                    return value.customFieldId == key;
                                })));
                            });

                            // ...and set their values to null.
                            Ext.Array.each(fakeCustomValuesActual, function(customField) {
                                customField.value = null;
                            });
                        }

                        if (keysOfFieldsWithNewValues.length > 0) {
                            // Create fake actual fields by copy values from actual fields which had value before editing
                            Ext.Array.each(keysOfFieldsWithNewValues, function(key) {
                                fakeCustomValuesActual.push(Ext.Object.merge({}, Ext.Array.findBy(customValuesActual, function(value) {
                                    return value.customFieldId == key;
                                })));
                            });
                        }

                        Ext.Array.each(removedCustomValuesRequest, function(cValue) {
                            cValue['value'] = null;
                        });

                        // For changed positions, show the fields that changed (old and new values)
                        shouldShowCustomFields = customValuesRequest.length > 0 || removedCustomValuesRequest.length > 0;
                        break;

                    default:
                        shouldShowCustomFields = false;
                }

                if (shouldShowCustomFields) {
                    criterion.CodeDataManager.loadIfEmpty(criterion.consts.Dict.DATA_TYPE).then(function() {
                        me.lookup('actualCustomFieldsForm').setCustomFieldsData(fakeCustomValuesActual, removedCustomValuesActual);
                        me.lookup('requestCustomFieldsForm').setCustomFieldsData(customValuesRequest, removedCustomValuesRequest);
                        me.lookup('panelCustomFields').show();
                    });
                }
            } else {
                this.lookup('panelCustomFields').hide();
            }

            // fill skills fields
            if (Ext.Array.contains(requestKeys, 'skills')) {
                var skillsActual = Ext.Array.clone(actualData['skills'] || []),
                    skillsRequestRaw = Ext.Array.clone(requestData['skills'] || []),
                    skillsRequest = [],
                    shouldShowSkills = false;

                switch (workflowRequestType) {
                    case WORKFLOW_REQUEST_TYPE.CREATE:
                        // For new positions, show all fields
                        shouldShowSkills = true;
                        break;
                    case WORKFLOW_REQUEST_TYPE.UPDATE:
                    case WORKFLOW_REQUEST_TYPE.SUBMIT:
                        // For changed positions, show the fields that changed (old and new values)
                        shouldShowSkills = skillsActual.length > 0 || skillsRequestRaw.length > 0;
                        break;
                    default:
                        shouldShowSkills = false;
                }

                if (shouldShowSkills) {
                    if (!skills._markLoading) {
                        skills._markLoading = true;
                        skills.loadWithPromise({
                            params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                        }).then(function() {
                            var skillsFormActual = me.lookup('skillsFormActual'),
                                skillsFormRequest = me.lookup('skillsFormRequest');

                            skills._markLoading = false;

                            skillsFormActual.setSkills(skills);
                            skillsFormActual.setSkillsData(skillsActual);

                            skillsRequest = Ext.Array.clone(skillsActual);

                            Ext.Array.each(skillsRequestRaw, function(skillRequestRaw) {
                                var skillOriginal = {},
                                    skillChanged = {},
                                    skillIndex;

                                if (!Ext.isDefined(skillRequestRaw.id)) {
                                    // new record
                                    skillsRequest.push(skillRequestRaw);
                                } else if (Ext.isDefined(skillRequestRaw['$delete'])) {
                                    // deleted record
                                    skillOriginal = Ext.Array.findBy(skillsActual, function(skillActual) {
                                        return (skillActual.id === skillRequestRaw.id);
                                    });

                                    if (skillOriginal) {
                                        skillsRequest = Ext.Array.remove(skillsRequest, skillOriginal)
                                    }
                                } else {
                                    // changed record
                                    skillOriginal = Ext.Array.findBy(skillsActual, function(skillActual) {
                                        return (skillActual.id === skillRequestRaw.id);
                                    });

                                    if (skillOriginal) {
                                        // Set new values to the object using this trick to avoid reference to original object.
                                        skillChanged = Ext.Object.merge(Ext.Object.merge({}, skillOriginal), skillRequestRaw);

                                        skillIndex = Ext.Array.indexOf(skillsRequest, skillOriginal);
                                        skillsRequest = Ext.Array.replace(skillsRequest, skillIndex, 1, [skillChanged]);
                                    }
                                }
                            });

                            skillsFormRequest.setSkills(skills);
                            skillsFormRequest.setSkillsData(skillsRequest);
                            me.lookup('panelSkills').show();
                        });
                    }
                }
            } else {
                this.lookup('panelSkills').hide();
            }
        }
    };
});
