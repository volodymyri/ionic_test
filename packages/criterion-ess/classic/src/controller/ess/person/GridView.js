Ext.define('criterion.controller.ess.person.GridView', function() {

    return {
        alias : 'controller.criterion_selfservice_person_gridview',

        extend : 'criterion.controller.person.GridView',

        suppressIdentity : ['employeeContext'],

        /**
         * @deprecated
         */
        getPerson : function() {
            return {};
        },

        /**
         * @deprecated
         */
        getEmployer : function() {
            return {};
        },

        handleAfterEdit : function() {
            this.callParent(arguments);
            this.load();
        }
    };
});
