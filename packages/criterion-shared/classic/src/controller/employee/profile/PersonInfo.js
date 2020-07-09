Ext.define('criterion.controller.employee.profile.PersonInfo', function() {

    let personId;

    const API = criterion.consts.Api.API,
        USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_profile_person_info',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        listen : {
            controller : {
                '*' : {
                    selectedPersonSet : 'handleEmployeeSet',
                    selectedEmployeeSet : 'handleEmployeeSet',
                    changePersonInfo : 'handleChangePersonInfo',
                    clearEmployeeInfo : 'handleClearEmployeeInfo',
                    changeEmployeeProfilePicture : 'onUpdatePicture',
                    employeeProfilePictureSaved : 'onUpdatePicture',
                    primaryPositionChange : 'onPrimaryPositionChange'
                }
            },
            global : {
                blockPrevNext : 'handleBlockPrevNext'
            }
        },

        onPrimaryPositionChange : function(position) {
            this.getView().changePositionName(position.get('title'));
        },

        onUpdatePicture : function(data) {
            this.getView().setImageUrl(criterion.Utils.makePersonPhotoUrl(data.personId));
        },

        getPersonName(person) {
            let prefixDescription = person.get('prefixDescription');

            return (prefixDescription ? (prefixDescription + ' ') : '') + person.get('fullName');
        },

        handleEmployeeSet : function(data, contextView) {
            if (!this.isInContext(contextView)) {
                return;
            }

            let person = data.person,
                view = this.getView(),
                assignment = data.employee && data.employee.get('assignment'),
                employeeNumber = data.employee && !data.employee.phantom && data.employee.get('employeeNumber');

            personId = person.phantom ? null : person.getId();

            if (person.phantom) {
                return;
            }

            view.setImageUrl(criterion.Utils.makePersonPhotoUrl(person.get('id')));
            view.setPersonInfo({
                name : this.getPersonName(person),
                id : person.get('id'),
                positionTitle : assignment ? assignment.positionTitle : '',
                employerId : data.employer && data.employer.getId(),
                employerName : data.employer && data.employee ? data.employer.get('legalName') : '',
                isNew : !data.employee || data.employee.phantom,
                employeeNumber : employeeNumber ? 'Employee Number: ' + data.employee.get('employeeNumber') : ''
            });
        },

        handleChangePersonInfo : function(data) {
            let person = data.person,
                view = this.getView(),
                assignment = data.employee && data.employee.get('assignment'),
                employeeNumber = data.employee && !data.employee.phantom && data.employee.get('employeeNumber');

            view.setPersonInfo({
                name : this.getPersonName(person),
                id : person.get('id'),
                positionTitle : assignment ? assignment.positionTitle : '',
                employerId : data.employer && data.employer.getId(),
                employerName : data.employer && data.employee ? data.employer.get('legalName') : '',
                isNew : !data.employee || data.employee.phantom,
                employeeNumber : employeeNumber ? 'Employee Number: ' + data.employee.get('employeeNumber') : ''
            });
        },

        handleClearEmployeeInfo : function(contextView) {
            if (!this.isInContext(contextView)) {
                return;
            }

            let view = this.getView();

            view.setImageUrl(API.EMPLOYEE_NO_PHOTO_90);
            view.setPersonInfo({
                name : '',
                id : '',
                positionTitle : '',
                employerName : '',
                employeeNumber : ''
            });
        },

        handleProfilePictureChange : function() {
            let form = this.getView().getPhotoUploadForm().getForm();

            if (form.isValid()) {
                criterion.Api.submitForm({
                    url : criterion.Api.getSecureResourceUrl((personId) ? Ext.String.format("{0}/{1}", API.PERSON_LOGO, personId) : API.PERSON_LOGO),
                    form : form,
                    scope : this,
                    success : personId ? Ext.bind(this.callbackUpdatePhoto, this) : Ext.bind(this.callbackSavePhoto, this)
                });
            }
        },

        handleShowPictureUploader : function() {
            let url = (personId) ? Ext.String.format("{0}/{1}", API.PERSON_LOGO, personId) : API.PERSON_LOGO;

            Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Edit photo'),
                dropGlyph : criterion.consts.Glyph['ios7-contact-outline'],

                url : criterion.Api.getSecureResourceUrl(url),
                useCrop : true,
                maxFileSize : USER_PHOTO_SIZE.MAX_FILE_SIZE_MB,
                maxFileApi : API.PERSON_LOGO_MAX_FILE_SIZE,
                imageSize : USER_PHOTO_SIZE,

                scope : this,
                callback : personId ? Ext.bind(this.callbackUpdatePhoto, this) : Ext.bind(this.callbackSavePhoto, this)
            }).show();
        },

        callbackUpdatePhoto(result) {
            this.fireEvent('changeEmployeeProfilePicture', {
                personId : personId
            });

            this.getView().setImageUrl(criterion.Utils.makePersonPhotoUrl(personId), true);
        },

        callbackSavePhoto(result) {
            let view = this.getView();

            view.fireEvent('connectIdentifierToPerson', result.identifier);
            view.setImageUrl(API.PERSON_PREVIEW_PHOTO + result.identifier);
        },

        handleGoToNextEmployee : function() {
            let nextEmployee = this.getView().getNextEmployee();

            this.goToEmployee(nextEmployee);
        },

        handleGoToPrevEmployee : function() {
            let prevEmployee = this.getView().getPrevEmployee();

            this.goToEmployee(prevEmployee);
        },

        goToEmployee : function(employee) {
            let employeeId = this.getViewModel().get('employee').getId();

            if (Ext.GlobalEvents.fireEvent('beforeHideForm', this, arguments, true) === false) {
                Ext.GlobalEvents.on('dirtyFormClosed', function() {
                    loadEmployee();
                }, this);
            } else {
                Ext.GlobalEvents.fireEvent('forcedFormClose');
                loadEmployee();
            }

            function loadEmployee() {
                let newHash = Ext.History.getHash().replace(employeeId, employee.employeeId),
                    searchEmployees = Ext.getStore('searchEmployees');

                Ext.History.add(newHash);

                if (searchEmployees && searchEmployees.currentPage !== employee.page) {
                    searchEmployees.loadPage(employee.page || 1);
                }
            }
        },

        handleBlockPrevNext : function(blocked) {
            this.getViewModel().set('disablePrevNext', blocked);
        }

    };
});
