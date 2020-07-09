Ext.define('criterion.ux.form.field.plugin.InputMask', {
    extend : 'Ext.plugin.Abstract',
    alias : 'plugin.inputmask',

    pluginId : 'inputmask',

    mixins : {
        observable : 'Ext.util.Observable'
    },

    /**
     * Field listeners, attached by the plugin.
     * @private
     */
    listeners : false,

    /**
     * Listener on underlying DOM element.
     * @private
     */
    onRenderListener : null,

    constructor : function(settings) {
        var me = this;

        settings = settings || {};
        var config = {
            pasteEventName : (Ext.isIE ? 'paste' : 'input'),
            iPhone : (window.orientation != undefined),
            mask : {
                definitions : criterion.Consts.FIELD_FORMAT_TYPE_DEFINITIONS,
                dataName : 'rawMaskFn'
            },
            format : settings.format,
            settings : settings
        };

        me.callParent([config]);
        me.mixins.observable.constructor.call(me);
    },

    jqmap : function(array, callback) {
        var result = [];
        Ext.Array.each(array, function(item, index) {
            var intermediate = callback(index, item);
            if (intermediate) {
                if (Ext.isArray(intermediate)) {
                    for (var i = 0; i < intermediate.length; i++) {
                        this.push(intermediate[i]);
                    }
                }
                else {
                    this.push(intermediate);
                }
            }
        }, result);
        return result;
    },

    init : function() {
        var me = this,
            field = this.getCmp();

        if (me.destroyed) {
            return;
        }

        if (me.field !== field) {
            Ext.Function.interceptAfter(field, "setReadOnly", this.onReadOnlyChange, this);
        }

        me.field = field;
        me.readOnly = field.readOnly;
        field.enableKeyEvents = true;
        Ext.destroy(me.listeners);
        Ext.destroy(me.onRenderListener);

        if (!me.format) {
            if (me.origFunctions) {
                Ext.apply(field, me.origFunctions);
                delete me.origFunctions;
            }
            return;
        }

        var mask = me.format;

        me.settings = Ext.applyIf(me.settings, {
            placeholder : '_',
            completed : null
        });

        me.defs = me.mask.definitions;
        me.tests = [];
        me.partialPosition = mask.length;
        me.firstNonMaskPos = null;

        Ext.Array.each(mask.split(''), function(c, i) {
            if (c == '?') {
                me.format.length--;
                me.partialPosition = i;
            } else if (me.defs[c]) {
                me.tests.push(new RegExp(me.defs[c]));
                if (me.firstNonMaskPos == null)
                    me.firstNonMaskPos = me.tests.length - 1;
            } else {
                me.tests.push(null);
            }
        });

        var input = me.field;

        me.buffer = me.jqmap(mask.split(''), function(i, c) {
            if (c != '?') {
                return me.defs[c] ? me.settings.placeholder : c;
            }
        });
        me.focusText = input.getRawValue();

        input[me.mask.dataName] = function() {
            return me.jqmap(buffer, function(i, c) {
                return tests[i] && c != settings.placeholder ? c : null;
            }).join('');
        };

        if (!input.readOnly) {
            me.listeners = input.on({
                destroyable: true,
                focus : {
                    fn : me.onFocus,
                    scope : me
                },
                blur : {
                    fn : me.onBlur,
                    scope : me
                },
                keydown : {
                    fn : function(f, e) {
                        if (me.keydownEvent(f, e) == false) {
                            e.preventDefault();
                        }
                    },
                    scope : me
                },
                keypress : {
                    fn : function(f, e) {
                        if (me.keypressEvent(f, e) == false) {
                            e.preventDefault();
                        }
                    },
                    scope : me
                },
                render : {
                    fn : this.onRender,
                    scope : me,
                    single : true
                }
            });

            if (input.rendered) {
                me.onRender();
            }
        }

        me.checkVal(); //Perform initial check for existing values

        input.caret = me.caret;

        if (!me.origFunctions) {
            me.origFunctions = {
                getValue : Ext.Function.bind(field.getValue, field),
                setValue : Ext.Function.bind(field.setValue, field)
            };

            Ext.apply(field, {
                getValue : function(v) {
                    return me.prepareValueToExternalWorld();
                },
                setValue : function(v) {
                    me.field.setRawValue('');
                    me.clearBuffer(0, me.format.length);
                    me.prepareValueToInternalWorld(me.settings.preValFn ? me.settings.preValFn(v) : v );
                }
            });
        }
    },

    onRender : function() {
        var input = this.field,
            me = this;

        me.onRenderListener = input.inputEl.on(this.pasteEventName, function() {
            setTimeout(function() {
                input.caret(me.checkVal(true));
            }, 0);
        }, input.inputEl, {destroyable: true})
    },

    caret : function(begin, end) {
        if (this.length == 0) return;
        var el = Ext.get(this.inputId);
        if (typeof begin == 'number') {
            end = (typeof end == 'number') ? end : begin;
            this.selectText(begin, end);
            return this;
        } else {
            if (el.dom.setSelectionRange) {
                begin = el.dom.selectionStart;
                end = el.dom.selectionEnd;
            } else if (document.selection && document.selection.createRange) {
                var range = document.selection.createRange();
                begin = 0 - range.duplicate().moveStart('character', -100000);
                end = begin + range.text.length;
            }
            return {begin : begin, end : end};
        }
    },

    unmask : function() {
        return this.fireEvent('unmask');
    },

    /*===============================================*/

    onBlur : function(f) {
        var input = this.field,
            me = this;

        me.checkVal();
        if (f.getRawValue() != me.focusText) {
            f.fireEvent('change', f.getRawValue(), me.focusText);
            //was f.change();
        }

        if (input.isValid()) {
            input.toggleInvalidCls(false);
        }
    },

    onFocus : function(f) {
        var me = this;

        me.focusText = f.getRawValue();
        var pos = me.checkVal();
        me.writeBuffer();
        var moveCaret = function() {
            if (pos == me.format.length)
                f.caret(0, pos);
            else
                f.caret(pos);
        };

        // due to 'fixes' in ext6.2 need to do this
        setTimeout(moveCaret, 10);
    },

    /*===============================================*/

    seekNext : function(pos) {
        var me = this;

        while (++pos <= me.format.length && !me.tests[pos]);
        return pos;
    },
    seekPrev : function(pos) {
        var me = this;

        while (--pos >= 0 && !me.tests[pos]);
        return pos;
    },

    shiftL : function(begin, end) {
        var me = this;
        if (begin < 0)
            return;
        for (var i = begin, j = me.seekNext(end); i < me.format.length; i++) {
            if (me.tests[i]) {
                if (j < me.format.length && me.tests[i].test(me.buffer[j])) {
                    me.buffer[i] = me.buffer[j];
                    me.buffer[j] = me.settings.placeholder;
                } else
                    break;
                j = me.seekNext(j);
            }
        }
        me.writeBuffer();
        me.field.caret(Math.max(me.firstNonMaskPos, begin));
    },

    shiftR : function(pos) {
        var me = this;

        for (var i = pos, c = me.settings.placeholder; i < me.format.length; i++) {
            if (me.tests[i]) {
                var j = me.seekNext(i);
                var t = me.buffer[i];
                me.buffer[i] = c;
                if (j < me.format.length && me.tests[j].test(t))
                    c = t;
                else
                    break;
            }
        }
    },

    keydownEvent : function(f, e) {
        var me = this;

        var k = e.getKey();

        //backspace, delete, and escape get special treatment
        if (k == 8 || k == 46 || (me.iPhone && k == 127)) {
            var pos = me.field.caret(),
                begin = pos.begin,
                end = pos.end;

            if (end - begin == 0) {
                begin = k != 46 ? me.seekPrev(begin) : (end = me.seekNext(begin - 1));
                end = k == 46 ? me.seekNext(end) : end;
            }
            me.clearBuffer(begin, end);
            me.shiftL(begin, end - 1);

            return false;
        } else if (k == 27) {//escape
            me.field.setRawValue(me.focusText);
            me.field.caret(0, me.checkVal());
            return false;
        }
    },

    keypressEvent : function(f, e) {
        var me = this;

        if (e.charCode == 0) {
            return true;
        }

        var k = e.getCharCode(),
            pos = me.field.caret();
        if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
            return true;
        } else if (k) {
            if (pos.end - pos.begin != 0) {
                me.clearBuffer(pos.begin, pos.end);
                me.shiftL(pos.begin, pos.end - 1);
            }

            var p = me.seekNext(pos.begin - 1);
            if (p < me.format.length) {
                var c = String.fromCharCode(k);
                if (me.tests[p].test(c)) {
                    me.shiftR(p);
                    me.buffer[p] = c;
                    me.writeBuffer();
                    var next = me.seekNext(p);
                    me.field.caret(next);
                    if (me.settings.completed && next >= me.format.length)
                        me.settings.completed.call(f);
                }
            }
            return false;
        }
    },

    clearBuffer : function(start, end) {
        var me = this;

        for (var i = start; i < end && i < me.format.length; i++) {
            if (me.tests[i])
                me.buffer[i] = me.settings.placeholder;
        }
    },

    writeBuffer : function() {
        var me = this;
        return me.field.setRawValue(me.buffer.join(''));
    },

    checkVal : function(allow) {
        var me = this;
        var input = me.field;
        //try to place characters where they belong
        var test = input.getRawValue();
        var lastMatch = -1;
        for (var i = 0, pos = 0; i < me.format.length; i++) {
            if (me.tests[i]) {
                me.buffer[i] = me.settings.placeholder;
                while (pos++ < test.length) {
                    var c = test.charAt(pos - 1);
                    if (me.tests[i].test(c)) {
                        me.buffer[i] = c;
                        lastMatch = i;
                        break;
                    }
                }
                if (pos > test.length)
                    break;
            } else if (me.buffer[i] == test.charAt(pos) && i != me.partialPosition) {
                pos++;
                lastMatch = i;
            }
        }
        if (!allow && lastMatch + 1 < me.partialPosition) {
            input.setRawValue('');
            me.clearBuffer(0, me.format.length);
        } else if (allow || lastMatch + 1 >= me.partialPosition) {
            me.writeBuffer();
            if (!allow) input.setRawValue(input.getRawValue().substring(0, lastMatch + 1));
        }
        return (me.partialPosition ? i : me.firstNonMaskPos);
    },

    prepareValueToExternalWorld : function() {
        var me = this;

        var result = [], valid = true;
        for (var i = 0; i < me.tests.length; i++) {
            if (me.tests[i] != null) {
                result.push(me.buffer[i]);
            }
        }
        return Ext.Array.indexOf(result, me.settings.placeholder) == -1 ? result.join('') : '';
    },

    prepareValueToInternalWorld : function(val) {
        var me = this;

        var p = -1;

        if (val) {
            Ext.Array.each(val.split(''), function(c) {
                p = me.seekNext(p);
                if (me.tests[p] && me.tests[p].test(c)) {
                    me.buffer[p] = c;
                }
            });
            me.writeBuffer();
        }

    },

    /**
     * todo add a way to call this method from owner field
     * @param format
     */
    setFormat : function(format) {
        this.format = format;
        this.init(this.field);
    },

    onReadOnlyChange : function() {
        if (!this.field) {
            return;
        }

        if (this.readOnly !== this.field.readOnly) {
            this.init(this.field);
        }
    }
});
