Ext.define('criterion.controller.common.PictureUploader', function() {

    var file, src, fileButton;

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_picture_uploader',

        requires : [
            'criterion.ux.ImageCrop'
        ],

        croppedImage : null,
        scale : 1,
        originalSize : {},

        handleAfterRender : function() {
            var imageHolderEl = this.lookup('imageHolder').getEl(),
                view = this.getView(),
                maxFileApi = view.getMaxFileApi(),
                me = this;

            maxFileApi && criterion.Api.requestWithPromise({
                url : maxFileApi,
                method : 'GET',
                silent : true
            }).then(function(mFileSize) {
                view.setMaxFileSize(mFileSize);
            });

            imageHolderEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageHolderEl.addCls('import-image-drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    me.handleSelectImage();

                    imageHolderEl.removeCls('import-image-drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageHolderEl.removeCls('import-image-drag-over');
                }
            });

            fileButton = Ext.create('Ext.form.field.FileButton', {
                renderTo : imageHolderEl.down('.browse-holder'),
                text : i18n.gettext('browse'),
                cls : 'criterion-btn-transparent',
                listeners : {
                    afterrender : function(cmp) {
                        cmp.fileInputEl.on('change', function(event) {
                            me.handleSelectFile(event);
                        });
                    }
                }
            });
        },

        handleShow : function() {
            fileButton.focus();
        },

        handleSelectImage : function() {
            var me = this,
                imageHolder = this.lookupReference('imageHolder'),
                reader = new FileReader();

            if (!file || !this.checkValid(file)) {
                return;
            }

            reader.onload = function(e) {
                var view = me.getView(),
                    tempImage = new Image(),
                    cropBackgroundImage = new Image(),
                    wRatio, hRatio, cWidth, cHeight, scale,
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    imageSize = view.getImageSize(),
                    useCrop = view.getUseCrop(),
                    saveBtn = me.lookupReference('saveBtn'),
                    mTB, mLR, component;

                tempImage.onload = function() {
                    if (imageSize) {
                        if (imageSize.MIN_WIDTH && tempImage.width < imageSize.MIN_WIDTH) {
                            criterion.Msg.warning(Ext.String.format(i18n.gettext('Image width must be greater than {0} pixels.'), imageSize.MIN_WIDTH));

                            return false;
                        } else if (imageSize.MIN_HEIGHT && tempImage.height < imageSize.MIN_HEIGHT) {
                            criterion.Msg.warning(Ext.String.format(i18n.gettext('Image height must be greater than {0} pixels.'), imageSize.MIN_HEIGHT));

                            return false;
                        } else if (imageSize.MAX_WIDTH && tempImage.width > imageSize.MAX_WIDTH) {
                            criterion.Msg.warning(Ext.String.format(i18n.gettext('Image width should not be greater than {0} pixels.'), imageSize.MAX_WIDTH));

                            return false;
                        } else if (imageSize.MAX_HEIGHT && tempImage.height > imageSize.MAX_HEIGHT) {
                            criterion.Msg.warning(Ext.String.format(i18n.gettext('Image height should not be greater than {0} pixels.'), imageSize.MAX_HEIGHT));

                            return false;
                        }
                    }

                    imageHolder.removeAll(true);

                    wRatio = tempImage.width / imageHolder.getWidth();
                    hRatio = tempImage.height / imageHolder.getHeight();

                    me.originalSize = {
                        w : tempImage.width,
                        h : tempImage.height
                    };

                    scale = (wRatio > 1 || hRatio > 1) ? ((wRatio > hRatio) ? wRatio : hRatio) : 1;

                    cWidth = tempImage.width / scale;
                    cHeight = tempImage.height / scale;

                    canvas.width = cWidth;
                    canvas.height = cHeight;

                    ctx.drawImage(tempImage, 0, 0, cWidth, cHeight);
                    src = cropBackgroundImage.src = canvas.toDataURL();

                    mLR = Math.floor((imageHolder.getWidth() - cWidth) / 2);
                    mTB = Math.round((imageHolder.getHeight() - cHeight) / 2);

                    if (useCrop) {
                        component = Ext.create('criterion.ux.ImageCrop', {
                            src : src,

                            width : cWidth,
                            height : cHeight,

                            minWidth : (scale > 1) ? 200 / scale : (cWidth > cHeight) ? cHeight : cWidth,
                            minHeight : (scale > 1) ? 200 / scale : (cWidth > cHeight) ? cHeight : cWidth,

                            preserveRatio : true,
                            margin : Ext.util.Format.format('{0} {1}', mTB, mLR)
                        });

                        component.on('changeCrop', function(cropComp, res) {
                            me.croppedImage = res;
                            saveBtn && saveBtn.setDisabled(false);
                        }, this);
                    } else {
                        component = Ext.create('Ext.Component', {
                            style : {
                                background : 'url(' + src + ') no-repeat left top'
                            },

                            width : cWidth,
                            height : cHeight,

                            margin : Ext.util.Format.format('{0} {1}', mTB, mLR)
                        });
                        saveBtn && saveBtn.setDisabled(false);
                    }

                    imageHolder.add(component);

                    me.scale = scale;
                }

                tempImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        },

        handleSelectFile : function(event) {
            file = event.target && event.target.files && event.target.files[0];
            this.handleSelectImage();
        },

        checkValid : function(image) {
            var v = image.name.replace(/^\s|\s$/g, ""),
                bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB,
                fileSizeInMb = this.getView().getFileSizeInMb(),
                maxFileSize = this.getView().getMaxFileSize();

            if (fileSizeInMb && maxFileSize) {
                maxFileSize = maxFileSize * bytesInMb;
            }

            if (!v.match(/([^\/\\]+)\.(gif|png|jpg|jpeg)$/i)) {
                criterion.Msg.error(Ext.String.format(i18n.gettext("Image extension can only be gif, png, jpg, jpeg")));
                return false;
            }

            if (maxFileSize && image.size > maxFileSize) {
                criterion.Msg.warning(Ext.String.format(i18n.gettext("Image file size must be less than {0} MB"), Math.round(maxFileSize / bytesInMb)));
                return false;
            }

            return true;
        },

        handleSave : function() {
            var me = this,
                view = this.getView(),
                url = view.getUrl(),
                useCrop = view.getUseCrop(),
                extraParams = view.getExtraParams(),
                extraItems = this.lookupReference('extraItems'),
                fileParam = view.getFileParam(),
                data = extraParams || {};

            data[fileParam] = file;

            if (!file || useCrop && !me.croppedImage || extraItems && !extraItems.isValid()) {
                return;
            }

            if (extraItems) {
                Ext.Object.merge(data, extraItems.getForm().getFieldValues());
            }

            useCrop && Ext.Object.merge(data, {
                x : Math.floor(me.croppedImage.x * me.scale + me.croppedImage.width * me.scale / 2),
                y : Math.floor(me.croppedImage.y * me.scale + me.croppedImage.width * me.scale / 2),
                r : Math.floor(me.croppedImage.width * me.scale / 2)
            });

            if (url) {
                me.lookupReference('saveBtn').setDisabled(true);
                view.setLoading(true);

                criterion.Api.submitFakeForm([], {
                    url : url,
                    scope : this,
                    extraData : data,

                    success : function(scope, result) {
                        Ext.isFunction(view.callback) ? view.callback(result) : null;
                        view.setLoading(false);
                        me.handleCancel();
                    },
                    failure : function() {
                        view.setLoading(false);
                        me.lookupReference('saveBtn').setDisabled(false);
                    }
                });
            } else {
                view.fireEvent('save', data, src);
                me.handleCancel();
            }
        },

        handleCancel : function() {
            this.getView().destroy();
        }
    }
});
