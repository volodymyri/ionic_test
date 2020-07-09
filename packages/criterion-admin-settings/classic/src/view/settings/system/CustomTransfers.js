Ext.define('criterion.view.settings.system.CustomTransfers', function() {

    return {
        alias : 'widget.criterion_settings_custom_transfers',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.system.CustomTransfers',
            'criterion.view.settings.system.CustomTransfersUploadForm',
            'criterion.store.Transfers'
        ],

        title : i18n.gettext('Custom Transfers'),

        viewModel : {
            data : {
                employerId : null
            },
            stores : {
                transfers : {
                    type : 'criterion_transfers',
                    filters : [
                        {
                            property : 'isCustomTransfer',
                            value : true
                        }
                    ]
                }
            }
        },

        controller : {
            type : 'criterion_settings_custom_transfers',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_custom_transfers_upload_form',
                allowDelete : true
            }
        },

        bind : {
            store : '{transfers}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Transfer Name'),
                dataIndex : 'name',
                flex : 1,
                editor : 'textfield'
            }
        ]
    };

});
