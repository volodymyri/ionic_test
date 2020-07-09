Ext.define('criterion.controller.person.Contacts', function() {

    return {
        alias : 'controller.criterion_person_contacts',

        extend : 'criterion.controller.person.GridView',

        getEmptyRecord : function() {
            var record = this.callParent(arguments);

            record.isEmergency = this.getView().isEmergency;

            return record;
        },

        createEditor : function(editor, record) {
            editor = Ext.apply(editor, {
                title : record.get('isEmergency') ? 'Emergency Contact' : 'Dependent'
            });

            return this.callParent([editor, record]);
        }
    };

});
