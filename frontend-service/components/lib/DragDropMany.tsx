import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";

type props = {
  fileType: string;
  extentions: string;
  files: FileList | null;
  setfiles: (files: FileList) => void;
};

const DragDropMany = ({ extentions, fileType, files, setfiles }: props) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [DragOver, setDragOver] = useState(false);

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }
  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setfiles(e.dataTransfer.files);
    setDragOver(false);
  }

  function onClick(e: React.MouseEvent | React.TouchEvent) {
    // e.preventDefault();
    if (fileInput.current) {
      fileInput.current.click();
    }
  }

  return (
    <div className="w-full h-full text-center">
      <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick} className={`p-10 border-2 ${DragOver ? "border-blue-500" : "border-gray-300"}  rounded-2xl flex flex-col items-center justify-center border-dashed w-full h-full `}>
        <input
          type="file"
          className="invisible"
          ref={fileInput}
          onChange={(e) => {
            e.target.files && setfiles(e.target.files);
          }}
          multiple
        />
        <i className=" mt-5 fas fa-cloud-arrow-up text-zinc-400 text-2xl"></i>
        <div className="space-x-1">
          <span className="font-semibold text-lg text-zinc-600">Upload an {fileType}</span>
          <span className="text-zinc-500">or drag and drop</span>
        </div>
        <div className="text-sm text-zinc-500">{extentions}</div>
        <br />
        <div className="flex flex-wrap  w-[270px] items-center justify-center gap-4 overflow-auto customscrollbar pr-3">
          {files &&
            Array.from(files).map((file, index) => (
              <div key={index} className="w-12 h-12">
                <img className="w-12 h-12" src={URL.createObjectURL(file)} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DragDropMany;
