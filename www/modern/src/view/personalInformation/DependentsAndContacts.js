Ext.define('ess.view.personalInformation.DependentsAndContacts', function() {

    return {

        alias : 'widget.ess_modern_personal_information_dependents_and_contacts',

        extend : 'Ext.Panel',

        requires : [
            'criterion.store.person.Contacts',
            'ess.controller.personalInformation.DependentsAndContacts',
            'ess.view.personalInformation.DependentAndContact',
            'criterion.store.CustomData',
            'criterion.store.customField.Values'
        ],

        layout : 'card',

        controller : {
            type : 'ess_modern_personal_information_dependents_and_contacts'
        },

        listeners : {
            activate : 'handleActivate'
        },

        viewModel : {
            stores : {
                contacts : {
                    type : 'criterion_person_contacts'
                },
                customFields : {
                    type : 'criterion_customdata'
                },
                customFieldValues : {
                    type : 'criterion_customdata_values'
                }
            }
        },

        items : [
            {
                xtype : 'container',
                reference : 'contactsGridWrapper',
                height : '100%',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        title : 'Dependents and Contacts',
                        buttons : [
                            {
                                xtype : 'button',
                                itemId : 'backButton',
                                cls : 'criterion-menubar-back-btn',
                                iconCls : 'md-icon-arrow-back',
                                align : 'left',
                                handler : 'handleBack'
                            }
                        ],
                        actions : [
                            {
                                xtype : 'button',
                                text : '',
                                iconCls : 'md-icon-add',
                                iconAlign : 'center',
                                handler : 'handleAdd'
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_gridview',
                        cls : 'ess-grid-with-workflow',
                        bind : {
                            store : '{contacts}'
                        },

                        listeners : {
                            doEdit : 'handleEdit'
                        },

                        height : '100%',
                        flex : 1,

                        itemConfig : {
                            viewModel : {
                                data : {}
                            }
                        },

                        columns : [
                            {
                                text : '',
                                width : 7,
                                minWidth : 7,
                                cls : 'workflow-cell-header',
                                cell : {
                                    cls : 'workflow-cell',
                                    width : 7,
                                    bind : {
                                        bodyCls : '{record.statusCode}'
                                    }
                                }
                            },
                            {
                                text : i18n.gettext('First Name'),
                                flex : 1,
                                dataIndex : 'firstName',
                                minWidth : 170
                            },
                            {
                                text : i18n.gettext('Last Name'),
                                flex : 1,
                                dataIndex : 'lastName',
                                minWidth : 170
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Relationship'),
                                dataIndex : 'relationshipTypeCd',
                                flex : 1,
                                codeDataId : criterion.consts.Dict.RELATIONSHIP_TYPE,
                                minWidth : 150
                            },
                            {
                                text : i18n.gettext('Mobile Phone'),
                                flex : 1,
                                dataIndex : 'mobilePhoneInternational',
                                minWidth : 200
                            },
                            {
                                text : i18n.gettext('Email'),
                                flex : 1,
                                dataIndex : 'email',
                                minWidth : 170
                            },
                            {
                                text : i18n.gettext('Emergency Contact'),
                                dataIndex : 'isEmergency',
                                flex : 1,
                                minWidth : 170,
                                renderer : function(value) {
                                    return value ? 'Yes' : 'No';
                                }
                            },
                            {
                                text : i18n.gettext('Dependent'),
                                dataIndex : 'isDependent',
                                flex : 1,
                                minWidth : 170,
                                renderer : function(value) {
                                    return value ? 'Yes' : 'No';
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'ess_modern_personal_information_dependent_and_contact',
                reference : 'dependentAndContactForm',
                height : '100%',
                listeners : {
                    close : 'handleEditFinish',
                    afterSave : 'handleEditFinish'
                }
            }
        ]

    }

});
