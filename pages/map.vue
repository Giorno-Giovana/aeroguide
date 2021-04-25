<template>
  <div>
    <canvas
      id="canvas"
      width="1000px"
      height="1000px"
      style="border: 1px solid black"
    />
  </div>
</template>

<script>
import { fabric } from 'fabric'
// import proj4 from 'proj4'
window.jQuery = require('jquery')
const $ = window.jQuery
require('jvectormap')

export default {
  name: 'Map',
  data() {
    return {
      canvas: null,
      group: null,
      element: null,
      baseWidth: 0,
      baseHeight: 0,
      baseScale: 1,
      width: 500, // current width
      height: 500, // current height
      transX: 0, // current shift for x axis
      transY: 0, // current shift for y axis
      scale: 1, // current global scale
      markerColor: '#2567d5',
      isEditing: true,
      markers: [],
      paths: [
        [
          '1838.1776222473347,4579.231813862647',
          '1852.980808741624,4620.9498848920075',
          '1912.1935547187813,4657.284979014355',
          '1994.283952550749,4676.125398188904',
          '2084.4488157432384,4684.199863549426',
          '2157.1190039879316,4634.4073271595435',
          '2198.837075017292,4588.652023449922',
        ],
        [
          '3752.096790312076,4706.447252674904',
          '3673.8909870992243,4661.379501670888',
          '3582.429963002839,4638.84562616888',
          '3483.015806376333,4657.4029354058275',
          '3420.716268223722,4678.611288819482',
          '3345.161509187578,4691.866509703017',
          '3272.25779432814,4705.121730586551',
          '3212.6093003522383,4699.8196422331375',
          '3127.7758866976196,4691.866509703017',
          '3052.221127661475,4687.889943437957',
          '2962.085625653443,4664.030545847596',
          '2890.5074328823584,4660.053979582535',
          '2795.069842520913,4670.6581562893625',
          '2707.5853846895884,4668.007112112653',
          '2610.822272239789,4660.0539795825325',
          '2523.3378144084636,4661.379501670886',
          '2401.38978227995,4669.332634201007',
          '2287.3948826815563,4689.2154655263075',
          '2197.2593806735254,4687.889943437954',
          '2197.2593806735254,4687.889943437954',
          '2091.217613605252,4679.936810907833',
          '2002.4076336855735,4662.705023759238',
          '1905.6445212357744,4638.845626168877',
          '1839.3684168181037,4595.103397253215',
        ],
        [
          '3766.802056281707,4807.297910901908',
          '3761.9819759604216,4751.866987207129',
          '3736.676554273675,4700.051123753314',
          '3690.8857912214658,4668.720601664961',
          '3690.8857912214658,4668.720601664961',
          '3639.0699277676504,4654.260360701105',
          '3580.0239438319077,4648.235260299499',
          '3533.0281606993776,4644.6202000585345',
          '3490.8524578881324,4642.210159897892',
          '3442.651654675275,4660.285461102711',
          '3377.5805703379256,4675.950722146888',
          '3320.9446265628253,4707.2812442352415',
          '3251.053461904191,4701.256143833635',
          '3166.7020562817006,4691.6159831910645',
          '3084.7606908198536,4688.000922950101',
          '3024.5096868037863,4679.565782387851',
          '2953.4135020648305,4662.6955012633525',
          '2882.3173173258747,4655.465380781425',
          '2816.041212908204,4659.080441022389',
          '2747.355068329891,4656.670400861746',
          '2696.744224956397,4604.854537407931',
          '2682.2839839925405,4528.938272347688',
          '2646.133381582902,4462.662167930018',
          '2619.6229398158334,4400.001123753311',
          '2600.342618530693,4337.340079576605',
        ],
      ],
      currentPath: 0,
    }
  },

  mounted() {
    this.element = $('#canvas') // we are going to use it for event handling
    this.canvas = new fabric.Canvas(this.element.get(0), {
      selection: false, // disable groups selection
      scale: 1, // set default scale
      renderOnAddRemove: false, // disable auto-render in order to improve performance for complex maps with a lot of markers
      moveCursor: 'default', // reset mouse cursor — they are not used by us
      hoverCursor: 'default',
    })
    // fabric.util.loadImage('map.jpg', (img) => {
    fabric.util.loadImage('d_1.png', (img) => {
      const map = new fabric.Image(img)
      if (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
      ) {
        this.bindContainerTouchEvents()
      } else {
        this.bindContainerEvents()
      }

      // Set base and current dimensions
      this.baseWidth = map.width
      this.baseHeight = map.height
      this.width = this.element.width()
      this.height = this.element.height()

      // Disable all edit and object selecting functionality on the canvas
      map.set({
        hasRotatingPoint: false,
        hasBorders: false,
        hasControls: true,
        lockScalingY: true,
        lockScalingX: true,
        selectable: false,
        left: map.width / 2,
        top: map.height / 2,
        originX: 'center',
        originY: 'center',
      })
      this.canvas.add(map)
      // Zoom after load in order to show whole map from the beginning
      const curBaseScale = this.baseScale
      if (this.width / this.height > this.baseWidth / this.baseHeight) {
        this.baseScale = this.height / this.baseHeight
      } else {
        this.baseScale = this.width / this.baseWidth
      }
      this.scale *= this.baseScale / curBaseScale
      this.transX *= this.baseScale / curBaseScale
      this.transY *= this.baseScale / curBaseScale

      this.canvas.setWidth(this.width)
      this.canvas.setHeight(this.height)

      this.applyTransform()
      // Show markers on the map, will be added later
      // this.getPosition()
      //this.createMarkers()
    })
  },
  methods: {
    getPosition() {
      const leftBottomCoordinates = {
        lat: 55.961149,
        long: 37.402112,
      }
      const rightTopCoordinates = {
        lat: 55.966114,
        long: 37.406953,
      }
      const latDiff = rightTopCoordinates.lat - leftBottomCoordinates.lat
      const longDiff = rightTopCoordinates.long - leftBottomCoordinates.long
      const geo = navigator.geolocation
      geo.getCurrentPosition((pos) => {
        const myPosition = {
          x:
            (1000 * (pos.coords.latitude - leftBottomCoordinates.lat)) /
            latDiff,
          y:
            (1000 * (pos.coords.longitude - leftBottomCoordinates.long)) /
            longDiff,
        }
        // this.addMarker(myPosition, 'Я ТУТ', true)
        this.setScale(1, myPosition.x, myPosition.y)
      })
    },
    applyTransform() {
      let maxTransX
      let maxTransY
      let minTransX
      let minTransY
      let { transX, transY } = this
      const { baseWidth, scale, width, baseHeight, height, canvas } = this
      // Calculation of thresholds for x axis transition
      if (baseWidth * scale <= width) {
        // Map fits into the canvas
        maxTransX = (width - baseWidth * scale) / (2 * scale)
        minTransX = (width - baseWidth * scale) / (2 * scale)
      } else {
        // Map doesn’t fit
        maxTransX = 0
        minTransX = (width - baseWidth * scale) / scale
      }

      // Limit transition with calculated thresholds
      if (transX > maxTransX) {
        transX = maxTransX
      } else if (transX < minTransX) {
        transX = minTransX
      }
      window.transX = transX

      // The same for y axis
      if (baseHeight * scale <= height) {
        maxTransY = (height - baseHeight * scale) / (2 * scale)
        minTransY = (height - baseHeight * scale) / (2 * scale)
      } else {
        maxTransY = 0
        minTransY = (height - baseHeight * scale) / scale
      }
      if (transY > maxTransY) {
        transY = maxTransY
      } else if (transY < minTransY) {
        transY = minTransY
      }

      window.transY = transY

      // Group all objects and apply transform on the group
      const group = new fabric.Group(canvas.getObjects())
      group.scaleX = scale / canvas.scale
      group.scaleY = scale / canvas.scale
      group.left = transX * scale
      group.top = transY * scale
      group.destroy()

      // Refresh global scale for the canvas
      canvas.scale = scale

      this.bzCurve(this.markers)

      // At last render canvas with changed objects
      canvas.renderAll()
    },
    bindContainerEvents() {
      let mouseDown = false
      let oldPageX
      let oldPageY
      const container = $(this.canvas.wrapperEl)
      // const { scale } = this
      container
        .mousemove((e) => {
          // Shifting
          if (mouseDown) {
            // Calculate transition with respect to the current scale
            // console.log('this.transX', this.transX)
            if (this.transX < 0) {
              // console.log(
              //   'this.transX',
              //   this.transX / (this.scale / this.baseScale)
              // )
              this.transX -= (oldPageX - e.pageX) / this.scale
            } else {
              this.transX = -1
            }
            this.transY -= (oldPageY - e.pageY) / this.scale
            this.applyTransform()

            oldPageX = e.pageX
            oldPageY = e.pageY
            return false
          }
        })
        .mousedown((e) => {
          // Store position
          mouseDown = true
          oldPageX = e.pageX
          oldPageY = e.pageY
          return false
        })

      $('body').mouseup(() => {
        mouseDown = false
      })
      // Zoom with mouse wheel
      container.mousewheel((event, delta, deltaX, deltaY) => {
        const offset = this.element.offset() // position of the canvas on the page
        const centerX = event.pageX - offset.left // x coordinate of the center of zoom
        const centerY = event.pageY - offset.top // y coordinate of the center of zoom
        const zoomStep = Math.pow(1.1, deltaY) // user-friendly zoom step

        this.setScale(this.scale * zoomStep, centerX, centerY)

        // Prevent scroll of the page
        event.preventDefault()
      })
    },
    bindContainerTouchEvents() {
      let touchStartScale
      let touchStartDistance
      const container = $(this.canvas.wrapperEl)
      let touchX
      let touchY
      let centerTouchX
      let centerTouchY
      let lastTouchesLength
      const handleTouchEvent = (e) => {
        const touches = e.originalEvent.touches
        let offset
        let currentScale
        let transXOld
        let transYOld

        if (e.type === 'touchstart') {
          lastTouchesLength = 0
        }
        if (touches.length === 1) {
          // Simple shift
          if (lastTouchesLength === 1) {
            transXOld = this.transX
            transYOld = this.transY
            this.transX -= (touchX - touches[0].pageX) / this.scale
            this.transY -= (touchY - touches[0].pageY) / this.scale
            this.applyTransform()
            if (transXOld !== this.transX || transYOld !== this.transY) {
              e.preventDefault()
            }
          }
          touchX = touches[0].pageX
          touchY = touches[0].pageY
        } else if (touches.length === 2) {
          // Zoom
          if (lastTouchesLength === 2) {
            currentScale =
              Math.sqrt(
                Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                  Math.pow(touches[0].pageY - touches[1].pageY, 2)
              ) / touchStartDistance
            this.setScale(
              touchStartScale * currentScale,
              centerTouchX,
              centerTouchY
            )
            e.preventDefault()
          } else {
            // This is zoom start, store current state
            offset = this.element.offset()
            if (touches[0].pageX > touches[1].pageX) {
              centerTouchX =
                touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2
            } else {
              centerTouchX =
                touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2
            }
            if (touches[0].pageY > touches[1].pageY) {
              centerTouchY =
                touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2
            } else {
              centerTouchY =
                touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2
            }
            centerTouchX -= offset.left
            centerTouchY -= offset.top
            touchStartScale = this.scale
            touchStartDistance = Math.sqrt(
              Math.pow(touches[0].pageX - touches[1].pageX, 2) +
                Math.pow(touches[0].pageY - touches[1].pageY, 2)
            )
          }
        }

        lastTouchesLength = touches.length
      }

      container.bind('touchstart', handleTouchEvent)
      container.bind('touchmove', handleTouchEvent)
    },
    setScale(scaleToSet, anchorX, anchorY) {
      const zoomMax = 10 // max 5x zoom
      const zoomMin = 1 // min 1x zoom — real image size
      let zoomStep // required scale change
      // Limit scale if needed
      if (scaleToSet > zoomMax * this.baseScale) {
        scaleToSet = zoomMax * this.baseScale
      } else if (scaleToSet < zoomMin * this.baseScale) {
        scaleToSet = zoomMin * this.baseScale
      }

      // The center of zoom — a point which should stay on its place.
      // It is defined by anchorX and anchorY arguments.
      // In fact, it is just a position of mouse pointer during scaling.
      if (typeof anchorX !== 'undefined' && typeof anchorY !== 'undefined') {
        zoomStep = scaleToSet / this.scale
        // Calculate required shift for all objects
        // so the center of zoom stays motionless.
        this.transX -= ((zoomStep - 1) / scaleToSet) * anchorX
        this.transY -= ((zoomStep - 1) / scaleToSet) * anchorY
      }
      this.scale = scaleToSet

      this.applyTransform()
    },
    addMarker(point, text, isUserMarker) {
      console.log(this.canvas.getObjects('group'))
      this.canvas.getObjects('group').map((item) => this.canvas.remove(item))
      this.canvas
        .getObjects('path')
        .map((item) =>
          item.stroke === '#2e69b6' ? this.canvas.remove(item) : ''
        )
      //this.canvas.getObjects('rect').map(item => this.canvas.remove(item))
      // const shiftX = window.transX
      // const shiftY = window.transY
      // const x = -shiftX + point.x / this.scale
      // const y = -shiftY + point.y / this.scale
      // console.log('x', x)
      // console.log('y', y)
      //
      // console.log('смещение', this.transX / (this.scale / this.baseScale))
      // this.markers.push([
      //   x, y
      // ])
      // window.markers = this.markers
      const marker = new fabric.Path(
        'm 11,-19.124715 c -8.2234742,0 -14.8981027,-6.676138 -14.8981027,-14.9016 0,-5.633585 3.35732837,-10.582599 6.3104192,-14.933175 C 4.5507896,-52.109948 9.1631953,-59.34619 11,-61.92345 c 1.733396,2.518329 6.760904,9.975806 8.874266,13.22971 3.050966,4.697513 6.023837,8.647788 6.023837,14.667425 0,8.225462 -6.674629,14.9016 -14.898103,14.9016 z m 0,-9.996913 c 2.703016,0 4.903568,-2.201022 4.903568,-4.904687 0,-2.703664 -2.200552,-4.873493 -4.903568,-4.873493 -2.7030165,0 -4.903568,2.169829 -4.903568,4.873493 0,2.703665 2.2005515,4.904687 4.903568,4.904687 z"',
        {
          width: isUserMarker ? 80 : 40,
          height: isUserMarker ? 80 : 80,
          scaleX: this.scale,
          scaleY: this.scale,
          left: (point[0] + window.transX) * this.scale,
          top: (point[1] + window.transY) * this.scale,
          originX: 'center',
          originY: 'center',
          fill: this.markerColor,
          stroke: '#2e69b6',
        }
      )
      // // Text
      // const textObject = new fabric.Text(text, {
      //   fontSize: 30,
      //   originX: 'center',
      //   fill: this.markerColor,
      //   originY: 'center',
      // })
      // // Wrapper
      // const background = new fabric.Rect({
      //   width: 100,
      //   height: 40,
      //   originX: 'center',
      //   originY: 'center',
      //   fill: 'white',
      //   stroke: 'black',
      // })
      // // Group for correct positioning
      // const textGroup = new fabric.Group([background, textObject], {
      //   scaleX: this.scale,
      //   scaleY: this.scale,
      //   left: ((point[0] + window.transX) * this.scale) + 20 * this.scale, // respect current scale
      //   top: ((point[1] + window.transX) * this.scale) - 30 * this.scale, // respect current scale
      // })

      this.canvas.add(marker)
      //this.canvas.add(textGroup)
      this.canvas.renderAll()
    },
    // createMarkers() {
    //   let markersCount = 0
    //
    //   // Create new marker
    //   this.canvas.on('mouse:down', (options) => {
    //     if (!this.isEditing) {
    //       return
    //     }
    //     // Get absolute position on the canvas
    //     const position = this.canvas.getPointer(options.e)
    //     // position = this.getCursorPosition(this.canvas.upperCanvasEl, options.e)
    //
    //     this.addMarker(
    //       position,
    //       `#${markersCount++}:${Math.round(position.x)}, ${Math.round(
    //         position.y
    //       )}`
    //     )
    //   })
    // },
    showPath(index) {
      this.markers = this.paths[index].map((mark) => mark.split(','))
      this.markers = this.markers.map((marker) =>
        marker.map((coord) => ~~+coord)
      )
      this.setScale(
        1.1,
        (this.markers[0][0] + window.transX) * this.scale,
        (this.markers[0][1] + window.transY) * this.scale
      )
      this.addMarker(this.markers[0], 'Вы тут', true)
      this.bzCurve(this.markers)
    },
    gradient(a, b) {
      return (b[1] - a[1]) / (b[0] - a[0])
    },
    bzCurve(points, f, t) {
      this.canvas
        .getObjects('path')
        .map((item) =>
          item.stroke === 'black' ? this.canvas.remove(item) : ''
        )
      if (typeof f == 'undefined') f = 0.3
      if (typeof t == 'undefined') t = 1
      let m = 0
      let dx1 = 0
      let dy1 = 0
      let nexP
      let dx2
      let dy2

      let preP = points[0]

      for (let i = 1; i < points.length; i++) {
        let curP = points[i]
        nexP = points[i + 1]
        if (nexP) {
          m = this.gradient(preP, nexP)
          dx2 = (nexP[0] - curP[0]) * -f
          dy2 = dx2 * m * t
        } else {
          dx2 = 0
          dy2 = 0
        }

        this.bezierCurveTo(
          preP[0],
          preP[1],
          curP[0] + dx2,
          curP[1] + dy2,
          curP[0],
          curP[1]
        )

        dx1 = dx2
        dy1 = dy2
        preP = curP
      }
    },
    bezierCurveTo(point1_x, point1_y, point2_x, point2_y, point3_x, point3_y) {
      let line = new fabric.Path('M 65 0 Q 100, 100, 200, 0', {
        fill: '',
        stroke: 'black',
        objectCaching: false,
        strokeWidth: 1.5,
      })

      line.path[0][1] = (point1_x + window.transX) * this.scale
      line.path[0][2] = (point1_y + window.transY) * this.scale

      line.path[1][1] = (point2_x + window.transX) * this.scale
      line.path[1][2] = (point2_y + window.transY) * this.scale

      line.path[1][3] = (point3_x + window.transX) * this.scale
      line.path[1][4] = (point3_y + window.transY) * this.scale

      line.selectable = false
      this.canvas.add(line)
      this.canvas.renderAll()
    },
  },
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
