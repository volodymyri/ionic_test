Ext.define('criterion.view.recruiting.candidate.BackgroundReportPicker', function() {

    return {
        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.store.candidate.Backgrounds'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : '300px',
                modal : true
            }
        ],

        candidateId : null,

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.EXTERNAL_SYSTEM_NAME,
                text : i18n.gettext('External System'),
                dataIndex : 'externalSystemCd',
                flex : 1
            },
            {
                text : i18n.gettext('Status'),
                dataIndex : 'statusDescription',
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Updated'),
                dataIndex : 'updated'
            }
        ],

        constructor : function(config) {
            var extraParams = {};

            if (config && config.candidateId) {
                extraParams['candidateId'] = config.candidateId;
            }

            this.store = Ext.create('criterion.store.candidate.Backgrounds', {
                proxy : {
                    extraParams : extraParams
                }
            });

            this.callParent(arguments);
        }
    };

});