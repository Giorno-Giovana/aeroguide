<template>
  <div>
    <canvas
      id="canvas"
      width="1000px"
      height="1000px"
      style="border: 1px solid black"
    />
    <div>
      <input
        type="checkbox"
        v-model="isEditing"
        id="editing"
      /><label for="editing">Editing markers</label>
    </div>
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
      width: 0, // current width
      height: 0, // current height
      transX: 0, // current shift for x axis
      transY: 0, // current shift for y axis
      scale: 1, // current global scale
      markerColor: '#2567d5',
      isEditing: true,
      markers: [],
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
      console.log(this.scale)
      this.transX *= this.baseScale / curBaseScale
      this.transY *= this.baseScale / curBaseScale

      this.canvas.setWidth(this.width)
      this.canvas.setHeight(this.height)

      this.applyTransform()

      // Show markers on the map, will be added later
      // this.getPosition()
      this.createMarkers()
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
        this.addMarker(myPosition, 'Я ТУТ', true)
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
      window.transX = transX
      // Group all objects and apply transform on the group
      const group = new fabric.Group(canvas.getObjects())
      group.scaleX = scale / canvas.scale
      group.scaleY = scale / canvas.scale
      group.left = transX * scale
      group.top = transY * scale
      group.destroy()

      // Refresh global scale for the canvas
      canvas.scale = scale

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
            //console.log('this.transX', this.transX)
            if (this.transX < 0){
              //console.log('scale', (this.scale / this.baseScale))
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
      console.log(scaleToSet)
      this.scale = scaleToSet
      this.applyTransform()
    },
    addMarker(point, text, isUserMarker) {
      console.log('Position X', (-window.transX + point.x) / ( 6 * this.scale))
      //console.log('point.x', point.x, point.y)
      // console.log('scale', this.scale)
      // console.log('window.transX', window.transX)
      // console.log('this.transX', (-window.transX + point.x) * this.scale)
      const marker = new fabric.Path(
        'm 11,-19.124715 c -8.2234742,0 -14.8981027,-6.676138 -14.8981027,-14.9016 0,-5.633585 3.35732837,-10.582599 6.3104192,-14.933175 C 4.5507896,-52.109948 9.1631953,-59.34619 11,-61.92345 c 1.733396,2.518329 6.760904,9.975806 8.874266,13.22971 3.050966,4.697513 6.023837,8.647788 6.023837,14.667425 0,8.225462 -6.674629,14.9016 -14.898103,14.9016 z m 0,-9.996913 c 2.703016,0 4.903568,-2.201022 4.903568,-4.904687 0,-2.703664 -2.200552,-4.873493 -4.903568,-4.873493 -2.7030165,0 -4.903568,2.169829 -4.903568,4.873493 0,2.703665 2.2005515,4.904687 4.903568,4.904687 z"',
        {
          width: isUserMarker ? 200 : 40,
          height: isUserMarker ? 200 : 80,
          scaleX: this.scale,
          scaleY: this.scale,
          left: point.x,
          top: point.y,
          originX: 'center',
          originY: 'center',
          fill: this.markerColor,
          stroke: '#2e69b6',
          text: text, // save text inside the marker for import/export
        }
      )

   // Text
      const textObject = new fabric.Text(text, {
        fontSize: 30,
        originX: 'center',
        fill: this.markerColor,
        originY: 'center',
      })
      // Wrapper
      const background = new fabric.Rect({
        width: 180,
        height: 40,
        originX: 'center',
        originY: 'center',
        fill: 'white',
        stroke: 'black',
      })
      // Group for correct positioning
      const textGroup = new fabric.Group([background, textObject], {
        scaleX: this.scale,
        scaleY: this.scale,
        left: point.x + 20 * this.scale, // respect current scale
        top: point.y - 30 * this.scale, // respect current scale
      })
      this.canvas.add(marker)
      this.canvas.add(textGroup)
      this.canvas.renderAll()
    },
    createMarkers() {
      let markersCount = 0

      // Create new marker
      this.canvas.on('mouse:down', (options) => {
        let position
        if (!this.isEditing) {
          return
        }
        // Get absolute position on the canvas
        position = this.canvas.getPointer(options.e)
        // position = this.getCursorPosition(this.canvas.upperCanvasEl, options.e)


        this.addMarker(position, `#${markersCount++}:${Math.round(position.x)}, ${Math.round(position.y)}`)
      })
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
