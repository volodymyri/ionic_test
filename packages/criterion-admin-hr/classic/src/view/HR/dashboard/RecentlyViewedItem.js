Ext.define('criterion.view.hr.dashboard.RecentlyViewedItem', function() {

    return {

        alias : 'widget.criterion_hr_dashboard_recently_viewed_item',

        extend : 'Ext.container.Container',

        mixins : [
            'criterion.ux.mixin.Component'
        ],

        config : {
            record : undefined
        },

        layout : 'hbox',

        defaults : {
            margin : '0 0 5 10',
            flex : 1
        },

        itemTmpl : Ext.create(
            'Ext.XTemplate',
            '<tpl for=".">',
            '> <a href="#{path}/{personId}/{employerId}">{name}</a>',
            '</tpl>'
        ),

        setRecord : function(record) {
            if (!this.rendered) {
                this.on('render', function() {
                    this.setRecord(record);
                }, this, { single : true });
                return;
            }

            this.removeAll();
            this.add({
                html : this.itemTmpl.apply({
                    path : criterion.consts.Route.HR.EMPLOYEE,
                    personId : record.get('personId'),
                    employerId : record.get('employerId'),
                    name : record.get('name')
                })
            });
        }
    };

});
