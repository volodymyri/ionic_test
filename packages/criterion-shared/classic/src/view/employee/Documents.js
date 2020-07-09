Ext.define('criterion.view.employee.Documents', function() {

    return {

        alias : 'widget.criterion_employee_documents',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.Documents',
            'criterion.controller.employee.Documents'
        ],

        controller : 'criterion_employee_documents',

        listeners : {
            viewaction : 'onAttachmentView'
        },

        title : i18n.gettext('Documents'),

        store : {
            type : 'criterion_employee_documents',
            sorters : [
                {
                    property : 'uploadDate',
                    direction : 'DESC'
                }
            ]
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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_DOCUMENTS, criterion.SecurityManager.CREATE, true)
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
                text : i18n.gettext('Type'),
                dataIndex : 'documentTypeDesc',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'description',
                text : i18n.gettext('Description'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'webformId',
                text : i18n.gettext('File Type'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                renderer : function(value) {
                    return value ? i18n.gettext('Form') : i18n.gettext('Document');
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Size'),
                dataIndex : 'size',
                align : 'right',
                formatter : 'criterionFileSize',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'dueDate',
                text : i18n.gettext('Due Date'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'uploadDate',
                text : i18n.gettext('Upload Date'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'isShare',
                encodeHtml : false,
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                renderer : function(value) {
                    return ' <span style="font-family:Ionicons">'
                        + '&#' + criterion.consts.Glyph[value ? 'ios7-person-outline' : 'ios7-locked-outline']
                        + '</span>';
                }
            },
            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        tooltip : i18n.gettext('View'),
                        action : 'viewaction'
                    }
                ]
            }
        ]
    };

});
