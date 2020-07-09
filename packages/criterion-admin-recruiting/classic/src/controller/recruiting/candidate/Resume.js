Ext.define('criterion.controller.recruiting.candidate.Resume', function() {

    const API = criterion.consts.Api.API,
        RESUME_PARSE_STATUSES = criterion.Consts.RESUME_PARSE_STATUSES;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_resume',

        requires : [
            'criterion.view.recruiting.candidate.UploadFileForm',
            'criterion.view.recruiting.candidate.UploadResumeForm'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        listen : {
            global : {
                beforeHideForm : 'onBeforeLeavePage'
            }
        },

        onBeforeLeavePage() {
            this.stopChecker();
            this.runCount = 0;
        },

        runCount : 0,

        init() {
            let vm = this.getViewModel();

            vm.bind({
                bindTo : '{candidate}',
                deep : true
            }, this.showResume, this);

            this.onBeforeLeavePage = Ext.Function.createBuffered(this.onBeforeLeavePage, 100, this);
            this.resumeStatus = Ext.Function.createBuffered(this.resumeStatus, 1000, this);

            this.callParent(arguments);
        },

        handleActivate() {
            this.runCount = 0;
            this.showResume();
        },

        showResume() {
            if (!this.checkViewIsActive()) {
                return;
            }

            let vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                resumeIframe;

            if (!candidate) {
                return;
            }

            resumeIframe = this.lookupReference('resumeIframe');

            if (candidate.get('hasResume')) {
                this.resumeStatus();

                if (candidate.get('isPdfResume')) {
                    resumeIframe.load(criterion.Api.getSecureResourceUrl(API.CANDIDATE_RESUME_SHOW + '/' + candidate.getId()));
                } else if (candidate.get('isMSOResume')) {
                    resumeIframe.load(candidate.get('resumeURL'));
                }
            } else {
                resumeIframe.load('about:blank');
            }
        },

        resumeStatus() {
            let me = this,
                vm = this.getViewModel(),
                candidate = vm.get('candidate');

            if (!this.checkViewIsActive() || !criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_RESUME_PARSE, criterion.SecurityManager.ACT)()) {
                this.stopChecker();
                return;
            }

            criterion.Api.requestWithPromise({
                url : Ext.urlAppend(API.CANDIDATE_RESUME_STATUS + '/' + candidate.getId(), Ext.Object.toQueryString({
                    _rc : ++this.runCount
                })),
                method : 'GET'
            }).then(result => {
                me.actResumeStatus(result);
            });
        },

        hasChecker() {
            return !!this._checker;
        },

        getChecker() {
            if (!this.hasChecker()) {
                this._checker = Ext.TaskManager.newTask({
                    run : this.resumeStatus,
                    interval : criterion.Consts.CONTROL_DEFERRED_PROCESS_CHECK_INTERVALS.RESUME_PARSING_CHECK_STATUS,
                    scope : this
                });
            }

            return this._checker;
        },

        stopChecker() {
            if (this.hasChecker()) {
                this.getChecker().stop(true);
            }
            this._checker = null;
        },

        actResumeStatus(status) {
            let vm = this.getViewModel();

            switch (status) {
                case RESUME_PARSE_STATUSES.NOT_STARTED:
                    vm.set({
                        blockParseResume : false,
                        parseInProgress : false
                    });
                    this.stopChecker();

                    break;

                case RESUME_PARSE_STATUSES.IN_PROGRESS:
                    vm.set({
                        blockParseResume : true,
                        parseInProgress : true
                    });

                    if (!this.hasChecker()) {
                        this.getChecker().start();
                    }

                    break;

                case RESUME_PARSE_STATUSES.DONE:
                    vm.set({
                        blockParseResume : true,
                        parseInProgress : false
                    });

                    this.stopChecker();
                    break;

                default:
                    console && console.error('Wrong resume parsing status');
                    break;
            }
        },

        handleAddResume() {
            let me = this,
                vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                uploader;

            uploader = Ext.create('criterion.view.recruiting.candidate.UploadResumeForm', {
                candidateId : candidate.getId(),
                callback : function() {
                    candidate.loadWithPromise().then(() => {
                        me.showResume();
                    });
                }
            });

            uploader.show();
        },

        handleDownloadResume() {
            let candidate = this.getViewModel().get('candidate');

            if (candidate.get('hasResume')) {
                window.open(criterion.Api.getSecureResourceUrl(API.CANDIDATE_RESUME_DOWNLOAD + '/' + candidate.getId()));
            }
        },

        handleParseResume() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                confirmWindow;

            if (!candidate.get('hasResume')) {
                return;
            }

            confirmWindow = Ext.create({
                xtype : 'window',
                title : i18n._('Parse Resume'),
                modal : true,
                closable : true,
                draggable : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : criterion.Consts.UI_DEFAULTS.POPUP_WINDOW_HEIGHT,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        clearExistingInformation : false
                    }
                },

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n._('Cancel'),
                        cls : 'criterion-btn-light',
                        handler : () => {
                            confirmWindow.destroy();
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Ok'),
                        handler : () => {
                            confirmWindow.fireEvent('parseRequest', confirmWindow.getViewModel().get('clearExistingInformation'));
                        }
                    }
                ],

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'component',
                        html : i18n._('Do you want the system to parse the resume and update candidate\'s information')
                    },
                    {
                        xtype : 'toggleslidefield',
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                        margin : '20 0 0 0',
                        bind : '{clearExistingInformation}',
                        fieldLabel : i18n._('Clear existing information')
                    }
                ]
            });

            confirmWindow.show();

            confirmWindow.on({
                parseRequest : clearExistingInformation => {
                    me.setCorrectMaskZIndex(false);
                    confirmWindow.destroy();

                    view.setLoading(true);

                    criterion.Api.requestWithPromise({
                        url : Ext.urlAppend(API.CANDIDATE_RESUME_PARSE + '/' + candidate.getId(), Ext.Object.toQueryString({
                            isClearing : clearExistingInformation
                        })),
                        method : 'POST'
                    }).then(_ => {
                        me.actResumeStatus(RESUME_PARSE_STATUSES.IN_PROGRESS);
                    }).always(() => {
                        view.setLoading(false);
                    });
                }
            });

            this.setCorrectMaskZIndex(true);
        }
    };
});
