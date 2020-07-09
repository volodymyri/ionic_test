Ext.define('criterion.controller.settings.performanceReviews.reviewPeriod.employee.Form', function() {

    return {
        alias : 'controller.criterion_settings_performance_reviews_review_period_employee_form',

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.store.review.Employees',
            'criterion.view.MultiRecordPickerRemoteAlt',
            'criterion.view.settings.performanceReviews.manageReviews.Statuses'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleActivate : function() {
            this.changedReviewIds = [];
        },

        handleManageReviewers : function(reviewId, reviewers, statuses, typeCode, employeeId) {
            var me = this,
                employees = Ext.create('criterion.store.review.Employees'),
                employeeIds = [],
                selectEmployeesWindow,
                reviewPeriodId = this.getViewModel().get('reviewPeriodId'),
                selectedEmployees = Ext.create('criterion.store.review.Employees');

            reviewers.each(function(rec) {
                var employeeNameData = rec.get('employeeName').split(' ');

                employeeIds.push(rec.get('employeeId'));

                selectedEmployees.add({
                    id : rec.get('employeeId'),
                    firstName : employeeNameData[0],
                    lastName : employeeNameData[1]
                })
            });

            selectEmployeesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Employees'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Middle Name'),
                                dataIndex : 'middleName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employer'),
                                dataIndex : 'employerName',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Title'),
                                dataIndex : 'positionTitle',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {
                            employeeId : employeeId,
                            reviewType : typeCode,
                            reviewPeriodId : reviewPeriodId
                        },
                        excludedIds : []
                    },
                    stores : {
                        inputStore : employees,
                        selectedStore : selectedEmployees
                    }
                },
                allowEmptySelect : true
            });

            selectEmployeesWindow.show();
            selectEmployeesWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });
            selectEmployeesWindow.on('selectRecords', function(records) {
                me.setCorrectMaskZIndex(false);
                me.selectEmployees(records, reviewers, statuses, reviewId);
            });
            me.setCorrectMaskZIndex(true);
        },

        selectEmployees : function(records, reviewers, statuses, reviewId) {
            var vm = this.getViewModel(),
                employeeIds = [],
                employeeNames = {},
                reviewerForRemove = [],
                statusesForRemove = [],
                presentValues = [],
                newValues,
                newReviewers,
                newStatuses;

            this.changedReviewIds.push(reviewId);

            Ext.Array.each(records, function(rec) {
                var empIds = rec.getId().toString().split('-'),
                    empId = empIds.length === 1 ? empIds[0] : empIds[1];

                employeeIds.push(parseInt(empId, 10));
                employeeNames[empId] = rec.get('firstName') + ' ' + rec.get('lastName');
            });

            reviewers.each(function(rec) {
                var statusForRemove;

                if (Ext.Array.indexOf(employeeIds, rec.get('employeeId')) !== -1) {
                    presentValues.push(rec.get('employeeId'));
                } else {
                    reviewerForRemove.push(rec);

                    statusForRemove = statuses.findRecord('reviewer', rec.get('employeeName'));
                    if (statusForRemove) {
                        statusesForRemove.push(statusForRemove);
                    }
                }
            });
            if (reviewerForRemove.length) {
                reviewers.remove(reviewerForRemove);
            }

            if (statusesForRemove.length) {
                statuses.remove(statusesForRemove);
            }

            newValues = Ext.Array.difference(employeeIds, presentValues);
            if (newValues.length) {
                newReviewers = [];
                newStatuses = [];

                Ext.Array.each(newValues, function(employeeId) {
                    newReviewers.push({
                        employeeId : employeeId,
                        reviewId : reviewId,
                        reviewDate : vm.get('reviewEmployee.hasEmployeeReview') ? vm.get('reviewEmployee.reviewDate') : null,
                        employeeName : employeeNames[employeeId]
                    });

                    newStatuses.push({
                        reviewer : employeeNames[employeeId],
                        isComplete : false
                    });
                });

                reviewers.add(newReviewers);

                statuses.add(newStatuses);
            }
        },

        handleShowDetails : function(statuses) {
            var me = this,
                wnd = Ext.create('criterion.view.settings.performanceReviews.manageReviews.Statuses', {
                    viewModel : {
                        stores : {
                            statuses : statuses
                        }
                    }
                });

            wnd.on('ok', function() {
                me.setCorrectMaskZIndex(false);
                wnd.destroy();
            });
            wnd.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });
            wnd.show();
            me.setCorrectMaskZIndex(true);
        },

        handleDeleteEmployee : function() {
            var view = this.getView(),
                record = this.getViewModel().get('reviewEmployee');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        record.eraseWithPromise().then({
                            success : function() {
                                view.fireEvent('back');
                            },
                            failure : function() {
                                view.fireEvent('back');
                            }
                        });
                    }
                }
            );
        },

        handleSaveEmployee : function() {
            var view = this.getView(),
                record = this.getViewModel().get('reviewEmployee'),
                promises;

            if (!view.isValid()) {
                return;
            }

            view.setLoading(true);

            promises = [
                record.saveWithPromise()
            ];

            if (record.get('is360')) {
                record.reviewerDetails().each(function(detail) {
                    var reviewers = detail.reviewers(),
                        dfd = Ext.create('Ext.Deferred');

                    if (reviewers) {
                        promises.push(dfd.promise);
                        if (reviewers.getNewRecords().length || reviewers.getRemovedRecords().length || reviewers.getUpdatedRecords().length) {
                            reviewers.sync({
                                scope : dfd,
                                success : dfd.resolve,
                                failure : dfd.reject
                            });
                        } else {
                            dfd.resolve();
                        }
                    }
                })
            }

            Ext.promise.Promise.all(promises).then(function() {
                view.fireEvent('back');
            }).always(function() {
                view.setLoading(false);
            });
        }
    }
});
