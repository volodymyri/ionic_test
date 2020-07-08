Ext.define('ess.view.personalInformation.BasicDemographics', function() {

    return {
        alias : 'widget.ess_modern_personal_information_basic_demographics',

        extend : 'Ext.form.Panel',

        requires : [
            'criterion.ux.field.SSN'
        ],

        title : 'Demographics',

        viewModel : {
            data : {
                readOnly : true,
                editMode : false
            },
            formulas : {
                isPendingWorkflow : function(vmget) {
                    var person = vmget('person'),
                        workflowLog;

                    if (person && Ext.isFunction(person.getWorkflowLog)) {
                        workflowLog = person.getWorkflowLog();

                        if (workflowLog && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], workflowLog.get('stateCode'))) {
                            return true;
                        }
                    }

                    return false;
                },
                updateIconCls : function(vmget) {
                    return vmget('isPendingWorkflow') ? 'md-icon-block' : 'md-icon-mode-edit';
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
                title : 'Demographics',

                buttons : [
                    {
                        type : 'back',
                        handler : function() {
                            this.up('ess_modern_personal_information_basic_demographics').fireEvent('pageBack');
                        },
                        bind : {
                            hidden : '{editMode}'
                        }
                    },
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-clear',
                        bind : {
                            hidden : '{!editMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_personal_information_basic_demographics').fireEvent('personCancel');
                            }
                        }
                    }
                ],
                actions : [
                    {
                        xtype : 'button',
                        iconCls : 'md-icon-done',
                        bind : {
                            hidden : '{!editMode}'
                        },
                        listeners : {
                            tap : function() {
                                this.up('ess_modern_personal_information_basic_demographics').fireEvent('personSave');
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        bind : {
                            hidden : '{editMode}',
                            iconCls : '{updateIconCls}'
                        },
                        listeners : {
                            tap : function() {
                                var view = this.up('ess_modern_personal_information_basic_demographics'),
                                    vm = view.getViewModel();

                                if (!vm.get('isPendingWorkflow')) {
                                    vm.set({
                                        editMode : true,
                                        readOnly : false
                                    });
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.SALUTATION,
                label : i18n.gettext('Prefix'),
                bind : {
                    value : '{person.prefixCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('First Name'),
                required : true,
                bind : {
                    value : '{person.firstName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Middle Name'),
                bind : {
                    value : '{person.middleName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Last Name'),
                required : true,
                bind : {
                    value : '{person.lastName}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.GENERATION,
                label : i18n.gettext('Suffix'),
                bind : {
                    value : '{person.suffixCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Nickname'),
                bind : {
                    value : '{person.nickName}',
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
                bind : {
                    value : '{person.dateOfBirth}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.GENDER,
                label : i18n.gettext('Gender'),
                bind : {
                    value : '{person.genderCd}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.MARITAL_STATUS,
                label : i18n.gettext('Marital Status'),
                bind : {
                    value : '{person.maritalStatusCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.COUNTRY,
                label : i18n.gettext('Citizenship'),
                bind : {
                    value : '{person.citizenshipCountryCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            {
                xtype : 'criterion_code_detail_select',
                codeDataId : criterion.consts.Dict.ETHNICITY,
                label : i18n.gettext('Ethnicity'),
                bind : {
                    value : '{person.ethnicityCd}',
                    readOnly : '{readOnly}'
                },
                allowBlank : true
            },
            // view only
            {
                xtype : 'criterion_field_ssn',
                label : i18n.gettext('Social Security Number'),
                readOnly : true,
                bind : {
                    value : '{person.nationalIdentifier}',
                    hidden : '{!readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Social Security Number'),
                hidden : true,
                bind : {
                    value : '{person.nationalIdentifier}',
                    hidden : '{readOnly}'
                },
                reference : 'nationalIdentifier'
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Work Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                bind : {
                    value : '{person.workPhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Home Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                bind : {
                    value : '{person.homePhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Mobile Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                bind : {
                    value : '{person.mobilePhone}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Additional Phone'),
                allowBlank : true,
                vtype : 'phone',
                emptyText : '+X-XXX-XXX-XXXX',
                bind : {
                    value : '{person.additionalPhoneNumber}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Email'),
                vtype : 'email',
                allowBlank : false,
                required : true,
                bind : {
                    value : '{person.email}',
                    readOnly : '{readOnly}'
                },
                reference : 'email'
            },
            {
                xtype : 'textfield',
                label : i18n.gettext('Personal Email'),
                vtype : 'email',
                allowBlank : true,
                bind : {
                    value : '{person.personalEmail}',
                    readOnly : '{readOnly}'
                }
            },
            {
                xtype : 'container',
                reference : 'customFieldsContainerModern'
            },
            {
                xtype : 'container',
                cls : 'criterion-pending-changes-info',
                docked : 'bottom',
                bind : {
                    hidden : '{navMode}'
                },
                items : [
                    {
                        xtype : 'component',
                        margin : '10 20',
                        html : '<span>Highlighted</span> fields were recently changed and being reviewed.',
                        bind : {
                            hidden : '{!isPendingWorkflow}'
                        }
                    }
                ]
            }
        ]

    };

});
