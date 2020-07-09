Ext.define('criterion.controller.help.Request', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_help_request',

        handleCancelClick : function() {
            this.getView().fireEvent('cancel');
        },

        onHelpClick : function() {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : ''})));
        },

        handleAfterRecordLoad : function() {
            this.getViewModel().set({
                files : null,
                fileNames : ''
            });

            if (this.fileButton) {
                this.fileButton.fileInputEl.dom.value = null;
            }
        },

        handleAfterRender : function() {
            var imageHolderEl = this.lookup('imageHolder').getEl(),
                me = this;

            imageHolderEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageHolderEl.addCls('import-image-drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageHolderEl.removeCls('import-image-drag-over');

                    e.event.dataTransfer && me.handleAddFiles(e.event.dataTransfer.files);

                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageHolderEl.removeCls('import-image-drag-over');
                }
            });

            me.fileButton = Ext.create('Ext.form.field.FileButton', {
                renderTo : imageHolderEl.down('.add-holder'),
                text : i18n.gettext('Add file'),
                cls : 'criterion-btn-transparent',
                listeners : {
                    afterrender : function(cmp) {
                        cmp.fileInputEl.on('change', function(event) {
                            event.target && me.handleAddFiles(event.target.files);
                        });
                    }
                }
            });
        },

        handleAddFiles : function(files) {
            var vm = this.getViewModel();

            if (files && files.length) {
                vm.set('files', files);
                vm.set('fileNames', Ext.Array.pluck(files, 'name').join(' ,'));
            }
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                files = this.getViewModel().get('files'),
                record = this.getRecord(),
                data = {
                    subject : record.get('subject'),
                    description : record.get('description')
                };

            if (form.isValid()) {
                if (files && files.length) {
                    data['attachment'] = files;
                }

                form.setLoading(true);
                form.fireEvent('beforeSaveRequest');
                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.ZENDESK_REQUEST,
                    extraData : data,

                    success : function() {
                        form.fireEvent('afterSave');
                        form.fireEvent('afterSaveRequest');
                        form.setLoading(false);
                    },
                    failure : function() {
                        form.fireEvent('afterSaveRequest');
                        form.setLoading(false);
                    }
                });
            } else {
                me.focusInvalidField();
            }
        }
    };

});
