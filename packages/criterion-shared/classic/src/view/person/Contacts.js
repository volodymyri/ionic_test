Ext.define('criterion.view.person.Contacts', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_person_contacts',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.person.Contacts',
            'criterion.controller.person.Contacts',
            'criterion.view.person.Contact'
        ],

        viewModel : {
            data : {
                showApproved : true
            },
            stores : {
                contacts : {
                    type : 'criterion_person_contacts',
                    proxy : {
                        extraParams : {
                            showApproved : '{showApproved}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{contacts}'
        },

        controller : {
            type : 'criterion_person_contacts',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_person_contact',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                listeners : {
                    afterSave : function() {
                        criterion.Utils.toast(i18n.gettext('Dependent saved'));
                    }
                }
            }
        },

        title : i18n.gettext('Dependents & Contacts'),

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DEPENDENTS_CONTACTS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('First Name'),
                flex : 1,
                dataIndex : 'firstName'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Last Name'),
                flex : 1,
                dataIndex : 'lastName'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Relationship'),
                dataIndex : 'relationshipTypeCd',
                flex : 1,
                codeDataId : DICT.RELATIONSHIP_TYPE
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Mobile Phone'),
                flex : 1,
                dataIndex : 'mobilePhoneInternational'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Email'),
                flex : 1,
                dataIndex : 'email'
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Emergency') + '<br>' + i18n.gettext('Contact'),
                dataIndex : 'isEmergency',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                width : 130
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Dependent'),
                dataIndex : 'isDependent',
                trueText : i18n.gettext('Yes'),
                falseText : i18n.gettext('No'),
                width : 130
            }
        ]
    };
});
