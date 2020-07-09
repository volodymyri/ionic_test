Ext.define('criterion.view.settings.hr.LocationDetails', function() {

    return {
        alias : 'widget.criterion_settings_location_details',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        modelValidation : true,

        requires : [
            'criterion.controller.settings.hr.LocationDetails',
            'criterion.view.settings.hr.WorkArea',
            'criterion.view.settings.hr.WorkLocationTask',
            'criterion.store.workLocation.Areas',
            'criterion.store.workLocation.Tasks',
            'criterion.store.employer.CertifiedRates',
            'criterion.store.employer.Overtimes',
            'criterion.store.workLocation.Employees',
            'criterion.store.workLocation.Employers'
        ],

        controller : {
            type : 'criterion_settings_location_details',
            externalUpdate : false
        },

        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 0,

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        viewModel : {
            data : {
                showSelectEmployees : false,
                showSelectEmployers : false,

                countEmployeesSelected : 0,
                countEmployersSelected : 0
            },
            stores : {
                workLocationAreas : {
                    type : 'work_location_areas'
                },
                workLocationTasks : {
                    type : 'work_location_tasks'
                },
                certifiedRate : {
                    type : 'employer_certified_rates'
                },
                overtimes : {
                    type : 'criterion_employer_overtimes'
                },
                overtimeCodes : {
                    type : 'store',

                    proxy : {
                        type : 'memory',
                        reader : {
                            type : 'json'
                        }
                    },
                    fields : [
                        {
                            name : 'code',
                            type : 'string'
                        }
                    ],
                    sorters : [
                        {
                            property : 'code',
                            direction : 'ASC'
                        }
                    ]
                },

                workLocationEmployees : {
                    type : 'work_location_employees'
                },
                workLocationEmployers : {
                    type : 'work_location_employers'
                }
            },
            formulas : {
                phoneFormatParams : function(data) {
                    let countryCd = data('record.countryCd'),
                        country = countryCd && criterion.CodeDataManager.getCodeDetailRecord('id', countryCd, criterion.consts.Dict.COUNTRY);

                    return (country) ? {
                        countryCode : country && country.get('attribute1')
                    } : null;
                },
                schoolDistrict : function(data) {
                    let schdistName = data('record.schdistName'),
                        schdist = data('record.schdist');

                    if (schdistName) {
                        schdistName += schdist ? Ext.util.Format.format(' ({0})', schdist) : '';
                    } else {
                        schdistName = schdist;
                    }

                    return schdistName;
                },
                geoFenceIconCls : data => data('record.geofence') ? 'criterion-icon-geofence-blue' : 'criterion-icon-geofence-grey',

                employeesEmployersConfig : data => data('showSelectEmployees') || data('showSelectEmployers'),
                hideCancel : data => data('employeesEmployersConfig'),
                hideSave : data => data('employeesEmployersConfig'),
                hideDelete : data => data('hideDeleteInt') || data('employeesEmployersConfig'),
                hideNavigationBtns : data => data('employeesEmployersConfig')
            }
        },

        header : {

            title : {
                text : '',
                maxWidth : 1
            },

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-feature',
                    text : '< ' + i18n.gettext('Work Location'),
                    handler : 'backToWorkLocation',
                    hidden : true,
                    bind : {
                        hidden : '{!employeesEmployersConfig}'
                    }
                },
                {
                    xtype : 'component',
                    html : '<span class="bold fs-08">' + i18n.gettext('Work Location Details') + '</span>',
                    bind : {
                        hidden : '{employeesEmployersConfig}'
                    }
                },
                {
                    xtype : 'component',
                    flex : 1
                },
                {
                    xtype : 'component',
                    hidden : true,
                    bind : {
                        hidden : '{!employeesEmployersConfig}',
                        html : '<span class="bold fs-08">{record.description}</span>'
                    }
                },
                {
                    xtype : 'criterion_splitbutton',
                    text : i18n.gettext('Employees'),
                    cls : 'criterion-btn-feature',
                    handler : 'handleControlEmployees',
                    hidden : true,
                    bind : {
                        hidden : '{employeesEmployersConfig || isPhantom}'
                    },
                    margin : '0 10 0 0',
                    menu : [
                        {
                            text : i18n.gettext('Employers'),
                            handler : 'handleControlEmployers'
                        }
                    ]
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-like-link',
                    tooltip : i18n.gettext('Set Geofence'),
                    handler : 'handleEditGeoFence',
                    scale : 'medium',
                    margin : '0 10 0 0',
                    bind : {
                        iconCls : '{geoFenceIconCls}',
                        hidden : '{employeesEmployersConfig}'
                    }
                }
            ]
        },

        items : [
            {
                xtype : 'container',
                bind : {
                    hidden : '{employeesEmployersConfig}'
                },
                items : [
                    {
                        layout : 'hbox',
                        bodyPadding : 10,

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Code'),
                                        bind : '{record.code}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Description'),
                                        bind : '{record.description}'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Location type'),
                                        allowBlank : true,
                                        codeDataId : criterion.consts.Dict.LOCATION_TYPE,
                                        bind : '{record.locationTypeCd}'
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Certified Rate'),
                                        displayField : 'name',
                                        valueField : 'id',
                                        queryMode : 'local',
                                        name : 'certifiedRateId',
                                        allowBlank : true,
                                        editable : true,
                                        bind : {
                                            value : '{record.certifiedRateId}',
                                            store : '{certifiedRate}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Active'),
                                        bind : '{record.isActive}'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Country'),
                                        reference : 'countryCDField',
                                        name : 'countryCd',
                                        allowBlank : false,
                                        allowSetDefault : false,
                                        codeDataId : criterion.consts.Dict.COUNTRY,
                                        bind : {
                                            value : '{record.countryCd}',
                                            allowSetDefault : '{isPhantom}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Time Zone'),
                                        name : 'timezoneCd',
                                        allowBlank : false,
                                        codeDataId : criterion.consts.Dict.TIME_ZONE,
                                        bind : '{record.timezoneCd}'
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Overtime Code'),
                                        reference : 'overtimeCodeField',
                                        name : 'overtimeCode',
                                        editable : true,
                                        forceSelection : true,
                                        allowBlank : true,
                                        valueField : 'code',
                                        displayField : 'code',
                                        queryMode : 'local',
                                        bind : {
                                            store : '{overtimeCodes}',
                                            value : '{record.overtimeCode}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler',
                        margin : '0 10'
                    },
                    {
                        layout : 'hbox',
                        bodyPadding : 10,

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Address 1'),
                                        bind : '{record.address1}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Address 2'),
                                        bind : '{record.address2}'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('City'),
                                        name : 'city',
                                        bind : '{record.city}'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('State'),
                                        allowBlank : true,
                                        name : 'stateCd',

                                        codeDataId : criterion.consts.Dict.STATE,
                                        bind : {
                                            value : '{record.stateCd}',
                                            filterValues : {
                                                attribute : 'attribute1',
                                                value : '{countryCDField.selection.code}'
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'criterion_person_phone_number',
                                        fieldLabel : i18n.gettext('Phone'),
                                        bind : {
                                            rawNumber : '{record.phone}',
                                            displayNumber : '{record.phoneInternational}',
                                            formatParams : '{phoneFormatParams}'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Zip Code'),
                                        name : 'postalCode',
                                        bind : '{record.postalCode}'
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : i18n.gettext('Geocode / GNIS'),
                                        layout : 'hbox',
                                        anchor : '100%',
                                        defaults : {
                                            margin : '0 0 0 5'
                                        },
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                bind : '{record.geocode}',
                                                flex : 1,
                                                editable : false,
                                                allowBlank : true,
                                                margin : '0'
                                            },
                                            {
                                                xtype : 'button',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                action : 'select-employee-geocode-location',
                                                handler : 'handleSelectGeocode'
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'textfield',
                                        disableDirtyCheck : true,
                                        fieldLabel : i18n.gettext('School District'),
                                        readOnly : true,
                                        bind : {
                                            value : '{schoolDistrict}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'tabpanel',

                        cls : 'criterion-tab-bar-top-border',

                        tabBar : {
                            defaults : {
                                margin : 0
                            }
                        },

                        listeners : {
                            afterrender : function(panel) {
                                panel.tabBar.add([
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'button',
                                        text : i18n.gettext('Add'),
                                        margin : '0 10 5 0',
                                        cls : 'criterion-btn-feature',
                                        listeners : {
                                            click : 'handleAddObject'
                                        }
                                    }
                                ]);
                            }
                        },

                        items : [
                            {
                                xtype : 'criterion_gridview',

                                title : i18n.gettext('Work Areas'),

                                tbar : null,

                                preventStoreLoad : true,

                                bind : {
                                    store : '{workLocationAreas}'
                                },

                                controller : {
                                    connectParentView : false,
                                    editor : {
                                        xtype : 'criterion_settings_work_area'
                                    }
                                },

                                columns : [
                                    {
                                        xtype : 'gridcolumn',
                                        dataIndex : 'code',
                                        text : i18n.gettext('Code'),
                                        width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                                    },
                                    {
                                        xtype : 'gridcolumn',
                                        dataIndex : 'name',
                                        text : i18n.gettext('Name'),
                                        flex : 1
                                    }
                                ]
                            },
                            {
                                xtype : 'criterion_gridview',

                                title : i18n.gettext('Tasks'),

                                tbar : null,

                                preventStoreLoad : true,

                                bind : {
                                    store : '{workLocationTasks}',
                                    disabled : '{!workLocationAreas.count}'
                                },

                                controller : {
                                    connectParentView : false,
                                    editor : {
                                        xtype : 'criterion_settings_work_location_task',
                                        disableAutoSetLoadingState : true,
                                        bind : {
                                            workAreasStore : '{workLocationAreas}'
                                        }
                                    }
                                },

                                columns : [
                                    {
                                        xtype : 'gridcolumn',
                                        dataIndex : 'taskName',
                                        text : i18n.gettext('Task'),
                                        flex : 1
                                    },
                                    {
                                        xtype : 'gridcolumn',
                                        dataIndex : 'workLocationAreaName',
                                        text : i18n.gettext('Work Location Area'),
                                        flex : 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            // Employees
            {
                xtype : 'criterion_gridpanel',
                hidden : true,
                reference : 'employeesGrid',
                flex : 1,
                bind : {
                    hidden : '{!showSelectEmployees}',
                    store : '{workLocationEmployees}'
                },
                selType : 'checkboxmodel',
                selModel : {
                    checkOnly : true,
                    mode : 'MULTI',
                    listeners : {
                        selectionchange : 'handleEmployeesSelectionChange'
                    }
                },
                tbar : [
                    {
                        xtype : 'component',
                        html : '<span class="bold">' + i18n.gettext('Employees') + '</span>'
                    },
                    '->',
                    {
                        xtype : 'component',
                        hidden : true,
                        bind : {
                            html : '<span class="bold">{countEmployeesSelected} ' + i18n.gettext('selected') + '</span>',
                            hidden : '{!employeesGrid.selection}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        handler : 'handleRemoveEmployees',
                        hidden : true,
                        bind : {
                            hidden : '{!employeesGrid.selection}'
                        }
                    },
                    {
                        xtype : 'tbseparator',
                        hidden : true,
                        bind : {
                            hidden : '{!employeesGrid.selection}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        handler : 'handleAddEmployees'
                    }
                ],
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Last Name'),
                        dataIndex : 'lastName',
                        flex : 2
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('First Name'),
                        dataIndex : 'firstName',
                        flex : 2
                    },
                    {
                        text : i18n.gettext('Employer'),
                        dataIndex : 'employerName',
                        flex : 1
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Employee Number'),
                        dataIndex : 'employeeNumber',
                        flex : 1
                    },
                    {
                        xtype : 'booleancolumn',
                        text : i18n.gettext('Status'),
                        dataIndex : 'isActive',
                        trueText : i18n.gettext('Active'),
                        falseText : i18n.gettext('Inactive'),
                        width : 150
                    }
                ]
            },
            // Employers
            {
                xtype : 'criterion_gridpanel',
                hidden : true,
                flex : 1,
                bind : {
                    hidden : '{!showSelectEmployers}',
                    store : '{workLocationEmployers}'
                },
                reference : 'employersGrid',
                selType : 'checkboxmodel',
                selModel : {
                    checkOnly : true,
                    mode : 'MULTI',
                    listeners : {
                        selectionchange : 'handleEmployersSelectionChange'
                    }
                },
                tbar : [
                    {
                        xtype : 'component',
                        html : '<span class="bold">' + i18n.gettext('Employers') + '</span>'
                    },
                    '->',
                    {
                        xtype : 'component',
                        hidden : true,
                        bind : {
                            html : '<span class="bold">{countEmployersSelected} ' + i18n.gettext('selected') + '</span>',
                            hidden : '{!employersGrid.selection}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        handler : 'handleRemoveEmployers',
                        hidden : true,
                        bind : {
                            hidden : '{!employersGrid.selection}'
                        }
                    },
                    {
                        xtype : 'tbseparator',
                        hidden : true,
                        bind : {
                            hidden : '{!employersGrid.selection}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        handler : 'handleAddEmployers'
                    }
                ],
                columns : [
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Company Name'),
                        dataIndex : 'legalName'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('Alternate Name'),
                        dataIndex : 'alternativeName'
                    },
                    {
                        xtype : 'gridcolumn',
                        flex : 1,
                        text : i18n.gettext('National Identifier'),
                        dataIndex : 'nationalIdentifier'
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.callParent(arguments);

            this.getController() && this.getController().loadRecord(record);
        }
    };

});
