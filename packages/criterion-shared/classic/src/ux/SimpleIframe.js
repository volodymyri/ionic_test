/**
 * TODO Make this component based on {@link Ext.ux.IFrame}
 */

/**
 * A simple ExtJS implementaton of an iframe providing basic functionality.
 * For example:
 *
 * var panel=Ext.create('Ext.ux.SimpleIFrame', {
 *   border: false,
 *   src: 'http://localhost'
 * });
 * panel.setSrc('http://www.sencha.com');
 * panel.reset();
 * panel.reload();
 * panel.getSrc();
 * panel.update('<div><b>Some Content....</b></div>');
 * panel.destroy();
 *
 * @author Conor Armstrong
 */
Ext.define('criterion.ux.SimpleIframe', {
    alternateClassName : [
        'criterion.SimpleIframe',
        'criterion.ux.SimpleIframe'
    ],

    requires : [
        'Ext.util.Base64'
    ],

    alias : 'widget.criterion_simple_iframe',

    extend : 'Ext.Panel',

    src : 'about:blank',
    loadingText : i18n.gettext('Loading ...'),

    initComponent : function() {
        this.updateHTML();
        this.callParent(arguments);
    },

    updateHTML : function() {
        this.html = '<form id="iframe-' + this.id + '-form" action="" method="post" target="iframe-' + this.id + '" enctype="multipart/form-data">' +
        '<input id="iframe-' + this.id + '-options" type="hidden" value="" name="options"/></form>' +
        '<iframe id="iframe-' + this.id + '" name="iframe-' + this.id + '"' +
        ' style="overflow:auto;width:100%;height:100%;"' +
        ' frameborder="0" ' +
        ' src="' + this.src + '"' +
        '></iframe>';
    },

    reload : function() {
        this.setSrc(this.src);
    },

    reset : function() {
        var iframe = this.getDOM(),
            iframeParent = iframe.parentNode;

        if (iframe && iframeParent) {
            iframe.src = 'about:blank';
            iframe.parentNode.removeChild(iframe);
        }

        iframe = document.createElement('iframe');
        iframe.frameBorder = 0;
        iframe.src = this.src;
        iframe.id = 'iframe-' + this.id;
        iframe.style.overflow = 'auto';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframeParent.appendChild(iframe);
    },

    setSrc : function(src, options) {
        var iframe = this.getDOM(),
            form = this.getForm(),
            optionsInput = this.getFormInput();

        this.src = src;

        iframe.src = 'about:blank';

        Ext.Function.defer(function() {
            if (iframe && !options) {
                iframe.src = src;
            }
            if (form && options) {
                form.action = src;
                optionsInput.value = options;
                form.submit();
            }
        }, 100);
    },

    setSrcDoc : function(html) {
        var iframe = this.getDOM();

        srcDoc.set(iframe, html);
    },

    getSrc : function() {
        return this.src;
    },

    flush : function() {
        this.setSrc('about:blank');
    },

    getDOM : function() {
        return document.getElementById('iframe-' + this.id);
    },

    getForm : function() {
        return document.getElementById('iframe-' + this.id + '-form');
    },
    getFormInput : function() {
        return document.getElementById('iframe-' + this.id + '-options');
    },

    getDocument : function() {
        var iframe = this.getDOM();

        iframe = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
        return iframe.document;
    },

    getWindow : function() {
        var iframe = this.getDOM();

        return iframe.contentWindow || iframe;
    },

    destroy : function() {
        var iframe = this.getDOM();

        if (iframe && iframe.parentNode) {
            iframe.src = 'about:blank';
            iframe.parentNode.removeChild(iframe);
        }
        this.callParent(arguments);
    },

    //call this to manually change content.
    //don't call until component is rendered!!!
    update : function(content) {
        var doc;

        this.setSrc('about:blank');
        try {
            doc = this.getDocument();
            doc.open();
            doc.write(content);
            doc.close();
        } catch (err) {
            // reset if any permission issues
            this.reset();
            doc = this.getDocument();
            doc.open();
            doc.write(content);
            doc.close();
        }
    },

    setMainPageStyle : function() {
        var me = this;

        Ext.each(Ext.manifest.css, function(oCss) {
            me.appendStylesheet(oCss.path, 'print');
        });
    },

    appendStylesheet : function(path, media) {
        var iframeDoc = this.getDocument(),
            iframeHead = iframeDoc.getElementsByTagName('head').item(0),
            styleBlock = iframeDoc.createElement('link');

        styleBlock.type = 'text/css';
        styleBlock.rel = 'stylesheet';
        styleBlock.media = media || 'screen';
        styleBlock.href = path;

        iframeHead.appendChild(styleBlock);
    }
});
