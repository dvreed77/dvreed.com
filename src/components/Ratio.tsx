import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTractor, faBookReader } from "@fortawesome/free-solid-svg-icons";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import pkg from "react-katex";

const { BlockMath } = pkg;
const myState = atom({ a: 0, b: 0, pH: 0.5 });

const librarianColor = "#d97706";
const librarianColorLight = "#f59e0b";
const farmerColor = "#059669";
const farmerColorLight = "#10b981";

export const Slider1 = () => {
  const $myState = useStore(myState);

  return (
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
        onChange={(e) => myState.set({ ...$myState, a: +e.target.value })}
        // value={$myState.a}
        // onChange={(e) => console.log(e.target.value)}
        value={$myState.a}
        step="1"
        id="myRange"
      />
    </div>
  );
};

export const Slider2 = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, pH: +e.target.value })}
        value={$myState.pH}
      />
      <div className="ml-2">
        <BlockMath math={`P(H) = ${$myState.pH.toFixed(1)}`} />
      </div>
    </div>
  );
};

export const Slider3 = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, b: +e.target.value })}
        value={$myState.b}
      />
      <div className="ml-2">
        <BlockMath math={`P(B|A) = ${$myState.b.toFixed(1)}`} />
      </div>
    </div>
  );
};

export const Slider4 = () => {
  const $myState = useStore(myState);
  return (
    <div className="flex flex-row">
      <input
        className="flex-auto"
        type="range"
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => myState.set({ ...$myState, a: +e.target.value })}
        value={$myState.a}
      />
      <div className="ml-2">
        <BlockMath math={`P(B|\\bar{A}) = ${$myState.a.toFixed(1)}`} />
      </div>
    </div>
  );
};

export const Square1 = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState(0);
  const $myState = useStore(myState);

  const { pH, a, b } = $myState;

  const p1 = 0.5;
  const pNotH = 1 - pH;

  useEffect(() => {
    const el = divRef.current;
    setSvgSize((el?.clientWidth ?? 0) / 3);
  }, []);

  return (
    <>
      <div ref={divRef}>
        <div className="flex flex-col justify-center">
          <svg width={svgSize} height={svgSize} className="mx-auto">
            <rect
              x={0}
              y={0}
              width={pH * svgSize}
              height={svgSize}
              fill={librarianColor}
            />
            <rect
              x={pH * svgSize}
              y={0}
              width={svgSize - pH * svgSize}
              height={svgSize}
              fill={farmerColor}
            />

            <rect
              x={0}
              y={0}
              width={pH * svgSize}
              height={b * svgSize}
              fill={librarianColorLight}
            />
            <rect
              x={pH * svgSize}
              y={0}
              width={svgSize - pH * svgSize}
              height={a * svgSize}
              fill={farmerColorLight}
            />
          </svg>
        </div>
      </div>

      <div>
        <BlockMath math={`P(H) = ${pH}`} />
        <BlockMath math={`P(E|H) = ${b}`} />
        <BlockMath math={`P(H)P(E|H) = ${(b * pH).toFixed(2)}`} />
        <BlockMath math={`P(E|\\bar{H}) = ${a}`} />
        <BlockMath
          math={`P(\\bar{H})P(E|\\bar{H}) = ${(a * (1 - pH)).toFixed(2)}`}
        />
      </div>
    </>
  );
};
export function Ratio() {
  const [value, setValue] = useState(0);
  const [pH, setPH] = useState(0.5);

  const [pNotH, setPNotH] = useState(0.5);

  const ratio = value > 0 ? [1, Math.abs(value) + 1] : [Math.abs(value) + 1, 1];

  const p1 = ratio[0] ** 2 / (ratio[0] ** 2 + ratio[1] ** 2);

  return (
    <div className="mt-5">
      <div style={{ minHeight: 250 }}>
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
      </div>
    </div>
  );
}
