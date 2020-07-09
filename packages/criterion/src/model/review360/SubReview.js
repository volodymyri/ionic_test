Ext.define('criterion.model.review360.SubReview', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.review.Reviewer',
            'criterion.model.review360.Status'
        ],

        idProperty : {
            name : 'id',
            type : 'string'
        },

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'parentReviewId',
                type : 'string'
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'type',
                type : 'string'
            },
            {
                name : 'typeCode',
                type : 'string'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.review.Reviewer',
                name : 'reviewers',
                associationKey : 'reviewers'
            },
            {
                model : 'criterion.model.review360.Status',
                name : 'statuses',
                associationKey : 'statuses'
            }
        ]
    };
});
