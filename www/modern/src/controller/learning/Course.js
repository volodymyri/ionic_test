Ext.define('ess.controller.learning.Course', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_learning_course',

        handleBack : function() {
            this.getView().fireEvent('goBack');
        },

        handleStart : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_START, vm.get('record.id'))
            }).then(function(url) {
                view.fireEvent('showFrame', url, vm.get('record.name'));
            });
        },

        handleResume : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_RESUME, vm.get('record.id'))
            }).then(function(url) {
                view.fireEvent('showFrame', url, vm.get('record.name'));
            });
        },

        handleRegister : function() {
            var me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_REGISTER, vm.get('record.id'))
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.getView().fireEvent('goBack');
            });
        },

        handleWithdraw : function() {
            var me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_CANCEL, vm.get('record.id'))
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.getView().fireEvent('goBack');
            });
        },

        handleAttend : function() {
            var me = this,
                vm = this.getViewModel();

            Ext.create('Ext.MessageBox', {
                listeners : {
                    show : function(msgBox) {
                        var textfield = msgBox.down('textfield');
                        textfield.focus();
                    }
                }
            }).show({
                ui : 'rounded',
                title : i18n.gettext('Enter the PIN'),
                message : '',
                buttons : [
                    {
                        text : i18n.gettext('Cancel'),
                        itemId : 'no',
                        cls : 'cancel-btn'
                    },
                    {
                        text : i18n.gettext('Attend'),
                        itemId : 'yes'
                    }
                ],
                prompt : {
                    xtype : 'textfield'
                },
                scope : this,
                fn : function(btn, pin) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            method : 'PUT',
                            url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_ATTEND, vm.get('record.id')),
                            jsonData : {
                                pin : pin
                            }
                        }).then(function() {
                            criterion.Utils.toast(i18n.gettext('Successfully'));
                            me.getView().fireEvent('goBack');
                        });
                    }
                }
            });


        },

        handleUnenroll : function() {
            var me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_UNENROLL, vm.get('record.id'))
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.getView().fireEvent('goBack');
            });
        },

        handleRemoveAct : function() {
            var me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_UNENROLL, vm.get('record.id'))
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.getView().fireEvent('goBack');
            });
        },

        handleUnregister : function() {
            var me = this,
                vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                method : 'PUT',
                url : Ext.String.format(criterion.consts.Api.API.LEARNING_COURSE_UNENROLL, vm.get('record.id'))
            }).then(function() {
                criterion.Utils.toast(i18n.gettext('Successfully'));
                me.getView().fireEvent('goBack');
            });
        }
    }
});
