Ext.define('criterion.view.recruiting.candidate.Attachments', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_attachments',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.candidate.Attachments',
            'criterion.controller.recruiting.candidate.Attachments',
            'criterion.view.recruiting.candidate.AttachmentForm'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_attachments',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_recruiting_candidate_attachment_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        viewModel : {
            data : {
                fileName : null
            },
            stores : {
                candidateAttachments : {
                    type : 'candidate_attachments',
                    proxy : {
                        extraParams : {
                            candidateId : '{candidateId}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{candidateAttachments}'
        },

        listeners : {
            downloadAction : 'handleDownloadAction',
            scope : 'controller'
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
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_ATTACHMENT, criterion.SecurityManager.CREATE, true)
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
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'description',
                text : i18n.gettext('Description'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'date',
                text : i18n.gettext('Upload Date'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'criterion_actioncolumn',
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                        tooltip : i18n.gettext('Download'),
                        action : 'downloadAction',
                        permissionAction : function(v, cellValues, record, i, k, e, view) {
                            return criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_ATTACHMENT_DOWNLOAD, criterion.SecurityManager.ACT)();
                        }
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        action : 'removeaction',
                        permissionAction : function(v, cellValues, record, i, k, e, view) {
                            return criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_ATTACHMENT, criterion.SecurityManager.DELETE)();
                        }
                    }
                ]
            }
        ]
    }
});
