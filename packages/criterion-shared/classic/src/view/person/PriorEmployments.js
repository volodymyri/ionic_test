Ext.define('criterion.view.person.PriorEmployments', function() {

    return {
        alias : 'widget.criterion_person_prioremployments',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.person.GridView',
            'criterion.store.person.PriorEmployments'
        ],

        uses : [
            'criterion.view.person.PriorEmployment'
        ],

        store : {
            type : 'criterion_person_prioremployments',

            sorters : [
                {
                    property : 'fromDate',
                    direction : 'DESC'
                }
            ]
        },

        controller : {
            type : 'criterion_person_gridview',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_person_prioremployment',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : 800
                    }
                ],
                listeners : {
                    afterSave : function() {
                        criterion.Utils.toast(i18n.gettext('Prior Employment saved.'));
                    }
                }
            }
        },

        title : i18n.gettext('Prior Employment'),

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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIOR_EMPLOYMENT, criterion.SecurityManager.CREATE, true)
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

        columns : {
            defaults : {
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },

            items : [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Company'),
                    dataIndex : 'company'
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Title'),
                    dataIndex : 'title',
                    flex : 1
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Supervisor'),
                    dataIndex : 'supervisor'
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('From'),
                    dataIndex : 'fromDate'
                },
                {
                    xtype : 'datecolumn',
                    text : i18n.gettext('To'),
                    dataIndex : 'toDate'
                }
            ]
        }
    }
});
