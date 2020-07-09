Ext.define('criterion.view.ess.personalInformation.DependentsAndContacts', function() {

    return {

        alias : 'widget.criterion_selfservice_personal_information_dependents_and_contacts',

        extend : 'criterion.view.person.Contacts',

        requires : [
            'criterion.view.ess.personalInformation.Contact'
        ],

        viewModel : {
            data : {
                showApproved : true
            }
        },

        tbar : null,

        header : {

            title : i18n.gettext('Dependents and Contacts'),

            items : [
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'addButton',
                    text : i18n.gettext('Add'),
                    ui : 'feature',
                    listeners : {
                        click : 'handleAddClick'
                    }
                }
            ]
        },

        controller : {
            showTitleInConnectedViewMode : true,
            baseRoute : criterion.consts.Route.SELF_SERVICE.PERSONAL_INFORMATION_DEPENDENTS_AND_CONTACTS,
            editor : {
                xtype : 'criterion_selfservice_personal_information_contact',

                frame : true,

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

        initComponent() {
            this.columns.push({
                xtype : 'gridcolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'status',
                width : 130
            });

            this.callParent(arguments);
        }
    };
});
