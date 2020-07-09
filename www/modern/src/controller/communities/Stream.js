Ext.define('ess.controller.communities.Stream', function() {

    return {

        extend : 'criterion.controller.ess.community.Stream',

        alias : 'controller.ess_communities_stream',

        requires : [
            'criterion.model.community.Posting'
        ],

        load : function() {
            var view = this.getView();

            view.setLoading(true);

            this.getStore('postings').loadWithPromise({
                params : {
                    employeeId : this.getEmployeeId()
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId')
        },

        onPostingAdd : function() {
            var view = this.getView();

            view.fireEvent('addPosting', Ext.create('criterion.model.community.Posting'));
        },

        editPosting : function(posting) {
            var view = this.getView();

            view.fireEvent('addPosting', posting);
        }
    };
});
