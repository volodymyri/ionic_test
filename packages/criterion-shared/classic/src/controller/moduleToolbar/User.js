Ext.define('criterion.controller.moduleToolbar.User', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_moduletoolbar_user',

        handleLogoutClick : function() {
            criterion.Api.logout();
        },

        handleRender : function() {
            var view = this.getView(),
                person = criterion.Api.getCurrentPerson(),
                middleName = person.middleName;

            if (!view.getGlyph()) {
                view.setIcon(
                    criterion.Utils.makePersonPhotoUrl(person.id, criterion.Consts.USER_PHOTO_SIZE.TOOLBAR_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.TOOLBAR_ICON_HEIGHT)
                );
            }
            if (view.userModuleWithUserName) {
                view.setText(person.firstName + ' ' + (middleName && middleName + ' ') + person.lastName);
            }

        }
    };

});
