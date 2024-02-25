import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const Editor = ({
  placeholder,
  onChange,
  value,
}: {
  placeholder?: string;
  onChange: (html: string) => void;
  value: string;
}) => {
  return (
    <div>
      <ReactQuill
        theme="snow"
        onChange={onChange}
        value={value}
        modules={modules}
        formats={formats}
        bounds={".app"}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Editor;
