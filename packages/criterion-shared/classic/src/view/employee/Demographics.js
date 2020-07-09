Ext.define('criterion.view.employee.Demographics', {

    alias : 'widget.criterion_employee_demographics',

    extend : 'criterion.ux.form.Panel',

    requires : [
        'criterion.controller.employee.Demographics',
        'criterion.view.CustomFields',
        'criterion.view.customData.GridView',
        'criterion.view.employee.demographic.Basic',
        'criterion.view.employee.demographic.Address'
    ],

    title : i18n.gettext('Profile'),

    viewModel : true,

    controller : 'criterion_employee_demographics',

    buttons : [
        {
            xtype : 'button',
            text : i18n.gettext('Cancel'),
            cls : 'criterion-btn-light',
            listeners : {
                click : 'handleCancelClick'
            }
        },
        {
            xtype : 'button',
            cls : 'criterion-btn-primary',
            text : i18n.gettext('Save'),
            hidden : true,
            bind : {
                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                    rules : {
                        AND : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_PERSON,
                                actName : criterion.SecurityManager.UPDATE,
                                reverse : true
                            },
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDRESS,
                                actName : criterion.SecurityManager.UPDATE,
                                reverse : true
                            }
                        ]
                    }
                })
            },
            listeners : {
                click : 'onProfileSave'
            }
        }
    ],

    layout : 'card',

    autoScroll : false,

    defaults : {
        header : false,
        autoScroll : true
    },

    recordIds : [
        'address',
        'person'
    ],

    plugins : [
        {
            ptype : 'criterion_security_items',
            secureByDefault : true
        }
    ],

    items : [
        {
            xtype : 'criterion_employee_demographic_basic',
            itemId : 'basicDemographics',
            reference : 'basicDemographics',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PERSON, criterion.SecurityManager.READ)
        },
        {
            xtype : 'criterion_employee_demographic_address',
            itemId : 'address',
            reference : 'addressDemographics',
            securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDRESS, criterion.SecurityManager.READ)
        }
    ]

});
