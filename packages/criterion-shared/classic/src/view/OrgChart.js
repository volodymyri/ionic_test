Ext.define('criterion.view.OrgChart', function() {

    return {
        alias : 'widget.criterion_orgchart',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'Ext.tree.Panel',
            'Ext.resizer.Splitter',
            'criterion.controller.OrgChart',
            'criterion.view.orgchart.PositionsReport',
            'criterion.view.orgchart.position.Card',

            'criterion.store.employee.OrgChart',
            'criterion.store.employee.OrgTree',
            'criterion.store.searchEmployee.ByNameEmployees',
            'criterion.model.Employer',

            'criterion.ux.form.field.EmployerCombo'
        ],

        viewModel : {
            data : {
                reportType : null,
                employerId : null,
                isSingleEmployer : true
            },

            stores : {
                orgChartStore : {
                    type : 'employee_org_chart'
                },
                exploreStore : {
                    type : 'employee_org_tree',
                    listeners : {
                        load : 'onExploreStoreLoad'
                    }
                },
                positions : {
                    type : 'positions'
                },
                searchStore : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'int'
                        },
                        {
                            name : 'employeeId',
                            type : 'int'
                        },
                        {
                            name : 'fullName',
                            type : 'string'
                        }
                    ]
                }
            }
        },

        title : i18n.gettext('Organization Structure'),

        config : {
            goToProfile : true,
            sidePanelCfg : null,
            reportPanelCfg : null,
            hideReportPanel : false,
            bottomToolbarCfg : null,
            sideBarCollapsible : true
        },

        controller : {
            type : 'criterion_orgchart'
        },

        plugins : {
            ptype : 'criterion_lazyitems'
        },

        layout : 'border',

        bodyPadding : 0,

        initComponent : function() {
            var me = this;

            me.callParent(arguments);

            me.getPlugin('criterionLazyItems').items = [
                Ext.Object.merge({}, {
                    xtype : 'panel',
                    region : 'west',
                    cls : 'criterion-side-panel',
                    split : true,
                    width : 400,
                    collapsible : me.getSideBarCollapsible(),
                    collapseMode : 'mini',

                    title : i18n.gettext('Filter'),
                    header : false,

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    defaults : {
                        labelAlign : 'top',
                        width : '100%',
                        cls : 'criterion-side-field'
                    },

                    items : [
                        {
                            xtype : 'criterion_code_detail_field',
                            reference : 'reportTypeCombo',
                            codeDataId : criterion.consts.Dict.ORG_STRUCTURE,

                            fieldLabel : i18n.gettext('Organization Structure'),
                            labelAlign : 'top',
                            editable : false,
                            forceSelection : true,

                            store : {
                                sorters : [{
                                    property : 'attribute1',
                                    direction : 'ASC'
                                }]
                            },

                            listeners : {
                                change : 'onReportTypeChange',
                                datachange : 'onReportComboDataChange'
                            },

                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            }
                        },
                        {
                            xtype : 'combobox',
                            reference : 'employeeSearchCombo',

                            bind : {
                                store : '{searchStore}'
                            },
                            listeners : {
                                select : 'onSearchEmployeeSelect'
                            },

                            name : 'searchPositionField',
                            queryMode : 'local',
                            fieldLabel : i18n.gettext('Search Employee'),
                            labelAlign : 'top',
                            triggerCls : 'x-form-search-trigger',
                            anyMatch : true,
                            editable : true,
                            expandOnFocus : false,
                            valueField : 'employeeId',
                            displayField : 'fullName',
                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            }
                        },
                        {
                            xtype : 'treepanel',
                            reference : 'positionExplorer',
                            ui : 'criterion-side-tree',
                            cls : 'criterion-side-tree',
                            displayField : 'combined',
                            useArrows : true,
                            rootVisible : false,
                            autoLoad : false,
                            animate : false, // important! due to bug in NodeInterface do not use animation
                            scrollable : {
                                x : false,
                                y : true,
                                scrollbars : false
                            },
                            border : false,
                            flex : 1,
                            bind : {
                                store : '{exploreStore}'
                            },
                            listeners : {
                                select : 'onExploreTreeSelect'
                            },
                            collapsible : false,
                            collapsed : false,
                            width : 300,
                            dockedItems : [
                                {
                                    xtype : 'button',
                                    dock : 'top',
                                    glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                                    ui : 'treenav',
                                    handler : 'onScrollTreeUp'
                                },
                                {
                                    xtype : 'button',
                                    dock : 'bottom',
                                    glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                                    ui : 'treenav',
                                    handler : 'onScrollTreeDown'
                                }
                            ]
                        }

                    ]
                }, me.getSidePanelCfg() || {}),
                Ext.Object.merge({}, {
                    xtype : 'panel',
                    cls : 'positions-report',
                    region : 'center',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    header : {
                        title : false,
                        hidden : me.getHideReportPanel(),
                        items : [
                            {
                                xtype : 'toolbar',
                                dock : 'top',
                                margin : 0,
                                padding : 0,

                                items : [
                                    '->',
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-transparent',
                                        glyph : criterion.consts.Glyph['ios7-download-outline'],
                                        tooltip : i18n.gettext('Export'),
                                        scale : 'medium',
                                        padding : 0,
                                        margin : '0 2 0 0',
                                        handler : 'onExportOrgChart',
                                        hidden : true,
                                        bind : {
                                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.ORGANIZATION_EXPORT, criterion.SecurityManager.ACT, true)
                                        }
                                    }
                                ]
                            }
                        ]
                    },

                    scrollable : true,

                    items : [
                        {
                            xtype : 'container',
                            padding : '20 14 20 50',
                            minWidth : 1100,
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },

                            items : [
                                {
                                    xtype : 'panel',
                                    cls : 'criterion-orgchart-reports',

                                    items : [
                                        {
                                            xtype : 'criterion_orgchart_positions_report',
                                            parentItemId : 'criterion_orgchart',
                                            editable : true,
                                            positionComponent : 'criterion_orgchart_position_card',
                                            goToProfile : me.getGoToProfile(),
                                            bind : {
                                                store : '{orgChartStore}',
                                                isSingleEmployer : '{isSingleEmployer}'
                                            },
                                            listeners : {
                                                gotoProfile : 'onGotoProfile',
                                                zoom : 'onZoomPosition',
                                                goToSupervisor : 'onGoToSupervisor'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, me.getReportPanelCfg() || {})
            ];
        }
    };

});
