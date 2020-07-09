Ext.define('ess.view.PersonalInformation', function() {

    return {
        alias : 'widget.ess_modern_personal_information',

        extend : 'Ext.Container',

        requires : [
            'criterion.vm.ess.PersonalInformation',
            'ess.controller.PersonalInformation',
            'ess.view.personalInformation.Address',
            'ess.view.personalInformation.BasicDemographics',
            'ess.view.personalInformation.DependentsAndContacts'
        ],

        listeners : {
            activate : 'load',
            personSet : 'onPersonSet'
        },

        controller : {
            type : 'ess_modern_personal_information'
        },

        viewModel : {
            type : 'criterion_ess_personal_information'
        },

        layout : 'card',

        items : [
            {
                xtype : 'container',
                cls : 'navList',
                reference : 'subMenu',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        title : 'My Information',
                        docked : 'top'
                    },
                    {
                        xtype : 'button',
                        text : 'Demographics',
                        hidden : true,
                        cls : 'navigation-btn',
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.DEMOGRAPHICS, true)
                        },
                        goPage : 'basicDemographics',
                        handler : 'onSubPageTap'
                    },
                    {
                        xtype : 'button',
                        text : 'Address',
                        hidden : true,
                        cls : 'navigation-btn',
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.ADDRESS, true)
                        },
                        goPage : 'addressForm',
                        handler : 'onSubPageTap'
                    },
                    {
                        xtype : 'button',
                        text : 'Dependents and Contacts',
                        hidden : true,
                        cls : 'navigation-btn',
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityESSFormula(criterion.SecurityManager.ESS_KEYS.DEPENDENTS_CONTACTS, true)
                        },
                        goPage : 'dependentsAndContacts',
                        handler : 'onSubPageTap'
                    }
                ]
            },

            {
                xtype : 'ess_modern_personal_information_basic_demographics',
                reference : 'basicDemographics',
                listeners : {
                    pageBack : 'onSubPageBack',
                    personCancel : 'onPersonCancel',
                    personSave : 'onPersonSave'
                }
            },
            {
                xtype : 'ess_modern_personal_information_address',
                reference : 'addressForm',
                listeners : {
                    pageBack : 'onSubPageBack',
                    addressCancel : 'onAddressCancel',
                    addressSave : 'onAddressSave'
                }
            },
            {
                xtype : 'ess_modern_personal_information_dependents_and_contacts',
                reference : 'dependentsAndContacts',
                listeners : {
                    pageBack : 'onSubPageBack'
                }
            }
        ]

    };

});
