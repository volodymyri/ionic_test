Ext.define('criterion.controller.recruiting.CandidateJobPostingPanel', function() {

    const API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_job_posting_panel',

        requires : [
            'criterion.view.recruiting.candidate.BackgroundReportPicker',
            'criterion.view.recruiting.candidate.BackgroundReportRequest',
            'criterion.view.recruiting.candidate.SendForm',
            'criterion.view.recruiting.candidate.UploadResumeForm',
            'criterion.view.MultiRecordPicker',
            'criterion.store.employer.jobPosting.candidate.Documents',
            'criterion.ux.form.FillableWebForm',
            'criterion.store.employer.Onboardings'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init() {
            let vm = this.getViewModel();

            this.callParent(arguments);

            vm.bind({
                bindTo : '{detailsGrid.selection}',
                deep : true
            }, this.changeExternalSelection, this);

            vm.bind({
                bindTo : '{jobPostingCandidate}',
                deep : true
            }, this.changeJobPostingCandidate, this);
        },

        changeExternalSelection(rec) {
            let vm = this.getViewModel(),
                jobPostingCandidate,
                jobPostingCandidates = vm.get('jobPostingCandidates'),
                jobPostingId;

            if (rec && rec.isModel && rec.get('candidateId') !== vm.get('candidateId')) {
                vm.set({
                    candidateId : rec.get('candidateId'),
                    jobPostingCandidateId : null
                });

                jobPostingId = rec.get('jobPostingId');

                jobPostingCandidates.loadWithPromise().then(() => {
                    vm.set('jobPostingCandidateCount', jobPostingCandidates.count());

                    if (jobPostingId) {
                        jobPostingCandidate = jobPostingCandidates.findRecord('jobPostingId', jobPostingId, 0, false, false, true);

                        if (jobPostingCandidate) {
                            vm.set('jobPostingCandidateId', jobPostingCandidate.getId());
                        }
                    }
                });
            }
        },

        changeJobPostingCandidate(rec) {
            this.fireViewEvent('jobPostingCandidateChanged', rec);
        },

        handleSave() {
            let vm = this.getViewModel(),
                view = this.getView(),
                candidateJobPosting = vm.get('jobPostingCandidate');

            candidateJobPosting && candidateJobPosting.saveWithPromise().then(() => {
                criterion.Utils.toast(i18n.gettext('Changes Saved.'));

                view.fireEvent('candidateJobPostingSaved');
            });
        },

        handleSendEmail() {
            let vm = this.getViewModel();

            window.open('mailto:' + vm.get('detailsGrid.selection.candidate.email'));
        },

        actionOrderBackgroundReport(candidateJobPostingId) {
            let popup = Ext.create('criterion.view.recruiting.candidate.BackgroundReportRequest');

            popup.on('doRequest', function(data) {
                popup.setLoading(true);
                criterion.Api.request({
                    url : criterion.consts.Api.API.EXTERNAL_SYSTEM_REQUEST_BACKGROUND,
                    method : 'POST',
                    jsonData : Ext.apply({
                        jobPostingCandidateId : candidateJobPostingId
                    }, data),
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Background report requested.'));
                        popup.destroy();
                    },
                    callback : function() {
                        popup.setLoading(false);
                    }
                });
            }, this);

            popup.show();
        },

        actionViewBackgroundReport(candidateId) {
            let picker = Ext.create('criterion.view.recruiting.candidate.BackgroundReportPicker', {
                candidateId : candidateId
            });

            picker.show();

            picker.store.on('load', function() {
                if (!picker.store.count()) {
                    criterion.Msg.warning({
                        title : i18n.gettext('No reports'),
                        message : i18n.gettext('No requested background reports found.')
                    });
                }
            });

            picker.on('select', function(background) {
                if (background.get('reportUrl')) {
                    window.open(background.get('reportUrl'), '_blank');
                } else {
                    criterion.Msg.info(i18n.gettext('Request is being processed by external service.'));
                }
            });
        },

        actionSendForm(candidateJobPostingId) {
            let sendForm = Ext.create('criterion.view.recruiting.candidate.SendForm');

            sendForm.show();

            sendForm.on('close', function() {
                sendForm.destroy();
            });

            sendForm.on('send', function(formId) {
                criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : API.EMPLOYER_JOB_POSTING_CANDIDATE_DOCUMENT_SEND,
                    urlParams : {
                        employeeId : criterion.Api.getEmployeeId(),
                        jobPostingCandidateId : candidateJobPostingId,
                        formId : formId
                    },
                    jsonData : {}
                }).then({
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Form successfully sent.'));
                    }
                }).always(function() {
                    sendForm.destroy();
                });
            });

        },

        actionPreboarding(candidateJobPostingId, employerId) {
            let selectPopup;

            selectPopup = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Onboarding List'),
                modal : true,
                draggable : true,
                cls : 'criterion-modal',
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                        height : 'auto',
                        modal : true
                    }
                ],

                viewModel : {
                    stores : {
                        onboardings : {
                            type : 'criterion_employer_onboardings',
                            autoLoad : true,
                            proxy : {
                                extraParams : {
                                    employerId : employerId,
                                    isPreHire : true
                                }
                            }
                        }
                    }
                },

                layout : 'hbox',
                bodyPadding : 20,

                items : [
                    {
                        xtype : 'combo',
                        fieldLabel : i18n.gettext('Name'),
                        reference : 'onboarding',
                        bind : {
                            store : '{onboardings}'
                        },
                        valueField : 'id',
                        displayField : 'name',
                        queryMode : 'local',
                        editable : false,
                        allowBlank : false
                    }
                ],

                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-light',
                        handler : function() {
                            this.up('criterion_form').fireEvent('cancel');
                        },
                        text : i18n.gettext('Cancel')
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        handler : function() {
                            let form = this.up('criterion_form');

                            if (form.isValid()) {
                                form.fireEvent('change', form.getViewModel().get('onboarding.selection'));
                            }
                        },
                        text : i18n.gettext('Select')
                    }
                ]
            });

            selectPopup.show();

            selectPopup.on('cancel', function() {
                selectPopup.destroy();
            });
            selectPopup.on('change', function(onboarding) {
                criterion.Api.requestWithPromise({
                    method : 'POST',
                    url : API.EMPLOYER_JOB_POSTING_CANDIDATE_PREBOARDING,
                    urlParams : {
                        employeeId : criterion.Api.getEmployeeId(),
                        jobPostingCandidateId : candidateJobPostingId,
                        onboardingId : onboarding.getId()
                    },
                    jsonData : {}
                }).then({
                    success : function() {
                        criterion.Utils.toast(i18n.gettext('Preboarding successfully set.'));
                    }
                }).always(function() {
                    selectPopup.destroy();
                });

            });
        },

        actionViewSubmittedForms(candidateJobPostingId) {
            let selector;

            selector = Ext.create('criterion.view.MultiRecordPicker', {
                mode : 'SINGLE',
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Submitted Forms'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Form'),
                                dataIndex : 'description',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'datecolumn',
                                width : 200,
                                text : i18n.gettext('Submission Date'),
                                dataIndex : 'uploadDate'
                            }
                        ],
                        storeParams : {
                            jobPostingCandidateId : candidateJobPostingId
                        },
                        storeFilters : [{
                            property : 'isResponded',
                            value : true
                        }]
                    },
                    stores : {
                        inputStore : Ext.create('criterion.store.employer.jobPosting.candidate.Documents', {
                            autoSync : false
                        })
                    }
                },
                allowEmptySelect : false
            });

            selector.show();
            selector.on('selectRecords', this.selectSubmittedForm, this);
        },

        selectSubmittedForm(records) {
            let record = records[0],
                recordId = record.get('id'),
                formContainer;

            formContainer = Ext.create('criterion.ux.Panel', {
                layout : {
                    type : 'vbox',
                    align : 'center'
                },
                scrollable : true,
                title : record.get('description'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_SCREEN_WIDTH,
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                        modal : true
                    }
                ],
                bbar : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Save as PDF'),
                        handler : function() {
                            window.location.href = criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_WEBFORM_DOWNLOAD + recordId);
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        handler : function() {
                            formContainer.close();
                        }
                    }
                ],
                items : [{
                    xtype : 'criterion_fillable_webform'
                }]
            });

            formContainer.down('criterion_fillable_webform').loadForm(recordId, criterion.consts.Api.API.CANDIDATE_DOCUMENT_WEBFORM_FIELDS);
            formContainer.show();
        },

        handleSelectAction(combo, value) {
            let selection = this.getViewModel().get('detailsGrid.selection'),
                candidateId = selection.get('candidateId'),
                candidateJobPostingId = selection.getId(),
                jobPostingId = selection.get('jobPostingId');

            combo.reset();

            switch (value) {
                case 'create_new_employee':
                    criterion.consts.Route.setPrevRoute(Ext.History.getToken());
                    this.redirectTo(criterion.consts.Route.HR.WIZARD + '/candidate/' + candidateJobPostingId);
                    break;
                case 'order_background_report':
                    this.actionOrderBackgroundReport(candidateJobPostingId);
                    break;
                case 'view_background_report':
                    this.actionViewBackgroundReport(candidateId);
                    break;
                case 'send_form':
                    this.actionSendForm(candidateJobPostingId);
                    break;
                case 'view_submitted_forms':
                    this.actionViewSubmittedForms(candidateJobPostingId);
                    break;
                case 'download_application_form':
                    this.actionDownloadApplicationForm(jobPostingId, candidateId);
                    break;
                case 'preboarding':
                    this.actionPreboarding(candidateJobPostingId, selection.get('employerId'));
                    break;
                // no default
            }
        },

        actionDownloadApplicationForm(jobPostingId, candidateId) {
            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(
                    criterion.consts.Api.API.EMPLOYER_JOB_POSTING_DOWNLOAD_APPLICATION_FORM_PDF,
                    jobPostingId
                )
            ) + '&candidateId=' + candidateId);
        },

        handleAddResume() {
            let view = this.getView(),
                vm = this.getViewModel();

            Ext.create('criterion.view.recruiting.candidate.UploadResumeForm', {
                candidateId : vm.get('detailsGrid.selection.candidateId'),
                callback : function() {
                    vm.get('detailsGrid.selection.candidate').set('hasResume', true);

                    view.fireEvent('candidateUpdated')
                }
            }).show();
        },

        onJpCandidateChanged(record) {
            let vm = this.getViewModel(),
                jobPostingCandidates = vm.get('jobPostingCandidates');

            let rec = jobPostingCandidates.getById(record.getId());

            if (rec) {
                rec.set(Ext.clone(record.getData()));

                rec.modified = {};
                rec.dirty = false;
            }
        }
    }
});
