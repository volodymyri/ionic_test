Ext.define('criterion.view.employee.ReportingStructures', function() {

    function getIdField(idx) {
        return Ext.String.format('employee.org{0}EmployeeId', idx);
    }

    function getIdFieldInternal(idx) {
        return Ext.String.format('_org{0}EmployeeId', idx);
    }

    function getDisplayField(idx) {
        return Ext.String.format('employee.org{0}PersonName', idx);
    }

    function getEmployeeDisplayField(idx) {
        return Ext.String.format('org{0}PersonName', idx);
    }

    function getPositionSupervisorBind(idx) {
        return Ext.String.format('employee.supervisors.org{0}Supervisors', idx);
    }

    function getPositionSupervisorFormula(idx) {
        return Ext.String.format('position{0}Supervisor', idx);
    }

    return {

        extend : 'Ext.container.Container',

        requires : [
            'criterion.view.employee.EmployeePicker',
            'criterion.store.employee.AvailableSupervisors'
        ],

        alias : 'widget.criterion_employee_reporting_structures',

        cls : 'criterion-employee-reporting-structures',

        viewModel : {
            data : {
                isDisabled : false,
                readOnly : false
            }
        },

        config : {
            employerId : null,
            employeeId : null,
            isPositionReporting : false
        },

        items : [
            // dynamic
        ],

        style : {
            borderColor : '#EEE',
            borderStyle : 'solid',
            borderWidth : 0
        },

        setEmployerId : function(employerId) {
            this.employerId = employerId;

            if (employerId) {
                return Ext.promise.Promise.all([
                    criterion.CodeDataManager.load([criterion.consts.Dict.ORG_STRUCTURE])
                ])
                    .then({
                        scope : this,
                        success : this.createItems
                    });
            }
        },

        setEmployeeId : function(employeeId) {
            this.employeeId = employeeId;

            this.callParent(arguments);
        },

        getOrgStructureValues : function() {
            let vm = this.getViewModel(),
                vals = {};

            criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE).each(function(codeDetail) {
                let idx = codeDetail.get('attribute1');

                vals[getEmployeeDisplayField(idx)] = vm.get(getDisplayField(idx));
            });

            return vals;
        },

        setDisabled : function(value) {
            var vm = this.getViewModel();

            vm.set('isDisabled', value);

            criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE).each(function(codeDetail) {
                var idx = codeDetail.get('attribute1');

                if (value) {
                    vm.set(getIdFieldInternal(idx), vm.get(getIdField(idx)));
                    vm.set(getIdField(idx), null);
                } else {
                    var idFieldInternal = vm.get(getIdFieldInternal(idx));
                    if (idFieldInternal != null) {
                        vm.set(getIdField(idx), idFieldInternal);
                    }
                    vm.set(getIdFieldInternal(idx), null);
                }
            });
        },

        createOrgStructureComponent : function(codeDetail) {
            var idx = parseInt(codeDetail.get('attribute1')),
                idField = getIdField(idx),
                displayField = getDisplayField(idx),
                positionSupervisorFormula = getPositionSupervisorFormula(idx);

            if (isNaN(idx)) {
                console.warn('Code detail ins\'t valid');
                return;
            }

            if (!codeDetail.get('isActive')) {
                return;
            }

            return {
                xtype : 'container',
                margin : '0 0 18 0',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        xtype : 'container',
                        layout : 'hbox',

                        items : [
                            {
                                xtype : 'textfield',
                                flex : 1,
                                fieldLabel : codeDetail.get('description'),
                                disabled : !codeDetail.get('isActive'),
                                readOnly : true,
                                bind : {
                                    value : Ext.String.format('{{0}}', positionSupervisorFormula),
                                    disabled : '{pendingOrg' + idx + '}'
                                },
                                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                listeners : {
                                    render : function(field) {
                                        Ext.create('Ext.tip.ToolTip', {
                                            target : field.el,
                                            listeners : {
                                                beforeshow : function(tip) {
                                                    var supervisors = field.getValue();

                                                    if (!supervisors) {
                                                        return false;
                                                    }

                                                    tip.setHtml(supervisors);
                                                }
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-close-empty'],
                                listeners : {
                                    scope : this,
                                    click : this.onEmployeeClear
                                },
                                disabled : true,
                                bind : {
                                    hidden : Ext.String.format('{!{0} || isDisabled || readOnly}', displayField),
                                    disabled : '{isDisabled || isPendingRelationshipWorkflow}'
                                },
                                idField : idField,
                                nameField : displayField,
                                orgStructureIdx : idx
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-primary',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    scope : this,
                                    click : this.onEmployeeSearch
                                },
                                disabled : true,
                                bind : {
                                    disabled : '{isDisabled || isPendingRelationshipWorkflow}',
                                    hidden : '{isDisabled || readOnly}'
                                },
                                orgStructureIdx : idx
                            }
                        ]
                    },
                    {
                        xtype : 'label',
                        hidden : true,
                        cls : 'approval-pending',
                        margin : '0 0 0 205',
                        text : i18n.gettext('Approval Pending'),
                        bind : {
                            hidden : '{!isPendingRelationshipWorkflow || !pendingOrg' + idx + '}'
                        }
                    }
                ]
            }
        },

        onEmployeeSearch : function(cmp) {
            var vm = this.getViewModel(),
                cfg = {
                    isActive : true
                },
                picker;

            if (this.employeeId) {
                cfg['storeClass'] = 'criterion.store.employee.AvailableSupervisors';
                cfg['extraParams'] = {
                    employeeId : this.employeeId,
                    orgType : cmp.orgStructureIdx,
                    canRehireOnly : true
                };
            }

            picker = Ext.create('criterion.view.employee.EmployeePicker', cfg);

            picker.show();
            picker.on('select', function(searchRecord) {
                vm.set(getIdField(cmp.orgStructureIdx), searchRecord.get('employeeId'));
                vm.set(getDisplayField(cmp.orgStructureIdx), searchRecord.get('firstName') + ' ' + searchRecord.get('lastName'));
            }, this);
        },

        onEmployeeClear : function(cmp) {
            var vm = this.getViewModel();

            vm.set(getIdField(cmp.orgStructureIdx), null);
            vm.set(getDisplayField(cmp.orgStructureIdx), '');
        },

        createItems : function() {
            let vm = this.getViewModel(),
                view = this,
                leftCol = [],
                rightCol = [],
                hasItems = false,
                formulas = vm.getFormulas() || {};

            view.removeAll();

            criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE).each(function(codeDetail, index) {
                let cmp = view.createOrgStructureComponent(codeDetail),
                    idx = parseInt(codeDetail.get('attribute1')),
                    displayField = getDisplayField(idx),
                    positionSupervisorBind = getPositionSupervisorBind(idx),
                    positionSupervisorFormula = getPositionSupervisorFormula(idx);

                if (cmp) {
                    hasItems = true;
                    index % 2 === 0 ? rightCol.push(cmp) : leftCol.push(cmp);
                }

                formulas[positionSupervisorFormula] = {
                    bind : {
                        bindTo : '{employee}',
                        deep : true
                    },
                    get : function(employee) {
                        let employeeSupervisor = this.get(displayField),
                            positionSupervisors = this.get(positionSupervisorBind) || [];

                        return view.getIsPositionReporting() ? positionSupervisors.join(', ') : employeeSupervisor;
                    }
                };
            });

            vm.setFormulas(formulas);

            hasItems && view.add(
                [
                    {
                        items : leftCol
                    },
                    {
                        items : rightCol
                    }
                ]
            );

            view.el.applyStyles({
                borderWidth : hasItems ? '1px 0 0' : 0
            });

            view.getPlugins('criterion_responsive_column')[0].init(view);
        }

    }
});
