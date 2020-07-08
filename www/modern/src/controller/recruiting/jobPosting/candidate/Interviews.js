Ext.define('ess.controller.recruiting.jobPosting.candidate.Interviews', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_recruiting_job_postings_candidate_interviews',

        requires : [
            'ess.view.recruiting.jobPosting.candidate.InterviewReviewInfo'
        ],

        handleActivate() {
            let view = this.getView();

            if (!this.checkViewIsActive()) {
                return;
            }

            this.lookup('container').setActiveItem(this.lookup('grid'));

            view.setLoading(true);

            this.loadJobPostingCandidateInterviews().always(_ => {
                view.setLoading(false);
            });
        },

        loadJobPostingCandidateInterviews() {
            let vm = this.getViewModel();

            return vm.get('jobPostingCandidateInterviews').loadWithPromise({
                params : {
                    jobPostingCandidateId : vm.get('jobPostingCandidate.id')
                }
            });
        },

        showForm(record) {
            let form = this.lookup('form');

            this.prepareStores(record);

            this.createInterviewReviewUi(record);

            form.getViewModel().set({
                interview : record
            });

            this.lookup('container').setActiveItem(form);
        },

        prepareStores(interview) {
            let vm = this.getViewModel(),
                reviewScaleDetails = vm.get('reviewScaleDetails'),
                reviewCompetencies = vm.get('reviewCompetencies');

            reviewScaleDetails.removeAll();
            reviewCompetencies.removeAll();

            reviewScaleDetails.loadData(interview.reviewScaleDetails().getRange());
            reviewCompetencies.loadData(interview.reviewCompetency().getRange());

            vm.set('allowReview', !!reviewCompetencies.count());
        },

        createInterviewReviewUi(interview) {
            let me = this,
                vm = this.getViewModel(),
                jobPostingCandidateInterviewReviewId = interview.getId(),
                reviewDetails = interview.reviewDetails(),
                interviewReviewContainer = this.lookup('interviewReview'),
                reviewCompetencies = vm.getStore('reviewCompetencies'),
                scales = vm.getStore('reviewScaleDetails'),
                reviewScaleDetailId = scales.count() ? scales.first().getId() : null,
                groups = reviewCompetencies.getGroups(),
                interviewReviewItems = [];

            groups.each(group => {
                let items = [];

                group.each(competency => {
                    let uid = criterion.Utils.generateUID(),
                        reviewCompetencyId = competency.getId(),
                        reviewDetail = reviewDetails.findRecord('reviewCompetencyId', reviewCompetencyId, 0, false, false, true);

                    if (!reviewDetail) {
                        reviewDetail = reviewDetails.add({
                            jobPostingCandidateInterviewReviewId : jobPostingCandidateInterviewReviewId,
                            reviewCompetencyId,
                            reviewScaleDetailId
                        })[0];
                    }

                    items.push({
                        xtype : 'container',
                        layout : 'hbox',

                        defaults : {
                            flex : 1,
                            padding : '0 15 0 15'
                        },

                        viewModel : {
                            data : {
                                interview,
                                reviewDetail,
                                competency
                            }
                        },

                        items : [

                            {
                                xtype : 'container',
                                layout : {
                                    type : 'vbox',
                                    align : 'stretch'
                                },

                                items : [
                                    {
                                        xtype : 'container',
                                        layout : {
                                            type : 'hbox',
                                            align : 'stretch'
                                        },
                                        items : [
                                            {
                                                xtype : 'component',
                                                html : competency.get('name'),
                                                cls : 'custom-label x-unselectable',
                                                margin : '3 5 0 0'
                                            },

                                            {
                                                xtype : 'button',
                                                cls : 'ess-info-btn',
                                                iconCls : 'md-icon-info',
                                                handler : _ => {
                                                    me.showInfo({
                                                        competency,
                                                        scales
                                                    });
                                                }
                                            }
                                        ],
                                        margin : '0 0 10 0'
                                    },

                                    {
                                        xtype : 'container',
                                        flex : 1,
                                        layout : {
                                            type : 'vbox',
                                            align : 'stretch'
                                        },

                                        items : [
                                            {
                                                xtype : 'combobox',
                                                reference : `scale_${uid}`,
                                                queryMode : 'local',
                                                store : scales,
                                                disabled : !scales.getCount(),
                                                value : reviewDetail.reviewScaleDetailId,
                                                bind : {
                                                    value : '{reviewDetail.reviewScaleDetailId}'
                                                },

                                                listeners : {
                                                    change : 'onScaleComboChange'
                                                },

                                                displayField : 'name',
                                                valueField : 'id',
                                                sortByDisplayField : false,
                                                editable : false
                                            },
                                            {
                                                xtype : 'textfield',
                                                uid,
                                                hidden : !scales.getCount(),
                                                value : reviewDetail.rating,
                                                bind : {
                                                    value : '{reviewDetail.rating}',
                                                    disabled : '{!interview.isCompetencyManualRating}'
                                                },
                                                listeners : {
                                                    change : 'onScaleRatingChange'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype : 'container',
                                layout : 'fit',
                                margin : '25 0 15 0',
                                items : [
                                    {
                                        xtype : 'textareafield',
                                        height : 90,
                                        value : reviewDetail.reviewComments,
                                        bind : {
                                            value : '{reviewDetail.reviewComments}'
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                });

                items.length && interviewReviewItems.push({
                    xtype : 'panel',

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : [
                        {
                            xtype : 'component',
                            html : group.getAt(0).get('reviewCompetencyGroupDescription').toUpperCase(),
                            cls : 'bold',
                            margin : '20 0 20 0'
                        },
                        ...items
                    ]
                });
            });

            Ext.suspendLayouts();

            interviewReviewContainer.removeAll();
            interviewReviewContainer.add(interviewReviewItems);

            Ext.resumeLayouts(true);
        },

        onScaleComboChange(cmp, value) {
            let vm = cmp.lookupViewModel(),
                reviewDetail = vm.get('reviewDetail'),
                record;

            if (reviewDetail.phantom || reviewDetail.get('reviewScaleDetailId') !== value) {
                record = cmp.getSelection();
                reviewDetail.set('rating', record ? record.get('rating') : null);
            }
        },

        onScaleRatingChange(cmp, value) {
            if (!cmp.isDisabled()) {
                let scaleCmb = this.lookup(`scale_${cmp.uid}`),
                    store = scaleCmb.getStore(),
                    scale = store.findRecord('rating', value);

                scaleCmb.setValue(scale ? scale.getId() : null);
            }
        },

        handleBack() {
            this.lookup('container').setActiveItem(this.lookup('grid'));
        },

        handleSave() {
            let me = this,
                vm = this.lookup('form').getViewModel(),
                view = this.getView();

            view.setLoading(true);

            vm.get('interview').saveWithPromise().then(_ => {
                vm.set({
                    interview : null
                });

                me.loadJobPostingCandidateInterviews().then(_ => {
                    view.setLoading(false);
                    me.handleBack()
                }, _ => {
                    view.setLoading(false);
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                });
            });
        },

        showInfo(data) {
            let {competency, scales} = data;

            let infoWnd = Ext.create('ess.view.recruiting.jobPosting.candidate.InterviewReviewInfo', {
                competency,
                scales
            });

            infoWnd.show({
                title : i18n.gettext('Info'),
                ui : 'rounded',
                message : '',
                buttons : [
                    {text : i18n.gettext('Close'), itemId : 'no', cls : 'cancel-btn'}
                ],
                prompt : true,
                scope : this
            });
        }

    };
});
