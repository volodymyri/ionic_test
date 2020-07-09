Ext.define('criterion.controller.settings.hr.salaryGrades.SalaryGradeManage', function() {

    return {
        extend : 'criterion.controller.GridView',
        alias : 'controller.criterion_settings_salary_grade_manage',

        requires : [
            'criterion.model.SalaryGradeGradeStep',
            'criterion.model.SalaryGradeGradeOnly'
        ],

        init : function() {
            var vm = this.getViewModel(),
                itemSelector = this.lookup('itemselector'),
                grid = this.lookup('grid'),
                selected = [],
                gradeType = vm.get('gradeType'),
                index = 0,
                saveBtn = this.lookup('saveBtn'),
                allGrades = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_GRADE),
                store = Ext.create('criterion.data.Store', {
                    fields : [
                        {
                            name : 'description',
                            type : 'string'
                        },
                        {
                            name : 'selected',
                            type : 'boolean'
                        },
                        {
                            name : 'sequence',
                            type : 'integer'
                        }
                    ],

                    type : 'memory',

                    sorters : [
                        {
                            property : 'sequence',
                            direction : 'ASC'
                        }
                    ],

                    listeners : {
                        scope : this,
                        update : function(store, record, operation, modifiedFieldNames, details, eOpts) {
                            var modified = false;

                            store.each(function(data) {
                                if (data.dirty) {
                                    modified = true;
                                    return false;
                                }
                            });

                            saveBtn.setDisabled(!modified);
                        }
                    }
                });

            allGrades.each(function(data) {
                var tempRecord = {},
                    rec = data;

                tempRecord['id'] = data.get('id');
                tempRecord['description'] = data.get('description');
                tempRecord['selected'] = false;
                tempRecord['sequence'] = index;

                vm.get('currentGradeStore').each(function(currentGradesRecord) {
                    if (rec.getId() === currentGradesRecord.get('salaryGradeCd')) {
                        tempRecord['selected'] = true;
                        if (gradeType) {
                            tempRecord['rid'] = currentGradesRecord.getId();
                        } else {
                            tempRecord['steps'] = currentGradesRecord.get('steps') || currentGradesRecord.steps && currentGradesRecord.steps().getRange();
                        }
                        index = tempRecord['sequence'] = currentGradesRecord.get('sequence');
                    }
                });

                index++;
                store.add(tempRecord);
            }, this);

            store.sort('sequence', 'ASC');
            grid && grid.setStore(store);

            if (itemSelector) {
                store.suspendEvents();

                store.each(function(rec) {
                    rec.get('selected') && selected.push(rec.getId());
                });

                itemSelector.setStore(store);
                itemSelector.setValue(selected);
                store.resumeEvents();
            }
        },

        onSelectionChange : function(itemSelector, newValue, oldValue, e) {
            var store = itemSelector.getStore(),
                toRemove = Ext.Array.difference(oldValue, newValue);

            Ext.Array.each(toRemove, function(item, index) {
                store.getById(item).set({
                    'selected' : false
                });
            });

            Ext.Array.each(newValue, function(item, index) {
                var rec = store.getById(item);

                if (rec.get('selected')) {
                    rec.set({'sequence' : index + 1})
                } else {
                    rec.set({
                        'selected' : true,
                        'sequence' : newValue.length,
                        'phantom' : true
                    })
                }
            });
        },

        onSaveHandler : function() {
            var view = this.getView(),
                vm = view.getViewModel(),
                store = view.lookupReference('itemselector').getStore(),

                currentGroup = vm.get('currentGradeGroup'),
                currentGradeStore = vm.get('currentGradeStore'),
                currentGradeSteps = vm.get('currentGradeSteps'),
                gradeType = vm.get('gradeType'),
                employerId = vm.get('employerId'),

                cdGradeSteps = null,
                promises = [],
                eraseStepsPromises = [],
                removeStepError = false,
                errorMessages = [];

            if (!currentGradeSteps) {
                cdGradeSteps = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_STEP);
            }

            var seq = 0,
                seqArray = [];

            Ext.Array.each(store.getRange(), function(data) {
                seq++;

                if (data.get('selected')) {
                    var gradeRec = currentGradeStore.getById(data.get('rid'));

                    if (!gradeRec) {
                        gradeRec = Ext.create('criterion.model.SalaryGradeGradeOnly');
                    }

                    if (!gradeType) {
                        if (data.steps || data.get('steps') || currentGradeSteps) {
                            Ext.Array.each(data.steps && data.steps().getRange() || data.get('steps') || currentGradeSteps.getRange(), function(step) {
                                var gradeRec = null;

                                if (!data.get('phantom')) {
                                    gradeRec = Ext.create('criterion.model.SalaryGradeGradeStep', {
                                        id : step.get('salaryGradeId')
                                    });

                                    seqArray[data.getId() + '_' + step.get('salaryStepCd')] = seq;
                                    promises.push(gradeRec.loadWithPromise().then(function(rec) {
                                        rec.set({
                                            sequence : seqArray[rec.get('salaryGradeCd') + '_' + rec.get('salaryStepCd')],
                                            salaryStepCd : step.get('salaryStepCd'),
                                            salaryGroupCd : currentGroup
                                        });
                                        rec.saveWithPromise();
                                    }));
                                } else {
                                    gradeRec = Ext.create('criterion.model.SalaryGradeGradeStep',
                                        {
                                            sequence : seq,
                                            salaryGradeCd : data.getId(),
                                            salaryStepCd : step.get('salaryStepCd'),
                                            salaryGroupCd : currentGroup,
                                            employerId : employerId
                                        });
                                    promises.push(gradeRec.saveWithPromise());
                                }
                            });

                        } else {
                            cdGradeSteps.each(function(step) {
                                var gradeRec = Ext.create('criterion.model.SalaryGradeGradeStep', {
                                    salaryGradeCd : data.getId(),
                                    salaryGroupCd : currentGroup,
                                    salaryStepCd : step.getId(),
                                    sequence : seq,
                                    minRate : 0,
                                    employerId : employerId
                                });

                                promises.push(gradeRec.saveWithPromise());
                            });
                        }
                    } else {
                        gradeRec.set({
                            salaryGradeCd : data.getId(),
                            salaryGroupCd : currentGroup,
                            sequence : seq,
                            employerId : employerId
                        });
                        promises.push(gradeRec.saveWithPromise());

                    }

                } else if (data.dirty && !data.get('selected')) {
                    if (gradeType) {
                        var rec = currentGradeStore.getById(data.get('rid')),
                            jobs = rec && rec.get('jobs');

                        if (jobs && jobs.length) {
                            errorMessages.push(
                                Ext.util.Format.format(
                                    i18n.gettext('{0} can not be deleted because it is used in position(s) with ID: [{1}]'),
                                    rec.get('gradeName'), Ext.Array.pluck(jobs, 'id').toString()
                                )
                            )
                        } else {
                            rec && promises.push(rec.eraseWithPromise());
                        }
                    } else {
                        var stepParent = currentGradeStore.getById(data.getId());

                        stepParent && stepParent.steps().each(function(step) {
                            var removeStep = Ext.create('criterion.model.SalaryGradeGradeOnly', {id : step.get('salaryGradeId')}),
                                jobs = step.get('jobs');

                            if (jobs.length) {
                                removeStepError = true;
                                errorMessages.push(
                                    Ext.util.Format.format(
                                        i18n.gettext('{0} can not be deleted because {1} is used in position(s) with ID: [{2}]'),
                                        stepParent.get('salaryGradeName'),
                                        step.get('stepName'), Ext.Array.pluck(jobs, 'id').toString()
                                    )
                                )
                            } else {
                                eraseStepsPromises.push(removeStep);
                            }
                        });
                    }

                }
            });

            if (removeStepError && errorMessages.length) {
                criterion.Msg.info({
                    title : i18n.gettext('The number of steps can not be changed'),
                    msg : errorMessages.join('<BR/><BR/>')
                });
                errorMessages = [];
                eraseStepsPromises = [];
            } else if (!removeStepError) {
                promises = promises.concat(
                    Ext.Array.each(eraseStepsPromises, function(rec) {
                        return rec.eraseWithPromise()
                    })
                );
            }

            Ext.Deferred.all(promises).always(function() {
                view.setLoading(false);

                errorMessages.length && criterion.Msg.info(errorMessages.join('<BR/><BR/>'));

                view.fireEvent('buildGradesGrid', {
                    salaryGroupData : currentGroup,
                    gradeType : gradeType,
                    needReconfigure : !gradeType
                });

                view.destroy();
            }, this);
        },

        onCancel : function() {
            this.getView().destroy();
        }
    }
});
