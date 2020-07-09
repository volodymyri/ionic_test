Ext.define('criterion.controller.help.Requests', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_help_requests',

        onActivate : function() {
            this.onToolbarBack();
            this.search();
        },

        search : function() {
            var store,
                params = {},
                vm = this.getViewModel(),
                searchToken = ''; //Ext.String.trim(this.lookupReference('searchField').getValue()); disabling search for now

            if (!searchToken) {
                store = this.getStore('requestsList');
            } else {
                store = this.getStore('requestsSearch');
                params = {
                    query : searchToken
                }
            }

            vm.set('requests', store);

            store.load({
                params : params
            });
        },

        onSpecialKey : function(field, e) {
            if (e.getKey() == e.ENTER) {
                this.onSearch();
            }
        },

        onSearch : function() {
            this.search();
        },

        onAfterSave : function() {
            this.onToolbarBack();
            this.search();
        },

        onBeforeSaveRequest : function() {
            this.getViewModel().set('backButtonHidden', true);
        },

        onAfterSaveRequest : function() {
            this.getViewModel().set('backButtonHidden', false);
        },

        onToolbarBack : function() {
            var view = this.getView();

            this.getViewModel().set('isForm', false);

            view.setActiveItem(this.lookupReference('requestList'));
        },

        onToolbarAdd : function() {
            var view = this.getView(),
                form = this.lookupReference('requestForm');

            this.getViewModel().set('isForm', true);

            view.setActiveItem(form);
            form.loadRecord(Ext.create('criterion.model.zendesk.Request'));
        },

        onRequestClick : function(cmp, record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : 'requests/' + record.getId()})));
        }

    };

});