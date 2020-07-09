Ext.define('criterion.controller.ess.recruiting.candidate.Base', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_base',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employer.JobPosting',
            'criterion.model.employer.jobPosting.Candidate'
        ],

        handleBack() {
            this._gotoPageIdent('candidateDetail');
        },

        getAdditionalStores(jobPostingCandidate) {
            return [];
        },

        additionalLoadProcess(jobPostingCandidate) {
            let me = this,
                view = this.getView(),
                additionalStores;

            additionalStores = this.getAdditionalStores(jobPostingCandidate);

            if (additionalStores.length) {
                Ext.promise.Promise.all(additionalStores).then({
                    scope : this,
                    success : function() {
                        view.setLoading(false);
                        me.afterLoading();
                    }
                })
            } else {
                view.setLoading(false);
                me.afterLoading();
            }
        },

        loadMainData(add = []) {
            let vm = this.getViewModel(),
                dfd = Ext.create('Ext.promise.Deferred'),
                jobPostingId = vm.get('jobPostingId'),
                jobPostingCandidateId = vm.get('jobPostingCandidateId'),
                jobPosting = Ext.create('criterion.model.employer.JobPosting', {
                    id : parseInt(jobPostingId, 10)
                }),
                jobPostingCandidate = Ext.create('criterion.model.employer.jobPosting.Candidate', {
                    id : parseInt(jobPostingCandidateId, 10)
                });

            Ext.promise.Promise.all([
                jobPosting.loadWithPromise(),
                jobPostingCandidate.loadWithPromise(),
                ...add
            ]).then(_ => {
                dfd.resolve({
                    jobPosting,
                    jobPostingCandidate
                });
            }, _ => {
                dfd.reject();
            });

            return dfd.promise;
        },

        handleActivate() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                jobPostingId = vm.get('jobPostingId'),
                candidateToolbar = view.down('criterion_selfservice_recruiting_candidate_toolbar');

            if (jobPostingId) {
                view.setLoading(true);

                me.loadMainData().then(data => {
                    vm.set(data);

                    me.additionalLoadProcess(data['jobPostingCandidate']);
                    candidateToolbar && candidateToolbar.setPressedBtn();
                }, _ => {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    view.setLoading(false);
                });
            }
        },

        afterLoading : Ext.emptyFn,

        _gotoPageIdent(ident) {
            let vm = this.getViewModel(),
                jobPostingId = vm.get('jobPostingId'),
                jobPostingCandidateId = vm.get('jobPostingCandidateId');

            this.redirectTo(criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS + '/' + jobPostingId + '/candidates/' + jobPostingCandidateId + '/' + ident);
        },

        handleShowDetails() {
            this._gotoPageIdent('candidateDetail');
        },

        handleShowAdditionalDetails() {
            this._gotoPageIdent('candidateAdditionalDetails');
        },

        handleShowResume() {
            this._gotoPageIdent('candidateResume');
        },

        handleShowCoverLetter() {
            this._gotoPageIdent('candidateCoverLetter');
        },

        handleShowQuestionResponses() {
            this._gotoPageIdent('candidateQuestionResponses');
        },

        handleShowCandidateInterview() {
            this._gotoPageIdent('candidateInterview');
        },

        handleShowNotes() {
            this._gotoPageIdent('candidateNotes');
        }
    }
});

