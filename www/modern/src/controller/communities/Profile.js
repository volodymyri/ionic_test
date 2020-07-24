Ext.define('ess.controller.communities.Profile', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_communities_profile',

        onActivate : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                ownProfile = vm.get('ownProfile'),
                person,
                employerWorkLocations,
                badgesEarnedStore = vm.getStore('badgesEarnedStore'),
                employeeCommunities = vm.getStore('employeeCommunities'),
                promises,
                employee = Ext.create('criterion.model.Employee', {
                    id : vm.get('employeeId')
                });

            employee.getProxy().setUrl(criterion.consts.Api.API.COMMUNITY_EMPLOYEE);

            promises = [
                function() {
                    view.setLoading(true);

                    view.down('#profile-info').setData({
                        name : '',
                        positionTitle : '',
                        department : '',
                        employeeWorkLocation : '',
                        phone : '',
                        email : ''
                    });
                    view.down('#profile-photo').setData({
                        imageUrl : criterion.consts.Api.API.EMPLOYEE_NO_PHOTO_90
                    });
                    view.down('#profile-checked-info').hide();

                    return employee.loadWithPromise()
                },
                function() {
                    employee.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE);

                    person = Ext.create('criterion.model.Person', {
                        personId : employee.get('personId')
                    });

                    person.getProxy().setUrl(criterion.consts.Api.API.COMMUNITY_PERSON);

                    return person.loadWithPromise()
                },
                function() {
                    employerWorkLocations = Ext.create('criterion.store.employer.WorkLocations');

                    return employerWorkLocations.loadWithPromise({
                        params : {
                            employerId : employee.get('employerId')
                        }
                    })
                },
                function() {
                    badgesEarnedStore.getProxy().setExtraParam('employeeId', employee.getId());
                    return badgesEarnedStore.loadWithPromise()
                }
            ];

            if (ownProfile) {
                promises.push(
                    function() {
                        employeeCommunities.getProxy().setExtraParam('employeeId', employee.getId());
                        return employeeCommunities.loadWithPromise();
                    }
                );
            }

            Ext.Deferred.sequence(promises).then({
                scope : this,
                success : function() {
                    var checkInLocationId = employee.get('checkInLocationId'),
                        checkedInfo = view.down('#profile-checked-info'),
                        employer = ess.getApplication().getEmployersStore().getById(employee.get('employerId')),
                        employerLocationRecord,
                        employeeWorkLocation = employee.getEmployeeWorkLocation(),
                        assignment = employee.getAssignment();

                    vm.set('title', ownProfile ? i18n.gettext('My Profile') : person.get('fullName'));

                    view.down('#profile-info').setData({
                        name : !ownProfile ? person.get('fullName') : '',
                        positionTitle : assignment && assignment.get('positionTitle') || '',
                        department : assignment && criterion.CodeDataManager.getCodeDetailRecord('id', assignment.get('departmentCd'), criterion.consts.Dict.DEPARTMENT).get('description') || '',
                        employeeWorkLocation : employeeWorkLocation ? employerWorkLocations.getById(employeeWorkLocation.get('employerWorkLocationId')).get('description') : '',
                        phone : person.get('mobilePhone'),
                        email : person.get('email')
                    });

                    view.down('#profile-photo').setData({
                        imageUrl : criterion.Utils.makePersonPhotoUrl(person.getId())
                    });

                    if (employer.get('isCheckin')) {
                        employerLocationRecord = employerWorkLocations.getById(checkInLocationId);

                        if (employerLocationRecord) {
                            checkedInfo.show();
                            checkedInfo.setData({
                                checkedInto : Ext.String.format(
                                    i18n.gettext('Checked into <strong>{0}</strong>'),
                                    employerLocationRecord.get('description')
                                )
                            });
                        } else {
                            checkedInfo.hide();
                        }
                    } else {
                        checkedInfo.hide();
                    }

                    view.setLoading(false);
                }
            });
        },

        handleCancel : function() {
            var view = this.getView();

            view.fireEvent('cancelViewProfile');
        }
    };
});
