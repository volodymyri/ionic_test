Ext.define('criterion.controller.settings.hr.SalaryGrades', function() {

    let codedataGradeStore = null,
        codedataStepStore = null;

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_salary_grades',

        requires : [
            'criterion.view.settings.hr.salaryGrades.SalaryGradeManage',
            'criterion.view.settings.hr.salaryGrades.SalaryGradeStepManage'
        ],

        onActivate : function() {
            this.load();
        },

        load : function() {
            let me = this,
                salaryGroupData = this.lookup('salaryGroupData'),
                employerId = this.getEmployerId();

            if (!employerId && !(employerId = criterion.Api.getEmployerId())) {
                return;
            }

            codedataGradeStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_GRADE);
            codedataStepStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_STEP);

            Ext.Deferred.all([
                criterion.CodeDataManager.load([criterion.consts.Dict.SALARY_GROUP], Ext.emptyFn, this, {employerId : employerId}),
                !codedataGradeStore.isLoaded() && criterion.CodeDataManager.load([criterion.consts.Dict.SALARY_GRADE]),
                !codedataStepStore.isLoaded() && criterion.CodeDataManager.load([criterion.consts.Dict.SALARY_STEP])
            ]).then(function() {
                let group = salaryGroupData.getStore().getAt(0);

                salaryGroupData.setValue(group);
                me.selectGroup(group.getId());
            });
        },

        buildGradesGrid : function(data) {
            let me = this,
                vm = this.getViewModel(),
                employerId = this.getEmployerId() || criterion.Api.getEmployerId(),
                salaryGroupData = data.salaryGroupData,
                gradeType = data.gradeType,
                needReconfigure = data.needReconfigure,
                grid = this.lookup('grid'),
                store = grid.getViewModel().getStore((gradeType) ? 'gradeOnly' : 'gradeStep');

            grid.setLoading(true);

            vm.set('hasManageSteps', !gradeType);

            Ext.Deferred.all([
                store.loadWithPromise(
                    {
                        params : {
                            salaryGroupCd : salaryGroupData,
                            employerId : employerId
                        },
                        additionalParams : {
                            employerId : employerId
                        }
                    }
                )
            ]).then(function() {
                let steps = 0,
                    stepnum = 0,
                    gradeStepsStore,
                    fields = [],
                    memoryRecord = {};

                grid.setLoading(false);

                gradeStepsStore = Ext.create('criterion.data.Store', {
                    fields : fields,
                    type : 'memory'
                });

                if (!gradeType && store.getCount()) {
                    Ext.Object.each(criterion.model.SalaryGradeGradeStep.fieldsMap, function(name, field) {
                        fields.push({
                            name : field.name,
                            type : field.type,
                            allowNull : field.allowNull
                        })
                    });

                    store.getAt(0).steps().each(function() {
                        fields.push(
                            {
                                name : 'step_' + stepnum,
                                type : 'float',
                                allowNull : false
                            },
                            {
                                name : 'step_' + stepnum + '_rate_initial',
                                type : 'float',
                                allowNull : false
                            },
                            {
                                name : 'step_' + stepnum + '_salaryGradeId',
                                type : 'integer',
                                allowNull : false
                            },
                            {
                                name : 'step_' + stepnum + '_salaryStepCd',
                                type : 'criterion_codedata',
                                allowNull : false
                            }
                        );
                        stepnum++;
                    });

                    store.each(function(record) {
                        memoryRecord = {};
                        steps = (steps < record.steps().count()) ? record.steps().count() : steps;
                        memoryRecord.salaryGradeCd = record.get('salaryGradeCd');
                        memoryRecord.sequence = record.get('sequence');

                        for (let i = 0; i < record.steps().count(); i++) {
                            let step = record.steps().getAt(i);

                            memoryRecord['step_' + i] = step.get('rate');
                            memoryRecord['step_' + i + '_rate_initial'] = step.get('rate');
                            memoryRecord['step_' + i + '_salaryGradeId'] = step.get('salaryGradeId');
                            memoryRecord['step_' + i + '_salaryStepCd'] = step.get('salaryStepCd');

                            vm.set(Ext.String.format('step{0}label', i), step.get('stepName'));
                        }

                        gradeStepsStore.add(memoryRecord);
                    });

                    gradeStepsStore.setSorters({
                            property : 'sequence',
                            direction : 'ASC'
                        }
                    );
                    gradeStepsStore.sort();

                    gradeStepsStore.setListeners({
                        scope : me,
                        update : function(store) {
                            let modified = false;
                            store.each(function(data) {
                                for (let i = 0; i < steps; i++) {
                                    if (data.get('step_' + i) !== data.get('step_' + i + '_rate_initial')) {
                                        modified = true;
                                    }
                                    if (modified) {
                                        break
                                    }
                                }
                            });

                            me.lookup('saveBtn').setDisabled(!modified);
                        }
                    });
                }

                store.setSorters({
                        property : 'sequence',
                        direction : 'ASC'
                    }
                );
                store.sort();

                store.setListeners({
                    scope : me,
                    update : function(store) {
                        let modified = false;

                        store.each(function(data) {
                            if (data.dirty) {
                                modified = true;
                            }
                        });

                        me.lookup('saveBtn').setDisabled(!modified);
                    }
                });

                needReconfigure && grid.reconfigure((gradeType) ? store : gradeStepsStore, (gradeType) ? me.makeGridColumnsGradeOnly() : me.makeGridColumnsGradeStep(steps));

            }, null, null, null, this);
        },

        makeGridColumnsGradeOnly : function() {
            return [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Name'),
                    flex : 1,
                    dataIndex : 'salaryGradeCd',
                    editor : false,
                    renderer : function(value) {
                        return value && codedataGradeStore ? codedataGradeStore.getById(value).get('description') : '';
                    },
                    sortable : false,
                    menuDisabled : true
                },
                {
                    xtype : 'widgetcolumn',
                    text : i18n.gettext('Minimum Rate'),
                    dataIndex : 'minRate',
                    flex : 1,
                    sortable : false,
                    menuDisabled : true,
                    widget : {
                        xtype : 'criterion_currencyfield',
                        isRatePrecision : true,
                        listeners : {
                            change : function(field, value) {
                                if (field.getWidgetRecord()) {
                                    let store = field.getWidgetRecord().store,
                                        data = store.getById(field.getWidgetRecord().getId());

                                    data.set('minRate', value);
                                }
                            }
                        }
                    }
                },
                {
                    xtype : 'widgetcolumn',
                    text : i18n.gettext('Maximum Rate'),
                    dataIndex : 'maxRate',
                    sortable : false,
                    menuDisabled : true,
                    flex : 1,
                    widget : {
                        xtype : 'criterion_currencyfield',
                        isRatePrecision : true,
                        listeners : {
                            change : function(field, value) {
                                if (field.getWidgetRecord()) {
                                    let store = field.getWidgetRecord().store,
                                        data = store.getById(field.getWidgetRecord().getId());

                                    data.set('maxRate', value);
                                }
                            }
                        }
                    }
                }
            ];
        },

        makeGridColumnsGradeStep : function (stepsCount) {
            let columns = [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 1,
                        dataIndex : 'salaryGradeCd',
                        renderer : function(value) {
                            return value && codedataGradeStore ? codedataGradeStore.getById(value).get('description') : '';
                        },
                        sortable : false
                    }
                ];

            for (let i = 0; i < stepsCount; i++) {
                columns.push(
                    {
                        xtype : 'widgetcolumn',
                        dataIndex : 'step_' + i,
                        bind : {
                            text : '{step' + i + 'label}'
                        },
                        sortable : false,
                        menuDisabled : true,
                        flex : 1,
                        editor : {
                            allowBlank : false
                        },
                        widget : {
                            xtype : 'criterion_currencyfield',
                            isRatePrecision : true,
                            name : 'step_' + i,
                            listeners : {
                                change : function(field, value) {
                                    if (field.getWidgetRecord()) {
                                        let store = field.getWidgetRecord().store,
                                            data = store.getById(field.getWidgetRecord().getId());

                                        data.set(field.getName(), value);
                                    }
                                }
                            }
                        }
                    }
                );
            }

            return columns;
        },

        handleManageGrades : function() {
            let view = this.getView(),
                salaryGroupData = this.lookup('salaryGroupData'),
                gradeType = parseInt(salaryGroupData.getSelection().getData().attribute1),
                grid = this.lookup('grid'),
                store = grid.getViewModel().getStore((gradeType) ? 'gradeOnly' : 'gradeStep'),
                manageWnd = Ext.create('criterion.view.settings.hr.salaryGrades.SalaryGradeManage', {
                    viewModel : {
                        data : {
                            currentGradeGroup : this.lookup('salaryGroupData').getValue(),
                            currentGradeStore : store,
                            currentGradeSteps : (!gradeType && store.getCount()) ? store.getAt(0).steps() : null,
                            gradeType : gradeType,
                            employerId : this.getEmployerId()
                        }
                    },
                    _connectedView : view
                });
            
            manageWnd.on('buildGradesGrid', this.buildGradesGrid, this);
            manageWnd.show();
        },

        handleManageSteps : function() {
            let salaryGroupData = this.lookup('salaryGroupData'),
                gradeType = parseInt(salaryGroupData.getSelection().getData().attribute1),
                grid = this.lookup('grid'),
                store = grid.getViewModel().getStore((gradeType) ? 'gradeOnly' : 'gradeStep'),
                currentGradeSteps = (!gradeType && store.getCount()) ? store.getAt(0).steps() : null,
                manageWnd;

            if (currentGradeSteps) {
                manageWnd = Ext.create('criterion.view.settings.hr.salaryGrades.SalaryGradeStepManage', {
                    viewModel : {
                        data : {
                            currentGradeGroup : this.lookup('salaryGroupData').getValue(),
                            currentGradeStore : store,
                            currentGradeSteps : currentGradeSteps,
                            gradeType : gradeType,
                            employerId : this.getEmployerId()
                        }
                    }
                });

                manageWnd.on('buildGradesGrid', this.buildGradesGrid, this);
                manageWnd.show();

            } else {
                criterion.Msg.warning({
                    title : i18n.gettext('No Grade Steps'),
                    message : i18n.gettext('You have to fill Salary Steps code table first.')
                });
            }
        },

        handleGroupSelect : function(combo, record) {
            this.selectGroup(record.getId());
        },

        selectGroup : function(groupId) {
            let salaryGroupData = this.lookup('salaryGroupData'),
                frequencyData = this.lookup('frequencyData'),
                groupRecord = salaryGroupData.getStore().getById(groupId),
                gradeType = parseInt(groupRecord.get('attribute1')),
                frequency = parseInt(groupRecord.get('attribute2'));

            frequencyData.setValue(frequency);

            this.buildGradesGrid(
                {
                    salaryGroupData : groupId,
                    gradeType : gradeType,
                    needReconfigure : true
                }
            );
        },

        handleFrequencySelect : function() {
            this.lookup('saveBtn').setDisabled(false);
        },

        onSave : function() {
            let grid = this.lookup('grid'),
                store = grid.getStore(),
                updateSteps = [],
                groupRecord = this.lookup('salaryGroupData').getSelectedRecord(),
                frequencyData = this.lookup('frequencyData'),
                frequencyDataValue = frequencyData.getSelectedRecord();

            if (!frequencyData.isValid()) {
                criterion.Msg.warning(i18n.gettext('Please select Frequency first.'));
                return;
            }

            if (groupRecord.get('attribute2') !== frequencyDataValue.getId()) {
                let value = frequencyDataValue.getId().toString();

                criterion.CodeDataManager.save(groupRecord.getId(), {
                    attribute2 : value
                }).then(() => {
                    groupRecord.set('attribute2', value);
                });
            }

            if (store instanceof criterion.store.SalaryGradesGradeOnly) {
                store.sync();
                criterion.Utils.toast(i18n.gettext('Saved.'));
            } else {
                store.each(function(data) {
                    if (data.dirty) {
                        Ext.Array.each(data.modified, function(name) {
                            Ext.Array.each(Ext.Object.getKeys(name), function(stepRef) {
                                let updateStep = Ext.create('criterion.model.SalaryGradeGradeStep', {
                                    id : data.get(stepRef + '_salaryGradeId')
                                });

                                updateSteps.push(updateStep.loadWithPromise().then(function() {
                                    updateStep.set(
                                        {
                                            'minRate' : Ext.Number.parseFloat(data.get(stepRef))
                                        }
                                    );
                                    updateStep.saveWithPromise();
                                }));
                            });
                        });
                    }
                });

                Ext.promise.Promise.all(updateSteps)
                    .always(function() {
                        this.lookup('saveBtn').setDisabled(true);
                        grid.setLoading(false);
                        criterion.Utils.toast(i18n.gettext('Saved.'));
                    }, this);
            }
        }
    };
});
