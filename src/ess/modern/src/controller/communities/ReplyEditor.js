Ext.define('ess.controller.communities.ReplyEditor', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_communities_reply_editor',

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
            this.lookupReference('replyEditor').setHeight(Ext.Viewport.getSize().height - 100);
        },

        onCancel : function() {
            this.getViewModel().get('reply').reject();
            this.getView().fireEvent('cancelEdit');
        },

        onSave : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                reply = vm.get('reply'),
                posting = vm.get('posting'),
                isNew = reply.phantom;

            if (!reply.get('message')) {
                criterion.Msg.error(i18n.gettext('Message field is required.'));
                return
            }

            view.setLoading(true);

            reply.set({
                employeeId : vm.get('employeeId'),
                communityPostingId : posting.getId()
            });

            reply.saveWithPromise()
                .then({
                    scope : this,
                    success : function() {
                        view.fireEvent('saveReply', reply, isNew);
                    }
                })
                .always(function() {
                    view.setLoading(false);
                });
        }
    };
});
