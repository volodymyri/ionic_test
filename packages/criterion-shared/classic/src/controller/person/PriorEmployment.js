Ext.define('criterion.controller.person.PriorEmployment', function() {

    return {
        alias : 'controller.criterion_person_prioremployment',

        extend : 'criterion.controller.FormView',

        externalUpdate : false,

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord(),
                phoneField = me.lookupReference('phoneField');

            this.isNewRecord = record.phantom;

            phoneField.validateNumber().then({
                success : function() {
                    if (form.isValid()) {
                        me.updateRecord(record, me.handleRecordUpdate);
                    } else {
                        me.focusInvalidField();
                    }
                },
                failure : function() {
                    me.focusInvalidField();
                }
            });
        }
    }

});
