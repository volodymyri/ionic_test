Ext.define('criterion.view.settings.hr.screening.Form', function() {

    return {

        alias : 'widget.criterion_settings_screening_form',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.hr.screening.Form',
            'criterion.view.MultiRecordPicker',
            'criterion.store.EmployeeGroups',
            'criterion.store.employeeBackground.Search',
            'criterion.ux.form.field.EmployeeGroupComboBox',

        ],

        controller : {
            type : 'criterion_settings_screening_form'
        },

        viewModel : {
            data : {
                activeViewIdx : 0,
                titleForm : i18n.gettext('Select Employees'),

                requestData : {
                    vendorCd : null,
                    packageCd : null,
                    subPackageCd : null,
                    authorizationFormId : null,
                    newAuthorization : null,
                    employees : []
                },
                employeesCountMessage : ''
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '85%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        layout : 'card',

        draggable : true,
        closable : true,

        bind : {
            activeItem : '{activeViewIdx}',
            title : '{titleForm}'
        },

        items : [
            {
                xtype : 'criterion_multi_record_picker_remote',
                reference : 'selectEmployees',
                allowGridFilter : true,
                afterSelectAction : 'hide',

                draggable : false,
                closable : false,
                scrollable : false,
                plugins : null,

                listeners : {
                    activate : 'onActivateSelectEmployees',
                    selectRecords : 'selectEmployees',
                    cancel : 'handleCancel'
                },

                viewModel : {
                    data : {
                        submitBtnText : i18n.gettext('Next'),

                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employee Number'),
                                dataIndex : 'employeeNumber',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Report Order Date'),
                                dataIndex : 'lastReportOrderDate',
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employee Group'),
                                dataIndex : 'employeeGroup',
                                hidden : true,
                                filterType : 'criterion_employee_group_combobox',
                                filterCfg : {
                                    xtype : 'criterion_employee_group_combobox',
                                    listenEmployerChange : true,
                                    multiSelect : false
                                }
                            }
                        ],
                        storeParams : {
                            employerId : criterion.Api.getEmployerId(),
                            isActive : true
                        }
                    },
                    stores : {
                        inputStore : {
                            type : 'criterion_employee_background_search',
                            remoteFilter : true,
                            remoteSort : true
                        }
                    }
                }
            },

            {
                xtype : 'criterion_form',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDE,

                bodyPadding : '20 10',

                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('External Service'),
                        codeDataId : criterion.consts.Dict.EXTERNAL_SYSTEM_NAME,
                        editable : false,
                        autoSetFirst : true,
                        allowBlank : false,
                        bind : {
                            value : '{requestData.vendorCd}',
                            filterValues : {
                                attribute : 'attribute1',
                                value : '1',
                                strict : true
                            }
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('Package'),
                        codeDataId : criterion.consts.Dict.BACKGROUND_CHECK_PACKAGE,
                        reference : 'packageCDField',
                        editable : false,
                        autoSetFirst : true,
                        allowBlank : false,
                        bind : '{requestData.packageCd}'
                    },
                    {
                        xtype : 'criterion_code_detail_field_multi_select',
                        codeDataId : criterion.consts.Dict.BACKGROUND_CHECK_SUB_PACKAGE,
                        fieldLabel : i18n.gettext('Additional Products'),
                        bind : '{requestData.subPackageCd}'
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Authorization Form'),
                        valueField : 'formId',
                        displayField : 'name',
                        queryMode : 'local',
                        bind : {
                            store : '{webForms}',
                            value : '{requestData.authorizationFormId}'
                        },
                        editable : true
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Authorization Policy'),
                        queryMode : 'local',
                        valueField : 'id',
                        store : {
                            data : [
                                {
                                    id : 'true',
                                    text : i18n.gettext('Send new authorization always')
                                },
                                {
                                    id : 'false',
                                    text : i18n.gettext('Use previous authorization if available')
                                }
                            ]
                        },
                        editable : true,
                        bind : '{requestData.newAuthorization}'
                    }
                ],

                bbar : [
                    {
                        xtype : 'component',
                        bind : {
                            html : '{employeesCountMessage}'
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Previous'),
                        cls : 'criterion-btn-primary',
                        scale : 'small',
                        handler : 'handlePrevious'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        scale : 'small',
                        handler : 'handleCancel'
                    },
                    {
                        xtype : 'button',
                        text : 'Order',
                        cls : 'criterion-btn-primary',
                        scale : 'small',
                        formBind : true,
                        handler : 'handleOrder'
                    }
                ]
            }
        ]
    }
});
