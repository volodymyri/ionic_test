Ext.define('criterion.controller.settings.performanceReviews.RatingScaleGridView', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_rating_scale_gridview',

        extend : 'criterion.controller.GridView',

        init : function() {
            this.callParent(arguments);

            this.getView().getStore().setSorters({
                property : 'rating',
                direction : 'ASC'
            });
        },

        getEmptyRecord : function() {
            return {
                reviewScaleId : this.getViewModel().get('record.id')
            };
        },

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);
            // to prevent bug with two "modal" windows. to back one of them
            this.getView().up().setZIndex(99);
            return editor;
        }
    };

});
