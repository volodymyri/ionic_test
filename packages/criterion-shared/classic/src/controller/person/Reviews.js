Ext.define('criterion.controller.person.Reviews', function() {

    return {
        alias : 'controller.criterion_person_reviews',

        extend : 'criterion.controller.employee.GridView',

        requires : [
            'criterion.view.person.Review',
            'criterion.view.person.ReviewAggregated'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        handleAfterEdit : function() {
            this.callParent(arguments);
            this.load();
        },

        startEdit : function(record) {
            var editor = record.get('isAggregated') ? {
                xtype : 'criterion_person_review_aggregated',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            } : {
                xtype : 'criterion_person_review',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            };

            this.getViewModel().set('record', record);

            return this.callParent([record, editor]);
        },

        routeHandler : function(id) {
            var store = this.getView().getStore(),
                me = this,
                review = store.getById(id);

            if (review) {
                this.edit(review);
            } else {
                criterion.model.employee.Review.loadWithPromise(parseInt(id, 10)).then(function(review) {
                    me.edit(review);
                });
            }
        },

        handleSubGridBeforeCellClick : function(grid, td, cellIndex, record) {
            this.handleEditAction(record);
        }
    };

});
