Ext.define('criterion.ux.TransferButton', function() {

    return {

        extend : 'Ext.button.Button',

        alias : [
            'widget.criterion_transfer_button'
        ],

        config : {
            /**
             * @cfg {String} transferAlias
             * Required. Used for identify server-side transformation file
             */
            transferAlias : null,
            /**
             * @cfg {Object} parameters
             * Transformation parameters. Used for client side binding.
             */
            parameters : {}
        },

        transferId : null,
        activeError : null,
        downloadableResult : false,

        initComponent : function() {
            this.callParent(arguments);
            this.on('beforerender', this.onBeforeRender);
        },

        onBeforeRender : function() {
            var me = this,
                transferAlias = this.getTransferAlias();

            if (transferAlias) {
                criterion.Api.requestWithPromise({
                    url : Ext.util.Format.format(criterion.consts.Api.API.GET_BY_ALIAS, transferAlias),
                    method : 'GET'
                }).then({
                    scope : me,
                    success : function(response) {
                        me.transferId = response.id;

                        Ext.iterate(response.parameters, function(parameter) {
                            if (['of', 'hof'].indexOf(parameter.dataType) > -1) {
                                me.downloadableResult = true;
                            }
                        })
                    }
                })
            } else {
                this.activeError = i18n.gettext('Transfer alias should be defined.');
                this.setTooltip(this.activeError);
            }
        },

        handler : function(cmp) {
            var me = this,
                parameters = this.getParameters();

            if (this.activeError) {
                criterion.Msg.error(this.activeError);
            } else {
                var view = this.up('panel') || this.up();

                view.setLoading(true);

                criterion.Api.submitFakeForm([], {
                    url : Ext.util.Format.format(criterion.consts.Api.API.TRANSFER_EXECUTE, me.transferId),
                    extraData : parameters,
                    scope : this,
                    success : function(result) {
                        cmp.setDisabled(false);
                        view.setLoading(false);
                        if (me.downloadableResult) {
                            window.open(criterion.Api.getSecureResourceUrl(Ext.util.Format.format(criterion.consts.Api.API.TRANSFER_DOWNLOAD, result.fileName, result.hash)));
                        }
                    },
                    failure : function() {
                        cmp.setDisabled(false);
                        view.setLoading(false);
                    }
                });
            }
        }
    }
});