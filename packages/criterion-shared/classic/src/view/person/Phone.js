Ext.define('criterion.view.person.Phone', function() {

    return {
        alias : 'widget.criterion_person_phone',

        extend : 'Ext.form.FieldContainer',

        defaults : {
            margin : '0 0 0 5'
        },

        layout: 'hbox',

        focus : function() {
            this.down('#phoneNumber').focus();
        },

        items : [
            {
                xtype : 'criterion_code_detail_field',
                itemId : 'phoneTypeId',
                name : 'phoneTypeId',
                codeDataId : criterion.consts.Dict.PHONE_TYPE,
                allowBlank : false,
                emptyText : i18n.gettext('Phone Type'),
                width : 150,
                margin : 0
            },
            {
                xtype : 'textfield',
                itemId : 'phoneNumber',
                name : 'phoneNumber',
                emptyText : i18n.gettext('Number'),
                allowBlank : false,
                flex : 1
            }
        ]
    };

});
