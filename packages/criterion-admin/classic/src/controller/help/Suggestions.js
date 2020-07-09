/**
 * @deprecated kill after 09.08.18
 */
Ext.define('criterion.controller.help.Suggestions', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_help_suggestions',

        requires : [
            'criterion.model.zendesk.Post'
        ],

        onActivate : function() {
            this.onToolbarBack();
            this.load();
        },

        load : function() {
            var posts = this.getViewModel().getStore('posts');

            posts.load();
        },

        onAfterSave : function() {
            this.onToolbarBack();
            this.load();
        },

        onToolbarBack : function() {
            var view = this.getView();

            this.getViewModel().set('isForm', false);

            view.setActiveItem(this.lookupReference('postList'));
        },

        onToolbarAdd : function() {
            var view = this.getView(),
                form = this.lookupReference('postForm'),
                vm = this.getViewModel();

            vm.set({
                isForm : true,
                newRecord : true
            });

            view.setActiveItem(form);
            form.loadRecord(Ext.create('criterion.model.zendesk.Post'));
        },

        onPostClick : function(cmp, record) {
            var view = this.getView(),
                form = this.lookupReference('postForm'),
                vm = this.getViewModel();

            vm.set({
                isForm : true,
                newRecord : false
            });

            view.setActiveItem(form);
            form.loadRecord(record);
        }
    };

});
