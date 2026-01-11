import { useState } from "react";

export default function About() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="p-6">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (visible == false) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }}
        className="text-blue-600 underline"
      >
        Hide box
      </a>

      {visible && (
        <div className="mt-4 p-4 bg-gray-200 rounded">
          I will disappear when the link is clicked.
        </div>
      )}
    </div>
  );
}
