Ext.define('criterion.view.settings.system.CustomReportUploadForm', function() {

    return {
        alias : 'widget.criterion_settings_custom_reports_upload_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.system.CustomReportUploadForm',
            'criterion.store.ReportGroups'
        ],

        controller : {
            type : 'criterion_settings_custom_reports_upload_form',
            externalUpdate : false
        },

        viewModel : {
            data : {
                record : null,
                isPhantom : false
            },
            stores : {
                reportGroups : {
                    type : 'criterion_report_groups'
                }
            },
            formulas : {
                typeIsReport : function(get) {
                    return get('record.reportTypeCode') === criterion.Consts.REPORT_TYPE.REPORT
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        draggable : true,
        modal : true,

        listeners : {
            afterrender : 'handleAfterRender'
        },

        title : i18n.gettext('Report'),

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-remove',
                text : i18n.gettext('Delete'),
                handler : 'handleDeleteClick',
                bind : {
                    hidden : '{isPhantom}'
                }
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancelClick'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Save'),
                handler : 'handleSave'
            }
        ],

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'criterion_code_detail_field',
                    codeDataId : criterion.consts.Dict.REPORT_TYPE,
                    fieldLabel : i18n.gettext('Report Type'),
                    name : 'reportTypeCd',
                    reference : 'reportType',
                    bind : {
                        value : '{record.reportTypeCd}',
                        disabled : '{!isPhantom}'
                    }
                },
                {
                    xtype : 'textfield',
                    fieldLabel : i18n.gettext('Name'),
                    name : 'name',
                    reference : 'name',
                    allowBlank : false
                },
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Group'),
                    name : 'reportGroupId',
                    reference : 'reportGroup',
                    displayField : 'name',
                    valueField : 'id',
                    forceSelection : true,
                    queryMode : 'local',
                    bind : {
                        store : '{reportGroups}',
                        hidden : '{!typeIsReport}',
                        allowBlank : '{!typeIsReport}'
                    }
                },
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('Report File'),
                    name : 'reportFile',
                    reference : 'reportFile',
                    buttonText : i18n.gettext('Browse'),
                    buttonConfig : {
                        cls : 'criterion-btn-feature'
                    },
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    hidden : true,
                    bind : {
                        hidden : '{!isPhantom}',
                        disabled : '{!isPhantom}'
                    },
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            var me = cmp;
                            cmp.fileInputEl.on('change', function(event) {
                                me.fireEvent('onselectfile', event);
                            });
                        },
                        onselectfile : 'handleSelectReportFile'
                    }
                },
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('Options File'),
                    name : 'optionsFile',
                    reference : 'optionsFile',
                    buttonText : i18n.gettext('Browse'),
                    buttonConfig : {
                        cls : 'criterion-btn-feature'
                    },
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    hidden : true,
                    bind : {
                        hidden : '{!typeIsReport || !isPhantom}',
                        disabled : '{!isPhantom}',
                        allowBlank : '{!typeIsReport}'
                    },
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            var me = cmp;
                            cmp.fileInputEl.on('change', function(event) {
                                me.fireEvent('onselectfile', event);
                            });
                        },
                        onselectfile : 'handleSelectOptionsFile'
                    }
                }
            ];

            me.callParent(arguments);
            me.setKeyNavigation();
        },

        destroy() {
            Ext.destroy(this.keyNav);
            this.callParent();
        },

        setKeyNavigation() {
            let controller = this.getController();

            this.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [
                    {
                        key : 's',
                        shift : true,
                        alt : true,
                        handler : controller.navSaveHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.ESC,
                        handler : controller.navCancelHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.DELETE,
                        handler : controller.navDeleteHandler,
                        scope : controller
                    }
                ]
            });
        }
    }
});
