Ext.define('ess.controller.communities.PostEditor', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_communities_post_editor',

        requires : [
            'ess.view.communities.BadgePicker'
        ],

        onActivate : function() {
            this.setMessageHeight();
        },

        handleInitialize : function() {
            var me = this;

            Ext.Viewport.on('orientationchange', function() {
                me.setMessageHeight();
            }, me);
        },

        setMessageHeight : function() {
            this.lookupReference('message').setHeight(Ext.Viewport.getSize().height - 160);
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId');
        },

        onCancel : function() {
            this.getViewModel().get('posting').reject();
            this.getView().fireEvent('cancelEdit');
        },

        onSave : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                posting = vm.get('posting'),
                isNew = posting.phantom;

            if (!posting.get('communityId')) {
                criterion.Msg.error(i18n.gettext('Community field is required.'));
                return;
            }
            if (!posting.get('message')) {
                criterion.Msg.error(i18n.gettext('Message field is required.'));
                return;
            }

            view.setLoading(true);

            posting.set({
                employeeId : this.getEmployeeId()
            });

            posting.saveWithPromise()
                .then({
                    scope : this,
                    success : function() {
                        view.fireEvent('savePosting', posting, isNew);
                    }
                })
                .always(function() {
                    view.setLoading(false);
                });
        },

        onAddBadge : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.fireEvent('showBadgePicker', {
                communityId : vm.get('posting.communityId'),
                badgeId : vm.get('posting.badgeId'),
                badgeRecipientId : vm.get('posting.badgeRecipientId'),
                canRemove : !!vm.get('posting.badgeId'),
                authorId : this.getEmployeeId()
            });
        }
    };
});
