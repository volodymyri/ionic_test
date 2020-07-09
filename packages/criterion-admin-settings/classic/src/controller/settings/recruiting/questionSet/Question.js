Ext.define('criterion.controller.settings.recruiting.questionSet.Question', function() {

    return {
        alias : 'controller.criterion_settings_recruiting_question_set_question',

        extend : 'criterion.controller.FormView',

        handleRecordLoad : function(record) {
            var me = this,
                superFn = this.superclass.handleRecordLoad,
                vm = this.getViewModel();

            Ext.defer(function() {
                me.lookup('subQuestionField').getStore().loadWithPromise({
                    params : {
                        employerId : vm.get('_employerId')
                    }
                }).then(function() {
                    superFn.call(me, record);
                });
            }, 100)

        },

        handleChangeSubQuestionSet : function(cmp) {
            this.getViewModel().get('record').set('label', cmp.getSelection().get('name'));
        }
    }

});
