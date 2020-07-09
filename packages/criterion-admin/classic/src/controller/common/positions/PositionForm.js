Ext.define('criterion.controller.common.positions.PositionForm', function() {

    const NEW_POSITION_ID = 'new',
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.Position',
            'criterion.model.Assignment',
            'criterion.model.SalaryGradeGradeOnly',
            'criterion.store.Jobs',
            'criterion.view.RecordPicker'
        ],

        alias : 'controller.criterion_positions_position_form',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.WorkflowConfirmation',
            'criterion.controller.mixin.WorkflowHighlight'
        ],

        positionRecord : null,

        init : function() {
            let me = this;

            me.onChildTabChange = Ext.Function.createBuffered(me.onChildTabChange, 100, me);

            this.callParent(arguments);
        },

        copyPosition : function(positionId) {
            let me = this,
                positionCopy,
                workflowLog,
                hostPosition = Ext.create('criterion.model.Position', {
                    id : parseInt(positionId, 10)
                });

            hostPosition.loadWithPromise().then(function(rec) {
                positionCopy = rec.copyWithAssociations();

                workflowLog = positionCopy.getWorkflowLog();
                if (workflowLog) {
                    workflowLog.drop();
                    positionCopy.set('workflowLogId', null);
                }

                Ext.Array.each(rec.getFields(), function(field) {
                    let name = field.name,
                        val = hostPosition.get(name);

                    if (name === 'code') {
                        positionCopy.set(name, 'COPY-' + val);
                    }

                    if (name === 'title') {
                        positionCopy.set(name, 'Copy of ' + val);
                    }
                });

                me.positionRecord = positionCopy;

                me._load().then(function() {
                    me.lookup('customFields').getController().copyExist(positionId);
                });
            });
        },

        load : function(positionId) {
            let me = this,
                isNew = positionId === NEW_POSITION_ID,
                position = this.positionRecord,
                dfd = Ext.create('Ext.Deferred'),
                view = this.getView(),
                vm = this.getViewModel();

            if (position && (position.getId() === positionId || position.phantom && isNew)) {
                // position already loaded
                return;
            }

            vm.set('salaryGradeGroup', null);

            if (isNew) {
                position = Ext.create('criterion.model.Position', {
                    employerId : criterion.Api.getEmployerId()
                });

                position.loadCodeData(function() {
                    dfd.resolve();
                });
            } else {
                position = criterion.model.Position.load(parseInt(positionId, 10), {
                    success : function() {
                        dfd.resolve();
                    }
                });
            }

            view.setLoading(true);

            dfd.promise.then({
                success : function() {
                    me.positionRecord = position;
                    me._load();
                }
            });
        },

        handlePEmployerChange : function(cmp, employerId) {
            let position = this.positionRecord,
                employer = cmp.getSelection(),
                employerConfig = employer && employer.getData(),
                payRateField = this.lookup('payRate');

            if (!payRateField || !employerConfig) {
                return;
            }

            this.employerConfig = employerConfig;

            // reset employer settings to fields
            payRateField.currencySymbol = employerConfig['currencySign'] || '$';
            payRateField.thousandSeparator = employerConfig['thousandSeparator'] || ',';
            payRateField.decimalSeparator = employerConfig['decimalSeparator'] || '.';
            payRateField.decimalPrecision = employerConfig['ratePrecision'] || 0;
            payRateField.currencySymbolPos = (employerConfig['currencyAtEnd'] || false) ? 'right' : 'left';

            payRateField.focus();
            Ext.defer(function() {
                cmp.focus();
            }, 500);

            if (position && (position.get('employerId') !== employerId)) {
                position.set('employerId', employerId);
                this._load();
            }
        },

        getWorkflowLog : function() {
            let record = this.positionRecord;

            return record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog();
        },

        isPendingWorkflow : function() {
            let wf = this.getWorkflowLog(),
                stateCode = wf ? wf.get('stateCode') : null;

            return stateCode && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], stateCode);
        },

        _load : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                position = this.positionRecord,
                isNew = position.phantom,
                employerId = position.get('employerId'),
                isPendingWorkflow = false,
                salaryRecord = false,
                promises = [];

            view.setLoading(true);

            if (isNew) {
                delete vm.getStore('assignments').getProxy().extraParams['positionId'];
                vm.getStore('assignments').loadData([]);
            } else {
                let positionId = position.getId(),
                    minSalaryGradeId = position.get('minSalaryGradeId'),
                    maxSalaryGradeId = position.get('maxSalaryGradeId'),
                    assignments = vm.getStore('assignments'),
                    workflowLog = isPendingWorkflow && this.getWorkflowLog(),
                    requestData = {},
                    workflowKeys = [];

                isPendingWorkflow = this.isPendingWorkflow();

                assignments.getProxy().setExtraParams({
                    positionId : positionId
                });
                promises.push(assignments.loadWithPromise());

                if (isPendingWorkflow) {
                    if (workflowLog) {
                        requestData = workflowLog.get('request');
                        workflowKeys = Ext.Object.getAllKeys(requestData);
                    }

                    if (workflowKeys && (Ext.Array.contains(workflowKeys, 'minSalaryGradeId') || Ext.Array.contains(workflowKeys, 'minSalaryGradeId'))) {
                        minSalaryGradeId = requestData['minSalaryGradeId'];
                        maxSalaryGradeId = requestData['maxSalaryGradeId'];
                    }

                    let positionSkillsStore = vm.getStore('positionSkills');

                    positionSkillsStore.loadData([], false);

                    position.skills().cloneToStore(positionSkillsStore);

                    if (workflowKeys && Ext.Array.contains(workflowKeys, 'skills')) {
                        Ext.Array.each(requestData.skills, function(skill) {
                            if (!Ext.isDefined(skill.id)) {
                                positionSkillsStore.add(skill);
                            } else if (Ext.isDefined(skill['$delete'])) {
                                positionSkillsStore.remove(positionSkillsStore.getById(skill.id));
                            } else {
                                let skillRecord = positionSkillsStore.getById(skill.id);

                                positionSkillsStore.remove(skillRecord);
                                skillRecord.set(skill);
                                positionSkillsStore.add(skillRecord);
                            }
                        });
                    }
                }

                if (minSalaryGradeId || maxSalaryGradeId) {
                    salaryRecord = Ext.create('criterion.model.SalaryGradeGradeStep', {id : minSalaryGradeId || maxSalaryGradeId});

                    promises.push(salaryRecord.loadWithPromise());
                }
            }

            vm.set('employerId', employerId);

            promises.push(
                criterion.CodeDataManager.load([
                    criterion.consts.Dict.ORG_STRUCTURE
                ]),
                vm.getStore('employerWorkLocations').loadWithPromise({params : {employerId : employerId}}),
                vm.getStore('employerWorkPeriods').loadWithPromise({params : {employerId : employerId}}),
                vm.getStore('positions').loadWithPromise({params : {employerId : employerId}}),
                this.lookup('customFields').getController().load(isNew ? null : position.getId())
            );

            return Ext.promise.Promise.all(promises)
                .then(function() {
                    me.renderOrgStructurePositions();
                    vm.set('positionRecord', position);
                    vm.set('positionRecordCode', position.get('code'));
                    salaryRecord && vm.set('salaryGradeGroup', salaryRecord.get('salaryGroupCd'));
                })
                .then({
                    scope : this,
                    success : function() {
                        Ext.defer(function() {
                            me.highlightWorkflowLogFields(me.getWorkflowLog());
                        }, 200);
                    }
                })
                .always(function() {
                    view.setLoading(false);
                });
        },

        _getFormFields() {
            let view = this.getView(),
                res = [];

            view.items.each(function(item) {
                let form = item.getForm && item.getForm(),
                    fields = form && form.getFields && form.getFields() || [];

                res = Ext.Array.merge(res, fields.getRange());
            });

            return res;
        },

        highlightMapping : {
            positionRecordCode : 'code',
            job : 'jobCode'
        },

        highlightFieldsAdditional(changed) {
            let clsHighlighted = criterion.Consts.UI_CLS.WORKFLOW_HIGHLIGHTED,
                workflowKeys = Ext.Object.getAllKeys(changed),
                skillsGrid = this.lookup('skillsGrid');

            // Skills
            if (workflowKeys && Ext.Array.contains(workflowKeys, 'skills') && changed['skills'].length > 0) {
                skillsGrid.addCls(clsHighlighted);
            }
            else {
                skillsGrid.removeCls(clsHighlighted);
            }
        },

        renderOrgStructurePositions : function() {
            let reportingPositions = this.lookup('reportingPositions'),
                orgStructures = criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE),
                col1 = [], col2 = [];

            orgStructures.each(function(orgStructure, index) {
                let col = index % 2 === 0 ? col1 : col2;

                col.push({
                    xtype : 'fieldcontainer',
                    fieldLabel : i18n.gettext(orgStructure.get('description')),
                    layout : 'hbox',
                    anchor : '100%',
                    defaults : {
                        margin : '0 0 0 0'
                    },
                    items : [
                        {
                            xtype : 'combo',
                            bind : {
                                store : '{positions}',
                                value : Ext.String.format('{positionRecord.org{0}PositionId}', orgStructure.get('attribute1'))
                            },
                            displayField : 'title',
                            valueField : 'id',
                            queryMode : 'local',
                            flex : 1,
                            editable : false,
                            readOnly : true,
                            disableDirtyCheck : true,
                            allowBlank : true
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-close-empty'],
                            listeners : {
                                click : 'handleReportingPositionClear'
                            },
                            hidden : true,
                            disabled : true,
                            bind : {
                                hidden : '{readOnly}',
                                disabled : '{readOnly}'
                            }
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-primary',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            listeners : {
                                click : 'handleSearchReportingPosition'
                            },
                            hidden : true,
                            disabled : true,
                            bind : {
                                hidden : '{readOnly}',
                                disabled : '{readOnly}'
                            }
                        }
                    ]
                });
            });

            reportingPositions.removeAll();

            reportingPositions.add([
                {
                    items : col1
                },
                {
                    items : col2
                }
            ])
        },

        handleReportingPositionClear : function(button) {
            let reportingPositionField = button.up().down('combo');

            reportingPositionField.setValue(null);
        },

        handleSearchReportingPosition : function(button) {
            let me = this,
                vm = this.getViewModel(),
                reportingPositionField = button.up().down('combo'),
                positionPickerWindow = Ext.create('criterion.view.PositionPicker', {
                    employerId : vm.get('employerId')
                });

            positionPickerWindow.on('select', function(position) {
                reportingPositionField.setSelection(position);
            });

            positionPickerWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            positionPickerWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        onChildTabChange : function(panel, tab, parentTab) {
            if (!this.positionRecord) {
                return;
            }

            let positionRecord = this.positionRecord,
                isNew = positionRecord.phantom;

            Ext.History.add(this.getMainRoute() + '/' + (isNew ? NEW_POSITION_ID : positionRecord.getId()) + '/' + parentTab.itemId + '/' + tab.itemId, true);
        },

        onCancel : function() {
            let vm = this.getViewModel();

            vm.set('positionRecord', null);
            this.positionRecord = null;
            this.getView().fireEvent('canceledit');
            this.redirectTo(this.getMainRoute(), null);
        },

        onPositionSubmit : function() {
            let vm = this.getViewModel(),
                me = this,
                positionRecord = vm.get('positionRecord'),
                isPendingWorkflow = this.isPendingWorkflow(),
                positionChanges = positionRecord && Ext.isFunction(positionRecord.getChanges) && positionRecord.getChanges(),
                isPendingChanges = positionChanges && Ext.isObject(positionChanges) && !Ext.Object.isEmpty(positionChanges),
                customFieldsContainer = this.lookup('customFields'),
                customFieldsChanges = customFieldsContainer && customFieldsContainer.getController().getChanges(positionRecord.getId()),
                isCustomFieldsChanges = customFieldsChanges && (!Ext.isEmpty(customFieldsChanges.modifiedCustomValues) || !Ext.isEmpty(customFieldsChanges.removedCustomValues)),
                skillsStore = positionRecord && Ext.isFunction(positionRecord.skills) && positionRecord.skills(),
                isSkillChanges = skillsStore && (skillsStore.getModifiedRecords().length > 0 || skillsStore.getRemovedRecords().length > 0),
                form = this.lookup('form'),
                employeeId = criterion.Api.getEmployeeId();

            if (!isPendingWorkflow && !(isPendingChanges || isCustomFieldsChanges || isSkillChanges)) {
                criterion.Utils.toast(i18n.gettext('There are no changes to save.'));

                return;
            }

            if (form.isValid()) {
                me.loadWorkflowData(criterion.Api.getEmployeeId(), criterion.Consts.WORKFLOW_TYPE_CODE.POSITION).then(function() {
                    // delay for correct find the mask element
                    Ext.defer(function() {
                        me.setCorrectMaskZIndex(true);
                    }, 10);

                    me.actWorkflowConfirm(
                        employeeId,
                        criterion.Consts.WORKFLOW_TYPE_CODE.POSITION,
                        false,
                        positionRecord.phantom ? i18n.gettext('Submit new position?') : i18n.gettext('Submit changes?')
                    ).then(function(signature) {
                        me.setCorrectMaskZIndex(false);

                        if (signature) {
                            positionRecord.set('signature', signature);
                        }

                        me.savePosition();
                    });
                });
            } else {
                this.focusInvalidField();
            }

        },

        savePosition : function() {
            let vm = this.getViewModel(),
                me = this,
                view = this.getView(),
                positionRecord = vm.get('positionRecord'),
                customValues = view.lookupReference('customFields').getController().getChanges(positionRecord.getId());

            view.setLoading(true);

            positionRecord.setCustomValues(customValues);

            positionRecord.saveWithPromise({
                isWorkflow : true,
                employeeId : this.getEmployeeId(), // ? strange, need to check
                performerId : criterion.Api.getEmployeeId()
            }).then({
                scope : this,
                success : function() {
                    criterion.Utils.toast(i18n.gettext('Position Saved.'));
                    view.setLoading(false);
                    me.redirectTo(me.getMainRoute(), null);
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        findInvalidField : function() {
            return this.lookup('form').getForm().getFields().findBy(function(field) {
                return !field.isValid();
            });
        },

        focusInvalidField : function() {
            let field = this.findInvalidField(),
                submenu;

            if (field) {
                submenu = field.up('[isSubMenuItem]');
                this.getView().setSubMenuActiveTab(submenu.itemId);
                field.focus();
            }
        },

        handleRemoveAction : function() {
            let me = this;

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Submit deletion?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        me.remove();
                    }
                }
            );
        },

        remove : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                positionRecord = vm.get('positionRecord'),
                employeeId = criterion.Api.getEmployeeId();

            view.setLoading(true);

            me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.POSITION).then(function() {
                // delay for correct find the mask element
                Ext.defer(function() {
                    me.setCorrectMaskZIndex(true);
                }, 10);

                me.actWorkflowConfirm(
                    employeeId,
                    criterion.Consts.WORKFLOW_TYPE_CODE.POSITION
                ).then(function(signature) {
                    me.setCorrectMaskZIndex(false);

                    if (signature) {
                        positionRecord.set('signature', signature);
                    }

                    positionRecord.eraseWithPromise({
                        isWorkflow : true,
                        employeeId : vm.get('employeeId'),
                        performerId : criterion.Api.getEmployeeId()
                    }).then({
                        success : function() {
                            view.setLoading(false);
                            view.fireEvent('deleted', vm.get('positionId'));
                            me.redirectTo(me.getMainRoute(), null);
                        },
                        failure : function() {
                            positionRecord.reject();
                            view.setLoading(false);
                        }
                    });
                });
            });
        },

        onSalaryGradesStoreLoad : function(store) {
            let employerConfig = this.employerConfig,
                vm = this.getViewModel(),
                sg = vm.get('salaryGroup'),
                salaryGradeTypeGrade = sg && parseInt(sg.get('attribute1'), 10),
                data = [],
                view = this.getView(),
                record = vm.get('positionRecord'),
                salaryGradeStepCombo1 = view.lookup('salaryGradeStepCombo1'),
                salaryGradeStepCombo2 = view.lookup('salaryGradeStepCombo2'),
                salaryGradeCombo1 = view.lookup('salaryGradeCombo1'),
                salaryGradeCombo2 = view.lookup('salaryGradeCombo2');

            if (!record) {
                return; // CRITERION-5721
            }

            if (!salaryGradeTypeGrade) {
                store.each(function(rec) {
                    let recName = criterion.CodeDataManager.getCodeDetailRecord('id', rec.get('salaryGradeCd'), criterion.consts.Dict.SALARY_GRADE).getData().description;

                    rec.steps && rec.steps().each(function(step) {
                        data.push({
                            id : step.getId(),
                            stepName : recName + ' - ' + step.get('stepName'),
                            rate : Ext.util.Format.currency(
                                step.get('rate'),
                                employerConfig.currencySign,
                                employerConfig.ratePrecision,
                                employerConfig.currencyAtEnd
                            )
                        });
                    });
                });

                salaryGradeStepCombo1.getStore().setData(data);
                salaryGradeStepCombo2.getStore().setData(data);

                if (salaryGradeStepCombo1.getStore().getById(record.get('minSalaryGradeId'))) {
                    salaryGradeStepCombo1.setValue(record.get('minSalaryGradeId'));
                } else {
                    salaryGradeStepCombo1.reset();
                }

                if (salaryGradeStepCombo2.getStore().getById(record.get('maxSalaryGradeId'))) {
                    salaryGradeStepCombo2.setValue(record.get('maxSalaryGradeId'));
                } else {
                    salaryGradeStepCombo2.reset();
                }
            } else {
                // set employer format
                store.each(function(rec) {
                    rec.set({
                        currencySign : employerConfig.currencySign,
                        ratePrecision : employerConfig.ratePrecision,
                        currencyAtEnd : employerConfig.currencyAtEnd
                    })
                });

                if (salaryGradeCombo1.getStore().getById(record.get('minSalaryGradeId'))) {
                    salaryGradeCombo1.setValue(record.get('minSalaryGradeId'));
                    vm.set('salaryGrade1Minimum', salaryGradeCombo1.getStore().getById(record.get('minSalaryGradeId')).get('minRate'));
                    vm.set('salaryGrade1Maximum', salaryGradeCombo1.getStore().getById(record.get('minSalaryGradeId')).get('maxRate'));
                } else {
                    salaryGradeCombo1.reset();
                }

                if (salaryGradeCombo2.getStore().getById(record.get('maxSalaryGradeId'))) {
                    salaryGradeCombo2.setValue(record.get('maxSalaryGradeId'));
                    vm.set('salaryGrade2Minimum', salaryGradeCombo2.getStore().getById(record.get('maxSalaryGradeId')).get('minRate'));
                    vm.set('salaryGrade2Maximum', salaryGradeCombo2.getStore().getById(record.get('maxSalaryGradeId')).get('maxRate'));
                } else {
                    salaryGradeCombo2.reset();
                }
            }

            salaryGradeStepCombo1.resumeEvents();
            salaryGradeStepCombo2.resumeEvents();
            salaryGradeCombo1.resumeEvents();
            salaryGradeCombo2.resumeEvents();
        },

        onSalaryGroupChange : function(cmp, value) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                salaryGradesStore = vm.getStore('salaryGradesStore'),
                salaryGradeStepCombo1 = view.lookup('salaryGradeStepCombo1'),
                salaryGradeStepCombo2 = view.lookup('salaryGradeStepCombo2'),
                salaryGradeCombo1 = view.lookup('salaryGradeCombo1'),
                salaryGradeCombo2 = view.lookup('salaryGradeCombo2'),
                payRate = view.lookup('payRate'),
                payRateUnitCombo = view.lookup('payRateUnitCombo'),
                positionRecord = vm.get('positionRecord'),
                salaryGroup = vm.get('salaryGroup');

            if (!value) {
                salaryGradeStepCombo1.reset();
                salaryGradeStepCombo2.reset();
                salaryGradeCombo1.reset();
                salaryGradeCombo2.reset();
            }

            payRate.setMinValue();
            payRate.setMaxValue();

            payRateUnitCombo.setReadOnly(!!value);

            if (!salaryGroup) {
                return
            }

            positionRecord.set('rateUnitCd', value && parseInt(salaryGroup.get('attribute2'), 10) || null);

            if (salaryGradesStore && value) {
                salaryGradesStore.getProxy().setExtraParams({
                    salaryGroupCd : vm.get('salaryGroup.id'),
                    employerId : vm.get('employerId')
                });
                salaryGradeStepCombo1.setLoading(true);
                salaryGradeStepCombo2.setLoading(true);
                salaryGradeCombo1.setLoading(true);
                salaryGradeCombo2.setLoading(true);
                salaryGradesStore.reload({
                    callback : function() {
                        me.onSalaryGradesStoreLoad(salaryGradesStore);
                        salaryGradeStepCombo1.setLoading(false);
                        salaryGradeStepCombo2.setLoading(false);
                        salaryGradeCombo1.setLoading(false);
                        salaryGradeCombo2.setLoading(false);
                    }
                });
            }
        },

        onJobCodeSearch : function() {
            let me = this,
                vm = me.getViewModel();

            let cdPicker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Job Code'),
                searchFields : [
                    {
                        fieldName : 'code', displayName : i18n.gettext('Code')
                    },
                    {
                        fieldName : 'description', displayName : i18n.gettext('Description')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Code'),
                        dataIndex : 'code',
                        width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                    },
                    {
                        text : i18n.gettext('Description'),
                        dataIndex : 'description',
                        flex : 1
                    }
                ],
                store : Ext.create('criterion.store.Jobs', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                })
            });

            cdPicker.on('select', function(record) {
                vm.get('positionRecord').set({
                    jobId : record.getId(),
                    jobCode : record.get('code'),
                    jobDescription : record.get('description')
                });
            });

            cdPicker.show();
        },

        onJobCodeClear : function(el) {
            el.setValue(null); // in case the textfield filled by hand
            this.getViewModel().get('positionRecord').set({
                jobId : null,
                jobCode : null,
                jobDescription : null
            });
        },

        getMainRoute : function() {
            return this.getView().up('criterion_positions').mainRoute || criterion.consts.Route.HR.POSITIONS;
        }
    };
});
