Ext.define('criterion.ux.form.field.HtmlEditor', function() {

    return {

        alias : [
            'widget.criterion_htmleditor'
        ],

        extend : 'Ext.form.field.HtmlEditor',

        disableDirtyCheck : true,
        autoHeight : false,
        enableExtListMenu : false,

        defaultBindProperty : 'value',

        buttonTips : {
            bold : {
                title : i18n.gettext('Bold (Ctrl+B)'),
                text : i18n.gettext('Make the selected text bold.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic : {
                title : i18n.gettext('Italic (Ctrl+I)'),
                text : i18n.gettext('Make the selected text italic.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline : {
                title : i18n.gettext('Underline (Ctrl+U)'),
                text : i18n.gettext('Underline the selected text.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize : {
                title : i18n.gettext('Grow Text'),
                text : i18n.gettext('Increase the font size.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize : {
                title : i18n.gettext('Shrink Text'),
                text : i18n.gettext('Decrease the font size.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor : {
                title : i18n.gettext('Text Highlight Color'),
                text : i18n.gettext('Change the background color of the selected text.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor : {
                title : i18n.gettext('Font Color'),
                text : i18n.gettext('Change the color of the selected text.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft : {
                title : i18n.gettext('Align Text Left'),
                text : i18n.gettext('Align text to the left.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter : {
                title : i18n.gettext('Center Text'),
                text : i18n.gettext('Center text in the editor.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright : {
                title : i18n.gettext('Align Text Right'),
                text : i18n.gettext('Align text to the right.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist : {
                title : i18n.gettext('Bullet List'),
                text : i18n.gettext('Start a bulleted list.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist : {
                title : i18n.gettext('Numbered List'),
                text : i18n.gettext('Start a numbered list.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink : {
                title : i18n.gettext('Hyperlink'),
                text : i18n.gettext('Make the selected text a hyperlink.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit : {
                title : i18n.gettext('Source Edit'),
                text : i18n.gettext('Switch to source editing mode.'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },

            extlist : {
                title : i18n.gettext('List'),
                text : i18n.gettext('Extended List'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            },
            addimage : {
                title : i18n.gettext('Image'),
                text : i18n.gettext('Add an Image'),
                cls : Ext.baseCSSPrefix + 'html-editor-tip'
            }
        },

        listeners : {
            beforepush : function(field, html) {
                return field.getEditorBody().innerHTML != html;
            }
        },

        initComponent : function() {
            this.callParent(arguments);

            if (this.autoHeight) {
                this.on('change', this.checkAutoHeight, this);
            }
        },

        checkAutoHeight : function() {
            var body = this.getEditorBody(),
                bodyComponent = Ext.get(body);

            this.setHeight(this.textareaEl.dom.value ? bodyComponent.dom.offsetHeight : 0);
        },

        markInvalid : function() {
            this.bodyEl.addCls(Ext.baseCSSPrefix + 'form-invalid')
        },

        clearInvalid : function() {
            this.bodyEl.removeCls(Ext.baseCSSPrefix + 'form-invalid')
        },

        getStylesList : function() {
            let styles = ['font-family', 'background-image', 'background-repeat', 'background-color', 'color'];

            if (!Ext.isWebKit) {
                styles.push('font-size');
            }

            return styles;
        },

        addImage() {
            let me = this,
                uploader;

            uploader = Ext.create('criterion.view.common.PictureUploader', {
                title : i18n.gettext('Add an Image'),
                modal : true,
                useCrop : false,
                url : null,
                imageSize : criterion.Consts.FEED_IMAGE_SIZE,
                viewModel : {
                    data : {
                        saveBtnText : i18n.gettext('Add')
                    }
                }
            });

            uploader.on('save', function(file, image) {
                me.relayCmd('insertHTML', '<img src="' + image + '" alt="" />');
            })
            uploader.show();
        },

        /* Fixing D2-10753. Webkit document.executeCommand('font-size', ...) apply font-size style from editor body, that brokes <font size=x>
            so removing font-size style from editor body by getStylesList()
         */
        initEditor : function() {
            var me = this,
                dbody = me.getEditorBody(),
                ss = me.textareaEl.getStyle(me.getStylesList()), /// <---- CHANGED THIS
                doc = me.getDoc(),
                docEl = Ext.get(doc),
                fn;

            ss['background-attachment'] = 'fixed'; // w3c
            dbody.bgProperties = 'fixed'; // ie

            Ext.DomHelper.applyStyles(dbody, ss);

            if (docEl) {
                try {
                    docEl.clearListeners();
                } catch (e) {
                }

                /*
                 * Update toolbar state on a buffered timer when document changes.
                 */
                fn = Ext.Function.createBuffered(me.updateToolbar, 100, me);
                docEl.on({
                    mousedown : fn,
                    dblclick : fn,
                    click : fn,
                    keyup : fn,
                    delegated : false
                });

                // These events need to be relayed from the inner document (where they stop
                // bubbling) up to the outer document. This has to be done at the DOM level so
                // the event reaches listeners on elements like the document body. The effected
                // mechanisms that depend on this bubbling behavior are listed to the right
                // of the event.
                fn = me.onRelayedEvent;
                docEl.on({
                    mousedown : fn, // menu dismisal (MenuManager) and Window onMouseDown (toFront)
                    mousemove : fn, // window resize drag detection
                    mouseup : fn,   // window resize termination
                    click : fn,     // not sure, but just to be safe
                    dblclick : fn,  // not sure again
                    delegated : false,
                    scope : me
                });

                if (Ext.isGecko) {
                    docEl.on('keypress', me.applyCommand, me);
                }

                if (me.fixKeys) {
                    docEl.on('keydown', me.fixKeys, me, {delegated : false});
                }

                if (me.fixKeysAfter) {
                    docEl.on('keyup', me.fixKeysAfter, me, {delegated : false});
                }

                if (Ext.isIE9) {
                    Ext.get(doc.documentElement).on('focus', me.focus, me);
                }

                // In old IEs, clicking on a toolbar button shifts focus from iframe
                // and it loses selection. To avoid this, we save current selection
                // and restore it.
                if (Ext.isIE8) {
                    docEl.on('focusout', function() {
                        me.savedSelection = doc.selection.type !== 'None' ? doc.selection.createRange() : null;
                    }, me);

                    docEl.on('focusin', function() {
                        if (me.savedSelection) {
                            me.savedSelection.select();
                        }
                    }, me);
                }

                // We need to be sure we remove all our events from the iframe on unload or we're going to LEAK!
                Ext.getWin().on('unload', me.destroyEditor, me);

                me.initialized = true;
                me.pushValue();
                me.setReadOnly(me.readOnly);
                me.fireEvent('initialize', me);
            }
        },

        getToolbarCfg : function() {
            var me = this,
                items = [], i,
                tipsEnabled = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
                baseCSSPrefix = Ext.baseCSSPrefix,
                fontSelectItem, undef;

            function btn(id, toggle, handler) {
                return Ext.merge({
                    itemId : id,
                    cls : baseCSSPrefix + 'btn-icon',
                    iconCls : baseCSSPrefix + 'edit-' + id,
                    enableToggle : toggle !== false,
                    scope : me,
                    handler : handler || me.relayBtnCmd,
                    clickEvent : 'mousedown',
                    tooltip : tipsEnabled ? me.buttonTips[id] : undef,
                    overflowText : me.buttonTips[id].title || undef,
                    tabIndex : -1
                }, me.buttonDefaults);
            }

            if (me.enableFont) {
                fontSelectItem = Ext.widget('component', {
                    itemId : 'fontSelect',
                    renderTpl : [
                        '<select id="{id}-selectEl" data-ref="selectEl" class="' + baseCSSPrefix + 'font-select">',
                        '</select>'
                    ],
                    childEls : ['selectEl'],
                    afterRender : function() {
                        me.fontSelect = this.selectEl;
                        Ext.Component.prototype.afterRender.apply(this, arguments);
                    },
                    onDisable : function() {
                        var selectEl = this.selectEl;
                        if (selectEl) {
                            selectEl.dom.disabled = true;
                        }
                        Ext.Component.prototype.onDisable.apply(this, arguments);
                    },
                    onEnable : function() {
                        var selectEl = this.selectEl;
                        if (selectEl) {
                            selectEl.dom.disabled = false;
                        }
                        Ext.Component.prototype.onEnable.apply(this, arguments);
                    },
                    listeners : {
                        change : function() {
                            me.win.focus();
                            me.relayCmd('fontName', me.fontSelect.dom.value);
                            me.deferFocus();
                        },
                        element : 'selectEl'
                    }
                });

                items.push(
                    fontSelectItem,
                    '-'
                );
            }

            if (me.enableAddImage) {
                items.push(
                    btn('addimage', false, me.addImage),
                    '-'
                );
            }

            if (me.enableFormat) {
                items.push(
                    btn('bold'),
                    btn('italic'),
                    btn('underline')
                );
            }

            if (me.enableFontSize) {
                items.push(
                    '-',
                    btn('increasefontsize', false, me.adjustFont),
                    btn('decreasefontsize', false, me.adjustFont)
                );
            }

            if (me.enableColors) {
                items.push(
                    '-', Ext.merge({
                        itemId : 'forecolor',
                        cls : baseCSSPrefix + 'btn-icon',
                        iconCls : baseCSSPrefix + 'edit-forecolor',
                        overflowText : me.buttonTips.forecolor.title,
                        tooltip : tipsEnabled ? me.buttonTips.forecolor || undef : undef,
                        tabIndex : -1,
                        menu : Ext.widget('menu', {
                            plain : true,

                            items : [{
                                xtype : 'colorpicker',
                                allowReselect : true,
                                focus : Ext.emptyFn,
                                value : '000000',
                                plain : true,
                                clickEvent : 'mousedown',
                                handler : function(cp, color) {
                                    me.relayCmd('forecolor', Ext.isWebKit || Ext.isIE || Ext.isEdge ? '#' + color : color);
                                    this.up('menu').hide();
                                }
                            }]
                        })
                    }, me.buttonDefaults), Ext.merge({
                        itemId : 'backcolor',
                        cls : baseCSSPrefix + 'btn-icon',
                        iconCls : baseCSSPrefix + 'edit-backcolor',
                        overflowText : me.buttonTips.backcolor.title,
                        tooltip : tipsEnabled ? me.buttonTips.backcolor || undef : undef,
                        tabIndex : -1,
                        menu : Ext.widget('menu', {
                            plain : true,

                            items : [{
                                xtype : 'colorpicker',
                                focus : Ext.emptyFn,
                                value : 'FFFFFF',
                                plain : true,
                                allowReselect : true,
                                clickEvent : 'mousedown',
                                handler : function(cp, color) {
                                    if (Ext.isGecko) {
                                        me.execCmd('useCSS', false);
                                        me.execCmd('hilitecolor', '#' + color);
                                        me.execCmd('useCSS', true);
                                        me.deferFocus();
                                    } else {
                                        me.relayCmd(Ext.isOpera ? 'hilitecolor' : 'backcolor', Ext.isWebKit || Ext.isIE || Ext.isEdge || Ext.isOpera ? '#' + color : color);
                                    }
                                    this.up('menu').hide();
                                }
                            }]
                        })
                    }, me.buttonDefaults)
                );
            }

            if (me.enableAlignments) {
                items.push(
                    '-',
                    btn('justifyleft'),
                    btn('justifycenter'),
                    btn('justifyright')
                );
            }

            if (me.enableLinks) {
                items.push(
                    '-',
                    btn('createlink', false, me.createLink)
                );
            }

            if (me.enableLists) {
                items.push(
                    '-',
                    btn('insertorderedlist'),
                    btn('insertunorderedlist')
                );
            }

            // <--- changed this
            if (me.enableExtListMenu) {
                items.push(
                    '-',
                    Ext.merge({
                        itemId : 'extlist',
                        cls : baseCSSPrefix + 'btn-icon',
                        iconCls : baseCSSPrefix + 'edit-extlist',
                        overflowText : me.buttonTips.extlist.title,
                        tooltip : tipsEnabled ? me.buttonTips.extlist || undef : undef,
                        tabIndex : -1,
                        menu : Ext.widget('menu', {
                            plain : true,

                            items : [
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Bullet List'),
                                    textAlign : 'left',
                                    cls : 'criterion-btn-transparent ' + baseCSSPrefix + 'htmleditor-menu-btn',
                                    glyph : criterion.consts.Glyph['android-more-vertical'],
                                    scale : 'small' ,
                                    handler : function(cp, color) {
                                        me.relayCmd('insertunorderedlist');

                                        this.up('menu').hide();
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Indent'),
                                    textAlign : 'left',
                                    cls : 'criterion-btn-transparent ' + baseCSSPrefix + 'htmleditor-menu-btn',
                                    glyph : criterion.consts.Glyph['ios7-arrow-forward'],
                                    scale : 'small',
                                    handler : function(cp, color) {
                                        me.relayCmd('indent');

                                        this.up('menu').hide();
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Outdent'),
                                    textAlign : 'left',
                                    cls : 'criterion-btn-transparent ' + baseCSSPrefix + 'htmleditor-menu-btn',
                                    glyph : criterion.consts.Glyph['ios7-arrow-back'],
                                    scale : 'small',
                                    handler : function(cp, color) {
                                        me.relayCmd('outdent');

                                        this.up('menu').hide();
                                    }
                                }
                            ]
                        })
                    }, me.buttonDefaults)
                );
            }
            // /

            if (me.enableSourceEdit) {
                items.push(
                    '-',
                    btn('sourceedit', true, function() {
                        me.toggleSourceEdit(!me.sourceEditMode);
                    })
                );
            }

            // Everything starts disabled.
            for (i = 0; i < items.length; i++) {
                if (items[i].itemId !== 'sourceedit') {
                    items[i].disabled = true;
                }
            }

            // build the toolbar
            // Automatically rendered in Component.afterRender's renderChildren call
            return {
                xtype : 'toolbar',
                defaultButtonUI : me.defaultButtonUI,
                cls : Ext.baseCSSPrefix + 'html-editor-tb',
                enableOverflow : true,
                items : items,

                // stop form submits
                listeners : {
                    click : function(e) {
                        e.preventDefault();
                    },
                    element : 'el'
                }
            };
        }

    }
});
