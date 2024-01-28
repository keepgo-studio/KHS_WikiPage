import Delimiter from "@editorjs/delimiter";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";

export default {
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a Header',
      levels: [2, 3, 4],
      defaultLevel: 2,      
    },
    inlineToolbar: true
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  delimiter: Delimiter,
}