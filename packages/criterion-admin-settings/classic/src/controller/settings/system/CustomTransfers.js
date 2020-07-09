Ext.define('criterion.controller.settings.system.CustomTransfers', function() {

    var TRANSFER_TYPE = criterion.Consts.TRANSFER_TYPE,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_custom_transfers',

        load : function() {
            var me = this;

            Ext.promise.Promise.all([
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', TRANSFER_TYPE.DATA_TRANSFER, DICT.TRANSFER_TYPE),
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', TRANSFER_TYPE.ACH, DICT.TRANSFER_TYPE),
                criterion.CodeDataManager.getCodeDetailRecordStrict('code', TRANSFER_TYPE.GL, DICT.TRANSFER_TYPE)
            ]).then(function(response) {
                if (!response || response.length < 2) {
                    return;
                }

                var dataTransferTypeRecord = response[0],
                    achTypeRecord = response[1],
                    glTypeRecord = response[2];

                me.superclass.load.call(me, (
                    dataTransferTypeRecord && ({
                        params : {
                            transferTypeCds : Ext.String.format('{0},{1},{2}', dataTransferTypeRecord.getId(), achTypeRecord.getId(), glTypeRecord.getId()),
                            isCustom : true
                        }
                    })
                ));
            });
        }
    };
});
