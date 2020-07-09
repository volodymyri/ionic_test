Ext.define('criterion.controller.recruiting.jobs.Position', function() {

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employer.JobPosting',
            'criterion.view.recruiting.jobs.PositionPicker'
        ],

        alias : 'controller.criterion_recruiting_jobs_position',

        listen : {
            controller : {
                '*' : {
                    jobPostingSet : 'handleJobPostingSet'
                }
            }
        },

        onActivate : function() {
            var view = this.getView(),
                me = this,
                vm = this.getViewModel(),
                jobPosting = vm.get('jobPosting');

            if (!jobPosting) {
                return;
            }

            view.setLoading(true);

            vm.set('position', jobPosting.getPosition());

            var employerId = vm.get('position.employerId');

            Ext.promise.Promise.all([
                this.getStore('employerWorkLocations').loadWithPromise({params : {employerId : employerId}}),
                this.getStore('employerWorkPeriods').loadWithPromise({params : {employerId : employerId}})
            ]).always(function() {
                me._fillSalaryGradeData();
                view.setLoading(false);
            })
        },

        _fillSalaryGradeData : function() {
            var me = this,
                vm = this.getViewModel(),
                positionRecord = vm.get('position'),
                minSalaryGradeId = positionRecord && positionRecord.get('minSalaryGradeId'),
                maxSalaryGradeId = positionRecord && positionRecord.get('maxSalaryGradeId'),
                recordGrade = minSalaryGradeId || maxSalaryGradeId,
                employerId = vm.get('position.employerId');

            if (recordGrade) {
                Ext.create('criterion.model.SalaryGradeGradeOnly', {
                    id : recordGrade
                }).loadWithPromise().then(function(gradeRec) {
                    var salaryGradesStore = vm.getStore('salaryGradesStore'),
                        salaryGradesRemoteStore = Ext.clone(salaryGradesStore),
                        salaryGradesStepsStore = vm.getStore('salaryGradesStepsStore'),
                        data = [],
                        salaryGroupId = gradeRec.get('salaryGroupCd'),
                        salaryGroup;

                    salaryGradesRemoteStore.getProxy().setExtraParams({
                        salaryGroupCd : gradeRec.get('salaryGroupCd'),
                        employerId : employerId
                    });

                    salaryGroup = criterion.CodeDataManager.getStore(criterion.consts.Dict.SALARY_GROUP).getById(salaryGroupId);
                    vm.set('salaryGroup', salaryGroup);

                    salaryGradesRemoteStore.loadWithPromise().then(function(records) {
                        if (parseInt(salaryGroup.get('attribute1')) === 0) {
                            var salaryGradeStepCombo1 = me.lookup('salaryGradeStepCombo1'),
                                salaryGradeStepCombo2 = me.lookup('salaryGradeStepCombo2');

                            Ext.Array.each(records, function(rec) {
                                var gradeRec = criterion.CodeDataManager.getCodeDetailRecord('id', rec.get('salaryGradeCd'), criterion.consts.Dict.SALARY_GRADE),
                                    recName = gradeRec.getData().description;

                                rec.steps && rec.steps().each(function(step) {
                                    data.push({
                                        id : step.getId(),
                                        stepName : recName + ' - ' + step.get('stepName'),
                                        rate : step.get('rate'),
                                        sequence : rec.get('sequence'),
                                        frequencyCd : rec.get('frequencyCd')
                                    });
                                });
                            });

                            salaryGradesStepsStore.setData(data);
                            salaryGradeStepCombo1.initValue();
                            salaryGradeStepCombo2.initValue();
                        } else {
                            salaryGradesStore.setData(records);
                        }
                    });
                });
            }
        },

        handleJobPostingSet : function() {
            if (this.checkViewIsActive()) {
                this.onActivate();
            }
        }
    };
});
