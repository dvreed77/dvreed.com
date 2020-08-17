import React from "react"
import * as d3 from "d3"
import { RandomViewer } from "./RandomViewer"

export function quadratic(a: number, b: number, c: number) {
  const z1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
  const z2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)

  return [z1, z2]
}

function getDave(t: number, y: number) {
  const a = 2 * t - 1
  const b = 2 * (1 - t)
  const c = -y

  const [z1, z2] = quadratic(a, b, c)

  if (z1 >= 0 && z1 <= 1) {
    return z1
  } else if (z2 >= 0 && z2 <= 1) {
    return z2
  } else {
    return 0
  }
}

export function Dave() {
  const svgRef = React.useRef(null)
  const [dimensions, setDimensions] = React.useState({
    width: 800,
    height: 200,
  })

  const [scales, setScales] = React.useState({
    yScale: d3.scaleLinear(),
  })

  const [params, setParams] = React.useState({
    start: 0.5,
    end: 0.5,
  })

  React.useEffect(() => {
    setScales({
      yScale: d3.scaleLinear().domain([0, 1]).range([0, dimensions.height]),
    })
  }, [dimensions])

  const onStartDrag = (
    event: React.MouseEvent | React.TouchEvent,
    key: string
  ) => {
    const node = svgRef.current

    let origin = 0,
      p = params[key]

    const onMouseMove = (event: MouseEvent | TouchEvent) => {
      let cX: number, cY: number
      if (window.TouchEvent && event instanceof TouchEvent) {
        cX = event.touches[0].clientX
        cY = event.touches[0].clientY
      } else if (event instanceof MouseEvent) {
        cX = event.clientX
        cY = event.clientY
      } else {
        return
      }

      const curPos = scales.yScale(p) + cY - origin

      setParams(params => ({
        start:
          key === "start"
            ? scales.yScale.invert(curPos)
            : 1 - scales.yScale.invert(curPos),
        end:
          key === "end"
            ? scales.yScale.invert(curPos)
            : 1 - scales.yScale.invert(curPos),
      }))
    }

    const onMouseUp = (event: MouseEvent | TouchEvent) => {
      svgRef.current?.removeEventListener("mousemove", onMouseMove)
      svgRef.current?.removeEventListener("mouseup", onMouseUp)
      svgRef.current?.removeEventListener("touchmove", onMouseMove, false)
      svgRef.current?.removeEventListener("touchend", onMouseUp, false)
    }

    let cX, cY
    if (window.TouchEvent && event.nativeEvent instanceof TouchEvent) {
      cY = event.nativeEvent.touches[0].clientY
    } else if (event.nativeEvent instanceof MouseEvent) {
      cY = event.nativeEvent.clientY
    } else {
      return
    }

    origin = cY

    node?.addEventListener("mousemove", onMouseMove, false)
    node?.addEventListener("mouseup", onMouseUp, false)

    node?.addEventListener("touchmove", onMouseMove, false)
    node?.addEventListener("touchend", onMouseUp, false)
  }

  const startPoint = [10, scales.yScale(params.start)]
  const endPoint = [400, scales.yScale(params.end)]

  const data = Array.from({ length: 1000 }).map(
    () => getDave(params.start, Math.random()) * 1000
  )
  return (
    <div>
      <div className="select-none">
        <span>{params.start.toFixed(2)}</span>
        <span>{params.end.toFixed(2)}</span>
      </div>

      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        <line
          x1={startPoint[0]}
          y1={startPoint[1]}
          x2={endPoint[0]}
          y2={endPoint[1]}
          stroke="black"
        ></line>

        <circle
          className="cursor-pointer"
          cx={startPoint[0]}
          cy={startPoint[1]}
          r={5}
          onMouseDown={e => onStartDrag(e, "start")}
        ></circle>

        <circle
          className="cursor-pointer"
          cx={endPoint[0]}
          cy={endPoint[1]}
          r={5}
          onMouseDown={e => onStartDrag(e, "end")}
        ></circle>
      </svg>
      <RandomViewer data={data} />
    </div>
  )
}
