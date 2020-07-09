Ext.define('criterion.controller.common.FileAttachForm', function() {

    var bytesInMb = criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB,
        maxFileSize = criterion.Consts.ATTACHMENTS_CONFIG.MAX_FILE_SIZE_MB,
        file;

        return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_file_attach_form',

        handleSelectFile : function(event, cmp) {
            var fileSizeInMb = this.getView().getFileSizeInMb(),
                maxSize = maxFileSize;

            cmp && cmp.setValidation(true);
            file = event.target && event.target.files && event.target.files[0];
            cmp.tmpFile = null;

            if (fileSizeInMb && maxSize) {
                maxSize = maxSize * bytesInMb;
            }

            if (file.size > maxSize) {
                cmp && cmp.setValidation(Ext.util.Format.format('Max File size is {0} MB', Math.round(maxSize / bytesInMb)));
            }
        },

        handleAfterRender : function() {
            var viewEl = this.getView().getEl(),
                document = this.lookupReference('document'),
                fileSizeInMb = this.getView().getFileSizeInMb();

            criterion.Api.requestWithPromise({
                url : this.getView().getMaxFileSizeUrl(),
                method : 'GET',
                silent : true
            }).then(function(mFileSize) {
                maxFileSize = mFileSize;
            });

            viewEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.addCls('drag-over');
                },
                drop : function(e) {
                    var maxSize = maxFileSize;

                    e.preventDefault();
                    e.stopPropagation();
                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];
                    if (file) {
                        document.inputEl.dom.value = file.name;
                        document.fileInputEl.el.dom.value = '';
                        document.tmpFile = file;
                    }

                    if (fileSizeInMb && maxSize) {
                        maxSize = maxSize * bytesInMb;
                    }

                    if (file.size > maxSize) {
                        document && document.setValidation(Ext.util.Format.format('Max File size is {0} MB', Math.round(maxSize / bytesInMb)));
                    }
                    viewEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    viewEl.removeCls('drag-over');
                }
            });
        },

        handleAttach : function() {
            var me = this,
                view = this.getView(),
                form = view.getForm(),
                document = this.lookupReference('document');

            if (form.isValid()) {
                view.setLoading(true);

                document.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm(form.getFields().items, {
                    url : view.getUploadUrl(),
                    scope : this,
                    success : function() {
                        view.success && Ext.isFunction(view.success.fn) && Ext.Function.defer(view.success.fn, 100, view.success.scope, Array.prototype.slice.call(arguments, 0));

                        view.callback && Ext.isFunction(view.callback.fn) && Ext.Function.defer(view.callback.fn, 100, view.callback.scope);
                        view.setLoading(false);
                        me.handleCancel();
                    },
                    failure : function() {
                        view.callback && Ext.isFunction(view.callback.fn) && Ext.Function.defer(view.callback.fn, 100, view.callback.scope);
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : document.inputEl.getWidth()
                }, me.handleUploadProgress);
                document.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var document = owner && owner.lookupReference('document');

            if (event.lengthComputable && document && document.inputEl) {
                document.inputEl.setWidth(parseInt(event.loaded / event.total * initialWidth, 10), true);
            }
        },

        handleCancel : function() {
            this.getView().destroy();
        }
    }
});
