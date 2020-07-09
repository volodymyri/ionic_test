Ext.define('criterion.controller.ess.community.BadgePicker', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_community_badge_picker',

        onBadgesLoad : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            this.lookupReference('badgeDataView').setSelection(this.getStore('badges').getById(vm.get('badgeId')));
        },

        onCommunityUsersLoad : function() {
            var communityUsers = this.getStore('communityUsers');

            communityUsers.remove(communityUsers.getById(this.getViewModel().get('authorId')));
        },

        onBadgeSelect : function(cmp, record) {
            this.getViewModel().set('badgeId', record.getId());
        },
        
        onSelect : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                badgeId = vm.get('badgeId'),
                badgeRecipient = this.getStore('communityUsers').getById(vm.get('badgeRecipientId'));

            view.fireEvent('select', {
                badge : badgeId ? this.getStore('badges').getById(badgeId) : null,
                badgeRecipientId : badgeRecipient.getId(),
                badgeRecipientName : badgeRecipient.get('personName'),
                badgeId : badgeId
            });
            
            view.close();
        },

        onRemove : function() {
            var view = this.getView();

            view.fireEvent('select', {
                badge : null,
                badgeRecipientId : null,
                badgeRecipientName : null,
                badgeId : null
            });

            view.close();
        }

    };

});