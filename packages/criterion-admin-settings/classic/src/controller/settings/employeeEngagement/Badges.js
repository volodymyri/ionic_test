Ext.define('criterion.controller.settings.employeeEngagement.Badges', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_badges',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        handleAddClick : function() {
            var badgeUploader = Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Add Badge Details'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 550
                    }
                ],
                fileParam : 'file',
                extraItems : [
                    {
                        xtype : 'textfield',
                        name : 'description',
                        padding : '20 0 0',
                        fieldLabel : i18n.gettext('Description'),
                        allowBlank : false
                    }
                ],
                url : criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.COMMUNITY_BADGE_IMAGE_UPLOAD),
                callback : this.load
            });

            badgeUploader.show();
        }
    };

});
