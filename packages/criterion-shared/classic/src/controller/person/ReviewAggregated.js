Ext.define('criterion.controller.person.ReviewAggregated', function() {

    return {
        alias : 'controller.criterion_person_review_aggregated',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.model.employee.ReviewAggregated',
            'criterion.ux.rating.Picker',
            'criterion.model.employee.Goal',
            'criterion.store.reviewScale.Details'
        ],

        handleDownloadAggregated : function() {
            let vm = this.getViewModel()

            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(
                    criterion.consts.Api.API.EMPLOYEE_REVIEW_AGGREGATED_DOWNLOAD,
                    vm.get('record.id'),
                    vm.get('employeeId')
                )
            ));
        },

        loadRecord : function(record) {
            var me = this,
                aggregatedData = record.getId().replace('-aggregated', '').split('-'),
                id = aggregatedData[0] && parseInt(aggregatedData[0], 10),
                view = this.getView(),
                competencyGroupsGrid = this.lookup('competencyGroupsGrid'),
                competencyGroupsGridStore = competencyGroupsGrid.getStore(),
                competencyGroupsGridColumns = [
                    {
                        xtype : 'gridcolumn',

                        text : i18n.gettext('Competency Group'),

                        dataIndex : 'competencyName',

                        flex : 1
                    }
                ],
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId');

            criterion.model.employee.ReviewAggregated.loadWithPromise(id, {
                params : {
                    employeeId : employeeId
                }
            }).then(function(aggregatedReview) {
                var competencyGroups = aggregatedReview.get('competencyGroups'),
                    competencyGroupScores = aggregatedReview.get('competencyGroupScores'),
                    items = [],
                    reviewTypesColumns = [],
                    competencyGroupStoreFields = [
                        {
                            name : 'competencyName',

                            type : 'string'
                        }
                    ],
                    competencyGroupStoreData = [];

                vm.set('record', aggregatedReview);

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

                competencyGroupsGridStore.setFields(competencyGroupStoreFields);
                competencyGroupsGridStore.loadData(competencyGroupStoreData);

                competencyGroupsGrid.reconfigure(competencyGroupsGridStore, competencyGroupsGridColumns);

                aggregatedReview.get('canShowGoals') && me.loadGoals(aggregatedReview.get('goals'), aggregatedReview.get('reviewPeriodId'));

                view.insert(1, items);
            });
        },

        loadGoals : function(goals, reviewPeriodId) {
            let goalsContainer = this.lookup('goals'),
                vm = this.getViewModel(),
                reviewPeriods = vm.getStore('reviewPeriods'),
                goalsComponents = [],
                scalesData,
                reviewScaleId;

            if (!goals || !goals.length) {
                goalsContainer.hide();

                return;
            }

            Ext.promise.Promise.all([
                vm.getStore('reviewScaleDetails').loadWithPromise(),
                reviewPeriods.loadWithPromise()
            ]).then((response) => {
                let reviewerIds = {},
                    severalReviewers;

                goalsContainer.show();

                reviewScaleId = reviewPeriods.getById(reviewPeriodId).getReviewTemplate().get('reviewScaleId');

                Ext.Array.each(goals, (goal) => {
                    Ext.Array.each(goal.reviews || [], (review) => {
                        reviewerIds[review.reviewerId] = 1;
                    });
                });
                severalReviewers = Ext.Object.getKeys(reviewerIds).length > 1;

                Ext.Array.each(goals, (goal) => {
                    let scales = Ext.create('criterion.store.reviewScale.Details'),
                        reviews = goal.reviews;

                    if (Ext.isEmpty(reviews)) {
                        reviews = [goal];
                    }

                    scales.loadData(response[0]);
                    scales.filter('reviewScaleId', reviewScaleId);

                    Ext.Array.each(reviews, (review) => {
                        let reviewGoal = criterion.model.employee.Goal.loadData(Ext.apply(Ext.clone(goal), review)),
                            labelChildren = [
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
                            ];

                        if (severalReviewers) {
                            labelChildren.push({
                                tag : 'div',
                                cls : 'reviewer-name',
                                html : review.reviewerName
                            });
                        }

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
                                                cls : 'custom-label x-unselectable goal-label',
                                                children : labelChildren
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

                });

                goalsContainer.add(goalsComponents);
            });
        },

        onPublishChange : function(cmp, value) {
            var view = this.getView(),
                vm = this.getViewModel(),
                recordId = vm.get('record.id');

            if (Ext.isNumber(recordId)) {
                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED,
                    jsonData : {
                        periodId : recordId,
                        employeeId : vm.get('employeeId'),
                        isPublished : value
                    },
                    method : 'PUT'
                }).then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully.'));
                }).always(function() {
                    view.setLoading(false);
                })
            }
        },

        onPublishForReviewerChange : function(cmp, value) {
            var view = this.getView(),
                vm = this.getViewModel(),
                recordId = vm.get('record.id');

            if (Ext.isNumber(recordId)) {
                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED_FOR_REVIEWER,
                    jsonData : {
                        periodId : recordId,
                        employeeId : vm.get('employeeId'),
                        isPublishedForReviewer : value
                    },
                    method : 'PUT'
                }).then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully.'));
                }).always(function() {
                    view.setLoading(false);
                });
            }
        },

        onPublishForManagerChange : function(cmp, value) {
            var view = this.getView(),
                vm = this.getViewModel(),
                recordId = vm.get('record.id');

            if (Ext.isNumber(recordId)) {
                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYEE_REVIEW_AGGREGATED_SET_PUBLISHED_FOR_MANAGER,
                    jsonData : {
                        periodId : recordId,
                        employeeId : vm.get('employeeId'),
                        isPublishedForManager : value
                    },
                    method : 'PUT'
                }).then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully.'));
                }).always(function() {
                    view.setLoading(false);
                });
            }
        }
    };

});




