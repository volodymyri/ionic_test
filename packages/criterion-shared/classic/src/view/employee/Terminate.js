Ext.define('criterion.view.employee.Terminate', function() {

    return {

        alias : 'widget.criterion_employee_terminate',

        extend : 'Ext.Window',

        cls : 'criterion-employee-terminate',

        requires : [
            'criterion.controller.employee.Terminate',
            'criterion.store.employee.Benefits'
        ],

        title : i18n.gettext('Terminate Employee'),

        controller : {
            type : 'criterion_employee_terminate'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        viewModel : {
            data : {
                /**
                 * @type {criterion.model.Employee}
                 */
                employee : null,
                terminateBenefits : false,
                skipReassignment : false,
                eventCd : null,
                statuses : [],

                newSupervisorId : null,
                newHiringManagerId : null,
                newRecruiterId : null,

                lockTerminationReason : false,

                minDate : null,
                maxDate : null
            },

            stores : {
                employeeBenefits : {
                    type : 'criterion_employee_benefits'
                }
            },

            formulas : {
                isFirst : function(data) {
                    return data('activeViewIndex') === 0;
                },
                isLast : function(data) {
                    return data('activeViewIndex') === data('statuses').length - 1
                },
                enableEvent : function(data) {
                    return data('terminateBenefits');
                },
                isSkipReassignmentSupervisor : function(data) {
                    return !data('employee.isSupervisor') || data('skipReassignment');
                },
                isSkipReassignmentHiringManager : function(data) {
                    return !data('employee.isHiringManager') || data('skipReassignment');
                },
                isSkipReassignmentRecruiter : function(data) {
                    return !data('employee.isRecruiter') || data('skipReassignment');
                }
            }
        },

        modal : true,
        closable : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '80%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : '&larr;',
                cls : 'criterion-btn-transparent-only-text',
                handler : 'handlePrev',
                hidden : true,
                bind : {
                    hidden : '{isFirst}'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Next'),
                cls : 'criterion-btn-primary',
                handler : 'handleNext',
                hidden : true,
                bind : {
                    hidden : '{isLast}'
                }
            },

            {
                xtype : 'button',
                text : i18n.gettext('Submit Termination'),
                cls : 'criterion-btn-primary',
                handler : 'handleSubmit',
                hidden : true,
                bind : {
                    hidden : '{!isLast}'
                }
            }
        ],

        bodyPadding : 0,

        layout : 'fit',

        items : [
            {
                xtype : 'container',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'criterion_status_breadcrumb',
                        dock : 'top',
                        bind : {
                            data : {
                                statuses : '{statuses}',
                                activeIdx : '{activeViewIndex}'
                            }
                        },
                        margin : '0 0 3 0'
                    },
                    {
                        xtype : 'container',
                        reference : 'cardContainer',
                        layout : {
                            type : 'card'
                        },
                        defaults : {
                            bodyPadding : 20
                        },
                        flex : 1,
                        items : [
                            // main
                            {
                                xtype : 'form',
                                layout : 'center',
                                reference : 'card-main',
                                items : [
                                    {
                                        xtype : 'container',
                                        defaults : {
                                            labelWidth : 200
                                        },
                                        layout : {
                                            type : 'vbox',
                                            align : 'center'
                                        },
                                        items : [
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Termination reason and date'),
                                                cls : 'fp-title',
                                                margin : '0 0 10 0'
                                            },
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Choose a termination reason and date'),
                                                cls : 'fp-desc',
                                                margin : '0 0 30 0'
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Termination Reason'),
                                                codeDataId : criterion.consts.Dict.TERMINATION,
                                                allowBlank : false,
                                                disabled : true,
                                                hidden : true,
                                                bind : {
                                                    value : '{terminationCd}',
                                                    disabled : '{lockTerminationReason}',
                                                    hidden : '{lockTerminationReason}'
                                                }
                                            },
                                            {
                                                xtype : 'datefield',
                                                fieldLabel : i18n.gettext('Termination Date'),
                                                bind : {
                                                    value : '{terminationDate}',
                                                    minValue : '{minDate}',
                                                    maxValue : '{maxDate}'
                                                },
                                                submitFormat : criterion.consts.Api.DATE_FORMAT,
                                                allowBlank : false
                                            }
                                        ]
                                    }
                                ]
                            },

                            // benefits
                            {
                                xtype : 'form',
                                reference : 'card-benefits',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                flex : 1,
                                items : [
                                    {
                                        xtype : 'gridpanel',
                                        cls : 'criterion-grid-centred criterion-grid-panel',
                                        bind : {
                                            store : '{employeeBenefits}'
                                        },
                                        flex : 1,
                                        border : 1,
                                        columns : [
                                            {
                                                text : i18n.gettext('Benefit Plan'),
                                                dataIndex : 'planName',
                                                flex : 1
                                            },
                                            {
                                                xtype : 'booleancolumn',
                                                trueText : '✓',
                                                falseText : '',
                                                text : i18n.gettext('COBRA-eligible'),
                                                dataIndex : 'isCobra',
                                                width : 160
                                            }
                                        ]
                                    }
                                ],
                                dockedItems : [
                                    {
                                        xtype : 'container',
                                        dock : 'top',
                                        layout : 'hbox',
                                        margin : '20 0 0 0',
                                        items : [
                                            {
                                                flex : 1
                                            },
                                            {
                                                xtype : 'container',
                                                layout : {
                                                    type : 'vbox',
                                                    align : 'center'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'component',
                                                        html : i18n.gettext('Termination benefit plans'),
                                                        cls : 'fp-title',
                                                        margin : '0 0 10 0'
                                                    },
                                                    {
                                                        xtype : 'component',
                                                        html : i18n.gettext('Current benefit plans'),
                                                        cls : 'fp-desc',
                                                        margin : '0 0 30 0'
                                                    }
                                                ]
                                            },
                                            {
                                                flex : 1
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'container',
                                        dock : 'bottom',
                                        layout : 'hbox',
                                        margin : '0 20 20 20',
                                        defaults : {
                                            labelWidth : 200
                                        },
                                        items : [
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.gettext('Terminate Benefits'),
                                                bind : '{terminateBenefits}'
                                            },
                                            {
                                                flex : 1
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                margin : '0 0 0 10',
                                                fieldLabel : i18n.gettext('Choose qualifying event'),
                                                allowBlank : false,
                                                name : 'eventCd',
                                                codeDataId : criterion.consts.Dict.QUALIFYING_EVENT,
                                                hidden : true,
                                                disabled : true,
                                                bind : {
                                                    value : '{eventCd}',
                                                    hidden : '{!enableEvent}',
                                                    disabled : '{!enableEvent}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            // timeoffs
                            {
                                xtype : 'form',
                                reference : 'card-timeoffs',
                                items : [
                                    {
                                        xtype : 'container',
                                        layout : {
                                            type : 'vbox',
                                            align : 'center'
                                        },
                                        items : [
                                            {
                                                height : 100
                                            },
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Remove Time Offs'),
                                                cls : 'fp-title',
                                                margin : '0 0 10 0'
                                            },
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Time offs will be removed automatically'),
                                                cls : 'fp-desc'
                                            },
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Want to proceed?'),
                                                cls : 'fp-desc'
                                            }
                                        ]
                                    }
                                ]
                            },

                            // change employees
                            {
                                xtype : 'form',
                                reference : 'card-employees',
                                items : [
                                    {
                                        xtype : 'container',
                                        defaults : {
                                            labelWidth : 200
                                        },
                                        layout : {
                                            type : 'vbox',
                                            align : 'center'
                                        },
                                        items : [
                                            {
                                                height : 100
                                            },
                                            {
                                                xtype : 'component',
                                                html : i18n.gettext('Choose replacement employees for these roles'),
                                                cls : 'fp-title',
                                                margin : '0 0 30 0'
                                            },

                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.gettext('New Supervisor'),
                                                layout : 'hbox',
                                                margin : '0 0 0 30',
                                                hidden : true,
                                                bind : {
                                                    hidden : '{!employee.isSupervisor}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        reference : 'supervisorTextField',
                                                        flex : 1,
                                                        bind : {
                                                            value : '{supervisorFullName}',
                                                            disabled : '{isSkipReassignmentSupervisor}'
                                                        },
                                                        allowBlank : false,
                                                        readOnly : true
                                                    },
                                                    {
                                                        xtype : 'button',
                                                        scale : 'small',
                                                        margin : '0 0 0 3',
                                                        cls : 'criterion-btn-light',
                                                        glyph : criterion.consts.Glyph['ios7-search'],
                                                        handler : 'handleSupervisorSearch'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.gettext('New Hiring Manager'),
                                                layout : 'hbox',
                                                margin : '10 0 0 30',
                                                hidden : true,
                                                bind : {
                                                    hidden : '{!employee.isHiringManager}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        flex : 1,
                                                        reference : 'managerTextField',
                                                        bind : {
                                                            value : '{hiringManagerFullName}',
                                                            disabled : '{isSkipReassignmentHiringManager}'
                                                        },
                                                        allowBlank : false,
                                                        readOnly : true
                                                    },
                                                    {
                                                        xtype : 'button',
                                                        scale : 'small',
                                                        margin : '0 0 0 3',
                                                        cls : 'criterion-btn-light',
                                                        glyph : criterion.consts.Glyph['ios7-search'],
                                                        handler : 'handleHiringManagerSearch'
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.gettext('New Recruiter'),
                                                layout : 'hbox',
                                                margin : '10 0 0 30',
                                                hidden : true,
                                                bind : {
                                                    hidden : '{!employee.isRecruiter}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        flex : 1,
                                                        reference : 'recruiterTextField',
                                                        bind : {
                                                            value : '{recruiterFullName}',
                                                            disabled : '{isSkipReassignmentRecruiter}'
                                                        },
                                                        allowBlank : false,
                                                        readOnly : true
                                                    },
                                                    {
                                                        xtype : 'button',
                                                        scale : 'small',
                                                        margin : '0 0 0 3',
                                                        cls : 'criterion-btn-light',
                                                        glyph : criterion.consts.Glyph['ios7-search'],
                                                        handler : 'handleRecruiterSearch'
                                                    }
                                                ]
                                            },
                                            {
                                                height : 100
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.gettext('Skip Reassignment'),
                                                bind : '{skipReassignment}'
                                            }
                                        ]
                                    }
                                ]
                            }

                        ]
                    }

                ]
            }
        ],

        initComponent : function() {
            var vm = this.getViewModel(),
                getValidator = function(employeeParam) {
                    return function() {
                        if (vm.get(employeeParam) === vm.get('employee.id')) {
                            return i18n.gettext('Please choose another employee');
                        }

                        return true;
                    }
                };

            this.callParent(arguments);

            this.down('[reference=supervisorTextField]').validator = getValidator('newSupervisorId');
            this.down('[reference=managerTextField]').validator = getValidator('newHiringManagerId');
            this.down('[reference=recruiterTextField]').validator = getValidator('newRecruiterId');
        }
    };

});
