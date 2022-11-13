import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTractor, faBookReader } from "@fortawesome/free-solid-svg-icons";

export function Ratio() {
  const [value, setValue] = useState(0);
  const [pH, setPH] = useState(0.5);

  const [pNotH, setPNotH] = useState(0.5);

  const ratio = value > 0 ? [1, Math.abs(value) + 1] : [Math.abs(value) + 1, 1];

  const p1 = ratio[0] ** 2 / (ratio[0] ** 2 + ratio[1] ** 2);

  const svgSize = 500;

  const librarianColor = "#d97706";
  const librarianColorLight = "#f59e0b";
  const farmerColor = "#059669";
  const farmerColorLight = "#10b981";
  return (
    <div className="mt-5">
      <div style={{ minHeight: 250 }}>
        <div className="flex flex-col mb-2">
          <label
            htmlFor="myRange"
            className="italic text-sm font-thin text-gray-700"
          >
            Use the slider to adjust the ratio between librarians and farmers
          </label>
          <input
            type="range"
            min="-7"
            max="7"
            onChange={(e) => setValue(+e.target.value)}
            value={value}
            step="1"
            id="myRange"
          />
        </div>
        <div className="flex">
          <div className="flex flex-col mr-3 w-1/3">
            <h4>
              Librarians{" "}
              <span className="text-gray-700 font-thin">({ratio[0] ** 2})</span>
            </h4>
            <div>
              {Array.from({ length: ratio[0] }).map((_, idx) => (
                <div className="flex flex-row" key={idx}>
                  {Array.from({ length: ratio[0] }).map((_, idx) => (
                    <FontAwesomeIcon
                      key={idx}
                      className="m-1"
                      icon={faBookReader}
                      color={librarianColor}
                      size="xs"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col ml-5 w-1/3">
            <h4>
              Farmers{" "}
              <span className="text-gray-700 font-thin">({ratio[1] ** 2})</span>
            </h4>
            <div>
              {Array.from({ length: ratio[1] }).map((_, idx) => (
                <div className="flex flex-row" key={idx}>
                  {Array.from({ length: ratio[1] }).map((_, idx) => (
                    <FontAwesomeIcon
                      key={idx}
                      className="m-1"
                      icon={faTractor}
                      color="#2A9D8F"
                      size="xs"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/3">
            <div className="flex flex-row italic items-center text-3xl">
              <span>P</span>
              <span>(</span>
              <span style={{ color: "#264653" }}>H</span>
              <span>)</span>
              <span>=</span>
              <span>
                {(ratio[0] ** 2 / (ratio[0] ** 2 + ratio[1] ** 2)).toFixed(3)}
              </span>
            </div>
            <p className="italic text-sm font-thin text-gray-700">
              The probability Steve is a librarian before you saw any
              evidence... the <span className="font-semibold">Prior</span>
            </p>
          </div>
        </div>
      </div>
      <hr />
      <div className="mb-3">
        <h2>
          What is the Probability of Seeing this Evidence if Steve was a
          Librarian?
        </h2>
        <span className="text-sm font-light">
          Thinking of any interactions you have had with librarians, what
          percentage of librarians do you think match this description?
        </span>
        <div className="flex flex-col mb-2">
          <label className="italic text-sm font-thin text-gray-700">
            Use the slider to adjust the percentage
          </label>
          <input
            className="w-1/3"
            type="range"
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => setPH(+e.target.value)}
            value={pH}
          />
        </div>

        <div className="flex flex-row italic items-center text-2xl">
          <span>P</span>
          <span>(</span>
          <span>E</span> <span>|</span>{" "}
          <span style={{ color: librarianColor }}>H</span> <span>)</span>
          <span>=</span>
          <span>{pH}</span>
        </div>
      </div>
      <hr />
      <div className="mb-3">
        <h2>
          What is the Probability of Seeing this Evidence if Steve was a Farmer?
        </h2>
        <span className="text-sm font-light">
          Thinking of any interactions you have had with farmers, what
          percentage of farmers do you think match this description?
        </span>
        <div className="flex flex-col mt-2 mb-2">
          <label className="italic text-sm font-thin text-gray-700">
            Use the slider to adjust the percentage
          </label>
          <input
            className="w-1/3"
            type="range"
            min="0"
            max="1"
            step="0.1"
            onChange={(e) => setPNotH(+e.target.value)}
            value={pNotH}
          />
        </div>
        <div className="flex flex-row italic items-center text-2xl">
          <span>P</span>
          <span>(</span>
          <span>E</span> <span>|</span>{" "}
          <span style={{ color: farmerColor }}>¬H</span> <span>)</span>
          <span>=</span>
          <span>{pNotH}</span>
        </div>
      </div>
      <hr />
      <div>
        <h2>Putting it all together</h2>
        <div className="flex flex-row italic items-center text-2xl justify-center">
          <span>P</span>
          <span>(</span>
          <span style={{ color: librarianColor }}>H</span> <span>|</span>{" "}
          <span>E</span> <span>)</span>
          <span>=</span>
          <span className="flex flex-col text-center">
            <span className="flex flex-row items-center justify-center">
              <span>P</span>
              <span>(</span>
              <span style={{ color: librarianColor }}>H</span>
              <span>)</span>
              <span>P</span>
              <span>(</span>
              <span>E</span> <span>|</span>
              <span style={{ color: librarianColor }}>H</span> <span>)</span>
            </span>
            <span className="border-b-2 border-black"></span>
            <span className="flex flex-row items-center">
              <span>P</span>
              <span>(</span>
              <span style={{ color: librarianColor }}>H</span>
              <span>)</span>
              <span>P</span>
              <span>(</span>
              <span>E</span> <span>|</span>{" "}
              <span style={{ color: librarianColor }}>H</span> <span>)</span>
              <span className="m-2">+</span>
              <span>P</span>
              <span>(</span>
              <span style={{ color: farmerColor }}>¬H</span>
              <span>)</span>
              <span>P</span>
              <span>(</span>
              <span>E</span> <span>|</span>{" "}
              <span style={{ color: farmerColor }}>¬H</span> <span>)</span>
            </span>
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <svg width={svgSize} height={svgSize} className="mx-auto">
            {/* <g transform={`translate(${svgSize/2},${svgSize/2})`}> */}
            <rect
              x={0}
              y={0}
              width={p1 * svgSize}
              height={svgSize}
              fill={librarianColorLight}
            />
            <rect
              x={p1 * svgSize}
              y={0}
              width={svgSize - p1 * svgSize}
              height={svgSize}
              fill={farmerColorLight}
            />
            <rect
              x={0}
              y={svgSize - svgSize * pH}
              width={p1 * svgSize}
              height={svgSize * pH}
              fill={librarianColor}
            />
            <rect
              x={p1 * svgSize}
              y={svgSize - svgSize * pNotH}
              width={svgSize - p1 * svgSize}
              height={svgSize * pNotH}
              fill={farmerColor}
            />
            {/* </g> */}
          </svg>
        </div>
      </div>
    </div>
  );
}
