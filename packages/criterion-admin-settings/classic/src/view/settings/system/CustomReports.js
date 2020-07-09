Ext.define('criterion.view.settings.system.CustomReports', function() {

    return {
        alias : 'widget.criterion_settings_custom_reports',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.CustomReports',
            'criterion.view.settings.system.CustomReportUploadForm',
            'criterion.store.Reports',
            'criterion.store.ReportGroups'
        ],

        title : i18n.gettext('Custom Reports'),

        viewModel : {
            data : {
                employerId : null
            },
            stores : {
                reports : {
                    type : 'criterion_reports',
                    filters : [
                        {
                            property : 'isCustomReport',
                            value : true
                        }
                    ]
                },
                reportGroups : {
                    type : 'criterion_report_groups'
                }
            }
        },

        controller : {
            type : 'criterion_settings_custom_reports',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_custom_reports_upload_form',
                allowDelete : true
            }
        },

        listeners : {
            beforeedit : 'handleBeforeEdit',
            activate : 'handleActivate'
        },

        bind : {
            store : '{reports}'
        },

        initComponent : function() {
            var me = this;

            this.columns = [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Report Group'),
                    dataIndex : 'reportGroupId',
                    flex : 1,
                    renderer : function(value) {
                        var reportGroups = me.getViewModel().getStore('reportGroups'),
                            reportGroup = reportGroups.getById(value);
                        return reportGroup && reportGroup.get('name') || '';
                    },
                    editor : {
                        xtype : 'combobox',
                        displayField : 'name',
                        valueField : 'id',
                        forceSelection : true,
                        bind : {
                            store : '{reportGroups}'
                        },
                        allowBlank : false
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Report Name'),
                    dataIndex : 'name',
                    flex : 1,
                    editor : 'textfield'
                }
            ];

            this.callParent(arguments);
        }
    };

});
