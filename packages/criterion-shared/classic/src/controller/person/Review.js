Ext.define('criterion.controller.person.Review', function() {

    return {
        alias : 'controller.criterion_person_review',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.store.reviewScale.Details',
            'criterion.model.ReviewCompetency'
        ],

        handleDownload : function() {
            window.open(criterion.Api.getSecureResourceUrl(
                Ext.String.format(
                    criterion.consts.Api.API.EMPLOYEE_REVIEW_DOWNLOAD,
                    this.getViewModel().get('record.id')
                )
            ));
        },

        handleSubmitClick : function() {
            this.updateRecord(this.getRecord(), this.handleRecordUpdate);
        },

        loadRecord : function(record) {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                reviewPeriods = me.getStore('reviewPeriods'),
                reviewDetails = vm.get('reviewDetails');

            view.setLoading(true);

            Ext.Deferred.all([
                criterion.model.employee.Review.loadWithPromise(record.getId()),
                me.getStore('reviewScaleDetails').loadWithPromise(),
                reviewPeriods.loadWithPromise(),
                me.lookupReference('customfieldsReview').getController().load(record.getId())
            ]).then(function(response) {
                record = response[0];

                reviewDetails.loadData(record.employeeReviewDetails() ? record.employeeReviewDetails().getRange() : []);

                record.competencyGroupScores().setSorters(
                    {
                        property : 'reviewCompetencyGroupSequence',
                        direction : 'ASC'
                    }
                );

                vm.set({
                    record : record,
                    reviewPeriod : reviewPeriods.getById(record.get('reviewPeriodId'))
                });
                vm.notify(); // do not delete this. call for formulas calculation

                me.loadGoals(record.goals());

                me.loadCompetencies();
            }).always(function() {
                view.setLoading(false);
            });
        },

        loadGoals : function(goals) {
            var goalsContainer = this.lookup('goals'),
                vm = this.getViewModel(),
                scalesData = vm.getStore('reviewScaleDetails').getRange(),
                reviewScaleId = vm.get('reviewPeriod.reviewTemplate.reviewScaleId'),
                goalsComponents = [];

            if (!goals || !goals.count()) {
                goalsContainer.hide();

                return;
            }

            goals.each(function(goal) {
                var scales = Ext.create('criterion.store.reviewScale.Details');

                scales.loadData(scalesData);
                scales.filter('reviewScaleId', reviewScaleId);

                goalsComponents.push({
                    xtype : 'container',
                    layout : 'hbox',

                    viewModel : {
                        data : {
                            reviewGoal : goal
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

            goalsContainer.add(goalsComponents);
        },

        loadCompetencies : function() {
            var me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                isApproved = vm.get('isApproved'),
                reviewDetails = vm.get('reviewDetails'),
                competencies = this.getStore('reviewCompetencies'),
                promises = [];

            if (!isApproved) {
                return;
            }

            view.setLoading(true);

            competencies.loadWithPromise({
                params : {
                    reviewPeriodId : vm.get('reviewPeriod.id'),
                    employeeId : vm.get('record.employeeId')
                }
            }).then({
                scope : this,
                success : function() {
                    reviewDetails.each(function(reviewDetail) {
                        var competencyId = reviewDetail.get('reviewCompetencyId');

                        if (!competencies.getById(competencyId)) {
                            promises.push(
                                Ext.create('criterion.model.ReviewCompetency', {
                                    id : competencyId
                                }).loadWithPromise());
                        }
                    });

                    Ext.promise.Promise.all(promises).then(function(missedCompetencies) {
                        missedCompetencies && competencies.add(missedCompetencies);

                        me.updateCompetencyUi();
                    });
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        updateCompetencyUi : function() {
            var view = this,
                vm = this.getViewModel(),
                competencies = view.lookup('competencies'),
                reviewDetails = vm.getStore('reviewDetails'),
                reviewCompetencies = vm.getStore('reviewCompetencies'),
                groups = reviewCompetencies.getGroups(),
                competenciesItems = [];

            groups.each(function(group) {
                var items = [];

                group.each(function(competency) {
                    var reviewDetail = reviewDetails.findRecord('reviewCompetencyId', competency.getId(), 0, false, false, true);

                    if (!reviewDetail) {
                        return
                    }

                    var scales = Ext.create('criterion.store.reviewScale.Details');

                    scales.loadData(vm.getStore('reviewScaleDetails').getRange());
                    scales.filter('reviewScaleId', competency.get('reviewScaleId'));

                    items.push({
                        xtype : 'fieldcontainer',
                        padding : '0 10',
                        layout : 'hbox',
                        labelAlign : 'top',
                        fieldLabel : competency.get('name') + (competency.get('description') ? ' / ' + competency.get('description') : ''),

                        viewModel : {
                            data : {
                                reviewDetail : reviewDetail,
                                competency : competency,
                                scale : null
                            }
                        },

                        items : [
                            {
                                xtype : 'combobox',
                                queryMode : 'local',
                                store : scales,
                                bind : {
                                    value : '{reviewDetail.reviewScaleDetailId}'
                                },
                                displayField : 'name',
                                valueField : 'id',
                                readOnly : true
                            },
                            {
                                xtype : 'textarea',
                                width : 250,
                                padding : '0 15',
                                bind : {
                                    value : '{reviewDetail.reviewComments}'
                                },
                                readOnly : true
                            },
                            {
                                xtype : 'textfield',
                                width : 100,
                                bind : {
                                    value : '{reviewDetail.rating}'
                                },
                                readOnly : true
                            }
                        ]
                    });
                });

                if (items.length) {
                    competenciesItems.push({
                        xtype : 'component',
                        html : group.getAt(0).get('reviewCompetencyGroupDescription')
                    });

                    Ext.Array.each(items, function(item) {
                        competenciesItems.push(item);
                    });
                }
            });

            competencies.removeAll();
            competencies.add(competenciesItems);
        }

    };

});

