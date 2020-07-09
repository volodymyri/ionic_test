Ext.define('criterion.view.Reports', function() {

    return {

        alias : 'widget.criterion_reports',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'Ext.tree.Panel',
            'criterion.controller.Reports',
            'criterion.store.reports.Tree',
            'criterion.ux.SimpleIframe',
            'criterion.view.reports.DataGrid',
            'criterion.view.reports.DataTransfer'
        ],

        config : {
            allowAdminFeatures : true
        },

        viewModel : {
            data : {
                activeReport : null,
                optionsRecord : null,
                reportProgress : 1
            },

            stores : {
                reportsTreeStore : {
                    type : 'criterion_reports_tree',
                    sorters : 'sequence'
                },
                availableFormatsStore : {
                    proxy : {
                        type : 'memory'
                    },
                    sortOnLoad : false,
                    fields : [
                        {
                            name : 'id',
                            type : 'string'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : []
                }
            },

            formulas : {
                isStandardReport : vmget => {
                    let report = vmget('activeReport');

                    return report && !(report.get('custom') || report.get('memorized'));
                },
                isMemorized : vmget => {
                    let report = vmget('activeReport');

                    return report && report.get('memorized');
                },
                hideOptionBtn : vmget => {
                    let report = vmget('activeReport');

                    return !report;
                },
                hideMemorizeBtn : vmget => {
                    let report = vmget('activeReport');

                    return !report || report.get('memorized');
                },
                disableButtons : vmget => {
                    return vmget('reportProgress') !== 1;
                }
            }
        },

        mainRoute : criterion.consts.Route.HR.REPORTS,

        controller : {
            type : 'criterion_reports'
        },

        bodyPadding : 0,

        title : i18n.gettext('Reports'),

        layout : 'border',
        split : false,

        listeners : {
            hide : 'handleHide'
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'panel',
                    region : 'center',

                    layout : 'card',
                    reference : 'card',

                    items : [
                        {
                            xtype : 'panel',

                            reference : 'reports',

                            layout : 'fit',

                            dockedItems : me.getAllowAdminFeatures() ? {
                                xtype : 'toolbar',
                                dock : 'top',

                                bind : {
                                    hidden : '{!activeReport}'
                                },

                                items : [
                                    {
                                        text : i18n.gettext('Options'),
                                        reference : 'options',
                                        scale : 'small',
                                        cls : 'criterion-btn-feature',
                                        listeners : {
                                            click : 'showReportOptions'
                                        },
                                        bind : {
                                            hidden : '{hideOptionBtn}',
                                            disabled : '{disableButtons}'
                                        }
                                    },
                                    {
                                        text : i18n.gettext('Memorize'),
                                        scale : 'small',
                                        cls : 'criterion-btn-feature',
                                        listeners : {
                                            click : 'memorizeReport'
                                        },
                                        bind : {
                                            hidden : '{hideMemorizeBtn}',
                                            disabled : '{disableButtons}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        reference : 'reportFormat',
                                        queryMode : 'local',
                                        valueField : 'id',
                                        displayField : 'text',
                                        allowBlank : false,
                                        editable : false,
                                        bind : {
                                            store : '{availableFormatsStore}',
                                            disabled : '{reportProgress !== 1}'
                                        },
                                        listeners : {
                                            change : 'handleChangeTypeReport'
                                        }
                                    },
                                    '->',
                                    {
                                        text : i18n.gettext('Delete'),
                                        scale : 'small',
                                        cls : 'criterion-btn-remove',
                                        listeners : {
                                            click : 'deleteMemorized'
                                        },
                                        bind : {
                                            hidden : '{!isMemorized}'
                                        }
                                    }
                                ]
                            } : null,

                            items : [
                                {
                                    xtype : 'panel',
                                    layout : 'fit',

                                    cls : 'criterion-reports-container',
                                    margin : 10,
                                    listeners : {
                                        resize : 'handleFrameParentResize'
                                    },
                                    items : [
                                        {
                                            xtype : 'panel',

                                            bind : {
                                                hidden : '{activeReport}'
                                            },

                                            layout : {
                                                type : 'vbox',
                                                align : 'stretch',
                                                pack : 'center'
                                            },

                                            items : [
                                                {
                                                    xtype : 'component',
                                                    height : 100,
                                                    cls : 'criterion-no-reports-img'
                                                },
                                                {
                                                    xtype : 'component',
                                                    cls : 'criterion-no-reports-text',
                                                    html : Ext.util.Format.format(i18n.gettext('Select a "Menu Item" to view the Report'))
                                                },
                                                {
                                                    xtype : 'component',
                                                    cls : 'criterion-arrow',
                                                    height : 30
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'container',

                                            layout : {
                                                type : 'vbox',
                                                align : 'center',
                                                pack : 'center'
                                            },

                                            items : [
                                                {
                                                    xtype : 'criterion_percentagefield',
                                                    fieldLabel : i18n.gettext('Generating progress'),
                                                    hidden : true,
                                                    readOnly : true,
                                                    disabled : true,
                                                    bind : {
                                                        value : '{reportProgress}',
                                                        hidden : '{reportProgress === 1}'
                                                    }
                                                },
                                                {
                                                    xtype : 'criterion_simple_iframe',
                                                    hidden : true,
                                                    reference : 'reportIframe',
                                                    bind : {
                                                        hidden : '{!activeReport || reportProgress !== 1}'
                                                    },
                                                    listeners : {
                                                        boxready : 'onIFrameBoxReady'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        me.getAllowAdminFeatures() ? {
                            xtype : 'criterion_reports_datagrid',
                            reference : 'dataGrid'
                        } : null,
                        me.getAllowAdminFeatures() ? {
                            xtype : 'criterion_reports_datatransfer',
                            reference : 'dataTransfer'
                        } : null
                    ]
                },
                {
                    xtype : 'panel',
                    region : 'west',
                    width : 300,

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    scrollable : 'y',

                    cls : 'criterion-side-panel',

                    items : [
                        me.getAllowAdminFeatures() ? {
                            xtype : 'textfield',
                            emptyText : i18n.gettext('Filter Reports'),

                            reference : 'filterField',

                            padding : '16 0 0 0',

                            cls : 'criterion-side-field criterion-hide-default-clear',

                            style : {
                                borderBottom : 'none'
                            },

                            triggers : {
                                clear : {
                                    type : 'clear',
                                    cls : 'criterion-clear-trigger-transparent',
                                    hideWhenEmpty : true
                                }
                            },

                            listeners : {
                                change : 'handleReportsFilter'
                            }
                        } : null,
                        {
                            xtype : 'treepanel',
                            layout : 'fit',
                            split : true,
                            collapsible : false,
                            collapsed : false,
                            padding : '0 0 0 15',
                            width : 300,
                            useArrows : true,
                            cls : ['criterion-side-tree', 'criterion-tree-menu', 'criterion-side-field'],

                            reference : 'reportsTree',

                            displayField : 'typedName',

                            bind : {
                                store : '{reportsTreeStore}'
                            },

                            hideHeaders : true,
                            columns : [{
                                xtype : 'treecolumn',
                                text : '',
                                flex : 1,
                                dataIndex : 'typedName',
                                cellTpl : [
                                    '<tpl for="lines">',
                                    '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
                                    '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"/>',
                                    '</tpl>',
                                    '<tpl if="checked !== null">',
                                    '<input type="button" {ariaCellCheckboxAttr}',
                                    ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
                                    '</tpl>',
                                    '<img src="{blankUrl}" role="presentation" class="{childCls} {baseIconCls} ',
                                    '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
                                    '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
                                    '<tpl if="href">',
                                    '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
                                    '<tpl else>',
                                    '<span class="{textCls} {childCls}">{value}</span>',
                                    '</tpl>',
                                    '<span align="right" src="{blankUrl}" class="{childCls} {elbowCls}-img {elbowCls}',
                                    '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></span>'
                                ]
                            }],

                            listeners : {
                                itemclick : 'handleClick'
                            },

                            autoLoad : false,
                            rootVisible : false,
                            animate : false
                        },
                        me.getAllowAdminFeatures() ? {
                            xtype : 'treepanel',

                            padding : '15 0 15 15',

                            reference : 'dataTree',

                            useArrows : false,
                            cls : ['criterion-side-tree', 'criterion-tree-menu'],
                            hideHeaders : true,
                            collapsible : false,
                            rootVisible : false,
                            store : Ext.create('Ext.data.TreeStore', {
                                root : {
                                    expanded : true,
                                    children : Ext.Array.clean([
                                        criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS_DATA_GRID, criterion.SecurityManager.READ)() ? {
                                            text : i18n.gettext('Data Grid'),
                                            leaf : false,
                                            href_ : me.mainRoute.DATA_GRID
                                        } : null,
                                        criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS_DATA_TRANSFER, criterion.SecurityManager.READ)() ? {
                                            text : i18n.gettext('Data Transfer'),
                                            leaf : false,
                                            href_ : me.mainRoute.DATA_TRANSFER
                                        } : null
                                    ])
                                }
                            }),
                            columns : [{
                                xtype : 'treecolumn',
                                text : '',
                                flex : 1,
                                dataIndex : 'text',
                                cellTpl : [
                                    '<tpl for="lines">',
                                    '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
                                    '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"/>',
                                    '</tpl>',
                                    '<tpl if="checked !== null">',
                                    '<input type="button" {ariaCellCheckboxAttr}',
                                    ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
                                    '</tpl>',
                                    '<img src="{blankUrl}" role="presentation" class="{childCls} {baseIconCls} ',
                                    '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
                                    '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
                                    '<tpl if="href">',
                                    '<a href="{href}" role="button" target="{hrefTarget}" class="criterion-tree-menu">{value}</a>',
                                    '<tpl else>',
                                    '<span class="{textCls} {childCls}">{value}</span>',
                                    '</tpl>'
                                ]
                            }],
                            listeners : {
                                itemclick : 'handleDataClick'
                            }
                        } : null
                    ]
                }
            ];

            me.callParent(arguments);
        }
    }
});
