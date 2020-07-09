Ext.define('criterion.view.settings.system.SecurityProfiles', function() {

    return {

        alias : 'widget.criterion_settings_security_profiles',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.SecurityProfiles',
            'criterion.store.security.Profiles',
            'criterion.view.settings.system.SecurityProfile'
        ],

        title : i18n.gettext('Security Profiles'),

        viewModel : {
            data : {
                selectionCount : 0
            }
        },

        controller : {
            type : 'criterion_settings_security_profiles',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_security_profile',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_security_profiles'
        },

        selModel : {
            selType : 'checkboxmodel',
            listeners : {
                scope : 'controller',
                selectionchange : 'handleSelectionChange'
            }
        },

        tbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Clone'),
                cls : 'criterion-btn-feature',
                hidden : true,
                bind : {
                    hidden : '{!selectionCount}'
                },
                handler : 'handleClone'
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                handler : 'handleRefreshClick'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Profile Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Module'),
                dataIndex : 'module',
                renderer : function(value) {
                    return criterion.Utils.getSecurityBinaryNamesFromInt(criterion.Consts.SECURITY_MODULES, value).join(", ");
                }
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Full Access'),
                align : 'center',
                dataIndex : 'hasFullAccess',
                trueText : '✓',
                falseText : '',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            }
        ]
    };
});

