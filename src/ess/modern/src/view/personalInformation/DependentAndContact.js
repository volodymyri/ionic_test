Ext.define('ess.view.personalInformation.DependentAndContact', function() {

    const WORKFLOW_REQUEST_TYPE = criterion.Consts.WORKFLOW_REQUEST_TYPE,
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES,
        DICT = criterion.consts.Dict;

    return {

        alias : 'widget.ess_modern_personal_information_dependent_and_contact',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.ux.field.SSN',
            'ess.controller.personalInformation.DependentAndContact'
        ],

        title : i18n.gettext('Contact'),

        controller : {
            type : 'ess_modern_personal_information_dependent_and_contact'
        },

        viewModel : {
            data : {
                /**
                 * @link {criterion.model.person.Contact}
                 */
                record : null
            },
            formulas : {
                isPendingWorkflow : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        let wf = record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                            stateCode = wf ? wf.get('stateCode') : null;

                        return stateCode && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], stateCode);
                    }
                },

                readOnly : function(get) {
                    return get('isPendingWorkflow');
                },
                hideDelete : function(get) {
                    return get('isPhantom') || get('isPendingWorkflow');
                },
                workflowMessage : function(get) {
                    let record = get('record'),
                        workflowLog = record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                        message;

                    if (workflowLog && workflowLog.get('requestType') === WORKFLOW_REQUEST_TYPE.DELETE) {
                        message = i18n.gettext('Record has been recently removed and is pending approval.');
                    } else {
                        message = Ext.util.Format.format(i18n.gettext('<{0}>Highlighted</{0}> fields were recently changed and being reviewed.'), 'span');
                    }

                    return message;
                }
            }
        },

        defaults : {
            labelWidth : 150
        },

        items : [
            {
                xtype : 'ess_modern_menubar',
                docked : 'top',
                title : i18n.gettext('Dependent and Contact'),

                buttons : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-clear',
                        listeners : {
                            tap : 'handleCancel'
                        }
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-done',
                        hidden : true,
                        bind : {
                            hidden : '{isPendingWorkflow}'
                        },
                        listeners : {
                            tap : 'handleSubmit'
                        }
                    }
                ]
            },
            {
                xtype : 'component',
                hidden : true,
                docked : 'top',
                bind : {
                    hidden : '{isPhantom}',
                    html : '{record.status}',
                    cls : 'panel-of-workflow-status {record.statusCode}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.RELATIONSHIP_TYPE,
                label : i18n.gettext('Relationship'),
                name : 'relationshipTypeCd',
                bind : {
                    value : '{record.relationshipTypeCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : false,
                required : true,
                listeners : {
                    change : 'handleChangeRelationshipType'
                }
            },
            {
                xtype : 'togglefield',
                reference : 'isDependentField',
                label : i18n.gettext('Dependent'),
                name : 'isDependent',
                bind : {
                    value : '{record.isDependent}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'togglefield',
                reference : 'isEmergencyField',
                label : i18n.gettext('Emergency'),
                name : 'isEmergency',
                bind : {
                    value : '{record.isEmergency}',
                    readOnly : '{readOnly}'
                },
                listeners : {
                    change : 'handleChangeEmergency'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.SALUTATION,
                label : i18n.gettext('Prefix'),
                name : 'prefixCd',
                bind : {
                    value : '{record.prefixCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('First Name'),
                name : 'firstName',
                required : true,
                bind : {
                    value : '{record.firstName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Middle Name'),
                name : 'middleName',
                bind : {
                    value : '{record.middleName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Last Name'),
                name : 'lastName',
                required : true,
                bind : {
                    value : '{record.lastName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.GENERATION,
                label : i18n.gettext('Suffix'),
                name : 'suffixCd',
                bind : {
                    value : '{record.suffixCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Nickname'),
                name : 'nickName',
                bind : {
                    value : '{record.nickName}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'datepickerfield',
                edgePicker : {
                    yearFrom : new Date().getFullYear() - 100
                },
                label : i18n.gettext('Date of Birth'),
                name : 'dateOfBirth',
                bind : {
                    value : '{record.dateOfBirth}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.GENDER,
                label : i18n.gettext('Gender'),
                name : 'genderCd',
                required : true,
                bind : {
                    value : '{record.genderCd}',
                    readOnly : '{readOnly}'
                }
            },
            // view only
            {
                xtype : 'criterion_field_ssn',
                label : i18n.gettext('Social Security Number'),
                readOnly : true,
                name : 'nationalIdentifier_',
                bind : {
                    value : '{record.nationalIdentifier}',
                    hidden : '{!readOnly}'
                }
            },
            {
                xtype : 'criterion_field_format',
                fieldType : criterion.Consts.FIELD_FORMAT_TYPE.SSN,
                label : i18n.gettext('Social Security Number'),
                hidden : true,
                name : 'nationalIdentifier',
                bind : {
                    value : '{record.nationalIdentifier}',
                    countryCd : '{record.countryCd}',
                    hidden : '{readOnly}'
                },
                reference : 'nationalIdentifier'
            },

            {
                xtype : 'togglefield',
                label : i18n.gettext('Tobacco User'),
                name : 'isTobaccoUser',
                bind : {
                    value : '{record.isTobaccoUser}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('Handicapped'),
                name : 'isHandicapped',
                bind : {
                    value : '{record.isHandicapped}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'togglefield',
                label : i18n.gettext('Substance Abuse'),
                name : 'isSubstanceAbuse',
                bind : {
                    value : '{record.isSubstanceAbuse}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.STUDENT_STATUS,
                label : i18n.gettext('Student Status'),
                name : 'studentStatusCd',
                bind : {
                    value : '{record.studentStatusCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('School Name'),
                name : 'schoolName',
                bind : {
                    value : '{record.schoolName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'datepickerfield',
                label : i18n.gettext('Education End Date'),
                name : 'educationEndDate',
                bind : {
                    value : '{record.educationEndDate}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.DISABILITY,
                label : i18n.gettext('Disability'),
                name : 'disabilityCd',
                bind : {
                    value : '{record.disabilityCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Work Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                name : 'workPhone',
                bind : {
                    value : '{record.workPhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Home Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                name : 'homePhone',
                bind : {
                    value : '{record.homePhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Mobile Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                name : 'mobilePhone',
                bind : {
                    value : '{record.mobilePhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Email'),
                vtype : 'email',
                allowBlank : false,
                name : 'email',
                bind : {
                    value : '{record.email}',
                    readOnly : '{readOnly}'
                },
                reference : 'email'
            },

            {
                xtype : 'component',
                html : '<span class="bold uppercase">Address</span>',
                margin : '20 0'
            },

            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.COUNTRY,
                label : i18n.gettext('Country'),
                name : 'countryCd',
                bind : {
                    value : '{record.countryCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true,
                listeners: {
                    change : 'handleChangeCountryChangeStates'
                }
            },
            {
                xtype : 'textareafield',
                label : i18n.gettext('Address 1'),
                name : 'address1',
                bind : {
                    value : '{record.address1}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textareafield',
                label : i18n.gettext('Address 2'),
                name : 'address2',
                bind : {
                    value : '{record.address2}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Postal Code'),
                name : 'postalCode',
                bind : {
                    value : '{record.postalCode}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('City'),
                name : 'city',
                bind : {
                    value : '{record.city}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : DICT.STATE,
                label : i18n.gettext('State'),
                name : 'stateCd',
                bind : {
                    value : '{record.stateCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true,
                reference : 'statesField'
            },

            {
                xtype : 'component',
                html : '<span class="bold uppercase">Custom Fields</span>',
                margin : '20 0'
            },

            {
                xtype : 'formpanel',
                reference : 'customFieldsContainer',
                padding : 0
            },

            // button
            {
                xtype : 'container',
                layout : 'hbox',

                margin : '20 0 20 0',
                items : [
                    {
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        text : 'Delete',
                        cls : 'btn-delete',
                        width : 100,
                        bind : {
                            hidden : '{hideDelete}'
                        },
                        handler : 'handleDelete'
                    }
                ]
            },

            {
                xtype : 'container',
                cls : 'criterion-pending-changes-info',
                docked : 'bottom',
                hidden : true,
                bind : {
                    hidden : '{!isPendingWorkflow}'
                },
                items : [
                    {
                        xtype : 'component',
                        margin : '15 20 10',
                        bind : {
                            html : '{workflowMessage}'
                        }
                    }
                ]
            }
        ],

        setCustomFields : function(customFields, customFieldValues) {
            return this.getController().setCustomFields(customFields, customFieldValues);
        }

    };
});
