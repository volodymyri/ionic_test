Ext.define('criterion.view.settings.performanceReviews.manageReviews.ReviewersWidget', function() {

    var REVIEW_TYPE_STATUSES = criterion.Consts.REVIEW_TYPE_STATUSES;

    return {

        alias : 'widget.criterion_settings_performance_reviews_manage_reviews_reviewers_widget',

        extend : 'Ext.container.Container',

        cls : 'criterion_settings_performance_reviews_manage_reviews_reviewers_widget',

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        margin : 10,

        viewModel : {
            data : {
                reviewers : '',
                allowManage : false
            }
        },

        config : {
            /**
             * store
             */
            reviewers : null,
            statuses : null,
            typeCode : null,
            reviewId : null,
            employeeId : null,

            multiString : false
        },

        items : [
            {
                xtype : 'button',
                margin : '0 5 0 5',
                cls : 'criterion-btn-transparent-light criterion-btn-only-icon',
                iconCls : 'x-fa fa-plus-circle',
                bind : {
                    hidden : '{!allowManage}'
                },
                hidden : true,
                handler : function() {
                    var view = this.up('criterion_settings_performance_reviews_manage_reviews_reviewers_widget');

                    view.fireEvent('manageReviewers', view.getReviewId(), view.getReviewers(), view.getStatuses(), view.getTypeCode(), view.getEmployeeId());
                }
            },
            {
                xtype : 'component',
                cls : 'text-cmp',
                bind : {
                    html : '{reviewers}'
                },
                width : '90%'
            }
        ],

        setReviewers : function(reviewers) {
            if (reviewers && reviewers.isStore) {
                this.onSetReviewers(reviewers);

                reviewers.on('datachanged', this.onSetReviewers, this);
            }

            this.callParent(arguments);
        },

        onSetReviewers : function(reviewers) {
            var vm = this.getViewModel(),
                html = [];

            reviewers.each(function(rec) {
                html.push(rec.get('employeeName'));
            });

            if (this.getMultiString()) {
                vm.set('reviewers', Ext.Array.map(html, function(item) {
                    return Ext.String.format('<p class="ml">{0}</p>', item);
                }).join(' '));
            } else {
                vm.set('reviewers', html.join(', '));
            }

            this.fireEvent('recalSize');
        },

        setTypeCode : function(typeCode) {
            this.getViewModel().set('allowManage', Ext.Array.indexOf([REVIEW_TYPE_STATUSES.SELF, REVIEW_TYPE_STATUSES.MANAGER], typeCode) === -1);

            this.callParent(arguments);
        }
    }
});
