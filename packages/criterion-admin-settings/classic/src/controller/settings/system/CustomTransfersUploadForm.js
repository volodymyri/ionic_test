Ext.define('criterion.controller.settings.system.CustomTransfersUploadForm', function() {

    var TRANSFER_TYPE = criterion.Consts.TRANSFER_TYPE,
        DICT = criterion.consts.Dict,
        API = criterion.consts.Api.API,
        transfer,
        record;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_custom_transfers_upload_form',

        handleSelectTransferFile : function(event) {
            transfer = event.target && event.target.files && event.target.files[0];
        },

        handleRecordLoad : function(rec) {
            var dataTransferTypeRecord;

            record = rec;
            this.getViewModel().set('isEdit', !rec.phantom);

            if (rec.phantom) {
                dataTransferTypeRecord = criterion.CodeDataManager.getCodeDetailRecord('code', TRANSFER_TYPE.DATA_TRANSFER, DICT.TRANSFER_TYPE);
                dataTransferTypeRecord && rec.set('transferTypeCd', dataTransferTypeRecord.getId());
            }
        },

        handleAfterRender : function() {
            var transferFile = this.lookupReference('transferFile'),
                transferFileEl = transferFile.getEl();

            transferFileEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    transferFileEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    transfer = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (transferFile && transfer) {
                        transferFile.inputEl.dom.value = transfer.name;
                    }

                    transferFileEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    transferFileEl.removeCls('drag-over');
                }
            });
        },

        handleSave : function() {
            var me = this,
                view = this.getView(),
                transferFile = this.lookup('transferFile'),
                name = this.lookup('name'),
                isImport = this.lookup('isImport'),
                transferType;

            if (me.getView().getForm().isValid()) {

                if (!record.phantom) {
                    me.updateRecord(record, me.handleRecordUpdate);

                    return;
                }

                transferType = {
                    name : 'transferTypeCd',
                    value : record.get('transferTypeCd')
                };
                // Erase record since we are sending data via submitFakeForm
                record.erase();
                view.fireEvent('save', record);

                view.setLoading(true);
                transferFile.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([name, isImport, transferType], {
                    url : API.TRANSFER_UPLOAD,
                    scope : this,
                    extraData : {
                        transfer : transfer
                    },

                    success : Ext.Function.bind(function() {
                        view.setLoading(false);
                        view.fireEvent('afterSave');
                        view.destroy();
                    }),
                    failure : function() {
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : transferFile.inputEl.getWidth()
                }, me.handleUploadProgress);

                transferFile.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var transferFile = owner && owner.lookupReference('transferFile'),
                progress;

            if (event.lengthComputable && transferFile && transferFile.inputEl) {
                progress = parseInt(event.loaded / event.total * initialWidth, 10);
                transferFile.inputEl.setWidth(progress, true);
            }
        },

        handleTransferTypeChange : function(cmp, value) {
            record && record.set('transferTypeCd', value);

            if (!value) {
                return;
            }

            var selection = cmp.getSelection(),
                hideIsImport = Ext.Array.contains([TRANSFER_TYPE.ACH, TRANSFER_TYPE.GL], selection.get('code'));

            this.getViewModel().set('hideIsImport', hideIsImport);

        }
    };
});
