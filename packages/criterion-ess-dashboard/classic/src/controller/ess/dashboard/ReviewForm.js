Ext.define('criterion.controller.ess.dashboard.ReviewForm', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_dashboard_review_form',

        requires : [
            'criterion.model.employee.Review',
            'criterion.store.reviewScale.Details',
            'criterion.view.review.GoalCompetencyInfo',
            'Ext.layout.container.Column'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        init : function() {
            this.recalculateScores = Ext.Function.createBuffered(this.recalculateScores, 500, this);

            this.callParent(arguments);
        },

        loadReview : function(opts) {
            var dfd = Ext.create('Ext.Deferred'),
                vm = this.getViewModel(),
                reviewPeriods = this.getStore('reviewPeriods'),
                me = this,
                record = Ext.create('criterion.model.employee.Review', {
                    id : opts.reviewId
                }),
                employeeId = vm.get('employeeId'),
                hasSavedData = opts.workflowStatusCode === criterion.Consts.WORKFLOW_STATUSES.SAVED,
                savedData,
                delegatedByEmployeeId = opts.delegatedByEmployeeId,
                queue = [
                    this.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW, delegatedByEmployeeId),
                    record.loadWithPromise({
                        params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    }),
                    this.getStore('reviewScaleDetails').loadWithPromise({
                        params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    }),
                    reviewPeriods.loadWithPromise({
                        params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    }),
                    this.lookupReference('customfieldsReview').getController().load(opts.reviewId)
                ];

            if (hasSavedData) {
                savedData = opts.requestData;
            }

            if (opts.workflowStatusCode === criterion.Consts.WORKFLOW_STATUSES.REJECTED) {
                var lastComment = opts.comments && opts.comments.length ? opts.comments[opts.comments.length - 1] : null;

                lastComment && criterion.Msg.warning(Ext.String.format('<strong>Rejected by :</strong> {0}<p><strong>Comment :</strong>  {1}</p>', lastComment.commentator, lastComment.comment))
            }

            Ext.Deferred.all(queue).then(
                {
                    success : function() {
                        var period = reviewPeriods.getById(record.get('reviewPeriodId')),
                            goals = record.goals(),
                            reviewGoals = vm.get('reviewGoals'),
                            savedGoals;

                        if (hasSavedData && goals && savedData && savedData.goals) {
                            vm.get('reviewDetails').loadData(savedData.reviewDetails);

                            savedGoals = savedData.goals;
                            // add saved data to goals
                            Ext.each(savedGoals, function(goal) {
                                var rec = goals.getById(goal.id);
                                rec && rec.set({
                                    completedDate : goal.completedDate,
                                    reviewComments : goal.reviewComments,
                                    reviewScaleDetailId : goal.reviewScaleDetailId
                                }, {disableCaching : true})
                            });
                            me.fillValuesCustomFields(savedData.customData);
                        } else {
                            vm.get('reviewDetails').loadData(record.employeeReviewDetails() ? record.employeeReviewDetails().getRange() : []);

                        }

                        reviewGoals.loadData(goals ? goals.getRange() : []);

                        vm.set({
                            record : record,
                            selectedPeriod : period,
                            reviewGoalsCount : reviewGoals.count()
                        });

                        vm.notify();

                        criterion.model.ReviewTemplate.loadWithPromise(period.get('reviewTemplateId'), {
                            params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                        }).then(
                            function(reviewTemplate) {
                                vm.set('reviewTemplate', reviewTemplate);
                                me.loadCompetencies(delegatedByEmployeeId).then({
                                    success : function() {
                                        dfd.resolve();
                                    },
                                    failure : function() {
                                        dfd.reject();
                                    }
                                });
                            }
                        );
                    },
                    failure : function() {
                        dfd.reject();
                    }
                }
            );

            return dfd.promise;
        },

        loadCompetencies : function(delegatedByEmployeeId) {
            var vm = this.getViewModel(),
                reviewDetails = vm.get('reviewDetails'),
                competencies = this.getStore('reviewCompetencies'),
                isNotSubmitted = vm.get('record.reviewStatusCode') === criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED;

            return competencies.loadWithPromise({
                params : Ext.Object.merge(
                    {
                        reviewTemplateId : vm.get('selectedPeriod').get('reviewTemplateId')
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                )
            }).then({
                scope : this,
                success : function() {
                    isNotSubmitted && competencies.each(function(competency) {
                        if (!reviewDetails.findRecord('reviewCompetencyId', competency.getId(), 0, false, false, true)) {
                            reviewDetails.add({
                                reviewCompetencyId : competency.getId()
                            })
                        }
                    });

                    this.updateCompetencyUi();
                }
            });
        },

        updateCompetencyUi : function() {
            var view = this,
                vm = this.getViewModel(),
                reviewDetails = vm.getStore('reviewDetails'),
                reviewCompetencies = vm.getStore('reviewCompetencies'),
                reviewGoals = vm.getStore('reviewGoals'),
                competencies = [],
                goals = [],
                groups,
                isNotSubmitted = vm.get('record.reviewStatusCode') === criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED,
                promises = [];

            if (!isNotSubmitted) {
                reviewDetails.each(function(reviewDetail) {
                    var competencyId = reviewDetail.get('reviewCompetencyId');

                    if (!reviewCompetencies.getById(competencyId)) {
                        promises.push(
                            Ext.create('criterion.model.ReviewCompetency', {
                                id : competencyId
                            }).loadWithPromise());
                    }
                });
            }

            Ext.promise.Promise.all(promises).then(function(missedCompetencies) {
                missedCompetencies && reviewCompetencies.add(missedCompetencies);

                groups = reviewCompetencies.getGroups();

                groups.each(function(group) {
                    var compGroup = [];

                    if (!group.count()) {
                        return
                    }

                    group.each(function(competency) {
                        var reviewDetail = reviewDetails.findRecord('reviewCompetencyId', competency.getId(), 0, false, false, true);

                        if (!reviewDetail) {
                            return
                        }

                        var scales = Ext.create('criterion.store.reviewScale.Details');

                        scales.loadData(vm.getStore('reviewScaleDetails').getRange());
                        scales.filter('reviewScaleId', competency.get('reviewScaleId'));

                        compGroup.push({
                            xtype : 'container',
                            layout : 'hbox',
                            isCompetencyContainer : true,

                            defaults : {
                                flex : 1,
                                padding : '0 40 0 15'
                            },

                            viewModel : {
                                data : {
                                    reviewDetail : reviewDetail,
                                    competency : competency,
                                    scale : null
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
                                                                    scales : scales
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
                                                    resetOriginalValueOnRender : true,
                                                    itemId : 'scaleCmb',
                                                    queryMode : 'local',
                                                    store : scales,
                                                    allowBlank : false,
                                                    disabled : !scales.getCount(),
                                                    bind : {
                                                        value : '{reviewDetail.reviewScaleDetailId}',
                                                        readOnly : '{needApprove}'
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
                                                    resetOriginalValueOnRender : true,
                                                    hidden : !scales.getCount(),
                                                    bind : {
                                                        value : '{reviewDetail.rating}',
                                                        disabled : '{!selectedPeriod.reviewTemplate.isCompetencyManualRating}',
                                                        readOnly : '{needApprove}'
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
                                            resetOriginalValueOnRender : true,
                                            height : 90,
                                            bind : {
                                                value : '{reviewDetail.reviewComments}',
                                                readOnly : '{needApprove}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        });
                    });

                    compGroup.length && competencies.push({
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

                        items : compGroup
                    });
                });

                reviewGoals.each(function(goal) {
                    var scales = Ext.create('criterion.store.reviewScale.Details');

                    scales.loadData(vm.getStore('reviewScaleDetails').getRange());
                    scales.filter('reviewScaleId', vm.get('selectedPeriod.reviewTemplate.reviewScaleId'));

                    goals.push({
                        xtype : 'container',
                        layout : 'hbox',

                        viewModel : {
                            data : {
                                reviewGoal : goal
                            }
                        },

                        defaults : {
                            flex : 1,
                            padding : '0 40 0 15'
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
                                                html : goal.get('name'),
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
                                                                data : goal,
                                                                scales : scales
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
                                                queryMode : 'local',
                                                resetOriginalValueOnRender : true,
                                                allowBlank : false,
                                                store : scales,
                                                bind : {
                                                    value : '{reviewGoal.reviewScaleDetailId}',
                                                    readOnly : '{needApprove}'
                                                },
                                                sortByDisplayField : false,
                                                displayField : 'name',
                                                valueField : 'id',
                                                listeners : {
                                                    change : 'handleGoalScaleComboChange'
                                                }
                                            },
                                            {
                                                xtype : 'datefield',
                                                resetOriginalValueOnRender : true,
                                                allowBlank : false,
                                                bind : {
                                                    value : '{reviewGoal.completedDate}',
                                                    readOnly : '{needApprove}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype : 'container',
                                layout : 'fit',
                                items : [
                                    {
                                        xtype : 'textarea',
                                        resetOriginalValueOnRender : true,
                                        height : 90,
                                        bind : {
                                            value : '{reviewGoal.reviewComments}',
                                            readOnly : '{needApprove}'
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                });

                view.lookup('competencies').removeAll();
                view.lookup('goals').removeAll();
                view.lookup('competencies').add(competencies);
                view.lookup('goals').add(goals);
            });
        },

        onScaleComboChange : function(combo, scaleDetailId) {
            var vm = combo.up('[isCompetencyContainer]').getViewModel(),
                reviewDetail = vm.get('reviewDetail'),
                record;

            if (reviewDetail.phantom || reviewDetail.get('reviewScaleDetailId') !== scaleDetailId) {
                record = combo.getSelection();
                reviewDetail.set('rating', record ? record.get('rating') : null);
                this.recalculateScores();
            }
        },

        onScaleRatingChange : function(field, rating) {
            if (!field.isDisabled()) {
                var scaleCmb = field.up('container').getComponent('scaleCmb'), // ref this shit
                    store = scaleCmb.getStore(),
                    scale = store.findRecord('rating', rating);
                scaleCmb.setValue(scale ? scale.getId() : null);
                this.recalculateScores();
            }
        },

        handleGoalScaleComboChange : function() {
            this.recalculateScores();
        },

        recalculateScores : function() {
            var vm = this.getViewModel(),
                reviewScaleDetails = vm.getStore('reviewScaleDetails'),
                reviewGoals = vm.getStore('reviewGoals'),
                reviewCompetencies = vm.getStore('reviewCompetencies'),
                scales = Ext.create('criterion.store.reviewScale.Details', {
                    grouper : {
                        property : 'reviewScaleId',
                        direction : 'DESC'
                    }
                }),
                reviewScaleMaxRating,
                reviewCompetencyVals = {},
                weights = vm.get('reviewTemplate.weights'),
                competencyGroupScores = vm.get('record.competencyGroupScores'),
                totalCompetencyScore = 0,
                totalGoalScore = 0,
                periodCompetencyWeight = 1 - vm.get('selectedPeriod.reviewTemplate.goalWeight'),
                periodReviewScaleId, filteredScales, overallScore,
                ratingIndexes = [],
                ratingIndex,
                scale;

            reviewScaleDetails.cloneToStore(scales);

            reviewScaleMaxRating = scales.max('rating', true);

            vm.getStore('reviewDetails').each(function(record) {
                var rating = record.get('rating'),
                    reviewScaleDetailId = record.get('reviewScaleDetailId'),
                    reviewCompetencyId = record.get('reviewCompetencyId'),
                    reviewCompetency = reviewCompetencies.getById(reviewCompetencyId),
                    reviewScaleDetail,
                    reviewCompetencyGroupCd,
                    reviewScaleId;

                if (reviewScaleDetailId) {
                    reviewCompetencyGroupCd = reviewCompetency.get('reviewCompetencyGroupCd');

                    reviewScaleDetail = reviewScaleDetails.getById(record.get('reviewScaleDetailId'));
                    reviewScaleId = reviewScaleDetail.get('reviewScaleId');

                    if (!reviewCompetencyVals[reviewCompetencyGroupCd]) {
                        reviewCompetencyVals[reviewCompetencyGroupCd] = [];
                    }

                    reviewCompetencyVals[reviewCompetencyGroupCd].push(rating / reviewScaleMaxRating[reviewScaleId]);
                } else if (vm.get('selectedPeriod.reviewTemplate.isCompetencyManualRating')) {
                    reviewCompetencyGroupCd = reviewCompetency.get('reviewCompetencyGroupCd');
                    if (!reviewCompetencyVals[reviewCompetencyGroupCd]) {
                        reviewCompetencyVals[reviewCompetencyGroupCd] = [];
                    }

                    reviewCompetencyVals[reviewCompetencyGroupCd].push(rating / reviewScaleMaxRating[reviewCompetency.get('reviewScaleId')]);
                }
            });

            competencyGroupScores.loadData([]);
            Ext.Object.each(reviewCompetencyVals, function(key, vals) {
                var score = Ext.Array.sum(vals) / vals.length,
                    reviewCompetencyGroupCd = parseInt(key, 10),
                    weight;

                competencyGroupScores.add({
                    reviewCompetencyGroupCd : reviewCompetencyGroupCd,
                    score : score
                });

                weight = weights.findRecord('competencyGroupCd', reviewCompetencyGroupCd, 0, false, false, true).get('weight');
                totalCompetencyScore += score * weight;
            });

            competencyGroupScores.sort('reviewCompetencyGroupSequence', 'ASC');

            vm.set('record.competencyScore', totalCompetencyScore);

            // goals
            periodReviewScaleId = vm.get('selectedPeriod.reviewTemplate.reviewScaleId');

            reviewGoals.each(function(goal) {
                var rating,
                    reviewScaleDetailId = goal.get('reviewScaleDetailId');

                if (!reviewScaleDetailId) {
                    return;
                }

                rating = reviewScaleDetails.getById(reviewScaleDetailId).get('rating');

                totalGoalScore += (rating / reviewScaleMaxRating[periodReviewScaleId]) * goal.get('weight');
            });

            vm.set('record.goalScore', totalGoalScore);
            overallScore = totalCompetencyScore * periodCompetencyWeight + totalGoalScore * (1 - periodCompetencyWeight);
            vm.set('record.overallScore', overallScore);

            // calc Overall rating
            filteredScales = Ext.create('criterion.store.reviewScale.Details', {
                sorters : [{
                    property : 'rating',
                    direction : 'ASC'
                }]
            });
            filteredScales.loadData(reviewScaleDetails.getRange());
            filteredScales.filter('reviewScaleId', periodReviewScaleId);

            filteredScales.each(function(sc) {
                ratingIndexes.push(sc.get('rating') / reviewScaleMaxRating[periodReviewScaleId])
            });

            ratingIndex = Ext.Array.binarySearch(ratingIndexes, overallScore) - 1;
            scale = filteredScales.getAt(ratingIndex < 0 ? 0 : ratingIndex);
            vm.set('record.overallRatingReviewScaleName', scale ? scale.get('description') : '');
        },

        submitReview : function() {
            var me = this,
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                competencies = this.lookup('competencies'),
                goalsForm = this.lookup('goals'),
                hasGoals = vm.get('showGoals'),
                dfd = Ext.create('Ext.Deferred'),
                reviewData;

            if (hasGoals && !goalsForm.isValid()) {
                goalsForm.focusOnInvalidField();

                dfd.reject();
                return dfd.promise;
            }

            if (!competencies.isValid()) {
                competencies.focusOnInvalidField();

                dfd.reject();
                return dfd.promise;
            }

            reviewData = this.getReviewData();

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            me.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_REVIEW, false, i18n.gettext('Do you want to submit the review?')).then(function(signature) {
                me.setCorrectMaskZIndex(false);

                if (signature) {
                    reviewData['signature'] = signature;
                }

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_REVIEW_SUBMIT,
                    params : {
                        reviewId : vm.get('record').getId(),
                        employeeId : vm.get('employeeId')
                    },
                    jsonData : reviewData,
                    method : 'POST'
                }).then({
                    success : function(result) {
                        dfd.resolve(result);
                    },
                    failure : function() {
                        dfd.reject();
                    }
                });
            }, function() {
                dfd.reject();
            });

            return dfd.promise;
        },

        getReviewData : function() {
            var vm = this.getViewModel(),
                employeeReviewId = vm.get('record').getId(),
                customFieldsContainer = this.lookupReference('customfieldsReview'),
                customFieldsChanges = customFieldsContainer.getController().getChanges(employeeReviewId),
                customFields = [],
                reviewDetails = [],
                reviewGoals = [];

            var addCustomFieldsChanges = function(record, isDeleted) {
                customFields.push({
                    id : record.getId(),
                    deleted : isDeleted,
                    customField : record.get('customField'),
                    customFieldId : record.get('customFieldId'),
                    value : record.get('value')
                });
            };

            customFieldsChanges.modifiedCustomValues.forEach(function(record) {
                addCustomFieldsChanges(record, false);
            });

            customFieldsChanges.removedCustomValues.forEach(function(record) {
                addCustomFieldsChanges(record, true);
            });

            vm.getStore('reviewDetails').each(function(record) {
                reviewDetails.push({
                    employeeReviewId : employeeReviewId,
                    rating : record.get('rating'),
                    reviewComments : record.get('reviewComments'),
                    reviewCompetencyId : record.get('reviewCompetencyId'),
                    reviewScaleDetailId : record.get('reviewScaleDetailId')
                });
            });

            if (vm.get('showGoals')) {
                vm.getStore('reviewGoals').each(function(record) {
                    reviewGoals.push({
                        id : record.getId(),
                        reviewComments : record.get('reviewComments'),
                        reviewScaleDetailId : record.get('reviewScaleDetailId'),
                        completedDate : Ext.Date.format(record.get('completedDate'), criterion.consts.Api.DATE_FORMAT)
                    });
                });
            }

            return {
                employeeReviewId : employeeReviewId,
                customValues : customFields,
                reviewDetails : reviewDetails,
                goals : reviewGoals
            }
        },

        getReviewCustomData : function() {
            return {
                customData : this.lookup('customfieldsReview').getFieldsValues()
            };
        },

        fillValuesCustomFields : function(values) {
            this.lookup('customfieldsReview').setFieldsValues(values);
        }
    }

});
