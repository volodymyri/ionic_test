Ext.define('criterion.view.settings.performanceReviews.reviewPeriod.employee.Form', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_period_employee_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.view.settings.performanceReviews.manageReviews.*',
            'criterion.controller.settings.performanceReviews.reviewPeriod.employee.Form',
            'criterion.view.settings.performanceReviews.reviewPeriod.employee.ReviewDateWidget'
        ],

        cls : 'criterion-settings-performance-reviews-review-period-employee-form',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },
        header : {
            hidden : true
        },

        controller : {
            type : 'criterion_settings_performance_reviews_review_period_employee_form'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate',
            deleteEmployee : 'handleDeleteEmployee',
            saveEmployee : 'handleSaveEmployee'
        },

        viewModel : {
            data : {
                /**
                 * criterion.model.reviewTemplate.period.Employee
                 */
                reviewEmployee : null
            }
        },
        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_panel',
                reference : 'employeePeriodForm',
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                bodyPadding : 10,

                items : [
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Employee Name'),
                                disabled : true,
                                bind : {
                                    value : '{reviewEmployee.employeeName}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Review Type'),
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{reviewEmployee.reviewTypeCd}',
                                    disabled : '{reviewEmployee.is360}',
                                    hidden : '{reviewEmployee.is360}',
                                    store : '{reviewEmployee.reviewTypes}'
                                },
                                queryMode : 'local',
                                valueField : 'id',
                                displayField : 'title',
                                forceSelection : true,
                                autoSelect : true,
                                editable : false
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Period Start'),
                                allowBlank : false,
                                bind : {
                                    value : '{reviewEmployee.periodStart}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Period End'),
                                allowBlank : false,
                                bind : {
                                    value : '{reviewEmployee.periodEnd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Review Date'),
                                allowBlank : false,
                                bind : {
                                    value : '{reviewEmployee.reviewDate}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Review Deadline'),
                                allowBlank : false,
                                bind : {
                                    value : '{reviewEmployee.reviewDeadline}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Status'),
                                disabled : true,
                                bind : {
                                    value : '{reviewEmployee.status}'
                                }
                            }
                        ]
                    }
                ]
            },

            // grid of reviewers
            {
                xtype : 'criterion_gridpanel',
                hidden : true,
                variableRowHeight : true,
                title : i18n.gettext('Reviewers'),
                bind : {
                    hidden : '{!reviewEmployee.is360}',
                    store : '{reviewEmployee.reviewerDetails}'
                },
                columns : [
                    {
                        text : i18n.gettext('Type'),
                        dataIndex : 'type',
                        sortable : false,
                        menuDisabled : true,
                        width : 150
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Reviewer(s)'),
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_settings_performance_reviews_manage_reviews_reviewers_widget',
                            multiString : true,
                            listeners : {
                                manageReviewers : 'handleManageReviewers',
                                recalSize : function() {
                                    this.up('criterion_settings_performance_reviews_review_period_employee_form').resizeGrid();
                                }
                            }
                        },
                        onWidgetAttach : function(col, widget, rec) {
                            widget.setReviewId(rec.getId());
                            widget.setReviewers(rec.reviewers());
                            widget.setStatuses(rec.statuses());
                            widget.setTypeCode(rec.get('typeCode'));
                            widget.setEmployeeId(rec.get('employeeId'));
                        }
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Review Date'),
                        width : 150,
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_settings_performance_reviews_review_period_employee_review_date_widget',
                            fieldName : 'reviewDate'
                        },
                        onWidgetAttach : function(col, widget, rec) {
                            var viewVm = this.lookupViewModel(),
                                reviewEmployee = viewVm.get('reviewEmployee'),
                                hasEmployeeReview = reviewEmployee.get('hasEmployeeReview');

                            widget.setReviewers(rec.reviewers());

                            if (!hasEmployeeReview) {
                                widget.setDisabled(true);
                            }
                        }
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Next Review Date'),
                        width : 180,
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_settings_performance_reviews_review_period_employee_review_date_widget',
                            fieldName : 'nextReviewDate'
                        },
                        onWidgetAttach : function(col, widget, rec) {
                            var viewVm = this.lookupViewModel(),
                                reviewEmployee = viewVm.get('reviewEmployee'),
                                isCustomFrequency = reviewEmployee.get('isCustomFrequency'),
                                hasEmployeeReview = reviewEmployee.get('hasEmployeeReview');

                            widget.setReviewers(rec.reviewers());

                            if (!isCustomFrequency || !hasEmployeeReview) {
                                widget.setDisabled(true);
                            }
                        }
                    },
                    {
                        xtype : 'widgetcolumn',
                        text : i18n.gettext('Status'),
                        flex : 1,
                        sortable : false,
                        menuDisabled : true,
                        widget : {
                            xtype : 'criterion_settings_performance_reviews_manage_reviews_status_widget',
                            listeners : {
                                showDetails : 'handleShowDetails'
                            }
                        },
                        onWidgetAttach : function(col, widget, rec) {
                            var statuses = rec.statuses(),
                                typeCode = rec.get('typeCode');

                            widget.setTypeCode(typeCode);
                            widget.setStatuses(statuses);

                            statuses.on('datachanged', function() {
                                widget.setStatuses(statuses);
                            }, this);
                        }
                    }
                ]
            }
        ],

        initComponent : function() {
            Ext.GlobalEvents.on('resizeMainView', this.resizeGrid, this);

            this.resizeGrid = Ext.Function.createBuffered(this.resizeGrid, 200, this);
            this.callParent(arguments);
        },

        resizeGrid : function() {
            var grid = this.down('criterion_gridpanel'),
                view = grid && grid.view;

            if (!view) {
                return;
            }

            grid.setHeight(
                this.up('criterion_settings_performance_reviews_review_period').getHeight() - this.down('[reference=employeePeriodForm]').getHeight() - 110
            );

            view.refreshSize(true);
        }
    }
});
