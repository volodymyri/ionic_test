Ext.define('criterion.view.ess.community.PostEditor', {

    extend : 'criterion.ux.Panel',

    requires : [
        'criterion.controller.ess.community.PostEditor',
        'criterion.ux.DataList',
        'criterion.ux.form.field.MultiFileButton',
        'criterion.view.ess.community.HtmlEditor'
    ],

    alias : 'widget.criterion_ess_community_post_editor',

    viewModel : {
        /**
         * @type criterion.model.community.Posting|null
         */

        data : {
            posting : null
        },

        formulas : {
            saveBtnLabel : function(vmget) {
                return vmget('isPhantom') ? i18n.gettext('Post') : i18n.gettext('Save')
            },
            isDirty : {
                bind : {
                    bindTo : '{posting}',
                    deep : true
                },
                get : function(record) {
                    return record ? record.dirty : false
                }
            },
            isPhantom : {
                bind : {
                    bindTo : '{posting}',
                    deep : true
                },
                get : function(record) {
                    return record ? record.phantom : true
                }
            }
        }
    },

    controller : {
        type : 'criterion_ess_community_post_editor'
    },

    listeners : {
        addAttachment : 'onAddAttachment',
        show : 'handleEditorShow',
        focus : 'handleFocus'
    },

    dockedItems : [
        {
            xtype : 'criterion_datalist',
            dock : 'bottom',
            reference : 'attachmentsView',
            bind : {
                store : '{posting.attachments}'
            },

            displayField : 'fileName'

        },
        {
            xtype : 'toolbar',
            dock : 'bottom',
            weight : 1,
            margin : 0,
            padding : 10,
            cls : 'post-editor-bottom-bar',
            default : {
                margin : 0
            },
            items : [
                {
                    cls : ['criterion-btn-ess-new-light', 'icon-only'],
                    glyph : criterion.consts.Glyph['ribbon-b'],
                    listeners : {
                        click : 'onBadgeChange'
                    }
                },
                {
                    xtype : 'criterion_multi_filebutton',
                    cls : ['criterion-btn-ess-new-light', 'icon-only'],
                    glyph : criterion.consts.Glyph['paperclip'],
                    reference : 'attachmentFileButton',
                    listeners : {
                        afterrender : function(cmp) {
                            cmp.fileInputEl.on('change', function(event) {
                                cmp.up('criterion_ess_community_post_editor').fireEvent('addAttachment', event);
                            });
                        }
                    }
                },
                {
                    xtype : 'combobox',
                    cls : [
                        'simple-text-combo',
                        'grey-text',
                        'community-selector'
                    ],
                    margin : '0 0 0 10',
                    reference : 'communitiesCombo',
                    bind : {
                        store : '{communities}',
                        value : '{posting.communityId}',
                        hidden : '{!isPhantom}'
                    },
                    hidden : true,
                    displayField : 'name',
                    valueField : 'id',
                    queryMode : 'local',
                    editable : false,
                    emptyText : i18n.gettext('Choose Community'),
                    msgTarget : 'qtip',
                    allowBlank : false,
                    listeners : {
                        show : function(combo) {
                            combo.setWidth(Ext.util.TextMetrics.measure(combo.inputEl, combo.emptyText).width + 46);
                        },
                        change : function(combo, newVal, val) {
                            var record = combo.store.getById(newVal),
                                name = record ? record.get('name') : combo.emptyText,
                                textSize = name && Ext.util.TextMetrics.measure(combo.inputEl, name),
                                vm = combo.up('criterion_ess_community_post_editor').getViewModel(),
                                wrapper = combo.getEl().query('.x-form-text-wrap', false);

                            if (textSize) {
                                combo.setWidth(textSize.width + ((record && record.get('iconId')) ? 56 : 46));
                            }

                            wrapper.length && wrapper[0].setStyle({
                                padding : record ? '0 5px 0 15px' : 0,
                                background : record ? record.get('iconId') && 'url("' + record.get('imageUrl') + '") no-repeat left center' : 'none',
                                backgroundSize : '14px'
                            });

                            if (!record) {
                                combo.setStyle('padding-top', 0);
                                return;
                            }

                            combo.setStyle('padding-top', '1px');

                            if (val && newVal && (val !== newVal)) {
                                // reset
                                vm.set('posting.badgeId', null);
                                vm.set('posting.badgeRecipientId', null);
                                vm.set('posting.badgeRecipientName', null);
                            }
                        }
                    }
                },
                '->',
                {
                    ui : 'light',
                    text : i18n.gettext('Cancel'),
                    margin : '0 10 0 0',
                    listeners : {
                        click : 'onCancel'
                    }
                },
                {
                    ui : 'remove',
                    text : i18n.gettext('Delete'),
                    margin : '0 10 0 0',
                    hidden : true,
                    bind : {
                        hidden : '{isPhantom}'
                    },
                    listeners : {
                        click : 'onDelete'
                    }
                },
                {
                    bind : {
                        text : '{saveBtnLabel}'
                    },
                    listeners : {
                        click : 'onSave'
                    }
                }
            ]
        }
    ],

    layout : 'hbox',

    items : [
        {
            xtype : 'criterion_ess_community_html_editor',
            reference : 'htmlEditor',
            bind : {
                value : '{posting.message}',
                communityId : '{posting.communityId}'
            },
            enableFont : false,
            enableAddImage : true,
            bodyPadding : 10,
            margin : 0,
            flex : 1,
            frame : false,
            height : 150
        },
        {
            xtype : 'component',
            cls : 'badge-container',
            tpl : new Ext.XTemplate(
                '<div class="badge-container-header"></div>',
                '<div class="content-badge">' +
                '<tpl if="badgeId">' +
                '<img src="{badgeImageUrl}" alt="" />' +
                '<p>{badgeRecipientName}</p>' +
                '</tpl>' +
                '</div>'
            ),
            width : 80,
            bind : {
                data : {
                    badgeId : '{posting.badgeId}',
                    badgeImageUrl : '{posting.badgeImageUrl}',
                    badgeRecipientName : '{posting.badgeRecipientName}'
                },
                hidden : '{!posting.badgeId}'
            }
        }
    ],

    selectCommunity : function(community) {
        community && this.down('[reference=communitiesCombo]').select(community);
    }
});
