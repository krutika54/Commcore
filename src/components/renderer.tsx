import Quill from "quill";
import { useEffect, useRef, useState } from "react";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rendererRef.current) return;
    const container = rendererRef.current;

    const temp = document.createElement("div");
    const quill = new Quill(temp, { theme: "snow" });

    quill.enable(false);

    try {
      const contents = JSON.parse(value);
      quill.setContents(contents);

      const isEmptyCheck = quill.getLength() <= 1; // FIXED
      setIsEmpty(isEmptyCheck);

      container.innerHTML = quill.root.innerHTML;
    } catch {
      container.textContent = value;
    }

    return () => {
      container.innerHTML = "";
    };
  }, [value]);

  if (isEmpty) return null;

  return (
    <div
      ref={rendererRef}
      className="ql-editor ql-renderer text-gray-100 leading-relaxed"
    />
  );
};

export default Renderer;
