Ext.define('criterion.view.CustomFieldsContainer', function() {

    return {

        alias : 'widget.criterion_customfields_container',

        extend : 'Ext.container.Container',

        requires : [
            'criterion.view.CustomFields',
            'criterion.controller.CustomFieldsContainer'
        ],

        controller : {
            type : 'criterion_custom_fields_container'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        config : {
            entityType : null,
            numColumns : 2,
            topBorder : false,
            bottomBorder : false,
            suppressCaption : false,
            labelWidth : null,
            hideTopBlock : false,
            hideBottomBlock : false,
            readOnly : false,
            isResponsive : true,
            withDescription : false
        },

        scrollable : false,

        initComponent : function() {
            this.items = [
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    border : this.getTopBorder() ? '1 0 0 0' : (!this.getSuppressCaption() ? '0 0 1 0' : 0),
                    style : {
                        borderColor : '#EEE',
                        borderStyle : 'solid'
                    },
                    padding : '10 0 0 0',
                    margin : '10 10 10 0',
                    width : '100%',
                    hidden : this.getHideTopBlock(),
                    items : !this.getSuppressCaption() && [
                        {
                            xtype : 'component',
                            flex : 1
                        },
                        {
                            xtype : 'component',
                            html : '<sup class="criterion-blue">' + (this.getWithDescription() ? this.getEntityType().description : i18n.gettext('Custom Fields')) + '</sup>'
                        }
                    ]
                },
                {
                    xtype : 'criterion_customfields',

                    ui : 'clean',

                    reference : 'customFields',
                    numColumns : this.getNumColumns(),
                    entityTypeCode : this.getEntityType().code,
                    labelWidth : this.getLabelWidth(),
                    readOnly : this.getReadOnly(),
                    isResponsive : this.getIsResponsive(),
                    scrollable : false
                },
                {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },
                    margin : '10 10 10 0',
                    border : this.getBottomBorder() ? '1 0 0 0' : 0,
                    style : {
                        borderColor : '#EEE',
                        borderStyle : 'solid'
                    },
                    hidden : this.getHideBottomBlock(),
                    items : [
                        {
                            flex : 1
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        load : function() {
            return this.getController().load.apply(this, Ext.Array.toArray(arguments));
        },

        save : function() {
            return this.getController().save.apply(this, Ext.Array.toArray(arguments));
        },

        setReadOnly : function(value) {
            this.items && this.items.items && Ext.Array.each(this.query('criterion_customfields'), function(customfield) {
                customfield.setReadOnly(value);
            });

            this.callParent(arguments);
        },

        getFieldsValues : function() {
            return this.lookup('customFields').getFieldsValues();
        },

        setFieldsValues : function(values) {
            this.lookup('customFields').setFieldsValues(values);
        }
    };
});
