Ext.define('criterion.view.common.FileAttachForm', function() {

    return {

        alias : 'widget.criterion_common_file_attach_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.FileAttachForm'
        ],

        controller : {
            type : 'criterion_common_file_attach_form'
        },

        config : {
            uploadUrl : null,
            maxFileSizeUrl : null,
            fileSizeInMb : true,
            attachButtonText : i18n.gettext('Attach'),
            extraFields : [],
            fileFieldName : 'document'
        },

        alwaysOnTop : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Attach File'),

        listeners : {
            afterrender : 'handleAfterRender'
        },

        initComponent : function() {

            this.items = Ext.Array.union([
                {
                    xtype : 'filefield',
                    fieldLabel : i18n.gettext('File Name'),
                    name : this.getFileFieldName(),
                    reference : 'document',
                    flex : 1,
                    margin : '0 0 10 0',
                    buttonText : i18n.gettext('Browse'),
                    emptyText : i18n.gettext('Drop File here or browse'),
                    buttonOnly : false,
                    allowBlank : false,
                    listeners : {
                        change : function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);
                        },
                        afterrender : function(cmp) {
                            var me = cmp;
                            cmp.fileInputEl.on('change', function(event) {
                                me.fireEvent('onselectfile', event, me);
                            });
                        },
                        onselectfile : 'handleSelectFile'
                    }
                }
            ], this.getExtraFields());

            this.buttons = [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-light',
                    scale : 'small',
                    text : i18n.gettext('Cancel'),
                    handler : 'handleCancel'
                },
                {
                    xtype : 'button',
                    scale : 'small',
                    cls : 'criterion-btn-primary',
                    text : this.getAttachButtonText(),
                    handler : 'handleAttach'
                }
            ];

            this.callParent(arguments);
        }
    }
});
