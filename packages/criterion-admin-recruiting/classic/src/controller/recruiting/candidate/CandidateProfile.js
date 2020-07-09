Ext.define('criterion.controller.recruiting.candidate.CandidateProfile', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_profile',

        requires : [
            'criterion.model.Candidate'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        onCancel : function() {
            this.redirectTo(criterion.consts.Route.RECRUITING.CANDIDATES, null);
        },

        onSubmit : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                fileSelector = this.lookupReference('fileSelector'),
                promises = [],
                me = this;

            if (me.lookupReference('profileForm').isValid()) {
                view.setLoading(true);

                candidate.saveWithPromise()
                    .always(function() {
                        view.setLoading(false);
                    })
                    .then(function() {
                        if (fileSelector.isDirty()) {
                            promises.push(criterion.Api.submitFormWithPromise({
                                url : criterion.consts.Api.API.CANDIDATE_RESUME_UPLOAD,
                                fields : [fileSelector],
                                extraData : {
                                    candidateId : candidate.getId()
                                }
                            }));
                        }

                        Ext.promise.Promise.all(promises)
                            .then(function() {
                                criterion.Utils.toast(i18n.gettext('The candidate saved.'));
                                fileSelector.reset();
                                me.redirectTo(criterion.consts.Route.RECRUITING.CANDIDATES, null);
                            })
                            .then(function() {
                                view.setLoading(false);
                            })
                            .otherwise(function() {
                                me.lookupReference('fileSelector').setValue(null);
                                view.setLoading(false);
                            });
                    });
            }
        },

        load : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                candidate = vm.get('candidate');

            if (candidate) {
                view.setLoading(true);

                candidate.load({
                    callback : function() {
                        view.setLoading(false);
                    }
                });
            }
        },

        handleAddCandidateData : function(cmp) {
            let me = this,
                vm = this.getViewModel(),
                candidateId = vm.get('candidateId');

            let editor = Ext.create(cmp.up('panel').editor, {
                closable : false,
                shadow : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                viewModel : {
                    security : vm.get('security'),
                },
                listeners : {
                    afterSave : function() {
                        me.load();
                    }
                }
            });

            editor.getViewModel().get('record').set('candidateId', candidateId);

            editor._connectedView = this.getView();
            editor.show();
        },

        handleEditCandidateData : function(panel, record) {
            let me = this;

            let editor = Ext.create(panel.editor, {
                closable : false,
                shadow : false,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],

                viewModel : {
                    links : {
                        record : record
                    }
                },

                listeners : {
                    afterSave : function() {
                        me.load();
                    },
                    afterDelete : function() {
                        me.load();
                    }
                }
            });

            editor._connectedView = this.getView();
            editor.show();
        },

        handleDeleteCandidateData : function(panel, record) {
            let me = this;

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        let candidate = me.getViewModel().get('candidate');

                        record.store.remove(record);

                        candidate.saveWithPromise();
                    }
                }
            );
        },

        onSkillKeyPress(cmp, e) {
            let me = this,
                value,
                candidate = this.getViewModel().get('candidate');

            if (e.keyCode === e.RETURN) {
                value = cmp.getValue();

                if (value) {
                    cmp.setDisabled(true);

                    candidate.skills().add({
                        candidateId : candidate.getId(),
                        skill : value
                    });
                    candidate.saveWithPromise().then(() => {
                        me.load();
                        cmp.setValue('');
                        cmp.setDisabled(false);
                        cmp.focus();
                    });
                }
            }
        }
    };
});
