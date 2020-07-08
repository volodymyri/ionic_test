Ext.define('ess.controller.communities.BadgePicker', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_communities_badge_picker',

        onBadgesLoad : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            Ext.defer(function() {
                view.down('dataview').setSelection(vm.getStore('badges').getById(vm.get('badgeId')));
            }, 100);
        },

        onAddBadgeCancel : function() {
            this.getView().fireEvent('addBadgeCancel');
        },

        onAddBadgeDone : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                selection,
                badgeId,
                badgeRecipient;

            if (!vm.get('badgeRecipientId')) {
                criterion.Msg.error(i18n.gettext('Recipient field is required.'));
                return;
            }

            selection = view.down('dataview').getSelection();
            badgeId = selection ? selection.getId() : null;
            badgeRecipient = vm.getStore('communityUsers').getById(vm.get('badgeRecipientId'));

            view.fireEvent('badgeSelect', {
                badge : badgeId ? vm.getStore('badges').getById(badgeId) : null,
                badgeRecipientId : badgeRecipient.getId(),
                badgeRecipientName : badgeRecipient.get('personName'),
                badgeId : badgeId
            });
        },

        onBadgeRemove : function() {
            var view = this.getView();

            view.fireEvent('badgeSelect', {
                badge : null,
                badgeRecipientId : null,
                badgeRecipientName : null,
                badgeId : null
            });
        },

        onActivate : function() {
            var vm = this.getViewModel();

            vm.getStore('communityUsers').load();
            vm.getStore('badges').load();
        }
    };
});

