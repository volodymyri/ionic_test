Ext.define('criterion.view.settings.performanceReviews.manageReviews.StatusWidget', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_manage_reviews_status_widget',

        extend : 'Ext.container.Container',

        requires : [
            'Ext.Progress'
        ],

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        margin : '10 0 10 0',

        viewModel : {
            data : {
                status : '',
                fullMode : false,
                progress : 0.5
            }
        },

        config : {
            /**
             * store
             */
            statuses : null,
            typeCode : null
        },

        items : [
            {
                xtype : 'button',
                margin : '0 15 0 10',
                cls : 'criterion-btn-like-link',
                text : i18n.gettext('View Details'),
                bind : {
                    hidden : '{!fullMode}'
                },
                hidden : true,
                handler : function() {
                    var view = this.up('criterion_settings_performance_reviews_manage_reviews_status_widget');

                    view.fireEvent('showDetails', view.getStatuses());
                }
            },
            {
                xtype : 'component',
                cls : 'text-cmp',
                padding : '1 20 0 10',
                bind : {
                    html : '{status}'
                }
            },
            {
                xtype : 'progress',
                flex : 1,
                height : 10,
                margin : '0 10 0 10',
                bind : {
                    value : '{progress}',
                    hidden : '{!fullMode}'
                }
            }
        ],

        setStatuses : function(statuses) {
            var me = this,
                vm = this.getViewModel(),
                completed = 0,
                total;

            this.callParent(arguments);

            Ext.Function.defer(function() {
                if (statuses && statuses.isStore) {
                    total = statuses.getCount();

                    if (me.isFullMode()) {
                        statuses.each(function(rec) {
                            rec.get('isComplete') ? completed++ : null;
                        });

                        vm.set('status', Ext.String.format(i18n.gettext('{0} of {1} complete'), completed, total));
                        vm.set('progress', (completed / total));
                    } else {
                        vm.set('status', total ? statuses.getAt(0).get('status') : '');
                    }
                }
            }, 100);
        },

        setTypeCode : function(typeCode) {
            this.callParent(arguments);
            this.getViewModel().set('fullMode', this.isFullMode());
        },

        isFullMode : function() {
            return Ext.Array.indexOf(['SELF', 'MANAGER'], this.getTypeCode()) === -1;
        }
    }
});
