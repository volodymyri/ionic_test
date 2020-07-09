Ext.define('criterion.view.employee.Wizard', function() {

    var inactiveText = Ext.String.format(' ({0})', i18n.gettext('Inactive'));

    return {

        alias : 'widget.criterion_employee_wizard',

        extend : 'criterion.ux.BreadcrumbPanel',

        requires : [
            'criterion.controller.employee.Wizard',
            'criterion.ux.StatusBreadcrumb',
            'criterion.ux.form.field.EmployerCombo',

            'criterion.view.employee.demographic.Basic',
            'criterion.view.employee.demographic.Address',
            'criterion.view.employee.wizard.Employment',
            'criterion.view.employee.wizard.Onboarding',

            'criterion.store.person.Addresses',
            'criterion.store.FieldFormatTypes',
            'criterion.store.Employees',

            'criterion.model.Person',
            'criterion.model.person.Address',

            'criterion.model.employee.Hire',
            'criterion.store.employer.Eligible',

            'criterion.Consts'
        ],

        controller : {
            type : 'criterion_employee_wizard'
        },

        viewModel : {
            data : {
                person : null,
                employee : null,
                address : null,
                employer : null,
                candidate : null,
                employersCount : null,
                minHireDate : null
            },
            stores : {
                eligibleEmployers : {
                    type : 'criterion_employer_eligible',
                    listeners : {
                        load : 'handleEligibleEmployersLoad'
                    }
                },
                addresses : {
                    type : 'criterion_person_addresses',
                    proxy : {
                        extraParams : {
                            isPrimary : 1
                        }
                    }
                },
                employees : {
                    type : 'criterion_employees',
                    autoSync : false
                }
            },
            formulas : {
                isEmployerComboHidden : {
                    bind : {
                        bindTo : {
                            employersCount : '{employersCount}',
                            activeViewIndex : '{activeViewIndex}'
                        },
                        deep : true
                    },
                    get : function(bind) {
                        var activeViewIndex = bind.activeViewIndex,
                            employersCount = bind.employersCount;

                        return !!(employersCount < 2 || activeViewIndex);
                    }
                },
                isEmployeePhantom : {
                    bind : {
                        bindTo : '{employee}',
                        deep : true
                    },
                    get : function(record) {
                        return record ? record.phantom : true
                    }
                }
            }
        },

        tbar : null,

        dockedItems : [
            {
                xtype : 'toolbar',

                dock : 'bottom',
                ui : 'footer',

                padding : '10 15',

                defaults : {
                    minWidth : criterion.Consts.UI_DEFAULTS.MIN_BUTTON_WIDTH,
                    padding : 10,
                    margin : '0 5'
                },

                items : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : 'onCancelClick'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Prev'),
                        cls : 'criterion-btn-light',
                        bind : {
                            hidden : '{!activeViewIndex}'
                        },
                        listeners : {
                            click : 'onPrevClick'
                        }
                    },
                    {
                        xtype : 'button',
                        itemId : 'btnNext',
                        text : i18n.gettext('Next'),
                        bind : {
                            hidden : '{isLastCard}'
                        },
                        listeners : {
                            click : 'onNextClick'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Save'),
                        itemId : 'btnSave',
                        bind : {
                            hidden : '{!isLastCard}'
                        },
                        listeners : {
                            click : 'onSaveClick'
                        }
                    }
                ]
            },
            {
                dock : 'top',

                xtype : 'criterion_status_breadcrumb',

                bind : {
                    data : {
                        statuses : '{states}',
                        activeIdx : '{activeViewIndex}'
                    }
                },

                width : '100%',

                margin : '0 0 3 0'
            },
            {
                dock : 'top',
                padding : '10 10 0 15',

                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Employer'),
                        listeners : {
                            change : 'onBarEmployerChange'
                        },
                        allowBlank : false,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH - 5,
                        bind : {
                            store : '{eligibleEmployers}',
                            hidden : '{isEmployerComboHidden}',
                            value : '{employee.employerId}',
                            selection : '{employer}'
                        },
                        tpl : [
                            '<ul class="x-list-plain"><tpl for=".">',
                            '<li role="option" class="x-boundlist-item">{legalName:htmlEncode}',
                            '<tpl if="!isActive">' + inactiveText + '</tpl></li>',
                            '</tpl></ul>'
                        ],
                        displayTpl : [
                            '<tpl for=".">',
                            '{legalName}',
                            '<tpl if="!isActive">' + inactiveText + '</tpl>',
                            '</tpl>'
                        ],
                        valueField : 'id',
                        displayField : 'legalName',
                        reference : 'barEmployerCombo',
                        queryMode : 'local',
                        forceSelection : true,
                        editable : true,
                        minChars : 1,
                        typeAhead : true,
                        typeAheadDelay : 50
                    }
                ]
            }
        ],

        items : [
            /*  D2-9943 This breadcrumb has activeViewIndex : 0 by default, so it try to select card 0,
             *  that lead to error during layout and also broke barEmployerCombo binding to model, so combo store is
             *  empty -> no change event fired -> model.assignmentDetail is not set -> we get error on
             *  assignmentDetail.getData() as described in the ticket
             *  createItems below anyway will remove all items and create new, but it happens later in rout handler
             *  so we initially need some foo panel just to avoid error, then it will be removed safely
             */
            {
                xtype : 'panel'
            }
        ],

        createItems : function() {
            this.removeAll();
            this.add([
                {
                    xtype : 'criterion_employee_demographic_basic',
                    reference : 'basicDemographics',
                    viewModel : {
                        data : {
                            customFields : false,
                            hideSSNValue : false,
                            hideCustomFieldContainer : false
                        }
                    }
                },
                {
                    xtype : 'criterion_employee_demographic_address',
                    reference : 'address'
                },
                {
                    xtype : 'criterion_employee_wizard_employment',
                    reference : 'employment'
                },
                {
                    xtype : 'criterion_employee_wizard_onboarding',
                    reference : 'onboarding'
                }
            ]);
            this.updateStates();
        }
    };
});
