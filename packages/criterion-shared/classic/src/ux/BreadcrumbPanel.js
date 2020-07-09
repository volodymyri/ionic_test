Ext.define('criterion.ux.BreadcrumbPanel', function() {

    return {

        alias : 'widget.criterion_breadcrumb_panel',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.StatusBreadcrumb'
        ],

        viewModel : {
            data : {
                activeViewIndex : 0,
                states : [],
                extraInfo : '',
                additionalPath : ''
            },
            formulas : {
                isLastCard : function(get) {
                    return get('activeViewIndex') && get('activeViewIndex') == this.getView().items.length - 1 || false;
                }
            }
        },

        tbar : {
            xtype : 'criterion_status_breadcrumb',

            bind : {
                data : {
                    statuses : '{states}',
                    activeIdx : '{activeViewIndex}',
                    extraInfo : '{extraInfo}',
                    additionalPath : '{additionalPath}'
                }
            },

            width : '100%',

            margin : '0 0 3 0'
        },

        layout : {
            type : 'card'
        },

        bind : {
            activeItem : '{activeViewIndex}'
        },

        defaults : {
            header : false,
            autoScroll : true
        },

        initComponent : function() {
            this.callParent(arguments);

            this.updateStates();
        },

        updateStates : function() {
            var states = [];

            this.items.each(function(item) {
                states.push(item.getTitle());
            });

            this.getViewModel().set('states', states);
        }
    };

});
