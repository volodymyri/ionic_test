Ext.define('criterion.controller.person.Goal', function() {

    return {
        alias : 'controller.criterion_person_goal',

        extend : 'criterion.controller.FormView',

        getCurrentEmployerId() {
            return this.getViewModel().get('employer.id');
        },

        getCurrentEmployeeId() {
            return this.getViewModel().get('employeeId');
        },

        loadRecord(record) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                goalReviewScaleDetails = vm.getStore('goalReviewScaleDetails'),
                reviewsSeq = [];

            view.disableAutoSetLoadingState = true;
            view.setLoading(true);

            if (this.getCurrentEmployeeId()) {
                reviewsSeq.push(this.loadReviews())
            }

            Ext.Deferred.all([
                ...reviewsSeq,
                goalReviewScaleDetails.loadWithPromise(),
                Ext.Deferred.sequence([
                    () => criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_GOAL, criterion.consts.Dict.WORKFLOW).then(workflowTypeRec => {
                        me.workflowTypeCd = workflowTypeRec.getId();
                    }),
                    () => me.loadWorkflows()
                ])
            ]).always(() => {
                vm.set('record', record);

                me.afterLoadRecord(record);

                view.setLoading(false);
                view.disableAutoSetLoadingState = false;
            });
        },

        afterLoadRecord(record) {},

        loadReviews() {
            return this.getStore('reviews').loadWithPromise({
                params : {
                    employeeId : this.getCurrentEmployeeId()
                }
            });
        },

        loadWorkflows() {
            let employerId = this.getCurrentEmployerId(),
                dfd = Ext.create('Ext.Deferred');

            if (!employerId) {
                dfd.resolve();

                return dfd.promise;
            }

            return this.getViewModel().getStore('workflows').loadWithPromise({
                params : {
                    workflowTypeCd : this.workflowTypeCd,
                    employerId : employerId
                }
            })
        },

        onReviewChange(cmp, value) {
            let review = cmp.getSelection(),
                reviewPeriod = review && review.getReviewPeriod(),
                vm = this.getViewModel(),
                ratingCombo = this.lookup('ratingCombo'),
                reviewScaleDetailId = vm.get('record.reviewScaleDetailId');

            if (review && reviewPeriod) {
                vm.set({
                    reviewScaleId : review.get('reviewScaleId'),
                    selectedPeriod : reviewPeriod
                });

                vm.get('record').set({
                    employeeReviewId : review.get('employeeReviewId'),
                    reviewedEmployeeId : review.get('reviewedEmployeeId')
                });

                if (reviewScaleDetailId) {
                    // restore value after filtering
                    Ext.defer(function() {
                        ratingCombo.setValue(reviewScaleDetailId)
                    }, 100);
                }
            }
        }

    };

});
