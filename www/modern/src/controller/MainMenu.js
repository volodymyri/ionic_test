Ext.define('ess.controller.MainMenu', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_main_menu',

        listen : {
            global : {
                baseStoresLoaded : 'onBaseStoresLoaded',
                employeeChanged : 'onEmployeeChange',
                signOutAction : 'handleLogout',
                orientationChange : 'handleOrientationChange',
                afterWorkflowAction : 'handleAfterWorkflowAction'
            }
        },

        handleOrientationChange : function(viewPort, mode) {
            Ext.each(this.getView().query('[isMenuBtn]'), function(cmp) {
                cmp[mode === 'landscape' ? 'addCls' : 'removeCls']('main-menu-btn-landscape');
            });
        },

        handleSwitchMenu : function(cmp) {
            Ext.GlobalEvents.fireEvent('switchPage', cmp.showCard);
        },

        handleLogout : function() {
            criterion.Api.logout();
        },

        onBaseStoresLoaded : function(employers, employees) {
            var employments = this.getStore('employments');

            employees.each(function(employee) {
                var assignment = employee.getAssignment();

                employments.add({
                    employeeId : employee.getId(),
                    employerId : employee.get('employerId'),
                    text : (assignment ? assignment.get('title') : 'Unemployed') + ' — ' + (employers.getById(employee.get('employerId')).get('legalName'))
                })
            });

            this.lookup('employmentPicker').setValue(criterion.Application.getEmployee().getId());

            this.onEmployeeChange();
        },

        onEmployeeChange : function() {
            if (!this.checkViewIsActive()) {
                return;
            }

            Ext.defer(function() {
                this.load();
            }, 100, this);
        },

        onCheckIn : function() {
            var picker = this.lookupReference('checkInPlacePicker'),
                vm = this.getViewModel();

            picker.setValue(vm.get('employee.checkInLocationId'));
            picker.showPicker();
        },

        onCheckInPlacePick : function(field, record) {
            var view = this.getView(),
                vm = this.getViewModel(),
                newVal = record && record.getId(),
                employee = vm.get('employee');

            if (newVal && employee.get('checkInLocationId') !== newVal) {
                employee.set('checkInLocationId', newVal);
                employee.saveWithPromise().then({
                    scope : this,
                    success : function() {
                        Ext.GlobalEvents.fireEvent('changeCheckInPlace', record.get('description'));
                        criterion.Utils.toast(i18n.gettext('Successfully.'));
                        view.setLoading(false)
                    }
                });
            }
        },

        onEmploymentChange : function() {
            var employmentPicker = this.lookup('employmentPicker');

            employmentPicker.setValue(criterion.Application.getEmployee().getId());
            employmentPicker.showPicker();
        },

        onEmploymentPick : function(field, record) {
            var employeeId = record.get('employeeId'),
                employerId = record.get('employerId');

            criterion.Application.setEmployee(employeeId);
            criterion.Application.setEmployer(employerId);

            Ext.GlobalEvents.fireEvent('modern_employeeChanged', {
                employeeId : employeeId,
                employerId : employerId
            });

            this.onEmployeeChange();
        },

        loadPendingWorkflows : function() {
            var vm = this.getViewModel(),
                pendingLogs = this.getStore('pendingWorkflows'),
                employee = vm.get('employee'),
                employeeId;

            if (employee) {
                employeeId = employee.getId();

                pendingLogs.load({
                    params : {
                        employeeId : employeeId,
                        withoutDetails : true
                    },
                    callback : function() {
                        vm.set('pendingWorkflowsCount', pendingLogs.getCount());
                    }
                });
            }
        },

        onActivate : function() {
            this.loadPendingWorkflows();
        },

        load : function() {
            var vm = this.getViewModel(),
                employee = vm.get('employee'),
                communities = this.getStore('communities'),
                employments = this.getStore('employments'),
                employeeId,
                changeBtn = this.lookup('changeBtn'),
                recruitingBtn = this.lookup('recruitingBtn');

            if (employments.getCount() === 1) {
                changeBtn.hide();
            } else {
                changeBtn.show();
            }

            if (employee) {
                employeeId = employee.getId();

                recruitingBtn[(ess.Application.isEmployeeHiringManager() && criterion.SecurityManager.getESSAccess(criterion.SecurityManager.ESS_KEYS.JOB_POSTINGS)) ? 'show' : 'hide']();

                this.loadPendingWorkflows();

                communities.loadWithPromise({
                    params : {
                        employeeId : employeeId,
                        isActive : true
                    }
                }).then({
                    scope : this,
                    success : function() {
                        vm.set('communitiesCount', communities.count());
                    }
                });
            }
        },

        handleAfterWorkflowAction : function() {
            var vm = this.getViewModel(),
                pendingLogs = this.getStore('pendingWorkflows'),
                employeeId = vm.get('employee.id');

            pendingLogs.load({
                params : {
                    employeeId : employeeId,
                    withoutDetails: true
                },
                callback : function() {
                    vm.set('pendingWorkflowsCount', pendingLogs.getCount());
                }
            });
        },

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 500, this);
            this.getViewModel().set('person', criterion.Api.getCurrentPerson());
            this.callParent(arguments);
            this.handleOrientationChange(Ext.Viewport, Ext.Viewport.getOrientation());
        }
    };
});
