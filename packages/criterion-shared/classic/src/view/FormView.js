Ext.define('criterion.view.FormView', function() {

    /**
     * @event save
     * Fired when form was saved.
     * @param {Ext.data.Model}  record
     */

    /**
     * @event cancel
     * Fired when form editing was canceled.
     * @param {Ext.Component}  this
     * @param {Ext.data.Model}  record
     */

    /**
     * @event delete
     * Fired when was delete button was clicked. Actual delete depends on {@link #externalUpdate} configuration.
     * @param {Ext.Component}  this
     * @param {Ext.data.Model}  record
     */

    return {
        alias : [
            'widget.criterion_formview'
        ],

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.FormView'
        ],

        controller : {
            type : 'criterion_formview',
            externalUpdate : true
        },

        viewModel : {
            data : {
                record : null,
                blockedState : false, // for blocking form elements + buttons,
                hideCancel : false,
                hideNavigationBtns : false
            },

            formulas : {
                isPhantom : data => data('record') && data('record').phantom,

                submitBtnText : data => {
                    return data('blockedState') ? i18n.gettext('Please wait...') : i18n.gettext('Save');
                },
                cancelBtnText : () => i18n.gettext('Cancel'),
                hideSave : () => false,
                hideDeleteInt : data => {
                    let isPhantom = data('isPhantom');

                    return !data('record') || (isPhantom && data('record').$relatedPhantom ? false : isPhantom);
                },
                hideDelete : data => data('hideDeleteInt'),
                disableSave : data => data('blockedState'),
                disableDelete : data => data('blockedState')
            }
        },

        config : {
            noButtons : false,
            allowDelete : false,
            allowNavigate : true
        },

        modelValidation : true,

        autoScroll : true,
        border : false,

        setButtonConfig : function() {
            let buttons = [];

            if (this.getNoButtons()) {
                return;
            }

            if (this.getAllowDelete()) {
                buttons.push(
                    {
                        xtype : 'button',
                        reference : 'delete',
                        text : i18n.gettext('Delete'),
                        cls : 'criterion-btn-remove',
                        listeners : {
                            click : 'handleDeleteClick'
                        },
                        hidden : true,
                        bind : {
                            disabled : '{disableDelete}',
                            hidden : '{hideDelete}'
                        }
                    },
                    '->'
                );
            }

            buttons.push(
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    },
                    tooltip : i18n.gettext('Save') + '&nbsp;<span class="fs-08 criterion-darken-gray">(Alt&nbsp;+&nbsp;Shift&nbsp;+&nbsp;S)<span>'
                }
            );

            this.buttons = buttons;
        },

        initComponent : function() {
            let me = this;

            this.setButtonConfig();

            this.callParent(arguments);

            if (this.getAllowNavigate()) {
                this.setKeyNavigation();

                Ext.defer(() => {
                    let header = me.getHeader();

                    header && !header.destroyed && me._connectedView && Ext.isFunction(header.add) && header.add([
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-transparent',
                            padding : 0,
                            glyph : criterion.consts.Glyph['ios7-arrow-left'],
                            scale : 'small',
                            hidden : true,
                            bind : {
                                hidden : '{!transitionInfo.allowPrev || hideNavigationBtns}'
                            },
                            handler : 'navLeftHandler',
                            tooltipType : 'title',
                            tooltip : i18n.gettext('Previous') + ' (Shift + <)'
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-transparent',
                            margin : '0 5 0 5',
                            padding : 0,
                            glyph : criterion.consts.Glyph['ios7-arrow-right'],
                            scale : 'small',
                            hidden : true,
                            bind : {
                                hidden : '{!transitionInfo.allowNext || hideNavigationBtns}'
                            },
                            handler : 'navRightHandler',
                            tooltipType : 'title',
                            tooltip : i18n.gettext('Next') + ' (Shift + >)'
                        }
                    ]);
                }, 100);
            }
        },

        destroy() {
            Ext.destroy(this.keyNav);
            this.callParent();
        },

        setKeyNavigation() {
            let controller = this.getController();

            this.keyNav = new Ext.util.KeyMap({
                target : window,
                ignoreInputFields : true,
                binding : [
                    {
                        key : 's',
                        shift : true,
                        alt : true,
                        handler : controller.navSaveHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.ESC,
                        handler : controller.navCancelHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.DELETE,
                        handler : controller.navDeleteHandler,
                        scope : controller
                    },

                    {
                        key : Ext.event.Event.RIGHT,
                        shift : true,
                        handler : controller.navRightHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.LEFT,
                        shift : true,
                        handler : controller.navLeftHandler,
                        scope : controller
                    }
                ]
            });
        },

        loadRecord : function(record) {
            let vm = this.getViewModel();

            if (!vm) {
                return;
            }

            vm.set('record', record);

            this.callParent(arguments);

            this.getController() && this.getController().handleAfterRecordLoad(record);
        },

        show : function() {
            this.callParent(arguments);

            this.focusFirstField();
        }

    };
});
