Ext.define('criterion.ux.form.field.CodeEditor', {

    alias : 'widget.criterion_code_editor_field',

    extend : 'Ext.form.field.Base',

    fieldSubTpl : [
        '<div id="{aceWrapperDivId}" ',
        'style="min-height: {minHeight}px; height: {height}"',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        '<tpl if="fieldCls"> class="{fieldCls}"</tpl>',
        '>',
        '<div id="{aceDivId}" ',
        'style="min-height: {minHeight}px; height: {height}"',
        '></div>',
        '</div>',
    ],

    defaultAceEditorOptions : {
        highlightActiveLine : true,
        showPrintMargin : false,
        autoScrollEditorIntoView : true,
        copyWithEmptySelection : true,

        mode : 'ace/mode/sql',
        theme : 'ace/theme/github'
    },

    aceOptions : {},
    value : '',
    lastValue : '',

    minHeight : 58,
    allowBlank : true,
    blankText : i18n.gettext('This field is required'),

    extraFieldBodyCls : Ext.baseCSSPrefix + 'form-text-wrap-default',
    invalidCls : Ext.baseCSSPrefix + 'form-invalid-ace-field-default',

    onResizeCmp() {
        this.getAceEditor().resize();
    },

    initComponent() {
        if (!window['ace']) {
            console && console.warn('[WARN] the ace editor main class is absent!');
            return;
        }

        this.onResizeCmp = Ext.Function.createBuffered(this.onResizeCmp, 100, this);

        Ext.GlobalEvents.on('resizeMainView', this.onResizeCmp, this);

        this.on('afterrender', this.initAceEditor, this);

        this.callParent(arguments);
    },

    getAceEditor() {
        if (!this.aceEditor) {
            window['ace'].require('ace/ext/language_tools');
            this.aceEditor = window['ace'].edit(this.getAceDivId());
        }

        return this.aceEditor;
    },

    initAceEditor() {
        let me = this,
            aceEditor = this.getAceEditor(),
            aceOptions = Ext.Object.merge(
                this.defaultAceEditorOptions,
                this.aceOptions
            ),
            session = aceEditor.getSession();

        aceEditor.setOptions(aceOptions);
        aceEditor.setTheme(this.aceOptions.theme);

        session.setValue(this.getValue());
        session.setMode(this.aceOptions.mode);

        session.on('change', function() {
            me.onChange.call(me);
            me.onResizeCmp();
        });
    },

    onChange() {
        this.lastValue = this.value;
        this.value = this.getAceEditor().getSession().getValue();

        this.isCodeValid();

        if (this.value !== this.lastValue) {
            this.fireEvent('change', this, this.value, this.lastValue);
            this.publishState('value', this.value);
        }

        this.callParent([this.value, this.lastValue]);
    },

    isCodeValid() {
        let me = this,
            annotations = this.getAceEditor().getSession().getAnnotations();

        if (annotations.length > 0) {
            this.fireEvent('annotation', annotations);
        }

        Ext.Array.each(annotations, annotation => {
            if (annotation.type === 'info') {
                me.fireEvent('info_annotation');

                return false;
            }
        });

        Ext.Array.each(annotations, annotation => {
            if (annotation.type === 'error') {
                me.fireEvent('error_annotation');

                return false;
            }
        });

        Ext.Array.each(annotations, annotation => {
            if (annotation.type === 'warning') {
                me.fireEvent('warning_annotation');

                return false;
            }
        });
    },

    getValue() {
        return this.value;
    },

    getSubmitValue() {
        return this.value.toString();
    },

    setStartEditorValue(value = '') {
        if (this.rendered) {
            this.getAceEditor().getSession().setValue(value);
        }

        this.setValue(value);
    },

    getSubTplData(fieldData) {
        fieldData.aceWrapperDivId = this.getAceWrapperDivId();
        fieldData.aceDivId = this.getAceDivId();
        fieldData.height = this.height || this.minHeight;
        fieldData.minHeight = this.minHeight;
        fieldData.fieldCls = this.fieldCls;

        return fieldData;
    },

    getAceWrapperDivId() {
        return this.getId() + '-aceDivWrapperId';
    },

    getAceWrapperEl() {
        return Ext.get(this.getAceWrapperDivId());
    },

    getAceDivId() {
        return this.getId() + '-aceDivId';
    },

    getErrors(value = '') {
        let errors = this.callParent([value]);

        if (!this.allowBlank && this.value && this.value.length === 0) {
            errors.push(this.blankText);
        }

        if (errors && errors.length > 0) {
            this.getAceWrapperEl().addCls(this.invalidCls);
        } else {
            this.getAceWrapperEl().removeCls(this.invalidCls);
        }

        return errors;
    }
});
