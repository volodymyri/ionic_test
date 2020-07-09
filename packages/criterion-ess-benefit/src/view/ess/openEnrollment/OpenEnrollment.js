Ext.define('criterion.view.ess.openEnrollment.OpenEnrollment', function() {

    var WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {
        alias : 'widget.criterion_selfservice_open_enrollment',

        extend : 'criterion.ux.BreadcrumbPanel',

        requires : [
            'criterion.ux.BreadcrumbPanel',
            'criterion.controller.ess.openEnrollment.OpenEnrollment',
            'criterion.view.ess.openEnrollment.OpenEnrollmentSummary',
            'criterion.ux.button.Next',
            'criterion.ux.button.Back'
        ],

        viewModel : {
            data : {
                employerEnrollment : null,
                cafeCredit : null,
                blockedState : false
            },
            formulas : {
                isPendingWorkflow : function(get) {
                    var employeeEnrollment = get('employeeEnrollment');

                    return employeeEnrollment && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], employeeEnrollment.get('openEnrollmentStatusCode'));
                },
                allowDownloadSummary : function(get) {
                    return get('employeeEnrollment') && get('isLastCard');
                },
                statusText : function(get) {
                    return get('isPendingWorkflow') ? i18n.gettext('Open Enrollment is being reviewed') : i18n.gettext('Open Enrollment is Approved')
                },
                editDisabled : function(get) {
                    var employeeEnrollment = get('employeeEnrollment');

                    return employeeEnrollment && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED, WORKFLOW_STATUSES.APPROVED], employeeEnrollment.get('openEnrollmentStatusCode'));
                },
                isRejected : function(get) {
                    var employeeEnrollment = get('employeeEnrollment');

                    return employeeEnrollment && employeeEnrollment.get('openEnrollmentStatusCode') === WORKFLOW_STATUSES.REJECTED;
                },
                finishHidden : function(get) {
                    return get('editDisabled') || !get('isLastCard');
                },
                allowRecallBtn : function(get) {
                    return get('employeeEnrollment.canRecall');
                },
                isApproved : get => get('employeeEnrollment.openEnrollmentStatusCode') === WORKFLOW_STATUSES.APPROVED
            }
        },

        controller : {
            type : 'criterion_selfservice_open_enrollment'
        },

        listeners : {
            prev : 'onBackClick',
            next : 'onNextClick',
            recalculate : 'recalculate'
        },

        frame : true,

        header : {
            title : {
                text : i18n.gettext('Welcome'),
                minimizeWidth : true
            },

            items : [
                {
                    xtype : 'component',

                    userCls : 'sub-title',

                    bind : {
                        html : '{employerEnrollment.name}'
                    }
                },
                {
                    xtype : 'tbfill'
                },
                {
                    xtype : 'component',
                    hidden : true,
                    bind : {
                        html : '<strong>' + i18n.gettext('Cafe Credits') + '</strong> {cafeCredit:currency}',
                        hidden : '{!employerEnrollment.cafeBenefitPlanId}'
                    }
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'component',
                    bind : {
                        html : '<strong>' + i18n.gettext('Enroll By') + '</strong> {employerEnrollment.endDate:date}'
                    }
                }
            ]
        },

        tbar : {
            xtype : 'criterion_status_breadcrumb',

            bind : {
                data : {
                    statuses : '{states}',
                    activeIdx : '{activeViewIndex}'
                }
            }
        },

        dockedItems : [
            {
                xtype : 'toolbar',

                dock : 'bottom',
                ui : 'footer',

                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Recall'),
                        ui : 'remove',
                        listeners : {
                            click : 'handleRecallRequest'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!allowRecallBtn}'
                        }
                    },
                    {
                        xtype : 'component',
                        margin : '0 0 0 20',
                        cls : 'criterion-profile-pending-changes-tooltip',
                        hidden : true,
                        bind : {
                            hidden : '{!isPendingWorkflow}',
                            html : '{statusText}'
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        ui : 'secondary',
                        listeners : {
                            click : 'onCancelClick'
                        }
                    },
                    {
                        xtype : 'tbspacer',
                        hidden : true,
                        bind : {
                            hidden : '{!activeViewIndex}'
                        }
                    },
                    {
                        xtype : 'criterion_button_back',
                        hidden : true,
                        bind : {
                            hidden : '{!activeViewIndex}'
                        },
                        listeners : {
                            click : 'onBackClick'
                        }
                    },
                    {
                        xtype : 'tbspacer',
                        hidden : true,
                        bind : {
                            hidden : '{isLastCard}'
                        }
                    },
                    {
                        xtype : 'criterion_button_next',
                        hidden : true,
                        bind : {
                            hidden : '{isLastCard}'
                        },
                        listeners : {
                            click : 'onNextClick'
                        }
                    },
                    {
                        xtype : 'tbspacer',
                        hidden : true,
                        bind : {
                            hidden : '{!isLastCard}'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Finish'),
                        ui : 'feature',
                        hidden : true,
                        disabled : true,
                        bind : {
                            hidden : '{finishHidden}',
                            disabled : '{blockedState}'
                        },
                        listeners : {
                            click : 'onFinishClick'
                        }
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Download Summary PDF'),
                        ui : 'feature',
                        hidden : true,
                        disabled : true,
                        bind : {
                            hidden : '{!allowDownloadSummary}',
                            disabled : '{blockedState}'
                        },
                        listeners : {
                            click : 'onDownloadSummary'
                        }
                    }
                ]
            }
        ],

        items : [
            {
                title : i18n.gettext('Welcome'),

                padding : '20 20 20 25',

                ui : 'clean',

                items : [
                    {
                        xtype : 'component',
                        bind : {
                            html : '{employerEnrollment.description}'
                        }
                    }
                ]
            },
            {
                xtype : 'criterion_selfservice_open_enrollment_summary',
                reference : 'openEnrollmentSummary'
            }
        ],

        loadRecord : function(record) {
            this.getController() && this.getController().loadRecord(record);
        }

    };

});
