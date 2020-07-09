Ext.define('criterion.controller.person.JobsAndPriorEmployments', function() {

    return {
        alias : 'controller.criterion_person_jobsandprioremployments',

        extend : 'criterion.app.ViewController',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        onEmployeeChange : function() {
            this.load();
        },

        load : function() {
            this.lookupReference('prioremployments').getController().load();
        }
    };

});