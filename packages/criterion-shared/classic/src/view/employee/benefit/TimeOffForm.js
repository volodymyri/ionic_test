Ext.define('criterion.view.employee.benefit.TimeOffForm', function() {

    return {
        alias : 'widget.criterion_employee_benefit_time_off_form',

        requires : [
            'criterion.controller.employee.benefit.TimeOffForm',
            'criterion.store.employee.timeOff.Details',
            'criterion.store.employee.timeOff.AvailableTypes'
        ],

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar'
            }
        ],

        viewModel : {
            data : {
                /**
                 * @link {criterion.model.employee.TimeOff}
                 */
                record : null,
                isAllDayOnly : false
            },
            formulas : {
                readOnlyMode : function() {
                    return false;
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.DELETE, false, true));
                },

                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF, criterion.SecurityManager.UPDATE, false, true));
                },

                isFullDayNotPhantom : function(data) {
                    return data('record.isFullDay') || !data('isPhantom');
                }
            },

            stores : {
                timeOffDetails : {
                    type : 'criterion_employee_time_off_details',
                    sorters : [{
                        property : 'timeOffDate',
                        direction : 'DESC'
                    }]
                },
                employeeTimeOffType : {
                    type : 'criterion_employee_time_off_available_types'
                }
            }
        },

        controller : {
            type : 'criterion_employee_benefit_time_off_form',
            saveParams : {
                isHR : true
            },
            externalUpdate : false
        },

        listeners : {
            afterSave : 'onAfterSaveTimeoff',
            afterrender : 'onAfterRender'
        },

        modelValidation : true,

        bodyPadding : 0,

        title : i18n.gettext('Time Off'),

        timeFieldXType : 'timefield',

        setButtonConfig : function() {
            this.buttons = [
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.gettext('Delete'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{blockedState}',
                        hidden : '{hideDelete}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    bind : {
                        disabled : '{blockedState}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    }
                }
            ];
        },

        initComponent : function() {
            this.items = [
                {
                    xtype : 'container',

                    layout : 'hbox',

                    plugins : [
                        'criterion_responsive_column'
                    ],
                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,

                    items : [
                        {
                            xtype : 'container',

                            items : [
                                {
                                    xtype : 'combobox',
                                    reference : 'timeOffType',
                                    fieldLabel : i18n.gettext('Type'),
                                    valueField : 'id',
                                    displayField : 'description',
                                    queryMode : 'local',
                                    editable : false,
                                    disabled : true,
                                    allowBlank : false,
                                    bind : {
                                        value : '{record.timeOffTypeCd}',
                                        readOnly : '{!isPhantom}',
                                        disabled : '{!isPhantom}',
                                        store : '{employeeTimeOffType}',
                                        filters : [
                                            {
                                                filterFn : function(record) {
                                                    let vm = this.getViewModel();

                                                    return (!vm.get('isPhantom') || record.get('isActive')) && (criterion.Application.isAdmin() || !parseInt(record.get('attribute5'), 10)); // 'hideInEss' param
                                                },
                                                scope : this
                                            }
                                        ]
                                    },
                                    forceSelection : true,
                                    listeners : {
                                        change : 'handleTypeChange'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('Start Date'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{record.startDateForCreate}',
                                        hidden : '{!isPhantom}',
                                        readOnly : '{readOnlyMode}',
                                        disabled : '{!isPhantom}'
                                    },
                                    listeners : {
                                        change : 'onStartDateChange'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Duration'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{record.durationString}',
                                        readOnly : '{readOnlyMode}',
                                        disabled : '{isFullDayNotPhantom}',
                                        hidden : '{!isPhantom}'
                                    },
                                    listeners : {
                                        blur : 'handleDurationBlur'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'container',

                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.gettext('All Day'),
                                    bind : {
                                        value : '{record.isFullDay}',
                                        readOnly : '{readOnlyMode || isAllDayOnly}',
                                        hidden : '{!isPhantom}',
                                        disabled : '{!isPhantom}'
                                    },
                                    listeners : {
                                        change : 'handleFullDayChange'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.gettext('End Date'),
                                    bind : {
                                        value : '{record.endDate}',
                                        hidden : '{!isPhantom}',
                                        readOnly : '{readOnlyMode}',
                                        disabled : '{!isPhantom}'
                                    }
                                },
                                {
                                    xtype : this.timeFieldXType,
                                    fieldLabel : i18n.gettext('Start Time'),
                                    bind : {
                                        value : '{record.startTime}',
                                        readOnly : '{readOnlyMode}',
                                        hidden : '{!isPhantom}',
                                        disabled : '{isFullDayNotPhantom}'
                                    }
                                },
                                {
                                    xtype : 'displayfield',
                                    fieldLabel : i18n.gettext('Timezone'),
                                    skipRequiredMark : true,
                                    bind : {
                                        value : '{record.timezoneDescription}',
                                        hidden : '{isFullDayNotPhantom}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'container',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,
                    layout : 'hbox',
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    padding : '15 40 0 15',
                    items : [
                        {
                            xtype : 'textarea',
                            flex : 4,
                            height : 100,
                            fieldLabel : i18n.gettext('Notes'),
                            allowBlank : false,
                            bind : {
                                value : '{record.notes}',
                                allowBlank : '{timeOffType.selection.notesOptional}',
                                readOnly : '{readOnlyMode}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'container',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,
                    layout : 'hbox',
                    plugins : [
                        'criterion_responsive_column'
                    ],
                    padding : '15 0 0 0',
                    items : [
                        {
                            xtype : 'container',
                            items : [
                                {
                                    xtype : 'filefield',
                                    fieldLabel : i18n.gettext('Document'),
                                    reference : 'document',
                                    buttonText : i18n.gettext('Browse'),
                                    buttonMargin : 6,
                                    emptyText : i18n.gettext('Drop File here or browse'),
                                    buttonOnly : false,
                                    flex : 1,
                                    hidden : true,
                                    bind : {
                                        disabled : '{readOnlyMode}',
                                        hidden : '{readOnlyMode || record.attachmentId}'
                                    },
                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                    listeners : {
                                        change : function(fld, value) {
                                            var newValue = value.replace(/C:\\fakepath\\/g, '');

                                            fld.setRawValue(newValue);
                                        },
                                        afterrender : function(cmp) {
                                            cmp.fileInputEl.on('change', function(event) {
                                                cmp.fireEvent('onselectfile', event, cmp);
                                            });
                                        },
                                        onselectfile : 'handleSelectFile'
                                    }
                                },
                                {
                                    xtype : 'container',
                                    flex : 1,
                                    layout : 'hbox',
                                    bind : {
                                        hidden : '{!record.attachmentId}'
                                    },
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Document'),
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                                            flex : 1,
                                            readOnly : true,
                                            bind : {
                                                value : '{record.attachmentName}'
                                            }
                                        },
                                        {
                                            xtype : 'button',
                                            cls : 'criterion-btn-transparent',
                                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                                            tooltip : i18n.gettext('Download'),
                                            scale : 'medium',
                                            margin : '0 0 0 10',
                                            handler : 'handleDownloadFile'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            items : []
                        }
                    ]
                },
                {
                    xtype : 'criterion_gridview',
                    margin : '0 0 20 0',
                    reference : 'detailsGrid',

                    bind : {
                        hidden : '{isPhantom}'
                    },
                    preventStoreLoad : true,
                    listeners : {
                        scope : this.getController(),
                        editaction : 'handleEditTimeoffDetail'
                    },
                    tbar : [
                        '->',
                        {
                            xtype : 'button',
                            reference : 'addButton',
                            text : i18n.gettext('Add'),
                            cls : 'criterion-btn-feature',
                            hidden : true,
                            listeners : {
                                scope : this.getController(),
                                click : 'handleAddTimeoffDetail'
                            },
                            bind : {
                                disabled : '{disableAdd}',
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    append : 'readOnlyMode ||',
                                    rules : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF,
                                            actName : criterion.SecurityManager.UPDATE,
                                            reverse : true
                                        }
                                    ]
                                })
                            }
                        }
                    ],

                    columns : {
                        items : [
                            {
                                xtype : 'datecolumn',
                                text : i18n.gettext('Date'),
                                dataIndex : 'timeOffDate',
                                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                            },
                            {
                                xtype : 'timecolumn',
                                text : i18n.gettext('Start Time'),
                                dataIndex : 'timeOffDate',
                                flex : 1,
                                encodeHtml : false,
                                renderer : function(val, o, rec) {
                                    return rec.get('isFullDay') ? '' : (Ext.util.Format.dateRenderer(criterion.consts.Api.TIME_FORMAT_US)(val) + '<br />' + rec.get('timezoneDescription'));
                                }
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Duration'),
                                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                                renderer : function(value, metaData, record) {
                                    var res;

                                    if (record.get('isFullDay')) {
                                        res = i18n.gettext('All day');
                                    } else {
                                        res = criterion.Utils.minutesToTimeStr(Math.floor(record.get('duration')));
                                    }

                                    return res;
                                }
                            },
                            {
                                xtype : 'criterion_actioncolumn',
                                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                bind : {
                                    hidden : '{readOnlyMode}'
                                },
                                items : [
                                    {
                                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                        tooltip : i18n.gettext('Delete'),
                                        action : 'removeaction'
                                    }
                                ]
                            }
                        ]
                    }
                }
            ];

            this.callParent(arguments);
        },

        loadRecord : function(record, store) {
            var mc = this.getController();
            mc && mc.loadRecord(record, store);
        }
    };
});
