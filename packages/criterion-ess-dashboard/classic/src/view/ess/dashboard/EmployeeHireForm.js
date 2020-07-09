Ext.define('criterion.view.ess.dashboard.EmployeeHireForm', function() {

    return {

        alias : 'widget.criterion_selfservice_dashboard_employee_hire_form',

        extend : 'criterion.ux.form.Panel',

        cls : 'criterion-ess-panel',

        requires : [
            'criterion.view.employee.demographic.Basic',
            'criterion.view.employee.demographic.Address',
            'criterion.view.employee.wizard.Employment',
            'criterion.view.employee.wizard.Onboarding',

            'criterion.model.Person',
            'criterion.model.person.Address',
            'criterion.model.Employee',
            'criterion.model.Employer',
            'criterion.model.assignment.Detail'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_employee_demographic_basic',
                reference : 'basicDemographics',
                viewModel : {
                    data : {
                        readOnly : true,
                        customFields : false,
                        hideSSNValue : false,
                        hideCustomFieldContainer : true
                    }
                }
            },
            {
                xtype : 'criterion_employee_demographic_address',
                header : {
                    title : i18n.gettext('Address'),
                    padding : '15 25 0'
                },
                style : {
                    'border-top' : '1px solid #f2f2f2 !important'
                },
                reference : 'address',
                viewModel : {
                    data : {
                        readOnly : true
                    }
                }
            },
            {
                xtype : 'criterion_employee_wizard_employment',
                header : {
                    title : i18n.gettext('Employment Information'),
                    padding : '15 25 0'
                },
                style : {
                    'border-top' : '1px solid #f2f2f2 !important'
                },
                reference : 'employment',
                viewModel : {
                    data : {
                        readOnly : true,
                        showCustomfields : false
                    }
                }
            },
            {
                xtype : 'criterion_employee_wizard_onboarding',
                header : {
                    title : i18n.gettext('Onboarding'),
                    padding : '15 25 0'
                },
                style : {
                    'border-top' : '1px solid #f2f2f2 !important'
                },
                reference : 'onboarding',
                features : null,
                viewModel : {
                    data : {
                        readOnly : true
                    }
                }
            }
        ],

        loadData : function(requestData, actualData, workflowRequestType) {
            let employment = this.down('[reference=employment]'),
                employmentVm = employment.getViewModel();

            this.down('[reference=basicDemographics]').getViewModel().set('person', Ext.create('criterion.model.Person', requestData.person));
            this.down('[reference=address]').getViewModel().set('address', Ext.create('criterion.model.person.Address', requestData.address));

            Ext.promise.Promise.all([
                employment.getController().loadStoresForApproverView(requestData.employee.employerId),
                employment.initPositionReporting(),
                employment.initReportingStructures(requestData.employee.employerId, true)
            ]).then(function() {
                employmentVm.set({
                    employer : Ext.create('criterion.model.Employer', requestData.additionalData.employerData),
                    employee : Ext.create('criterion.model.Employee', requestData.employee),
                    assignmentDetail : Ext.create('criterion.model.assignment.Detail', requestData.assignmentDetail),
                    salaryGradeName : requestData.additionalData.salaryGradeName !== "" ? requestData.additionalData.salaryGradeName : null
                });

                Ext.isObject(requestData.additionalData.orgStructureNames) && employmentVm.get('employee').set(requestData.additionalData.orgStructureNames);
                employment.setGroupValue(Ext.Array.map(requestData.groups || [], (val) => val.employeeGroupId));
            });

            this.down('[reference=onboarding]').getStore().loadData(requestData.onboarding || []);
        }
    }

});
