Ext.define('criterion.controller.ess.recruiting.candidate.QuestionResponses', function() {

    const API = criterion.consts.Api.API,
        QUESTION_TYPE_CODE = criterion.Consts.QUESTION_TYPE_CODE;

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_question_responses',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        getAdditionalStores : function(jobPostingCandidate) {
            let vm = this.getViewModel();

            return [
                vm.getStore('questions').loadWithPromise(),
                vm.getStore('questionValues').loadWithPromise({
                    params : {
                        jobPostingCandidateId : jobPostingCandidate.getId()
                    }
                })
            ];
        },

        afterLoading : function() {
            this.generateResponse();
        },

        generateResponse : function() {
            let view = this.getView(),
                questions = this.getStore('questions'),
                questionValues = this.getStore('questionValues'),
                fields = [],
                lng;

            view.setLoading(true);
            view.removeAll();

            questionValues.each(questionValue => {
                let question = questions.getById(questionValue.get('questionId')),
                    localizationLanguageCd = questionValue.get('localizationLanguageCd');

                if (!question) {
                    return;
                }

                if (localizationLanguageCd) {
                    lng = {
                        xtype : 'criterion_code_detail_field',
                        labelAlign : 'top',
                        fieldLabel : i18n.gettext('Responses Language'),
                        codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                        readOnly : true,
                        value : localizationLanguageCd
                    }
                }

                let value = questionValue.get('value'),
                    component = {
                        labelAlign : 'top',
                        fieldLabel : question.get('label')[criterion.Consts.LOCALIZATION_LANGUAGE_EN],
                        readOnly : true,
                        value : value,
                        _sequence : question.get('sequence')
                    };

                switch (question.get('questionTypeCode')) {
                    case QUESTION_TYPE_CODE.TEXT:
                        Ext.Object.merge(component, {
                            xtype : 'textfield',
                            readOnly : true
                        });
                        break;

                    case QUESTION_TYPE_CODE.TEXTAREA:
                        Ext.Object.merge(component, {
                            xtype : 'textarea',
                            readOnly : true
                        });
                        break;

                    case QUESTION_TYPE_CODE.SELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_field',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd')),
                            readOnly : true
                        });
                        break;

                    case QUESTION_TYPE_CODE.MULTISELECT:
                        Ext.Object.merge(component, {
                            xtype : 'criterion_code_detail_field_multi_select',
                            codeDataId : criterion.CodeDataManager.getCodeTableNameById(question.get('responseCd')),
                            readOnly : true
                        });
                        value = Ext.JSON.decode(value, true);
                        break;

                    case QUESTION_TYPE_CODE.DATE:
                        Ext.Object.merge(component, {
                            xtype : 'datefield',
                            readOnly : true
                        });
                        value = new Date(value);
                        break;

                    case QUESTION_TYPE_CODE.FILE_ATTACHMENT:
                        let linkText = i18n.gettext('Download Attachment'),
                            url = criterion.Api.getSecureResourceUrl(API.CANDIDATE_ATTACHMENT_DOWNLOAD + '/' + value);

                        Ext.Object.merge(component, {
                            xtype : 'displayfield',
                            value : Ext.String.format('<a href="{0}" target="_blank">{1}</a>', url, linkText),
                            htmlEncode : false
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

            if (lng) {
                view.add(lng);
            }
            view.add(fields);

            view.setLoading(false);
        }

    }
});
