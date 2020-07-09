Ext.define('criterion.controller.recruiting.candidate.CoverLetter', function() {

    var API = criterion.consts.Api.API;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_cover_letter',

        requires : [
            'criterion.view.recruiting.candidate.UploadFileForm'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        init : function() {
            var vm = this.getViewModel();

            vm.bind({
                bindTo : '{candidate}',
                deep : true
            }, this.showCoverLetter, this);

            this.callParent(arguments);
        },

        handleActivate : function() {
            this.showCoverLetter();
        },

        showCoverLetter : function() {
            if (!this.checkViewIsActive()) {
                return;
            }

            var vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                coverLetterIframe;

            if (!candidate) {
                return;
            }

            coverLetterIframe = this.lookupReference('coverLetterIframe');

            if (candidate.get('hasCoverLetter')) {
                if (candidate.get('isPdfCoverLetter')) {
                    coverLetterIframe.load(criterion.Api.getSecureResourceUrl(API.CANDIDATE_COVER_LETTER_SHOW + '/' + candidate.getId()));
                } else if (candidate.get('isMSOCoverLetter')) {
                    coverLetterIframe.load(candidate.get('coverLetterURL'));
                }
            } else {
                coverLetterIframe.load('about:blank');
            }
        },

        handleAddCoverLetterClick : function() {
            var me = this,
                vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                coverLetterText = i18n.gettext('Cover Letter'),
                uploadCallback;

            uploadCallback = function() {
                candidate.loadWithPromise().then({
                    scope : me,
                    success : me.showCoverLetter
                });
            };

            Ext.create('criterion.view.recruiting.candidate.UploadFileForm', {
                candidateId : candidate.getId(),
                documentTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.DOCUMENT_RECORD_TYPE_CODE.CANDIDATE_COVER_LETTER, criterion.consts.Dict.DOCUMENT_RECORD_TYPE).getId(),
                fileDescription : coverLetterText,
                fieldTitle : coverLetterText,
                callback : uploadCallback
            }).show();
        },

        handleShowCoverLetterAsText : function() {
            var me = this,
                vm = this.getViewModel(),
                picker = Ext.create('criterion.ux.window.Window', {
                title : i18n.gettext('Cover Letter'),
                resizable : false,
                bodyPadding : 10,
                modal : true,
                draggable : false,
                plugins : {
                    ptype : 'criterion_sidebar',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                    height : '50%',
                    modal : true
                },
                cls : 'criterion-modal',
                viewModel : {
                    data : {
                        security : vm.get('security'),
                        text : vm.get('candidate.coverLetterText')
                    }
                },
                layout : 'fit',
                items : [
                    {
                        xtype : 'textarea',
                        bind : {
                            value : '{text}',
                            readOnly : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_COVER_LETTER, criterion.SecurityManager.UPDATE, true)
                        },
                        flex : 1
                    }
                ],

                bbar : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : function() {
                                this.up('criterion_window').fireEvent('close');
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-primary',
                        text : i18n.gettext('Save'),
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_NOTES, criterion.SecurityManager.UPDATE, true)
                        },
                        listeners : {
                            click : function() {
                                var window = this.up('criterion_window');

                                window.fireEvent('changeCoverLetter', window.getViewModel().get('text'));
                            }
                        }
                    }
                ]
            });

            picker.show();

            picker.on('changeCoverLetter', function(text) {
                var candidate = vm.get('candidate');

                criterion.Api.requestWithPromise({
                    url : Ext.util.Format.format(
                        criterion.consts.Api.API.CANDIDATE_COVER_LETTER_UPDATE_TEXT,
                        candidate.getId()
                    ),
                    method : 'PUT',
                    jsonData : {
                        coverLetter : text
                    }
                }).then(function() {
                    me.setCorrectMaskZIndex(false);
                    candidate.load();
                    picker.destroy();
                });
            });

            picker.on('close', function() {
                me.setCorrectMaskZIndex(false);
                picker.destroy();
            });

            this.setCorrectMaskZIndex(true);
        },

        handleDownloadCoverLetterClick : function() {
            var candidate = this.getViewModel().get('candidate');

            if (candidate.get('hasCoverLetter')) {
                window.open(criterion.Api.getSecureResourceUrl(API.CANDIDATE_COVER_LETTER_DOWNLOAD + '/' + candidate.getId()));
            }
        }
    };
});
