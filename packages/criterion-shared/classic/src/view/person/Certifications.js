Ext.define('criterion.view.person.Certifications', function () {

    return {
        alias : 'widget.criterion_person_certifications',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.GridView',
            'criterion.store.person.Certifications',
            'criterion.view.person.Certification'
        ],

        store : {
            type : 'criterion_person_certifications'
        },

        controller : {
            type : 'criterion_person_gridview',
            editor : {
                xtype : 'criterion_person_certification',
                allowDelete : true,
                controller : {
                    externalUpdate : false
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_CERTIFICATIONS, criterion.SecurityManager.CREATE, true)
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

        title : i18n.gettext('Certifications'),

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'certificationName',
                text : i18n.gettext('Name'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'issuedBy',
                text : i18n.gettext('Issued By'),
                flex : 1
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'issueDate',
                text : i18n.gettext('Issue Date'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'expiryDate',
                text : i18n.gettext('Expiry Date'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            }
        ]
    };

});
