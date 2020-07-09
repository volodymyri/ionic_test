Ext.define('criterion.controller.recruiting.JobPostingCandidateQuestionsForm', function() {

    const QUESTION_TYPE_CODE = criterion.Consts.QUESTION_TYPE_CODE;

    return {

        alias : 'controller.criterion_recruiting_job_posting_questions_form',

        extend : 'criterion.controller.FormView',

        onShow() {
            if (this.getView().onShowDataActivate) {
                this.loadData();
            }
        },

        loadData(jobPostingCandidate) {
            let me = this,
                vm = this.getViewModel(),
                rec = jobPostingCandidate ? jobPostingCandidate : vm.get('record'),
                view = this.getView();

            view.setLoading(true);

            Ext.Deferred.all([
                vm.getStore('questions').loadWithPromise(),
                vm.getStore('questionValues').loadWithPromise({
                    params : {
                        jobPostingCandidateId : rec.getId()
                    }
                })
            ]).then(() => {
                me.generateResponse();
            }).always(() => {
                view.setLoading(false);
            });
        },

        generateResponse() {
            let view = this.getView(),
                questions = this.getStore('questions'),
                questionValues = this.getStore('questionValues'),
                response = this.lookup('response'),
                fields = [];

            view.setLoading(true);
            response.removeAll();

            if (!questionValues.count()) {

            }

            questionValues.each(valueRecord => {
                let question = questions.getById(valueRecord.get('questionId')),
                    label;

                if (!question) {
                    return;
                }

                label = question.get('label');

                if (Ext.isObject(label)) {
                    label = label[criterion.Consts.LOCALIZATION_LANGUAGE_EN];
                }

                let value = valueRecord.get('value'),
                    component = {
                        labelAlign : 'top',
                        fieldLabel : label,
                        readOnly : true,
                        value : value,
                        _sequence : question.get('sequence')
                    };

                switch(question.get('questionTypeCode')) {
                    case QUESTION_TYPE_CODE.TEXT:
                        Ext.Object.merge(component, {
                            xtype : 'textfield'
                        });
                        break;

                    case QUESTION_TYPE_CODE.TEXTAREA:
                        Ext.Object.merge(component, {
                            xtype : 'textarea'
                        });
                        break;

                    case QUESTION_TYPE_CODE.SELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd'))
                        });
                        break;

                    case QUESTION_TYPE_CODE.MULTISELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_field_multi_select',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd'))
                        });
                        value = Ext.JSON.decode(value, true);
                        break;

                    case QUESTION_TYPE_CODE.DATE:
                        Ext.Object.merge(component, {
                            xtype : 'datefield',
                            value : criterion.Utils.parseDate(value)
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
