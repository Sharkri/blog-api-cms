import { forwardRef } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

type Props = {
  onChange: (html: string) => void;
  value: string;
};

const Editor = forwardRef<HTMLDivElement, Props>(({ onChange, value }, ref) => {
  return (
    <div ref={ref}>
      <TinyMCEEditor
        apiKey="lbbny201yfmx5l230jnqz3xe98l42841oju63ueb3bvsbdic"
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
          height: 696,
        }}
        onEditorChange={onChange}
        value={value}
      />
    </div>
  );
});

export default Editor;
