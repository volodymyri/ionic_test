Ext.define('criterion.controller.settings.system.SecurityProfiles', function() {

    return {
        alias : 'controller.criterion_settings_security_profiles',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Cloning'
        ],
        
        edit(record) {
            if (record.get('isSystemAdministrator')) {
                criterion.Msg.info(i18n.gettext('System Administrator is a built-in profile. It cannot be edited.'));
                this.updateGridToken();
            } else {
                this.callParent(arguments);
            }
        },

        getEmptyRecord() {
            return {
                hasFullAccess : true
            };
        },

        handleSelectionChange(g, selection) {
            this.getViewModel().set('selectionCount', selection.length);
        },

        handleClone() {
            let picker,
                me = this,
                view = this.getView(),
                selectedProfiles = Ext.Array.map(view.getSelection(), select => select.get('name')),
                selectionCount = selectedProfiles.length;

            picker = Ext.create('criterion.ux.form.CloneForm', {
                title : i18n.gettext('Clone Security Profiles'),
                items : [
                    {
                        xtype : 'textarea',
                        readOnly : true,
                        value : selectedProfiles.join('\r\n'),
                        fieldLabel : selectionCount + ' ' + i18n.gettext('Security Profile') + (selectionCount > 1 ? 's' : '')
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
                    me.cloneProfiles();
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        getParamsForCloning(data, item) {
            return {
                name : item.name
            }
        },

        cloneProfiles() {
            let view = this.getView(),
                profiles = Ext.Array.map(view.getSelection(), select => ({
                    id : select.getId(),
                    name : select.get('name') + criterion.Consts.CLONE_PREFIX
                }));

            this.actCloneItems(
                i18n.gettext('Clone security profile') + (profiles.length > 1 ? 's' : ''),
                criterion.consts.Api.API.SECURITY_PROFILE_CLONE,
                {},
                null,
                profiles
            );
        }

    };

});
