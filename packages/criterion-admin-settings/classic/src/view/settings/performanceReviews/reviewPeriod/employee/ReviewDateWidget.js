Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.employee.ReviewDateWidget', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_employee_review_date_widget',

        extend : 'Ext.container.Container',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        margin : '5 0',

        config : {
            fieldName : null
        },

        viewModel : {},

        items : [],

        setReviewers : function(reviewers) {
            if (reviewers && reviewers.isStore) {
                var me = this,
                    onReviewersChanged = function() {
                        me.onSetReviewers(reviewers);
                        me.up('criterion_gridpanel').reconfigure();
                    };

                this.onSetReviewers(reviewers);

                reviewers.on('add', function() {
                    onReviewersChanged();
                }, this);

                reviewers.on('remove', function() {
                    onReviewersChanged();
                }, this);
            }
        },

        onSetReviewers : function(reviewers) {
            var me = this,
                fieldName = me.getFieldName(),
                removedFields;

            removedFields = this.removeAll();

            reviewers.each(function(rec) {
                var cachedValue;

                Ext.Array.each(removedFields, function(removedField) {
                    if (rec.get('employeeId') === removedField.employeeId) {
                        cachedValue = removedField.getValue();
                    }
                });

                me.add({
                    xtype : 'datefield',
                    employeeId : rec.get('employeeId'),
                    value : cachedValue ? cachedValue : Ext.clone(rec.get(fieldName)),
                    margin : '0 5 3 5',
                    listeners : {
                        change : function(cmp, val) {
                            rec.set(fieldName, val);
                        }
                    },
                    onDirtyChange : Ext.emptyFn,
                    onTabOut : function(picker) {
                        if (!this.inputEl) {
                            return;
                        }

                        this.inputEl.focus();
                        this.collapse();
                    }
                })
            });
        },

        disable : function() {
            var items = this.items;

            items && items.each(function(item) {
                item.setDisabled(true);
            });

            this.callParent(arguments);
        }
    }
});
