Ext.define('criterion.view.customData.ListItem', function() {

    return {
        alias : [
            'widget.criterion_customdata_listitem'
        ],

        extend : 'Ext.form.FieldContainer',

        defaults : {
            margin : '0 0 0 5'
        },

        layout: 'hbox',

        focus : function() {
            this.down('#code').focus();
        },

        items : [
            {
                xtype : 'textfield',
                itemId : 'code',
                name : 'code',
                emptyText : i18n.gettext('Code'),
                allowBlank : false,
                width : 150,
                margin : 0
            },
            {
                xtype : 'textfield',
                itemId : 'description',
                name : 'description',
                emptyText : i18n.gettext('Description'),
                allowBlank : false,
                flex : 1
            }
        ]
    };

});