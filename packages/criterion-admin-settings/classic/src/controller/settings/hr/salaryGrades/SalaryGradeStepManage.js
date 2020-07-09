Ext.define('criterion.controller.settings.hr.salaryGrades.SalaryGradeStepManage', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_settings_salary_grade_step_manage',

        requires : [
            'criterion.model.SalaryGradeGradeOnly'
        ],

        init : function() {
            var vm = this.getViewModel(),
                grid = this.lookup('grid'),
                index = 0,
                saveBtn = this.lookup('saveBtn'),
                allVal = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_STEP),
                store = Ext.create('criterion.data.Store', {
                    fields : [
                        {
                            name : 'description',
                            type : 'string'
                        },
                        {
                            name : 'selected',
                            type : 'boolean'
                        }
                    ],

                    type : 'memory',

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

            allVal.each(function(data) {
                var tempRecord = {},
                    rec = data;

                tempRecord['id'] = data.get('id');
                tempRecord['description'] = data.get('description');

                vm.get('currentGradeSteps').each(function(currentStepRecord) {
                    if (rec.getId() === currentStepRecord.get('salaryStepCd')) {
                        tempRecord['selected'] = true;
                        tempRecord['rid'] = currentStepRecord.get('salaryStepCd');
                    }
                });

                index++;
                store.add(tempRecord);
            }, this);

            store.sort('sequence', 'ASC');
            grid && grid.setStore(store);
        },

        onSaveHandler : function() {
            var view = this.getView(),
                vm = view.getViewModel(),
                store = this.lookup('grid').getStore(),
                currentGroup = vm.get('currentGradeGroup'),
                currentGradeStore = vm.get('currentGradeStore'),
                gradeType = vm.get('gradeType'),
                employerId = vm.get('employerId'),
                promises = [],
                eraseStepsPromises = [],
                removeStepError = false,
                errorMessages = [];

            store.each(function(data) {
                if (data.dirty && data.get('selected')) {
                    currentGradeStore.each(function(rec) {
                        var gradeRec = Ext.create('criterion.model.SalaryGradeGradeOnly', {
                            salaryGradeCd : rec.get('salaryGradeCd'),
                            salaryStepCd : data.getId(),
                            salaryGroupCd : currentGroup,
                            minRate : 0,
                            employerId : employerId
                        });

                        promises.push(gradeRec.saveWithPromise());
                    });
                } else if (data.dirty && !data.get('selected')) {
                    currentGradeStore.each(function(rec) {
                        rec.steps().each(function(step) {
                            if (data.getId() === step.get('salaryStepCd')) {
                                var removeStep = Ext.create('criterion.model.SalaryGradeGradeOnly', {id : step.get('salaryGradeId')}),
                                    gradeName = rec.get('salaryGradeName'),
                                    jobs = step.get('jobs');

                                if (jobs.length) {
                                    removeStepError = true;
                                    errorMessages.push(
                                        Ext.util.Format.format(
                                            i18n.gettext('Step can not be deleted because {0} - {1} is used in position(s) with ID: [{2}]'),
                                            gradeName,
                                            step.get('stepName'), Ext.Array.pluck(jobs, 'id').toString()
                                        )
                                    )
                                } else {
                                    eraseStepsPromises.push(removeStep);
                                }
                            }
                        });
                    });
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
