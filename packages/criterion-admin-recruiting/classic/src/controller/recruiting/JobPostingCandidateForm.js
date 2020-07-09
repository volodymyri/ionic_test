Ext.define('criterion.controller.recruiting.JobPostingCandidateForm', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'controller.criterion_recruiting_job_posting_candidate_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.recruiting.candidate.SendEmailForm',
            'criterion.store.EmailLayouts',
            'criterion.model.EmailLayout'
        ],

        handleShow : function() {
            var recruitingEmails = Ext.create('criterion.store.EmailLayouts'),
                vm = this.getViewModel();

            recruitingEmails.loadWithPromise().then(function() {
                var apptRecord = recruitingEmails.findRecord('emailLayoutCode', criterion.Consts.EMAIL_LAYOUT_CODE.RECRUITING_REJECTION);

                !vm.destroyed && vm.set('sendEmailEnabled', apptRecord && apptRecord.get('isActive'));
            });
        },

        handleSendEmail : function(view, record) {
            var sendEmail = this.lookupReference('sendEmail');

            if (sendEmail.getValue()) {
                var recruitingEmailEvent = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.EMAIL_LAYOUT_CODE.RECRUITING_REJECTION, DICT.EMAIL_LAYOUT);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMAIL_LAYOUT_PREVIEW,
                    params : {
                        emailLayoutCd : recruitingEmailEvent.getId(),
                        candidateId : record.getCandidate().getId(),
                        jobPostingId : record.getJobPosting().getId()
                    },
                    method : 'GET'
                }).then(function(response) {
                    var sendEmailForm = Ext.create('criterion.view.recruiting.candidate.SendEmailForm', {
                        viewModel : {
                            data : {
                                recruitingEmail : Ext.create('criterion.model.EmailLayout', response)
                            }
                        }
                    });

                    sendEmailForm.show();

                    sendEmailForm.on('close', function() {
                        sendEmailForm.destroy();
                    });

                    sendEmailForm.on('send', function(recruitingEmail) {
                        criterion.Api.requestWithPromise({
                            method : 'POST',
                            url : criterion.consts.Api.API.EMAIL_LAYOUT_SEND,
                            urlParams : {
                                jobPostingCandidateId : record.getId()
                            },
                            jsonData : {
                                email : record.getCandidate().get('email'),
                                fromText : recruitingEmail.get('fromText'),
                                subject : recruitingEmail.get('subjectProcessed'),
                                body : recruitingEmail.get('bodyProcessed')
                            }
                        }).then({
                            success : function() {
                                criterion.Utils.toast(i18n.gettext('Email successfully sent.'));
                            }
                        }).always(function() {
                            sendEmailForm.destroy();
                        });
                    });
                });
            }
        },

        handleCandidateStatusChange : function(combo, value) {
            this.getViewModel().set('candidateStatus', combo.getStore().getById(value));
        },

        handleCandidateStatusSelect : function(combo, record) {
            this.getViewModel().set('sendEmailRejStatus', record.get('attribute1') == 0);
        },

        handleCancelClick : function() {
            var record = this.getRecord();

            record.reject();

            this.callParent(arguments);
        },

        handleSubmitClick : function() {
            this.getView().fireEvent('formSubmitted');
            this.callParent(arguments);
        }
    };

});
