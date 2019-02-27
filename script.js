const mouse = {
   x: window.innerWidth * 0.5,
   y: window.innerHeight * 0.5
};

let input = {
   mouseX: {
      start: 0,
      end: window.innerWidth,
      current: mouse.x
   },
   mouseY: {
      start: 0,
      end: window.innerHeight,
      current: mouse.y
   }
};
input.mouseX.range = input.mouseX.end - input.mouseX.start;
input.mouseY.range = input.mouseY.end - input.mouseY.start;

let output = {
   //mouse position translation
   x: {
      start: -300,
      end: 300,
      current: 0
   },
   y: {
      start: -300,
      end: 300,
      current: 0
   },
   z: {
      range: 10000
   },
   scale: {
      start: 1,
      end: 0.4
   },
   blur: {
      start: 0.2,
      range: 5
   }
};
output.scale.range = output.scale.end - output.scale.start;
output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;

//corresponding with img/
let elements = [
   'icon_1',
   'icon_2',
   'icon_3',
   'icon_4',
   'icon_5',
   'icon_6',
   'icon_7',
   'icon_8',
   'icon_9'
];

//how many space elements depending on media queries
if (window.matchMedia('(max-width: 600px)').matches) {
   howMany = 15;
} else if (window.matchMedia('(max-width: 900px)').matches) {
   howMany = 25;
} else if (window.matchMedia('(max-width: 1200px)').matches) {
   howMany = 35;
} else if (window.matchMedia('(max-width: 1500px)').matches) {
   howMany = 55;
} else {
   howMany = 75;
}

const elementsArray = [];
for (let i = 0; i < howMany; i++) {
   const container = document.getElementById('container');
   const element = document.createElement('div');
   element.className = 'element';
   elementsArray.push(element);

   const icon = document.createElement('div');
   icon.className = 'icon';
   element.appendChild(icon);
   container.appendChild(element);

   const size = Math.round(100 * Math.random() + 25) + 'px';
   element.style.width = size;
   element.style.height = size;
   element.dataset.depth = Math.random().toFixed(1);

   const elementNum = Math.ceil(Math.random() * elements.length);
   icon.style.backgroundImage = `url(img/icon_${elementNum}.png)`;

   const blur = (Math.round() - output.blur.start) * output.blur.range;
   element.style.filter = `blur(${blur}px)`;

   const zIndex = output.z.range - Math.round() * output.z.range;
   element.style.zIndex = zIndex;

   element.style.top = Math.round(Math.random() * 100) + 'vh';
   element.style.left = Math.round(Math.random() * 100) + 'vw';
}

const updateInputs = function() {
   input.mouseX.current = mouse.x;
   input.mouseY.current = mouse.y;

   input.mouseX.fraction = (input.mouseX.current - input.mouseX.start) / input.mouseX.range;
   input.mouseY.fraction = (input.mouseY.current - input.mouseY.start) / input.mouseY.range;
};

const updateOutputs = function() {
   // inverted
   output.x.current = output.x.end - input.mouseX.fraction * output.x.range;
   output.y.current = output.y.end - input.mouseY.fraction * output.y.range;
   // following mouse direction: output.x.current = output.x.start + input.mouseX.fraction * output.x.range;
};

const updateElements = function() {
   elementsArray.forEach(function(element) {
      const depth = parseFloat(element.dataset.depth, 10); //comes as string value; between 0 (close) and 1 (far away)

      const elementOutput = {
         //as element gets further away - moves less quickly and gets more blurry
         //blur correlates with depth values
         //the depth is higher the scale is smaller
         x: output.x.current - output.x.current * depth,
         y: output.y.current - output.y.current * depth,
         zIndex: output.z.range - output.z.range * depth,
         scale: output.scale.start + output.scale.range * depth,
         blur: (depth - output.blur.start) * output.blur.range
      };

      element.style.zIndex = elementOutput.zIndex;
      element.style.filter = `blur(${elementOutput.blur}px)`;

      // both transform properties together
      element.style.transform = `scale(${elementOutput.scale}) translate(${elementOutput.x}px, ${
         elementOutput.y
      }px)`;
   });
};

function mouseMove(event) {
   mouse.x = event.clientX;
   mouse.y = event.clientY;
   updateInputs();
   updateOutputs();
   updateElements();
}

//adapt to window resizing
function windowResize() {
   input.mouseX.end = window.innerWidth;
   input.mouseX.range = input.mouseX.end - input.mouseX.start;

   input.mouseY.end = window.innerHeight;
   input.mouseY.range = input.mouseY.end - input.mouseY.start;
}

window.addEventListener('mousemove', mouseMove);
window.addEventListener('resize', windowResize);
document.querySelector('button').addEventListener('click', () => location.reload());

updateInputs();
updateOutputs();
updateElements();
