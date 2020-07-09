Ext.define('criterion.view.payroll.batch.Import', function() {

    return {

        alias : 'widget.criterion_payroll_batch_import',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.Import',
            'criterion.store.employer.payroll.Imports',
            'criterion.ux.grid.PanelExtended'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '100%',
                width : '100%'
            }
        ],

        viewModel : {
            data : {
                batchId : null,
                canBeSaved : false,
                fileIsValid : false
            },
            stores : {
                imports : {
                    type : 'criterion_employer_payroll_imports'
                }
            }
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        controller : {
            type : 'criterion_payroll_batch_import'
        },

        title : i18n.gettext('Import Data'),

        layout : 'fit',

        tbar : [
            {
                xtype : 'button',
                text : i18n.gettext('Load Timesheets'),
                cls : 'criterion-btn-feature',
                handler : 'handleImportTimesheet'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Import Incomes'),
                cls : 'criterion-btn-feature',
                handler : 'handleImportIncome'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Import Deductions'),
                cls : 'criterion-btn-feature',
                handler : 'handleImportDeductions'
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                reference : 'submit',
                text : i18n.gettext('Add to Batch'),
                disabled : true,
                bind : {
                    disabled : '{!canBeSaved}'
                },
                handler : 'handleSubmit'
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel_extended',

                width : '100%',
                reference : 'importGrid',

                scrollable : 'vertical',

                useDefaultTbar : false,
                useDefaultActionColumn : false,
                rowEditing : false,
                hasOwnSelModel : true,

                selModel : {
                    type : 'checkboxmodel',
                    mode : 'SINGLE',
                    allowDeselect : true,
                    checkColumnRenderer : function(value, meta, record) {
                        let me = this,
                            cls = me.checkboxCls;

                        if (value) {
                            cls += ' ' + me.checkboxCheckedCls;
                        }

                        if (record.get('isAdded')) {
                            record.markAsSkippedForSelection = true;

                            return '';
                        }

                        delete record.markAsSkippedForSelection;

                        return '<span class="tg-checkbox ' + cls + '"></span>';
                    },
                    listeners : {
                        beforeselect : function(selModel, rec) {
                            return rec && !rec.get('isAdded')
                        }
                    }
                },

                bind : {
                    store : '{imports}'
                },

                listeners : {
                    scope : 'controller',
                    getErrorsAction : 'onGetErrors',
                    removeAction : 'onRemove',
                    selectionchange : 'onSelectionChange'
                },

                columns : {
                    defaults : {
                        width : 160
                    },
                    items : [

                        {
                            text : i18n.gettext('File Name'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        {
                            xtype : 'datecolumn',
                            text : i18n.gettext('Import Time'),
                            dataIndex : 'importDate',
                            format : criterion.consts.Api.DATE_AND_TIME_FORMAT,
                            width : 200
                        },
                        {
                            text : i18n.gettext('Valid Records'),
                            dataIndex : 'successCount'
                        },
                        {
                            text : i18n.gettext('Errors'),
                            dataIndex : 'errorsCount'
                        },
                        {
                            xtype : 'booleancolumn',
                            text : i18n.gettext('Added to Batch'),
                            dataIndex : 'isAdded',
                            trueText : i18n.gettext('Yes'),
                            falseText : i18n.gettext('No')
                        },
                        {
                            xtype : 'criterion_actioncolumn',
                            width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                            items : [
                                {
                                    glyph : criterion.consts.Glyph['ios7-download-outline'],
                                    tooltip : i18n.gettext('Download CSV file with errors'),
                                    action : 'getErrorsAction',
                                    getClass : function(v, m, record) {
                                        return (record && record.get('errorsCount') == 0) && 'hidden-el';
                                    },
                                    isActionDisabled : function(view, rowIndex, colIndex, item, record) {
                                        return !(record && record.get('errorsCount') > 0);
                                    }
                                },
                                {
                                    glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                    tooltip : i18n.gettext('Delete'),
                                    action : 'removeaction',
                                    getClass : function(v, m, record) {
                                        return (record && record.get('isAdded')) && 'hidden-el';
                                    },
                                    isActionDisabled : function(view, rowIndex, colIndex, item, rec) {
                                        return rec && rec.get('isAdded');
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }
});
