Ext.define('criterion.controller.settings.recruiting.questionSet.Questions', function() {

    return {
        alias : 'controller.criterion_settings_recruiting_question_set_questions',

        extend : 'criterion.controller.GridView',

        createEditor : function(editorCfg, record) {
            var editor = this.callParent(arguments);

            editor.getViewModel().set({
                _employerId : this.getViewModel().get('record').get('employerId')
            });

            return editor;
        },

        handleMoveUpAction : function(record, grid, index) {
            var store = grid.getStore(),
                prevRecord = store.getAt(index - 1),
                filters = store.getFilters().getRange();

            if (index > 0) {
                if (filters.length) {
                    store.clearFilter();
                }

                record.set('sequence', index - 1);
                prevRecord.set('sequence', index);

                if (filters.length) {
                    store.setFilters(filters);
                }
            }
        },

        handleMoveDownAction : function(record, grid, index) {
            var store = grid.getStore(),
                nextRecord = store.getAt(index + 1),
                filters = store.getFilters().getRange();

            if (index < store.count() - 1) {
                if (filters.length) {
                    store.clearFilter();
                }

                record.set('sequence', index + 1);
                nextRecord.set('sequence', index);

                if (filters.length) {
                    store.setFilters(filters);
                }
            }
        },

        getEmptyRecord : function() {
            var lastRec = this.getView().getStore().last(),
                questionSetId = this.getViewModel().get('questionSetId');

            return {
                label : '',
                questionSetId : questionSetId,
                sequence : ( lastRec ? (lastRec.get('sequence') + 1) : 0 )
            };
        }
    }

});
