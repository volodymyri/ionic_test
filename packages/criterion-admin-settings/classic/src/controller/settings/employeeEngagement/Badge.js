Ext.define('criterion.controller.settings.employeeEngagement.Badge', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_badge',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        updateData : null,

        handleChange : function() {
            var badgeUploader = Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Upload Badge Image'),
                fileParam : 'file',
                modal : true
            });

            badgeUploader.on('save', this.onEditBadge, this);
            badgeUploader.show();
        },

        onEditBadge : function(data, src) {
            var badgeImage = this.lookupReference('badgeImage');

            this.updateData = data;
            badgeImage.setSrc(src);
        },

        handleRecordUpdate : function(record) {
            var me = this,
                view = this.getView();

            if (this.updateData || record.dirty) {
                var data = this.updateData || {};

                if (record.dirty) {
                    Ext.Object.merge(data, record.getChanges());
                }

                view.setLoading(true);

                criterion.Api.submitFakeForm([], {
                    url : Ext.util.Format.format('{0}/{1}', API.COMMUNITY_BADGE, record.getId()),
                    method : 'PUT',
                    scope : this,
                    extraData : data,
                    success : function() {
                        view.setLoading(false);
                        this.onAfterSave.call(me, view, record);
                        this.close();
                    },
                    failure : function() {
                        view.setLoading(false);
                    }
                });
            } else {
                me.close();
            }
        }

    };

});
