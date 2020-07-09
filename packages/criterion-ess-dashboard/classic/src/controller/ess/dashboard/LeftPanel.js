Ext.define('criterion.controller.ess.dashboard.LeftPanel', function() {

    const API = criterion.consts.Api.API,
        USER_PHOTO_SIZE = criterion.Consts.USER_PHOTO_SIZE;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_dashboard_left_panel',

        requires : [
            'criterion.view.common.PictureUploader'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                updateProfileWidget : 'onUpdate'
            }
        },

        checkCompletion(aData) {
            let count = 0;

            Ext.Array.each(aData, data => {
                if (data) {
                    count++;
                }
            });

            return count / aData.length * 100;
        },

        onUpdate(emwl, addresses) {
            let person = criterion.Api.getCurrentPerson(),
                employee = criterion.Application.getEmployee(),
                employer = criterion.Application.getEmployer(),
                vm = this.getViewModel(),
                assignment = employee && employee.getAssignment(),
                profilePicture = this.lookup('profilePicture'),
                profileInfo = this.lookup('profileInfo'),
                completion;

            vm.set('employee', employee);
            vm.set('showCheckin', employer && employer.get('isCheckin'));

            profilePicture.setData({
                imageUrl : criterion.Utils.makePersonPhotoUrl(person.id)
            });

            profileInfo.setData({
                name : person.firstName + ' ' + person.lastName,
                positionTitle : assignment ? assignment.get('title') : '',
                employerName : employer.get('isEssEmployerName') ? employer.get('legalName') : ''
            });

            let address = addresses && addresses[0] || {};

            if (Ext.isArray(address)) {
                address = address.length && address[0];
            }

            if (employer && employer.get('isPercentComplete')) {
                completion = parseInt(this.checkCompletion(
                    [
                        person.firstName, person.lastName, person.dateOfBirth, person.genderCd, person.maritalStatusCd,
                        person.citizenshipCountryCd, person.ethnicityCd, person.nationalIdentifier, person.workPhone,
                        person.homePhone, person.mobilePhone, person.email, address.countryCd, address.address1, address.city,
                        address.stateCd, address.postalCode
                    ]
                ).toFixed(0), 10);

                vm.set({
                    completion : completion,
                    profileCompleted : completion === 100
                });
            } else {
                vm.set('profileCompleted', true);
            }

            employee && this.lookupReference('employeeWorkLocation').setValue(employee.get('checkInLocationId'));

            this.handleShowImgChanger();
            return false;
        },

        handleCheckInLocation(combo, newVal) {
            let employee = this.getViewModel().get('employee'),
                record = combo.store.getById(newVal),
                description = record && record.get('description'),
                textSize = description && Ext.util.TextMetrics.measure(combo.inputEl, description),
                isVisible = combo.isVisible();

            combo.setVisible(true);
            if (textSize) {
                combo.setWidth(combo.labelWidth + textSize.width + 25)
            }
            combo.setVisible(isVisible);

            if (newVal && employee.get('checkInLocationId') !== newVal) {
                employee.set('checkInLocationId', newVal);
                employee.saveWithPromise().then({
                    scope : this,
                    success() {
                        criterion.Utils.toast(i18n.gettext('Successfully changed.'));
                    }
                })
            }
        },

        onBeforeEmployeeChange() {

        },

        onEmployeeChange(employee) {

        },

        handleShowImgChanger() {
            let view = this.getView(),
                photoUploadForm = view.getPhotoUploadForm();

            photoUploadForm && photoUploadForm.destroy();
            view.createChangePhotoElement();
        },

        handleHide() {
            let photoUploadForm = this.getView().getPhotoUploadForm();

            photoUploadForm && photoUploadForm.destroy();
        },

        handleShowPictureUploader() {
            let personId = this.getPersonId(),
                url = personId ? Ext.String.format("{0}/{1}", API.PERSON_LOGO, personId) : API.PERSON_LOGO;

            Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Edit photo'),
                dropGlyph : criterion.consts.Glyph['ios7-contact-outline'],

                url : criterion.Api.getSecureResourceUrl(url),
                useCrop : true,
                maxFileSize : USER_PHOTO_SIZE.MAX_FILE_SIZE_MB,
                maxFileApi : API.PERSON_LOGO_MAX_FILE_SIZE,
                imageSize : USER_PHOTO_SIZE,

                scope : this,
                callback : Ext.bind(this.callbackUpdatePhoto, this)
            }).show();
        },

        callbackUpdatePhoto() {
            let personId = this.getPersonId();

            if (!personId) {
                return;
            }

            this.fireEvent('changeEmployeeProfilePicture', {
                personId : personId
            });

            this.getView().setImageUrl(criterion.Utils.makePersonPhotoUrl(personId), true);
        }
    }
});
