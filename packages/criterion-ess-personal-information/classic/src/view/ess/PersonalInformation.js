Ext.define('criterion.view.ess.PersonalInformation', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information',

        extend : 'criterion.ux.Panel',

        layout : {
            type : 'card',
            deferredRender : true
        },

        requires : [
            'criterion.vm.ess.PersonalInformation',
            'criterion.controller.ess.PersonalInformation',
            'criterion.store.person.Addresses',

            'criterion.view.ess.personalInformation.BasicDemographics',
            'criterion.view.ess.personalInformation.Address',
            'criterion.view.ess.personalInformation.DependentsAndContacts',

            'criterion.view.employee.Position',
            'criterion.view.employee.Positions',
            'criterion.view.employee.AssignmentHistory',

            'criterion.view.ess.personalInformation.EmploymentInformation',
            'criterion.view.ess.personalInformation.AdditionalPositions',
            'criterion.view.ess.personalInformation.PrimaryPosition',
            'criterion.view.ess.personalInformation.AssignmentHistory'
        ],

        controller : {
            type : 'criterion_selfservice_personal_information'
        },

        viewModel : 'criterion_ess_personal_information',

        listeners : {
            activate : 'handleActivate'
        },

        defaults : {
            defaults : {
                scrollable : true
            }
        },

        items : [
            {
                xtype : 'criterion_form',
                layout : 'card',

                isSubMenu : true,

                trackResetOnLoad : true,

                monitorMultiPosition : true,

                plugins : [
                    {
                        ptype : 'criterion_security_items'
                    },
                    {
                        ptype : 'criterion_lazyitems',

                        items : [
                            {
                                xtype : 'criterion_selfservice_personal_information_basic_demographics',
                                itemId : 'basicDemographics',
                                reference : 'basicDemographics',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.DEMOGRAPHICS),
                                listeners : {
                                    personCancel : 'onPersonCancel',
                                    personSave : 'onPersonSave',
                                    recallRequest : 'handleRecallDemographicsRequest'
                                }
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_address',
                                itemId : 'address',
                                reference : 'addressForm',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.ADDRESS),
                                listeners : {
                                    addressCancel : 'onAddressCancel',
                                    addressSave : 'onAddressSave',
                                    recallRequest : 'handleRecallAddressRequest'
                                }
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_employment_information',
                                itemId : 'employment',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.EMPLOYMENT_INFORMATION)
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_primary_position',
                                reference : 'position',
                                itemId : 'position',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.PRIMARY_POSITION),
                                viewModel : { data : { viewOnly : true } },
                                controller : {
                                    suppressIdentity : ['employeeContext']
                                }
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_additional_positions',
                                itemId : 'positions',
                                isMultiPositionMode : true,
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.ADDITIONAL_POSITIONS),
                                tbar : null
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_assignment_history',
                                reference : 'positionHistory',
                                itemId : 'positionHistory',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.POSITION_HISTORY)
                            },
                            {
                                xtype : 'criterion_selfservice_personal_information_dependents_and_contacts',
                                itemId : 'dependentsAndContacts',
                                reference : 'dependentsAndContacts',
                                securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.DEPENDENTS_CONTACTS)
                            }
                        ]
                    }
                ]

            }
        ]

    };

});
