Ext.define('criterion.controller.ess.performance.Reviews', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_performance_reviews',

        requires : [
            'criterion.model.employee.Review',
            'criterion.model.employee.ReviewAggregated',
            'criterion.ux.rating.Picker'
        ],

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        baseURL : criterion.consts.Route.SELF_SERVICE.RECRUITING_JOB_POSTINGS,

        init : function() {
            // for initialization vm stores
            this.handleActivate = Ext.Function.createBuffered(this.handleActivate, 100, this);

            this.callParent(arguments);
        },

        handleEmployeeChanged : function(employee) {
            if (!this.checkViewIsActive()) {
                return;
            }

            this.handleActivate();
        },

        handleActivate : function() {
            var view = this.getView();

            if (!this.getViewModel().get('employeeId')) {
                return;
            }

            view.setActiveItem(0);
            view.setLoading(true);

            Ext.Deferred.all([
                this.getStore('reviewPeriods').loadWithPromise(),
                this.getStore('reviewScaleDetails').loadWithPromise()
            ]).always(function() {
                view.setLoading(false);
            });
        },

        handleReviewPeriodChange : function() {
            this.loadReviews();
        },

        loadReviews : function() {
            var me = this,
                view = this.getView(),
                reviewPeriod = this.getViewModel().get('reviewPeriod.selection');

            view.setLoading(true);

            me.getStore('employeeReviews').loadWithPromise({
                params : {
                    periodId : reviewPeriod.getId()
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleReviewView : function(grid, record) {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employeeId = record.get('employeeId'),
                reviewForm = this.lookup('reviewForm'),
                reviewAggregatedForm = this.lookup('reviewAggregatedForm'),
                reviewPeriod = vm.get('reviewPeriod.selection'),
                reviewTemplate = reviewPeriod.getReviewTemplate(),
                recordId = record.getId(),
                aggregatedData, aggregatedPeriodId, aggregatedEmployeeId;

            if (record.get('isAggregated')) {
                aggregatedData = recordId.replace('-aggregated', '').split('-');
                aggregatedPeriodId = aggregatedData[0] && parseInt(aggregatedData[0], 10);
                aggregatedEmployeeId = aggregatedData[1] && parseInt(aggregatedData[1], 10);

                Ext.promise.Promise.all([
                    criterion.model.employee.ReviewAggregated.loadWithPromise(aggregatedPeriodId, {
                        params : {
                            employeeId : employeeId
                        }
                    }),
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_REVIEW_SET_VIEWED,
                        method : 'PUT',
                        jsonData : {
                            periodId : aggregatedPeriodId,
                            employeeReviewId : aggregatedEmployeeId
                        }
                    })
                ]).then(function(response) {
                    var aggregatedReview = response[0],
                        competencyGroupsGrid,
                        competencyGroupsGridStore,
                        competencyGroupsGridColumns = [
                            {
                                xtype : 'gridcolumn',

                                text : i18n.gettext('Competency Group'),

                                dataIndex : 'competencyName',

                                flex : 1
                            }
                        ],
                        competencyGroups = aggregatedReview.get('competencyGroups'),
                        competencyGroupScores = aggregatedReview.get('competencyGroupScores'),
                        items = [],
                        goalsContainer = [],
                        reviewTypesColumns = [],
                        competencyGroupStoreFields = [
                            {
                                name : 'competencyName',

                                type : 'string'
                            }
                        ],
                        competencyGroupStoreData = [];

                    reviewAggregatedForm.getViewModel().set({
                        record : aggregatedReview,
                        employeeId : employeeId,
                        hideScore : !competencyGroupScores || !competencyGroupScores.length
                    });

                    Ext.Array.each(competencyGroups, function(competencyGroup) {
                        var competencies = competencyGroup['competencies'],
                            competencyItems = [];

                        Ext.Array.each(competencies, function(competency) {
                            var reviewTypes = competency['reviewTypes'],
                                reviewItems = [];

                            Ext.Array.each(reviewTypes, function(reviewType) {
                                var details = reviewType['details'],
                                    detailItems = [];

                                Ext.Array.each(details, function(detail) {
                                    let photoUrl = criterion.Utils.makePersonPhotoUrl(detail['personId'], criterion.Consts.USER_PHOTO_SIZE.PERFORMANCE_REVIEW_ICON_WIDTH, criterion.Consts.USER_PHOTO_SIZE.PERFORMANCE_REVIEW_ICON_HEIGHT);

                                    detailItems.push(
                                        {
                                            xtype : 'container',

                                            layout : 'hbox',

                                            flex : 1,

                                            width : '100%',

                                            items : [
                                                {
                                                    xtype : 'component',

                                                    cls : 'photo',

                                                    html : Ext.String.format(
                                                        '<div class="circular" style="background: url({0}) no-repeat"></div><div class="name">{1}</div>', photoUrl, detail['reviewerName']),
                                                    flex : 1
                                                },
                                                {
                                                    xtype : 'container',

                                                    layout : 'hbox',

                                                    flex : 1,

                                                    items : [
                                                        {
                                                            xtype : 'criterion_rating',
                                                            value : detail['normalizedRating'],
                                                            rounding : criterion.Consts.AGGREGATED_STAR_RATING_ROUNDING,
                                                            minimum : 0,
                                                            forViewOnly : true,
                                                            trackOver : false
                                                        },
                                                        {
                                                            xtype : 'component',
                                                            html : Ext.String.format('({0})', Ext.Number.toFixed(detail['normalizedRating'], 2)),
                                                            padding : '0 0 0 10'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype : 'component',
                                                    html : detail['reviewComments'],
                                                    flex : 2
                                                }
                                            ]

                                        }
                                    );
                                });
                                reviewItems.push(
                                    {
                                        xtype : 'container',

                                        layout : 'vbox',

                                        flex : 1,

                                        width : '100%',

                                        items : [
                                            {
                                                xtype : 'container',

                                                layout : 'hbox',

                                                flex : 1,

                                                width : '100%',

                                                padding : '20 20 10',

                                                defaults : {
                                                    cls : 'header'
                                                },

                                                items : [
                                                    {
                                                        xtype : 'component',
                                                        html : reviewType['description'],
                                                        flex : 1
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        html : i18n.gettext('Rating'),
                                                        flex : 1
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        html : i18n.gettext('Comment'),
                                                        flex : 2
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'container',

                                                flex : 1,

                                                width : '100%',

                                                layout : 'vbox',

                                                padding : '0 20',

                                                items : detailItems
                                            }
                                        ]
                                    }
                                );
                            });

                            competencyItems.push(
                                {
                                    xtype : 'container',

                                    layout : {
                                        type : 'vbox',
                                        align : 'center'
                                    },

                                    flex : 1,

                                    items : [
                                        {
                                            xtype : 'component',
                                            html : competency['name'],
                                            flex : 1,
                                            cls : 'competency-name',
                                            width : '100%'
                                        },
                                        {
                                            xtype : 'container',

                                            flex : 1,

                                            width : '100%',

                                            items : reviewItems
                                        }
                                    ]
                                }
                            );
                        });

                        items.push(Ext.create({
                            xtype : 'criterion_panel',

                            ui : 'clean',

                            title : competencyGroup['description'] || competencyGroup['code'],

                            items : competencyItems
                        }));
                    });

                    Ext.Array.each(competencyGroupScores, function(competencyGroupScore) {
                        var reviewTypes = competencyGroupScore['reviewTypes'];

                        Ext.Array.each(reviewTypes, function(reviewType) {
                            var fieldName = 'review' + reviewType['id'] + 'Score',
                                existingDetail, newDetail,
                                competencyName = competencyGroupScore['description'] || competencyGroupScore['code'];

                            if (!Ext.Array.findBy(reviewTypesColumns, function(reviewTypesColumn) {
                                return reviewTypesColumn['dataIndex'] === fieldName
                            })) {
                                reviewTypesColumns.push(
                                    {
                                        xtype : 'gridcolumn',

                                        text : reviewType['description'] || reviewType['code'],

                                        dataIndex : fieldName,

                                        flex : 1
                                    }
                                )
                            }

                            competencyGroupStoreFields = Ext.Array.merge(competencyGroupStoreFields, {
                                name : fieldName,
                                type : 'string'
                            });

                            existingDetail = Ext.Array.findBy(competencyGroupStoreData, function(record) {
                                return record['competencyName'] === competencyName;
                            });
                            if (existingDetail) {
                                existingDetail[fieldName] = Ext.String.format('{0}%', reviewType['score'] * 100);
                            } else {
                                newDetail = {
                                    competencyName : competencyName
                                };

                                newDetail[fieldName] = Ext.String.format('{0}%', reviewType['score'] * 100);

                                competencyGroupStoreData.push(newDetail);
                            }
                        });

                        competencyGroupsGridColumns = Ext.Array.merge(competencyGroupsGridColumns, reviewTypesColumns);
                    });

                    if (aggregatedReview.get('canShowGoals')) {
                        goalsContainer = me.loadGoals(aggregatedReview.get('goals'), aggregatedReview.get('reviewPeriodId'));
                    }

                    reviewAggregatedForm.removeAll();

                    reviewAggregatedForm.add(
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            plugins : [
                                'criterion_responsive_column'
                            ],
                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

                            ui : 'clean',

                            items : [
                                {
                                    xtype : 'container',

                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Review Period'),
                                            readOnly : true,
                                            bind : {
                                                value : '{record.reviewPeriodName}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Period Start'),
                                            readOnly : true,
                                            bind : {
                                                value : '{record.periodStart}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Period End'),
                                            readOnly : true,
                                            bind : {
                                                value : '{record.periodEnd}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'container',

                                    items : [
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Review Date'),
                                            readOnly : true,
                                            bind : {
                                                value : '{record.reviewDate}',
                                                visible : '{record.reviewDate}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'container',
                            padding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,
                            items : items
                        },
                        {
                            xtype : 'component',
                            autoEl : 'hr',
                            hidden : !goalsContainer
                        },
                        {
                            xtype : 'criterion_panel',
                            title : i18n.gettext('Goals'),
                            ui : 'clean',
                            layout : {
                                type : 'vbox',
                                align : 'stretch'
                            },
                            hidden : !goalsContainer,
                            reference : 'goals',
                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            items : goalsContainer
                        },
                        {
                            xtype : 'component',
                            autoEl : 'hr',
                            hidden : true,
                            bind : {
                                hidden : '{hideScore}'
                            }
                        },
                        {
                            xtype : 'criterion_panel',
                            title : i18n.gettext('Score'),
                            layout : 'hbox',
                            ui : 'clean',
                            hidden : true,
                            bind : {
                                hidden : '{hideScore}'
                            },
                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            items : [
                                {
                                    xtype : 'container',

                                    items : [
                                        {
                                            xtype : 'criterion_gridview',
                                            sortableColumns : false,
                                            reference : 'competencyGroupsGrid',
                                            border : 1,
                                            tbar : null,
                                            flex : 1,
                                            store : Ext.create('Ext.data.Store'),
                                            columns : {
                                                items : [
                                                    {
                                                        xtype : 'gridcolumn',

                                                        text : i18n.gettext('Competency Group'),

                                                        dataIndex : 'competencyName'
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'container',

                                    items : [
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Total Competency Score'),
                                            labelWidth : 180,
                                            readOnly : true,
                                            bind : {
                                                value : '{record.competencyScoreInPercent}%'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Total Goal Score'),
                                            labelWidth : 180,
                                            readOnly : true,
                                            bind : {
                                                value : '{record.goalScoreInPercent}%'
                                            }
                                        },
                                        {
                                            xtype : 'container',
                                            flex : 1,
                                            layout : 'hbox',
                                            items : [
                                                {
                                                    xtype : 'textfield',
                                                    fieldLabel : i18n.gettext('Overall Score'),
                                                    labelWidth : 180,
                                                    readOnly : true,
                                                    width : 265,
                                                    bind : {
                                                        value : '{record.overallScoreInPercent}%'
                                                    }
                                                },
                                                {
                                                    xtype : 'textfield',
                                                    bind : {
                                                        value : '{record.overallRatingReviewScaleName}'
                                                    },
                                                    flex : 1,
                                                    readOnly : true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    );

                    competencyGroupsGrid = me.lookup('competencyGroupsGrid');
                    competencyGroupsGridStore = competencyGroupsGrid.getStore();

                    competencyGroupsGridStore.setFields(competencyGroupStoreFields);
                    competencyGroupsGridStore.loadData(competencyGroupStoreData);

                    competencyGroupsGrid.reconfigure(competencyGroupsGridStore, competencyGroupsGridColumns);

                    // reviewAggregatedForm.insert(1, items);
                    view.setActiveItem(reviewAggregatedForm);
                });
            } else {
                Ext.promise.Promise.all([
                    // at the first step - set isViewed for review
                    criterion.model.employee.Review.loadWithPromise(recordId, {
                        params : {
                            employeeId : employeeId
                        }
                    }),
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_REVIEW_SET_VIEWED,
                        method : 'PUT',
                        jsonData : {
                            employeeReviewId : recordId
                        }
                    }),
                    me.getStore('reviewCompetencies').loadWithPromise({
                        params : {
                            reviewTemplateId : reviewTemplate.getId(),
                            reviewPeriodId : reviewPeriod.getId(),
                            employeeId : employeeId
                        }
                    })
                ]).then(function(response) {
                    reviewForm.getViewModel().set('record', response[0]);
                    view.setActiveItem(reviewForm);
                    me.updateCompetencyAndGoalUi();
                }, function() {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                });
            }
        },

        loadGoals : function(goals, reviewPeriodId) {
            let vm = this.getViewModel(),
                reviewPeriods = vm.getStore('reviewPeriods'),
                reviewScaleDetails = vm.getStore('reviewScaleDetails'),
                goalsComponents = [],
                scalesData,
                reviewScaleId;

            if (!goals || !goals.length) {
                return;
            }

            reviewScaleId = reviewPeriods.getById(reviewPeriodId).getReviewTemplate().get('reviewScaleId');

            Ext.Array.each(goals, (goal) => {
                let reviewGoal = criterion.model.employee.Goal.loadData(goal),
                    scales = Ext.create('criterion.store.reviewScale.Details');

                scales.loadData(reviewScaleDetails.getRange());
                scales.filter('reviewScaleId', reviewScaleId);

                goalsComponents.push({
                    xtype : 'container',
                    layout : 'hbox',

                    viewModel : {
                        data : {
                            reviewGoal : reviewGoal
                        }
                    },

                    defaults : {
                        flex : 1,
                        padding : '0 40 0 15',
                        defaults : {
                            readOnly : true,
                            defaults : {
                                readOnly : true
                            }
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
                                    xtype : 'component',
                                    width : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,

                                    autoEl : {
                                        tag : 'div',
                                        cls : 'custom-label x-unselectable',
                                        children : [
                                            {
                                                tag : 'div',
                                                cls : 'title',
                                                html : goal['name']
                                            },
                                            {
                                                tag : 'div',
                                                cls : 'description',
                                                html : goal['description']
                                            }
                                        ]
                                    }
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
                                            allowBlank : false,
                                            store : scales,
                                            bind : {
                                                value : '{reviewGoal.reviewScaleDetailId}'
                                            },
                                            sortByDisplayField : false,
                                            displayField : 'name',
                                            valueField : 'id'
                                        },
                                        {
                                            xtype : 'datefield',
                                            allowBlank : false,
                                            bind : {
                                                value : '{reviewGoal.completedDate}'
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
                                    height : 90,
                                    bind : {
                                        value : '{reviewGoal.reviewComments}'
                                    }
                                }
                            ]
                        }
                    ]
                });
            });

            return goalsComponents;
        },

        handleDownload : function() {
            var reviewForm = this.lookup('reviewForm'),
                record = reviewForm.getViewModel().get('record');

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(
                    criterion.consts.Api.API.EMPLOYEE_REVIEW_DOWNLOAD,
                    record.getId()
                )
            ));
        },

        handleDownloadAggregated : function() {
            var reviewForm = this.lookup('reviewAggregatedForm'),
                vm = reviewForm.getViewModel(),
                record = vm.get('record'),
                employeeId = vm.get('employeeId');

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(
                    criterion.consts.Api.API.EMPLOYEE_REVIEW_AGGREGATED_DOWNLOAD,
                    record.getId(),
                    employeeId
                )
            ));
        },

        handleClose : function() {
            this.getView().setActiveItem(0);
        },

        updateCompetencyAndGoalUi : function() {
            var reviewForm = this.lookup('reviewForm'),
                record = reviewForm.getViewModel().get('record'),
                vm = this.getViewModel(),
                reviewPeriod = vm.get('reviewPeriod.selection'),
                reviewCompetencies = this.getStore('reviewCompetencies'),
                reviewDetails = record.employeeReviewDetails(),
                reviewGoals = record.goals(),
                reviewScaleDetails = this.getStore('reviewScaleDetails'),
                competenciesEls = [],
                goalsEls = [],
                reviewCompetenciesByReview,
                groups;

            reviewCompetenciesByReview = reviewDetails.getRange().map(function(reviewDetail) {
                return reviewDetail.get('reviewCompetencyId');
            });

            reviewCompetencies.filter({
                property : 'id',
                operator : 'in',
                value : reviewCompetenciesByReview
            });

            groups = reviewCompetencies.getGroups();

            this.lookup('customfieldsReview').getController().load(record.getId());

            reviewForm.getViewModel().set('reviewGoalsCount', reviewGoals.count());

            // UI
            groups.each(function(group) {
                var compGroup = [];

                if (!group.count()) {
                    return
                }

                group.each(function(competency) {
                    var scales = Ext.create('criterion.store.reviewScale.Details');

                    scales.loadData(reviewScaleDetails.getRange());
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
                                reviewDetail : reviewDetails.findRecord('reviewCompetencyId', competency.getId(), 0, false, false, true),
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
                                        xtype : 'component',
                                        width : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,

                                        autoEl : {
                                            tag : 'div',
                                            cls : 'custom-label x-unselectable',
                                            children : [
                                                {
                                                    tag : 'div',
                                                    cls : 'title',
                                                    html : competency.get('name')
                                                },
                                                {
                                                    tag : 'div',
                                                    cls : 'description',
                                                    html : competency.get('description')
                                                }
                                            ]
                                        }
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
                                                store : scales,
                                                allowBlank : true,
                                                readOnly : true,
                                                bind : {
                                                    value : '{reviewDetail.reviewScaleDetailId}'
                                                },
                                                displayField : 'name',
                                                valueField : 'id',
                                                sortByDisplayField : false,
                                                editable : false
                                            },
                                            {
                                                xtype : 'textfield',
                                                readOnly : true,
                                                bind : {
                                                    value : '{reviewDetail.rating}'
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
                                        height : 90,
                                        readOnly : true,
                                        bind : {
                                            value : '{reviewDetail.reviewComments}'
                                        }
                                    }
                                ]
                            }
                        ]
                    });
                });

                competenciesEls.push({
                    xtype : 'criterion_form',

                    header : {
                        title : group.getAt(0).get('reviewCompetencyGroupDescription'),
                        padding : '15 35 0'
                    },

                    style : {
                        'border-top' : '1px solid #f2f2f2 !important'
                    },

                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.ONE_TIER_FORM,

                    items : compGroup
                });
            });

            reviewGoals.each(function(goal) {
                var scales = Ext.create('criterion.store.reviewScale.Details');

                scales.loadData(reviewScaleDetails.getRange());
                scales.filter('reviewScaleId', reviewPeriod.getReviewTemplate().get('reviewScaleId'));

                goalsEls.push({
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
                                    xtype : 'component',
                                    width : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,

                                    autoEl : {
                                        tag : 'div',
                                        cls : 'custom-label x-unselectable',
                                        children : [
                                            {
                                                tag : 'div',
                                                cls : 'title',
                                                html : goal.get('name')
                                            },
                                            {
                                                tag : 'div',
                                                cls : 'description',
                                                html : goal.get('description')
                                            }
                                        ]
                                    }
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
                                            allowBlank : true,
                                            readOnly : true,
                                            store : scales,
                                            bind : {
                                                value : '{reviewGoal.reviewScaleDetailId}'
                                            },
                                            sortByDisplayField : false,
                                            displayField : 'name',
                                            valueField : 'id'
                                        },
                                        {
                                            xtype : 'datefield',
                                            allowBlank : true,
                                            readOnly : true,
                                            bind : {
                                                value : '{reviewGoal.completedDate}'
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
                                    height : 90,
                                    readOnly : true,
                                    bind : {
                                        value : '{reviewGoal.reviewComments}'
                                    }
                                }
                            ]
                        }
                    ]
                });
            });

            this.lookup('competencies').removeAll();
            this.lookup('goals').removeAll();
            this.lookup('competencies').add(competenciesEls);
            this.lookup('goals').add(goalsEls);
        }
    }
});
