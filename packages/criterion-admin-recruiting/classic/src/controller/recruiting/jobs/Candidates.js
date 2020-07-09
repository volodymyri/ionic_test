Ext.define('criterion.controller.recruiting.jobs.Candidates', function() {

    return {
        alias : 'controller.criterion_recruiting_jobs_candidates',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.store.Candidates',
            'criterion.store.employer.jobPosting.Candidates',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.view.recruiting.JobPostingCandidateForm',
            'criterion.view.recruiting.JobPostingCandidateQuestionsForm'
        ],

        handleChangeShowInactive : function(cmp, value) {
            let store = this.getView().getStore();

            if (value) {
                store.clearFilter();
            } else {
                store.setFilters([
                    function(item) {
                        let candidateStatusCd = item.get('candidateStatusCd'),
                            jpRecord = criterion.CodeDataManager.getCodeDetailRecord('id', candidateStatusCd, criterion.consts.Dict.CANDIDATE_STATUS),
                            attr1Val = jpRecord ? parseInt(jpRecord.get('attribute1'), 10) : 1;

                        return !!attr1Val;
                    }
                ]);
            }
        },

        handleShowResponses : function(grid, index1, index2, act, e, record) {
            let form = Ext.create('criterion.view.recruiting.JobPostingCandidateQuestionsForm', {
                viewModel : {
                    data : {
                        record : record
                    }
                }
            });

            form.show();
        },

        handleEditJobPostingCandidate : function(grid, index1, index2, act, e, record) {
            let view = this.getView(),
                form = Ext.create('criterion.view.recruiting.JobPostingCandidateForm', {
                    viewModel : {
                        data : {
                            record : record
                        }
                    }
                });

            form.show();
            form.on('formSubmitted', function() {
                view.fireEvent('candidatesChanged');
            });
        },

        load : function() {
            // this store loaded in parent view
        },

        handleEditAction : function(record) {
            this.getView().fireEvent('selectCandidate', record);
        },

        handleAddCandidates : function() {
            let selectWindow,
                store = this.getView().getStore(),
                candidateStore = Ext.create('criterion.store.Candidates', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT,
                    remoteFilter : true,
                    remoteSort : true
                });

            selectWindow = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Candidates'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Number of Job Postings'),
                                dataIndex : 'jobsApplied',
                                flex : 1
                            }
                        ],
                        excludedIds : Ext.Array.map(store.getRange(), function(item) {
                            return item.get('candidateId');
                        })
                    },
                    stores : {
                        inputStore : candidateStore
                    }
                }
            });

            selectWindow.show();
            selectWindow.on('selectRecords', this.selectCandidates, this);
        },

        selectCandidates : function(records) {
            let vm = this.getViewModel(),
                view = this.getView(),
                employerId = vm.get('jobPosting.employerId'),
                jobPostingId = vm.get('jobPosting.id'),
                store = Ext.create('criterion.store.employer.jobPosting.Candidates'),
                gridStore = this.getView().getStore();

            Ext.Array.each(records, function(record) {
                if (!record) {
                    return;
                }

                store.add({
                    employerId : employerId,
                    candidateId : record.getId(),
                    jobPostingId : jobPostingId,
                    rating : 0
                });
            });

            store.syncWithPromise().then(function() {
                gridStore.loadWithPromise({
                    params : {
                        jobPostingId : jobPostingId
                    }
                }).then(function() {
                    view.fireEvent('candidatesChanged');
                });
            });
        },

        onSelectionCandidate : function(o, selected) {
            this.getViewModel().set('selectedCount', selected.length);
        },

        handleRejectSelected : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                jobPostingId = vm.get('jobPosting.id'),
                gridStore = view.getStore(),
                selectionModel = view.getSelectionModel(),
                candidatesIds;

            candidatesIds = Ext.Array.map(selectionModel.getSelection(), function(item) {
                return item.getId();
            });

            criterion.Msg.confirm(
                i18n.gettext('Reject'),
                i18n.gettext('Reject Selected Candidates'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_MASS_REJECT,
                            jsonData : {
                                candidatesIds : candidatesIds
                            },
                            method : 'POST'
                        }).then(function() {
                            criterion.Utils.toast(i18n.gettext('Success.'));
                            view.fireEvent('candidatesChanged');
                            selectionModel.deselectAll();

                            gridStore.loadWithPromise({
                                params : {
                                    jobPostingId : jobPostingId
                                }
                            });
                        });
                    }
                }
            );
        },

        handleRefreshClick : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                jobPostingId = vm.get('jobPosting.id'),
                gridStore = view.getStore();

            // reload
            gridStore.loadWithPromise({
                params : {
                    jobPostingId : jobPostingId
                }
            });
        }

    };

});
