Ext.define('criterion.controller.settings.benefits.OpenEnrollments', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_open_enrollment_grid',

        requires : [
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Cloning'
        ],

        handleSelectionChange(grid, selection) {
            this.getViewModel().set('selectionCount', selection.length);
        },

        handleClone() {
            let picker,
                me = this,
                view = this.getView(),
                selection = view.getSelection(),
                employerId = selection[0].get('employerId'),
                selectedOE = Ext.Array.map(selection, select => select.get('name')),
                selectionCount = selectedOE.length;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Open Enrollments to Employer'),

                viewModel : {
                    data : {
                        employerId : employerId
                    }
                },

                items : [
                    {
                        xtype : 'textarea',
                        readOnly : true,
                        value : selectedOE.join('\r\n'),
                        fieldLabel : i18n.gettext('Open Enrollment') + (selectionCount > 1 ? 's' : '')
                    },
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        allowBlank : false,
                        bind : {
                            value : '{employerId}'
                        }
                    }
                ]
            });

            picker.show();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneOE(data, employerId);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        cloneOE(data, employerId) {
            let view = this.getView(),
                openEnrollments = Ext.Array.map(view.getSelection(), select => ({
                    id : select.getId(),
                    name : select.get('name') + criterion.Consts.CLONE_PREFIX
                }));

            this.actCloneItems(
                i18n.gettext('Clone Open Enrollment') + (openEnrollments.length > 1 ? 's' : ''),
                criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT_CLONE,
                data,
                employerId,
                openEnrollments
            );
        },

        getFullCloneUrl(url, data, item) {
            return Ext.String.format(url, item.id, data.employerId);
        },

        getParamsForCloning(data, item) {
            return {
                name : item.name
            }
        },

        startEdit() {
            Ext.GlobalEvents.fireEvent('disableSettingsPanel', true);

            return this.callParent(arguments);
        }
    };
});
