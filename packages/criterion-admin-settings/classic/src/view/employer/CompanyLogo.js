Ext.define('criterion.view.employer.CompanyLogo', function() {

    return {
        alias : 'widget.criterion_settings_company_logo',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        layout : 'vbox',

        config : {
            employerId : null
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
                    cls : 'criterion-settings-company-logo-image',
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

        setEmployerId : function(employerId) {
            this.callParent(arguments);
            this.updateLogo();
        },

        setNoLogo : function() {
            this.down('#image').setStyle({
                backgroundImage : 'none'
            });
        },

        updateLogo : function() {
            this.down('#image').setStyle({
                backgroundImage : 'url(' + criterion.Api.getSecureResourceUrl(criterion.Api.getEmployerLogo(this.getEmployerId())) + ')'
            });
        },

        handleChangeFileLogo : function() {
            Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Edit Logo'),
                modal : true,
                url : criterion.Api.getSecureResourceUrl(criterion.Api.getEmployerLogo(this.getEmployerId())),

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
