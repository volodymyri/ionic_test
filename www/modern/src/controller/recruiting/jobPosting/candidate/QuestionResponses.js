Ext.define('ess.controller.recruiting.jobPosting.candidate.QuestionResponses', function() {

    var QUESTION_TYPE_CODE = criterion.Consts.QUESTION_TYPE_CODE;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_postings_candidate_question_responses',

        handleActivate : function() {
            var view = this.getView(),
                me = this;

            if (!this.checkViewIsActive()) {
                return;
            }

            view.setLoading(true);
            Ext.promise.Promise.all(this.getAdditionalStores()).then({
                scope : this,
                success : function() {
                    view.setLoading(false);
                    me.generateResponse();
                }
            })
        },

        getAdditionalStores : function() {
            var promises = [],
                vm = this.getViewModel(),
                jobPostingCandidateId = parseInt(vm.get('jobPostingCandidate.id'), 10);

            Ext.Array.each(['questions', 'questionValues'], function(storeName) {
                var store = vm.getStore(storeName);

                if (!store.isLoaded() || this.loadedJobPostingCandidateId !== jobPostingCandidateId) {
                    promises.push(vm.getStore(storeName).loadWithPromise());
                }
            }, this);

            this.loadedJobPostingCandidateId = jobPostingCandidateId;
            return promises;
        },

        generateResponse : function() {
            var view = this.getView(),
                questions = this.getStore('questions'),
                questionValues = this.getStore('questionValues'),
                response = view,
                fields = [];

            view.setLoading(true);
            response.removeAll();

            questionValues.each(function(valueRecord) {
                let question = questions.getById(valueRecord.get('questionId')),
                    label;

                if (!question) {
                    return;
                }

                label = question.get('label');

                if (Ext.isObject(label)) {
                    label = label[criterion.Consts.LOCALIZATION_LANGUAGE_EN];
                }

                var value = valueRecord.get('value'),
                    component = {
                        label : label,
                        readOnly : true,
                        _sequence : question.get('sequence')
                    };

                switch (question.get('questionTypeCode')) {
                    case QUESTION_TYPE_CODE.TEXT:
                        Ext.Object.merge(component, {
                            xtype : 'textfield',
                            value : value
                        });
                        break;

                    case QUESTION_TYPE_CODE.TEXTAREA:
                        Ext.Object.merge(component, {
                            xtype : 'textareafield',
                            value : value
                        });
                        break;

                    case QUESTION_TYPE_CODE.SELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_select',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd')),
                            value : parseInt(value, 10)
                        });
                        break;

                    case QUESTION_TYPE_CODE.MULTISELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_multy',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd')),
                            value : Ext.Array.map(value.split(','), function(val) {
                                return parseInt(val, 10);
                            })
                        });
                        break;

                    case QUESTION_TYPE_CODE.DATE:
                        Ext.Object.merge(component, {
                            xtype : 'datepickerfield',
                            value : (value ? new Date(value) : null)
                        });
                        break;
                    default:
                        return;
                }

                component && fields.push(component);
            });

            Ext.Array.sort(fields, function(a, b) {
                a = a.__sequence;
                b = b.__sequence;

                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                }
                return 0;
            });

            response.add(fields);

            view.setLoading(false);
        }

    };
});
