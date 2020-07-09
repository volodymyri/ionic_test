Ext.define('criterion.controller.recruiting.JobPostingCandidateInterviewForm', function() {

    return {

        alias : 'controller.criterion_recruiting_job_posting_candidate_interview_form',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.store.search.Employees',
            'criterion.view.MultiRecordPickerRemoteAlt'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        changeInterviewDateDate(field, newValue) {
            let vm = this.getViewModel(),
                time = Ext.Date.format(vm.get('record.interviewDateTime'), 'H:i:s'),
                date = Ext.Date.format(newValue, 'Y-m-d');

            vm.set('record.interviewDate', Ext.Date.parse(date + ' ' + time, 'Y-m-d H:i:s'))
        },

        changeInterviewDateTime(field, newValue) {
            let vm = this.getViewModel(),
                date = Ext.Date.format(vm.get('record.interviewDateDate'), 'Y-m-d'),
                time = Ext.Date.format(newValue, 'H:i:s');

            vm.set('record.interviewDate', Ext.Date.parse(date + ' ' + time, 'Y-m-d H:i:s'))
        },

        handleInterviewerSearch() {
            let me = this,
                vm = this.getViewModel(),
                employees = Ext.create('criterion.store.search.Employees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedEmployees = Ext.create('criterion.store.search.Employees'),
                interviewers = vm.get('record.details'),
                jobPostingCandidateInterviewId = vm.get('record.id'),
                excludedIds = [],
                storeParams = {
                    isActive : true,
                    employerId : vm.get('currentJobPostingCandidate.employerId')
                },
                selectEmployeesWindow;

            interviewers.each(empl => {
                let data = Ext.clone(empl.getData()),
                    id = empl.get('personId') + '-' + empl.get('employeeId');

                data.id = id;
                excludedIds.push(id);

                selectedEmployees.add(data);
            });

            selectEmployeesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : '85%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
                    }
                ],
                viewModel : {
                    data : {
                        title : i18n.gettext('Interviewers'),
                        gridColumns : [
                            {
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                text : i18n.gettext('Employee Number'),
                                dataIndex : 'employeeNumber',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                text : i18n.gettext('Title'),
                                dataIndex : 'positionTitle',
                                flex : 1,
                                filter : 'string'
                            }
                        ],
                        storeParams : storeParams,
                        excludedIds : excludedIds,
                        allowDeleteSelected : true
                    },
                    stores : {
                        inputStore : employees,
                        selectedStore : selectedEmployees
                    }
                },
                allowEmptySelect : true
            });

            selectEmployeesWindow.on({
                destroy : () => {
                    me.setCorrectMaskZIndex(false);
                },
                selectRecords : records => {
                    let selectedEmployeeIds = [],
                        toRemove = [];

                    Ext.Array.each(records, record => {
                        let employeeId = record.get('employeeId');

                        selectedEmployeeIds.push(employeeId);

                        if (!interviewers.findRecord('interviewerId', employeeId, 0, false, false, true)) {
                            interviewers.add({
                                interviewerId : employeeId,
                                jobPostingCandidateInterviewId : jobPostingCandidateInterviewId,

                                personId : record.get('personId'),
                                positionTitle : record.get('positionTitle'),
                                lastName : record.get('lastName'),
                                firstName : record.get('firstName'),
                                employeeNumber : record.get('employeeNumber')
                            });
                        }
                    });

                    interviewers.each(interviewer => {
                        if (!Ext.Array.contains(selectedEmployeeIds, interviewer.get('interviewerId'))) {
                            toRemove.push(interviewer);
                        }
                    });

                    if (toRemove.length) {
                        interviewers.remove(toRemove);
                    }
                }
            });

            selectEmployeesWindow.show();
            this.setCorrectMaskZIndex(true);
        },

        handleDownloadCalendar() {
            window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.EMPLOYER_JOB_POSTING_CANDIDATE_INTERVIEW_ICS, this.getRecord().get('accessKey'))));
        }
    };

});
