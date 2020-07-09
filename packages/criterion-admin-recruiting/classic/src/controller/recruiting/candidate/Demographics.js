Ext.define('criterion.controller.recruiting.candidate.Demographics', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_recruiting_candidate_demographics',

        requires : [
            'criterion.view.recruiting.candidate.DemographicsForm',
            'criterion.view.recruiting.candidate.UploadResumeForm'
        ],

        mixins : [
            'criterion.controller.recruiting.candidate.mixin.ToolbarHandlers'
        ],

        handleEditClick : function() {
            this.showDemographicsForm();
        },

        showDemographicsForm : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                candidateForm = view.up('criterion_recruiting_candidate_form'),
                demographicsFormContainer = this.lookup('formContainer'),
                demographicsForm;

            demographicsForm = Ext.create('criterion.view.recruiting.candidate.DemographicsForm', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                allowDelete : false,
                _connectedView : demographicsFormContainer,
                shadow : false,
                viewModel : {
                    parent : vm,
                    formulas : {
                        record : function(get) { // binding needs for correct work of delete functionality as basic form view/controller work with 'record'
                            return get('candidate');
                        }
                    }
                }
            });

            demographicsForm.on('afterSave', function(view, candidate, isNew) {
                candidateForm.fireEvent('afterCandidateLoad', candidate);

                if (isNew) {
                    me.redirectTo(criterion.consts.Route.RECRUITING.CANDIDATES + '/' + candidate.getId());
                }
            });

            demographicsForm.on('afterDelete', function() {
                me.redirectTo(criterion.consts.Route.RECRUITING.CANDIDATES);
            });

            demographicsForm.show();
        },

        showUploadResumeForm : function(callerView) {
            let vm = this.getViewModel(),
                candidate = vm.get('candidate'),
                uploadResumePopup,
                options = {
                    candidateId : candidate.getId()
                };

            options.callback = function() {
                candidate.loadWithPromise().then(function() {
                    callerView.show();
                });

            };

            callerView.hide();

            uploadResumePopup = Ext.create('criterion.view.recruiting.candidate.UploadResumeForm', options);

            uploadResumePopup.on('cancel', function() {
                Ext.Function.defer(function() {
                    callerView.show();
                }, 100);
            });

            uploadResumePopup.show();
        }
    };
});
