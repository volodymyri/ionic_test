Ext.define('criterion.store.person.Contacts', function() {

    var API = criterion.consts.Api.API;

    return {
        alias : 'store.criterion_person_contacts',

        extend : 'criterion.store.AbstractStore',

        autoSync : false,

        config : function() {
            /**
             * @cfg {Boolean} isEmergency
             *
             * Specifies whether store contains emergency or dependents
             * contacts.
             */
            isEmergency: undefined
        },

        model : 'criterion.model.person.Contact',

        proxy : {
            type : 'criterion_rest',
            url : API.PERSON_CONTACT
        },

        applyIsEmergency : function(isEmergency) {
            return !!isEmergency;
        },

        /**
         * Return id record with (isEmergency === true) or false in absence case
         *
         * @returns {boolean|int}
         */
        checkPresentIsEmergency : function() {
            var res = false;

            this.each(function(record) {
                if (record.get('isEmergency')) {
                    res = record.getId();
                }
            });

            return res;
        }
    };

});
