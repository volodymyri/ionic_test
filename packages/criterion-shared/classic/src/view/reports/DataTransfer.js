Ext.define('criterion.view.reports.DataTransfer', function() {

    return {

        alias : 'widget.criterion_reports_datatransfer',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.reports.DataTransfer',
            'criterion.store.Transfers',
            'criterion.view.reports.DataTransferOptions'
        ],

        viewModel : {
            data : {
                transferId : null
            },
            stores : {
                transfers : {
                    type : 'criterion_transfers'
                }
            }
        },

        controller : {
            type : 'criterion_reports_datatransfer'
        },

        listeners : {
            scope : 'controller',
            show : 'handleActivate'
        },

        tbar : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Data Transfer Name'),
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                width : criterion.Consts.UI_DEFAULTS.ITEM_WIDE_WIDTH,
                displayField : 'name',
                valueField : 'id',
                queryMode : 'local',
                excludeForm : true,
                margin : '10',
                bind : {
                    store : '{transfers}',
                    value : '{transferId}'
                },
                listeners : {
                    change : 'handleDataTransferChange'
                }
            }
        ],

        layout : 'fit',

        bbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Execute'),
                handler : 'handleTransferExec',
                cls : 'criterion-btn-feature',
                bind : {
                    hidden : '{!transferId}'
                }
            }
        ],

        items : [
            {
                xtype : 'criterion_reports_data_transfer_options',
                reference : 'transferOptions',
                listeners : {
                    setDownloadableResult : 'handleSetDownloadableResult'
                }
            }
        ]

    }
});
