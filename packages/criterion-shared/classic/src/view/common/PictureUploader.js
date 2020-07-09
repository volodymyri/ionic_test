Ext.define('criterion.view.common.PictureUploader', function() {

    return {
        alias : 'widget.criterion_common_picture_uploader',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.PictureUploader'
        ],

        controller : 'criterion_common_picture_uploader',

        config : {
            dropGlyph : criterion.consts.Glyph['image'],
            fileParam : 'image',
            extraParams : null,
            extraItems : null,
            url : null,
            useCrop : null,
            maxFileSize : null,
            maxFileApi : null,
            fileSizeInMb : true,
            imageSize : null
        },

        viewModel : {
            data : {
                saveBtnText : i18n.gettext('Save')
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 450
            }
        ],

        bodyPadding : 15,

        title : i18n.gettext('Drag & drop image'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        listeners : {
            afterrender : 'handleAfterRender',
            show : 'handleShow'
        },

        buttons : [
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                scale : 'small',
                reference : 'saveBtn',
                disabled : 1,
                handler : 'handleSave',
                bind : {
                    text : '{saveBtnText}'
                }
            }
        ],

        initComponent : function() {
            var extraItems = this.getExtraItems();

            this.items = [
                {
                    reference : 'imageHolder',
                    layout : 'fit',
                    flex : 1,
                    items : [
                        {
                            cls : 'upload-zone',
                            html :  '<div class="upload-text">' +
                            '<span>&#' + this.getDropGlyph() + '</span>' +
                            Ext.util.Format.format('<div class="title">{0}</div>', i18n.gettext('DRAG & DROP')) +
                            '<div class="browse-holder">' +
                            Ext.util.Format.format('<span class="description">{0}</span><span> {1} </span>', i18n.gettext('your image to here,'), i18n.gettext('or')) +
                            '</div>' +
                            '</div>'
                        }
                    ]
                }
            ];

            extraItems && this.items.push({
                xtype : 'criterion_form',
                reference : 'extraItems',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : extraItems
            });

            this.callParent(arguments);
        }
    }
});
