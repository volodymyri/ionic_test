Ext.define('criterion.view.common.LogoUploader', function() {

    return {
        alias : 'widget.criterion_logo_uploader',

        extend : 'Ext.form.FieldContainer',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        layout : 'vbox',

        config : {
            logoId : null,
            logoType : null
        },

        frame : true,

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'component',
                    itemId : 'image',
                    width : 220,
                    height : 70,
                    cls : 'criterion-common-logo-uploader-image',
                    style : {
                        'background-size' : 'contain',
                        'background-repeat' : 'no-repeat',
                        'background-position' : 'center'
                    }
                },
                {
                    layout : {
                        type : 'hbox',
                        pack : 'end'
                    },
                    width : 220,
                    items : [
                        {
                            xtype : 'button',
                            glyph : criterion.consts.Glyph['ios7-plus'],
                            cls : 'criterion-btn-transparent',
                            text : '',
                            width : 30,
                            height : 30,
                            listeners : {
                                click : {
                                    fn : 'handleChangeFileLogo',
                                    scope : me
                                }
                            }
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        },

        setNoLogo : function() {
            this.down('#image').setStyle({
                backgroundImage : 'none'
            });
        },

        updateLogo : function(logoId, logoType) {
            logoId && this.setLogoId(logoId);
            logoType && this.setLogoType(logoType);

            this.down('#image').setStyle({
                backgroundImage : 'url(' + criterion.Api.getSecureResourceUrl(criterion.Api.getLogo(this.getLogoId(), this.getLogoType())) + ')'
            });
        },

        handleChangeFileLogo : function() {
            Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Edit Logo'),
                modal : true,
                url : criterion.Api.getSecureResourceUrl(criterion.Api.getLogo(this.getLogoId(), this.getLogoType())),
                imageSize : criterion.Consts.REPORT_SETTINGS_LOGO_SIZE,
                scope : this,
                callback : Ext.bind(this._handleLogoUploadSuccess, this)
            }).show();
        },

        _handleLogoUploadSuccess : function() {
            this.updateLogo();
            this.fireEvent('logoUploadSuccess');
        }
    };
});
