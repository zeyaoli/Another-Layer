// create a variable for A-Frame world
var world;

// references to our markers (which are defined in the HTML document)
var hiroMarker, zbMarker;

// how long has each marker been visible?
var hiroVisCount = 0;
var zbVisCount = 0;

// global flag to keep track of whether we should track new markers
// (we can pause this when the user wants to interact with the content)
var tracking = true;

// graphics we may need during 2D mode
var p1, p2, currentPainting;

// a new drawing canvas (to overlay on top of the regular canvas)
var overlayCanvas;

var sourceImage;
var overlayImage;

function preload() {
  p1 = loadImage('images/Gericault_1.jpg');
  p2 = loadImage('images/Gericault_2.jpg');

  sourceImage = loadImage("images/Gericault_2.jpg");
}

function setup() {
  pixelDensity(1);

  world = new World("ARScene");

  // grab a reference to our marker in the HTML document
  hiroMarker = world.getMarker("hiro");
  zbMarker = world.getMarker("zb");

  overlayImage = createImage(1888, 2240);

  // put a painting on top of each marker
  var painting1 = new Plane({
    x: 0,
    y: 0,
    z: -1,
    width: 4,
    height: 5,
    rotationX: -90,
    asset: 'painting1'
  });
  hiroMarker.addChild(painting1);


  // create our overlay canvas (double the size as the regular canvas, which is 800x600)
  // this is because the canvas has to be scaled up to accomodate the AR video stream
  overlayCanvas = createGraphics(1600, 1200);
}

function draw() {
  // if we are in tracking mode we really don't need to do anything here
  if (tracking) {

  }

  // we are in 2D mode
  else {
    // erase the background of the world (hiding the video feed)
    world.clearDrawingCanvas();
    background(0, 200);

    // in my AR system the canvas is ALWAYS 800 x 600, but it's scaled up/down as needed


    // figure out how large the painting should be (50% of the window)
    var desiredWidth = 300;
    var scalingFactor = desiredWidth / currentPainting.width;

    // draw our painting
    imageMode(CENTER);
    image(currentPainting, width / 2, height / 2, currentPainting.width * scalingFactor, currentPainting.height * scalingFactor);

    // console.log(currentPainting.height * scalingFactor);

    // draw a 'close' button
    fill(255);
    textSize(25);
    textAlign(CENTER);
    text("[ close ]", width / 2, height / 2 + currentPainting.height * scalingFactor / 2 + 10);

    // if the user is clicking the mouse we should let them draw on the OVERLAY canvas
    if (mouseX >= width / 2 - 150 && mouseX <= width / 2 + 150) {

      if (mouseY >= height / 2 - currentPainting.height * scalingFactor / 2 && mouseY <= height / 2 + currentPainting.height * scalingFactor / 2) {
        // fill(255);
        // ellipse(mouseX, mouseY, 50, 50);
        var mapX = int(map(mouseX, width / 2 - 150, width / 2 + 150, 0, currentPainting.width));
        var mapY = int(map(mouseY, height / 2 - currentPainting.height * scalingFactor / 2, height / 2 + currentPainting.height * scalingFactor / 2, 0, currentPainting.height));

        // fill(0);
        // text(mapX + ', ' + mapY, mouseX, mouseY);

        if (mouseIsPressed) {
          overlayImage.copy(sourceImage, mapX - 250, mapY - 250, 500, 500, mapX - 250, mapY - 250, 500, 500);
        }

      }


    }


    if (false && mouseIsPressed) {

      overlayImage.copy(sourceImage, mouseX - 250, mouseY - 80, 500, 500, mouseX - 250, mouseY - 80, 500, 500);

      // how far are they from the close button?  If so, close the window
      if (dist(mouseX, mouseY, width / 2, height / 2 + currentPainting.height * scalingFactor / 2 + 50) < 50) {
        tracking = true;
        overlayCanvas.clear();
        world.clearDrawingCanvas();
        overlayImage = createImage(1888, 2240);
      }
    }

    // draw the overlay canvas
    imageMode(CENTER);
    image(overlayImage, width / 2, height / 2, currentPainting.width * scalingFactor, currentPainting.height * scalingFactor);

    imageMode(CORNER);
    image(overlayCanvas, 0, 0, overlayCanvas.width / 2, overlayCanvas.height / 2);
  }

}

function mousePressed() {
  // console.log(tracking);
  // are we currently in tracking mode?
  if (tracking) {
    // see which marker is currently visible
    if (hiroMarker.isVisible()) {
      tracking = false;
      currentPainting = p1;
    } else if (zbMarker.isVisible()) {
      tracking = false;
      currentPainting = p2;
    }
  }
}