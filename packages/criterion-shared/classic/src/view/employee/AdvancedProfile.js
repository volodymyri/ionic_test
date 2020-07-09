Ext.define('criterion.view.employee.AdvancedProfile', {

    alias : 'widget.criterion_employee_advanced_profile',

    extend : 'criterion.ux.Panel',

    title : i18n.gettext('Advanced Profile'),

    requires : [
        'criterion.view.person.Contacts',
        'criterion.view.employee.demographic.AdditionalDemographics',
        'criterion.view.employee.demographic.AdditionalAddress',
        'criterion.view.person.PriorEmployments',
        'criterion.view.employee.demographic.Social',
        'criterion.view.employee.Onboarding'
    ],

    layout : 'card',

    defaults : {
        header : false
    },

    plugins : [
        {
            ptype : 'criterion_security_items',
            secureByDefault : true
        }
    ],

    items : [
        {
            xtype : 'criterion_person_contacts',
            itemId : 'contacts',
            viewModel : {
                data : {
                    showApproved : false
                }
            },
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEPENDENTS_CONTACTS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_demographic_additional_demographics',
            itemId : 'additionalDemographics',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_DEMOGRAPHICS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_demographic_additional_address',
            itemId : 'additionalAddress',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_ADDRESS, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_person_prioremployments',
            itemId : 'priorEmployment',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIOR_EMPLOYMENT, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_demographic_social',
            itemId : 'social',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SOCIAL_MEDIA, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_onboarding',
            itemId : 'onboarding'
        }
    ]

});
