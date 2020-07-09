Ext.define('criterion.controller.recruiting.jobs.JobForm', function() {

    const DICT = criterion.consts.Dict,
        ROUTE = criterion.consts.Route.RECRUITING.JOBS;

    return {

        extend : 'criterion.app.ViewController',

        requires : [
            'criterion.model.employer.JobPosting',
            'criterion.view.recruiting.jobs.PositionPicker',
            'criterion.model.Employee',
            'criterion.model.Person',
            'criterion.model.Position',
            'criterion.view.MultiRecordPicker',
            'criterion.store.search.Employees',
            'criterion.store.employer.recruiting.Settings',
            'criterion.view.MultiRecordPickerRemoteAlt'
        ],

        alias : 'controller.criterion_recruiting_jobs_job_form',

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleEmployersStoreLoaded : function(employerId, dfd) {
            criterion.CodeDataManager.load([criterion.consts.Dict.JOB_POSTING_STATUS])
                .then({
                    success : function() {
                        let record = Ext.create('criterion.model.employer.JobPosting');

                        record.set({
                            statusCd : criterion.CodeDataManager.getStore(criterion.consts.Dict.JOB_POSTING_STATUS).getAt(0).getId(),
                            employerId : employerId
                        });
                        record.setPosition(Ext.create('criterion.model.Position'));
                        dfd.resolve(record);
                    }
                })
        },

        load : function(id, tabId) {
            let view = this.getView(),
                me = this,
                vm = this.getViewModel(),
                webForms = vm.getStore('webForms'),
                jobPostingCandidates = vm.getStore('jobPostingCandidates'),
                reviewTemplates = vm.getStore('reviewTemplates'),
                jobPostingId = parseInt(id, 10),
                dfd = Ext.create('Ext.promise.Deferred'),
                promises;

            if (this._currentLoadedId === jobPostingId) {
                return;
            }

            this._currentLoadedId = jobPostingId;
            this._tabitemId = tabId ? tabId : 'details';

            view.setActiveItem(0);
            vm.set('jobPosting', null);

            view.setLoading(true);

            if (!Ext.isNumber(jobPostingId)) {
                let employersStore = Ext.data.StoreManager.lookup('Employers');

                view.setTabsDisabled(true);

                if (employersStore.isLoaded()) {
                    me.handleEmployersStoreLoaded(employersStore.getAt(0).getId(), dfd);
                } else {
                    me.mon(employersStore, 'load', function() {
                        me.handleEmployersStoreLoaded(employersStore.getAt(0).getId(), dfd);
                    }, me, {single : true});
                }
            } else {
                view.setTabsDisabled(false);
                criterion.model.employer.JobPosting.load(jobPostingId, {
                    success : function(record) {
                        dfd.resolve(record);
                    }
                });
            }

            dfd.promise.then({
                scope : this,
                success : function(record) {
                    promises = [
                        webForms.loadWithPromise(),
                        reviewTemplates.loadWithPromise()
                    ];

                    vm.set('jobPosting', record);

                    me.fireEvent('jobPostingSet', {
                        jobPosting : record
                    }, view);

                    if (!record.phantom) {
                        promises.push(
                            jobPostingCandidates.loadWithPromise({
                                params : {
                                    jobPostingId : record.getId()
                                }
                            })
                        );
                    }

                    Ext.promise.Promise.all(promises).then(function() {
                        if (!record.phantom) {
                            jobPostingCandidates.setFilters([
                                function(item) {
                                    let candidateStatusCd = item.get('candidateStatusCd'),
                                        jpRecord = criterion.CodeDataManager.getCodeDetailRecord('id', candidateStatusCd, criterion.consts.Dict.CANDIDATE_STATUS),
                                        attr1Val = jpRecord ? parseInt(jpRecord.get('attribute1'), 10) : 1;

                                    return !!attr1Val;
                                }
                            ]);
                            me.lookupReference('recruiting_jobs_candidates_grid').setStore(jobPostingCandidates);
                        }
                        view.setLoading(false);
                    }).otherwise(function() {
                        view.setLoading(false);
                    });

                    me.onTabChange();
                }
            })
        },

        onCandidatesChanged : function() {
            let vm = this.getViewModel();

            vm.getStore('jobPostingCandidates').loadWithPromise({
                params : {
                    jobPostingId : vm.get('jobPosting.id')
                }
            })
        },

        onTabChange : function(panel, tab) {
            if (!this._currentLoadedId) {
                return;
            }

            if (tab) {
                this._tabitemId = tab.itemId;
            }

            Ext.History.add(ROUTE + '/' + this._currentLoadedId + '/' + this._tabitemId, true);
        },

        generateDescription : function() {
            let vm = this.getViewModel(),
                jobPosting = vm.get('jobPosting'),
                cmp = this.lookupReference('description'),
                position = jobPosting.getPosition(),
                description = '',
                employerWorkLocations = this.getStore('employerWorkLocations'),
                employerWorkPeriods = this.getStore('employerWorkPeriods'),
                employerId = position.get('employerId');

            cmp.setDisabled(true);

            Ext.promise.Promise.all([
                employerWorkLocations.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                }),
                employerWorkPeriods.loadWithPromise({
                    params : {
                        employerId : employerId
                    }
                })
            ]).then({
                scope : this,
                success : function() {
                    let positionDescr = position.get('description'),
                        location = employerWorkLocations.getById(position.get('employerWorkLocationId')),
                        employerWorkPeriod = employerWorkPeriods.getById(position.get('workPeriodId'));

                    positionDescr && (description += positionDescr + '<br><br>');

                    description += this.getCdDescription(position, i18n.gettext('Desired Experience'), 'experienceCd', DICT.EXPERIENCE);
                    description += this.getCdDescription(position, i18n.gettext('Desired Education'), 'educationCd', DICT.EDUCATION);

                    description += '<div>' + i18n.gettext('Exempt') + ' : ' + (position.get('isExempt') ? i18n.gettext('Yes') : i18n.gettext('No')) + '</div>';

                    description += this.getCdDescription(position, i18n.gettext('Type'), 'positionTypeCd', DICT.POSITION_TYPE);
                    description += this.getCdDescription(position, i18n.gettext('Department'), 'departmentCd', DICT.DEPARTMENT);

                    location && (description += '<div>' + i18n.gettext('Location') + ' : ' + location.get('code') + '</div>');

                    description += this.getCdDescription(position, i18n.gettext('Security Clearance'), 'securityClearanceCd', DICT.SECURITY_CLEARANCE);
                    description += this.getCdDescription(position, i18n.gettext('Work Authorization'), 'workAuthorizationCd', DICT.WORK_AUTHORIZATION);
                    employerWorkPeriod && (description += '<div>' + i18n.gettext('Work Period') + ' : ' + employerWorkPeriod.get('name') + '</div>');
                    description += this.getCdDescription(position, i18n.gettext('Travel Requirements'), 'travelRequirementsCd', DICT.TRAVEL_REQUIREMENTS);
                    description += this.getCdDescription(position, i18n.gettext('Work from Home'), 'workFromHomeCd', DICT.WORK_FROM_HOME);
                    description += this.getCdDescription(position, i18n.gettext('Dress / Attire'), 'dressCd', DICT.DRESS);

                    jobPosting.set('description', description);
                    cmp.setDisabled(false);
                }
            });
        },

        getCdDescription : function(record, label, id, codeTableCode) {
            let cm = criterion.CodeDataManager,
                value = record.get(id),
                description = '';

            value = value && cm.getValue(value, codeTableCode);

            if (value) {
                description = Ext.util.Format.format('<div>{0} : {1}</div>', label, value);
            }

            return description;
        },

        onSubmit : function() {
            let view = this.getView(),
                vm = this.getViewModel();

            if (this.lookupReference('form').isValid()) {
                view.setLoading(true);

                vm.get('jobPosting').saveWithPromise()
                    .always(function() {
                        view.setLoading(false);
                    })
                    .then({
                        scope : this,
                        success : function() {
                            criterion.Utils.toast(i18n.gettext('Job Saved.'));
                            this._currentLoadedId = null;
                            this.redirectTo(ROUTE, null);
                        }
                    })
            }
        },

        handleEmployerChange : function(cmp, employerId) {
            let vm = this.getViewModel(),
                jobPosting = vm.get('jobPosting'),
                settings = vm.getStore('settings'),
                questionSets = vm.getStore('questionSets'),
                promises = employerId ? [
                    questionSets.loadWithPromise({
                        params : {
                            employerId : employerId
                        }
                    })
                ] : [];
            
            if (jobPosting) {
                if (jobPosting.phantom) {
                    jobPosting.set({
                        title : null,
                        hiringManagerId : null,
                        description : null,
                        requisitionCode : null,
                        salary : null
                    });

                    vm.set('jobPosting.position.title', null);
                    vm.set('hiringManager', null);
                }

                if (employerId) {
                    promises.push(
                        jobPosting.phantom && settings.loadWithPromise({
                            params : {
                                employerId : employerId
                            }
                        }) || null
                    );
                }
            }

            Ext.promise.Promise.all(promises).then(function() {
                if (jobPosting && jobPosting.phantom) {
                    let defaultSettings = settings.getAt(0);

                    jobPosting.set({
                        questionSetId : defaultSettings ? defaultSettings.get('questionSetId') : null,
                        employmentApplicationWebformId : defaultSettings ? defaultSettings.get('employmentApplicationWebformId') : null,
                        isShowEaJobPortal : defaultSettings ? defaultSettings.get('isShowEaJobPortal') : null
                    });
                }
            });
        },

        onPositionSearch : function() {
            let vm = this.getViewModel(),
                jobPosting = vm.get('jobPosting'),
                employerId = jobPosting.get('employerId'),
                window;

            if (employerId === null) {
                this.lookupReference('form').isValid(); // highlight required fields

                return;
            }

            window = Ext.create('criterion.view.recruiting.jobs.PositionPicker', {
                employerId : employerId,
                isActive : true,
                isApproved : true
            });

            window.show();
            window.on('select', function(positionRecord) {
                jobPosting.set('positionId', positionRecord.getId());
                jobPosting.set('location', positionRecord.get('locationDescription'));
                jobPosting.setPosition(positionRecord);
                jobPosting.set('positionName', '');
                this.generateDescription();
            }, this);
        },

        onCancel : function() {
            let returnTo = criterion.consts.Route.getPrevRoute();

            this._currentLoadedId = null;

            if (returnTo) {
                criterion.consts.Route.setPrevRoute();
                this.redirectTo(returnTo, null);
            } else {
                this.redirectTo(ROUTE, null);
            }

        },

        handleRemoveAction : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            criterion.Msg.confirmDelete(
                {
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        view.setLoading(true);

                        vm.get('jobPosting').eraseWithPromise().always(function() {
                            view.setLoading(false);
                        }).then({
                            success : function() {
                                me.redirectTo(ROUTE, null);
                            }
                        });
                    }
                }
            );
        },

        init : function() {
            let routes = {};

            routes[ROUTE + '/:id'] = 'load';
            routes[ROUTE + '/:id/:tab'] = 'load';

            this.setRoutes(routes);

            this.callParent(arguments);
        },

        candidateSelect : function(record) {
            this.getView().fireEvent('candidateSelect', record);
        },

        onManagerSearch : function() {
            let vm = this.getViewModel(),
                employees = Ext.create('criterion.store.search.Employees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                selectedEmployees = Ext.create('criterion.store.search.Employees'),
                hiringManagers = vm.get('jobPosting.hiringManagers'),
                jobPostingId = vm.get('jobPosting.id'),
                excludedIds = [],
                storeParams = {
                    isActive : true,
                    employerId : vm.get('jobPosting.employerId')
                },
                selectEmployeesWindow;

            hiringManagers.each(function(empl) {
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
                        title : i18n.gettext('Hiring Managers'),
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
                }
            });

            selectEmployeesWindow.on({
                selectRecords : function(records) {
                    let selectedEmployeeIds = [],
                        toRemove = [];

                    Ext.Array.each(records, function(record) {
                        let employeeId = record.get('employeeId');

                        selectedEmployeeIds.push(employeeId);

                        if (!hiringManagers.findRecord('employeeId', employeeId, 0, false, false, true)) {
                            hiringManagers.add({
                                employeeId : employeeId,
                                jobPostingId : jobPostingId,

                                personId : record.get('personId'),
                                fullName : record.get('fullName'),
                                positionTitle : record.get('positionTitle'),
                                lastName : record.get('lastName'),
                                firstName : record.get('firstName'),
                                middleName : record.get('middleName'),
                                employeeNumber : record.get('employeeNumber')
                            });
                        }
                    });

                    hiringManagers.each(function(recruiter) {
                        if (!Ext.Array.contains(selectedEmployeeIds, recruiter.get('employeeId'))) {
                            toRemove.push(recruiter);
                        }
                    });

                    if (toRemove.length) {
                        hiringManagers.remove(toRemove);
                    }
                }
            });

            selectEmployeesWindow.show();
        },

        onRecruiterSearch : function() {
            let vm = this.getViewModel(),
                jobPosting = vm.get('jobPosting'),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true
                });

            picker.show();
            picker.on('select', function(record) {
                jobPosting.set({
                    recruiterId : record.get('employeeId'),
                    recruiterFullName : record.get('fullName')
                });
            }, this);
        }
    };
});
