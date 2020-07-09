Ext.define('criterion.controller.person.Certification', function() {

    return {

        alias : 'controller.criterion_person_certification',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.employer.Certifications'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleCertificationSearch() {
            let me = this,
                vm = me.getViewModel(),
                record = vm.get('record'),
                certifications = Ext.create('criterion.store.employer.Certifications'),
                picker = Ext.create('criterion.view.RecordPicker', {
                    title : i18n.gettext('Select Certification'),
                    searchFields : [
                        {
                            fieldName : 'name',
                            displayName : i18n.gettext('Name')
                        },
                        {
                            fieldName : 'description',
                            displayName : i18n.gettext('Description')
                        },
                        {
                            fieldName : 'issuedBy',
                            displayName : i18n.gettext('Issued By')
                        }
                    ],
                    columns : [
                        {
                            text : i18n.gettext('Name'),
                            dataIndex : 'name',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Description'),
                            dataIndex : 'description',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Issued By'),
                            dataIndex : 'issuedBy',
                            flex : 1
                        }
                    ],
                    store : certifications,
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
                            modal : true
                        }
                    ],
                    cls : 'criterion-modal',
                    localFiltering : true
                });

            certifications.getProxy().setExtraParam('employerId', me.getEmployerId());

            picker.on('select', certification => {
                record.set({
                    certificationId : certification.getId(),
                    certificationName : certification.get('name'),
                    description : certification.get('description'),
                    issuedBy : certification.get('issuedBy')
                });
            });

            picker.on('destroy', () => {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();

            this.setCorrectMaskZIndex(true);
        },

        getEmployerId() {
            return this.getViewModel().get('employee.employerId')
        }
    };

});
