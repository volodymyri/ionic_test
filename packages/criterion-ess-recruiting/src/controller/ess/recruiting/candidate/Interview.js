Ext.define('criterion.controller.ess.recruiting.candidate.Interview', function() {

    return {
        alias : 'controller.criterion_selfservice_recruiting_candidate_interview',

        extend : 'criterion.controller.ess.recruiting.candidate.Base',

        requires : [
            'criterion.view.review.GoalCompetencyInfo',
            'Ext.layout.container.Column'
        ],

        handleActivate() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                jobPostingCandidateId = vm.get('jobPostingCandidateId'),
                candidateToolbar = view.down('criterion_selfservice_recruiting_candidate_toolbar');

            if (jobPostingCandidateId) {
                vm.set({
                    interview : null,
                    activeViewIndex : 0
                });

                view.setLoading(true);

                me.loadMainData([this.loadJobPostingCandidateInterviews()]).then(data => {
                    view.setLoading(false);

                    vm.set(data);
                    candidateToolbar && candidateToolbar.setPressedBtn();
                }, _ => {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    view.setLoading(false);
                });
            }
        },

        loadJobPostingCandidateInterviews() {
            let vm = this.getViewModel();

            return vm.get('jobPostingCandidateInterviews').loadWithPromise({
                params : {
                    jobPostingCandidateId : vm.get('jobPostingCandidateId')
                }
            });
        },

        handleViewInterviewDetail(grid, td, cellIndex, record) {
            this.prepareStores(record);

            this.createInterviewReviewUi(record);

            this.getViewModel().set({
                interview : record,
                activeViewIndex : 1
            });
        },

        prepareStores(interview) {
            let vm = this.getViewModel(),
                reviewScaleDetails = vm.getStore('reviewScaleDetails'),
                reviewCompetencies = vm.getStore('reviewCompetencies');

            reviewScaleDetails.removeAll();
            reviewCompetencies.removeAll();

            reviewScaleDetails.loadData(interview.reviewScaleDetails().getRange());
            reviewCompetencies.loadData(interview.reviewCompetency().getRange());

            vm.set('allowReview', !!reviewCompetencies.count());
        },

        createInterviewReviewUi(interview) {
            let vm = this.getViewModel(),
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
                            padding : '0 40 0 15'
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
                                    type : 'hbox',
                                    align : 'stretch'
                                },

                                items : [
                                    {
                                        xtype : 'container',
                                        layout : 'column',

                                        width : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,

                                        margin : '0 20 0 0',

                                        items : [
                                            {
                                                xtype : 'component',
                                                html : competency.get('name'),
                                                cls : 'custom-label x-unselectable',
                                                margin : '0 20 0 0',
                                                width : 160
                                            },
                                            {
                                                xtype : 'button',
                                                cls : 'criterion-btn-glyph-only-small',
                                                scale : 'small',
                                                glyph : criterion.consts.Glyph['ios7-information-empty'],
                                                handler : _=> {
                                                    Ext.create('criterion.view.review.GoalCompetencyInfo', {
                                                        viewModel : {
                                                            data : {
                                                                data : competency,
                                                                scales
                                                            }
                                                        }
                                                    }).show();
                                                }
                                            }
                                        ]
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
                                margin : '0 0 25 0',
                                items : [
                                    {
                                        xtype : 'textarea',
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
                    xtype : 'criterion_form',

                    header : {
                        title : group.getAt(0).get('reviewCompetencyGroupDescription'),
                        padding : '15 25 0'
                    },

                    style : {
                        'border-top' : '1px solid #f2f2f2 !important'
                    },

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : items
                });
            });

            Ext.suspendLayouts();

            interviewReviewContainer.removeAll();
            interviewReviewContainer.add(interviewReviewItems);

            Ext.resumeLayouts(true);
        },

        handleBack() {
            let vm = this.getViewModel();

            if (vm.get('activeViewIndex') === 1) {
                vm.get('interview.reviewDetails').each(rec => {
                    rec.reject();
                });

                vm.set({
                    interview : null,
                    activeViewIndex : 0
                });
            } else {
                this.callParent(arguments);
            }
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

        handleSaveReviewInterview() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView();

            view.setLoading(true);

            vm.get('interview').saveWithPromise().then(_ => {
                vm.set({
                    interview : null,
                    activeViewIndex : 0
                });

                me.loadJobPostingCandidateInterviews();
            }).always(_ => {
                view.setLoading(false);
            });
        }
    }
});
