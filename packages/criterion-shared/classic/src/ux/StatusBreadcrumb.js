Ext.define('criterion.ux.StatusBreadcrumb', function() {

    return {

        alias : 'widget.criterion_status_breadcrumb',

        extend : 'Ext.Component',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        data : {
            statuses : [],
            activeIdx : 0,
            extraInfo : '',
            additionalPath : ''
        },

        tpl : new Ext.XTemplate(
            '<tpl>',
                '<tpl for="statuses">',
                    '<a href="javascript:void(0)" class="{[(xindex - 1) == parent.activeIdx ? \'active\' : \'\']} {[values ? \'\' : \'x-hidden\']}">{.}</a>',
                '</tpl>',
                '<span class="breadcrumb-additional-path {[values.additionalPath ? "" : "x-hidden"]}">{additionalPath}</span>',
                '<span class="breadcrumb-extra-info">{extraInfo}</span>',
            '</tpl>'
        ),

        afterRender : function() {
            this.callParent(arguments);

            this.clickListener = this.el.on({
                click : 'onStatusBreadClick',
                destroyable : true,
                scope : this
            });
        },

        onStatusBreadClick : function(e) {
            this.fireEvent('click', e);
        },

        destroy : function() {
            this.clickListener && Ext.destroy(this.clickListener);
            this.callParent(arguments);
        }
    };

});
