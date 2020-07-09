/**
 * @deprecated
 *
 * CRITERION-5240
 */
Ext.define('criterion.view.employee.TeamView', {

    alias : 'widget.criterion_employee_team_view',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.controller.employee.TeamView',
        'criterion.store.employee.SubordinatesTime'
    ],

    controller : {
        type : 'criterion_employee_team_view'
    },

    listeners : {
        scope : 'controller',
        show : 'handleShow'
    },

    title : i18n.gettext('Benefit Plans'),

    viewModel : {
        stores : {
            subordinatesTime : {
                type : 'criterion_employee_subordinates_time'
            },
            orgUnits : {
                type : 'store',
                fields : ['id', 'text']
            }
        }
    },

    bind : {
        store : '{subordinatesTime}'
    },

    tbar : [
        {
            xtype : 'combo',
            fieldLabel : i18n.gettext('Organization Structure'),
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
            reference : 'orgStructureCombo',
            valueField : 'id',
            displayField : 'text',
            editable : false,
            forceSelection : true,
            queryMode : 'local',
            listeners : {
                change : 'handleSelectUnit'
            },
            bind : {
                store : '{orgUnits}'
            }
        },
        {
            xtype : 'button',
            text : i18n.gettext('In'),
            cls : 'criterion-btn-feature',
            listeners : {
                click : 'handleInClick'
            }
        },
        {
            xtype : 'button',
            text : i18n.gettext('Out'),
            cls : 'criterion-btn-feature',
            listeners : {
                click : 'handleOutClick'
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

    viewConfig : {
        markDirty : false
    },

    columns : [
        {
            xtype : 'gridcolumn',
            width : 10,
            dataIndex : 'state',
            renderer : function(value, metaData) {
                var color = '';

                switch (value) {
                    case 1:
                        color = 'yellow';
                        break;
                    case 2:
                        color = 'green';
                        break;
                    case 3:
                        color = 'red';
                        break;
                }

                metaData.tdAttr = 'bgcolor="' + color + '"';
                return '';
            }
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Name'),
            flex : 1,
            dataIndex : 'name'
        },
        {
            xtype : 'timecolumn',
            text : i18n.gettext('In'),
            flex : 1,
            dataIndex : 'in'
        },
        {
            xtype : 'timecolumn',
            text : i18n.gettext('Out'),
            flex : 1,
            dataIndex : 'out'
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Hours'),
            flex : 1,
            dataIndex : 'hours'
        }
    ]
});
