/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import ExportPdf from '@ckeditor/ckeditor5-export-pdf/src/exportpdf.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	CloudServices,
	Essentials,
	ExportPdf,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
	ImageInsert,
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'insertImage',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo',
			'exportPdf'
		]
	},
	language: 'de',
	image: {
		toolbar: [
			'imageTextAlternative',
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	licenseKey: 'ftaKC8uG4JLIlq8GIHuTaiyu7Et0vFwTjS7scuOeh9NknLcbVsfobIIHxybD',
	exportPdf: {
		tokenUrl: 'https://87398.cke-cs.com/token/dev/859bdd75b1f4c8100b86b285e848c31e00f578624d3231f6d79b59962261?limit=10',
		stylesheets: [
			// NOTE: Only external stylesheets can be loaded so far 
			// FIXME: Add support for loading the existing local stylesheets (pdf-style.css, pdf-fonts.css)
			// '../src/styles/pdf-style.css',
			'https://raw.githubusercontent.com/diethardsteiner/css-for-print/master/sample1.css',
			// './src/styles/pdf-fonts.css',
			'EDITOR_STYLES',
		],
		fileName: 'web-notes-export.pdf',
		converterOptions: {
			format: 'A4',
			margin_top: '20mm',
			margin_bottom: '20mm',
			margin_right: '12mm',
			margin_left: '12mm',
			page_orientation: 'portrait'
		},

		// NOTE: The following option is only needed if we want to have a watermark
		// dataCallback: ( editor ) => {
		// 	return `
		// 		${ editor.getData() }
		// 		<div class="watermark">web-notes export</div>
		// 	`;
		// },
	
	}

};

export default Editor;
