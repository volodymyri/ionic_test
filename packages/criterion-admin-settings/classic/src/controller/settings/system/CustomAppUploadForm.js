Ext.define('criterion.controller.settings.system.CustomAppUploadForm', function() {

    var manifest,
        jar;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_custom_app_upload_form',

        handleSelectManifestFile : function(event) {
            manifest = event.target && event.target.files && event.target.files[0];
        },
        handleSelectJarFile : function(event) {
            jar = event.target && event.target.files && event.target.files[0];
        },

        handleAfterRender : function() {
            var view = this.getView(),
                manifestFile = this.lookupReference('manifestFile'),
                jarFile = this.lookupReference('jarFile'),
                manifestFileEl = manifestFile.getEl(),
                jarFileEl = jarFile.getEl();

            manifestFileEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    manifestFileEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    manifest = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (manifestFile && manifest) {
                        manifestFile.inputEl.dom.value = manifest.name;
                    }

                    manifestFileEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    manifestFileEl.removeCls('drag-over');
                }
            });

            jarFileEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    jarFileEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    jar = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    if (jarFile && jar) {
                        jarFile.inputEl.dom.value = jar.name;
                    }

                    jarFileEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    jarFileEl.removeCls('drag-over');
                }
            });
        },

        handleInstall : function() {
            var me = this,
                view = this.getView(),
                manifestFile = this.lookupReference('manifestFile'),
                jarFile = this.lookupReference('jarFile'),
                extraData = {
                    manifest : manifest,
                    jarFile : jar
                };

            if (me.getView().getForm().isValid()) {
                view.setLoading(true);
                manifestFile.inputEl.setStyle('background-color', '#eee');
                jarFile.inputEl.setStyle('background-color', '#eee');

                criterion.Api.submitFakeForm([], {
                    url : criterion.consts.Api.API.APP_UPLOAD,
                    scope : this,
                    extraData : extraData,

                    success : Ext.Function.bind(function() {
                        view.setLoading(false);
                        view.fireEvent('afterSave');
                        view.destroy();
                    }),
                    failure : function() {
                        view.setLoading(false);
                    },
                    owner : me,
                    initialWidth : manifestFile.inputEl.getWidth()
                }, me.handleUploadProgress);

                manifestFile.inputEl.setStyle('width', '1px');
                jarFile.inputEl.setStyle('width', '1px');
            }
        },

        handleUploadProgress : function(event, owner, initialWidth) {
            var manifestFile = owner && owner.lookupReference('manifestFile'),
                jarFile = owner && owner.lookupReference('jarFile'),
                progress;

            if (event.lengthComputable && manifestFile && manifestFile.inputEl) {
                progress = parseInt(event.loaded / event.total * initialWidth, 10);
                manifestFile.inputEl.setWidth(progress, true);
                jarFile.inputEl.setWidth(progress, true);
            }
        }
    }
});
