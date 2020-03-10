// Creates a random color.
const generateRandomHexCode = () => {
  return "#000000".replace(/0/g, () => {
    return (~~(Math.random() * 16)).toString(16);
  });
};

class BoundingBoxes {
  constructor(imageSrc) {
    // Superimpose image over svg.
    document.getElementById("image").src = imageSrc;

    // Initalise boxes variable
    this.boxes = []; // array: {topLeftX, topLeftY, bottomLeftX, bottomRightY, id}

    // Initalise SVG element variable
    this.svgElement = document.getElementById("svg");

    // Initialise list element vairable
    this.listElement = document.getElementById("list");

    // Initalize boxBeingDrawnId. This is null normally but is an integer
    // when a box is being drawn.
    this.boxBeingDrawnId = null;

    // Instantiate click listeners.
    this.initializeOnMouseDownListener();
    this.initializeOnMoveListener();
    this.initializeOnMouseUpListener();
  }

  // When the mouseup occurs, set boxBeingDrawnId back to null.
  initializeOnMouseUpListener = () => {
    this.svgElement.addEventListener("mouseup", () => {
      this.boxBeingDrawnId = null;
    });
  };

  // When the user moves their mouse over the SVG.
  initializeOnMoveListener = () => {
    this.svgElement.addEventListener("mousemove", e => {
      // Don't do anything unless a box is being drawn.
      if (this.boxBeingDrawnId === null) return;

      let updatedBox;

      // Update box in local state (this.boxes).
      this.boxes = this.boxes.map(box => {
        if (box.id === this.boxBeingDrawnId) {
          updatedBox = {
            ...box,
            width: e.offsetX - box.topLeftX,
            height: e.offsetY - box.topLeftY
          };
          return updatedBox;
        }
        return box;
      });

      // Update the dimensions of the rectangle DOM element.
      this.updateRectDimensions(
        updatedBox.id,
        updatedBox.topLeftX,
        updatedBox.topLeftY,
        updatedBox.width,
        updatedBox.height,
        updatedBox.color
      );

      // Update the height and width of the list items on the DOM.
      this.updateListItem(updatedBox);
    });
  };

  // When you click on the SVG, add a new box, add a new list item and create
  // an onmousemove listener.
  initializeOnMouseDownListener = () => {
    this.svgElement.addEventListener("mousedown", e => {
      const id = this.boxes.length;

      const newBox = {
        topLeftX: e.offsetX,
        topLeftY: e.offsetY,
        width: 1,
        height: 1,
        color: generateRandomHexCode(),
        id: this.boxes.length
      };

      // Set boxBeingDrawnId
      this.boxBeingDrawnId = id;

      // Add box to boxes
      this.boxes.push(newBox);

      // Add rect element to dom
      const newRectElement = document.createElementNS(
        `http://www.w3.org/2000/svg`,
        "rect"
      );
      newRectElement.id = newBox.id;
      this.svgElement.appendChild(newRectElement);

      // Set width and position of new rect element.
      this.updateRectDimensions(
        newBox.id,
        newBox.topLeftX,
        newBox.topLeftY,
        newBox.width,
        newBox.height,
        newBox.color
      );

      // Create list item
      this.appendListItem(newBox);
    });
  };

  updateRectDimensions = (id, x, y, width, height, color) => {
    const element = document.getElementById(id);

    if (width < 0) {
      x = x + width;
      width = Math.abs(width);
    }

    if (height < 0) {
      y = y + height;
      height = Math.abs(height);
    }

    element.setAttribute("x", x.toString());
    element.setAttribute("y", y.toString());
    element.setAttribute("width", width.toString());
    element.setAttribute("height", height.toString());
    element.style = `stroke: ${color}; fill: ${color}30`;
  };

  get listItemPrefix() {
    return "list-item-";
  }

  updateListItem = updatedBox => {
    const listItem = document.getElementById(
      `${this.listItemPrefix}${updatedBox.id}`
    );
    const newContent = this.getListItemContent(updatedBox);
    listItem.removeChild(listItem.firstChild);
    listItem.appendChild(newContent);
  };

  appendListItem = newBox => {
    const newListItemElement = document.createElement("li");
    newListItemElement.id = `${this.listItemPrefix}${newBox.id}`;
    newListItemElement.style.color = newBox.color;
    const content = this.getListItemContent(newBox);
    newListItemElement.appendChild(content);
    this.listElement.appendChild(newListItemElement);
  };

  getListItemContent = newBox => {
    return document.createTextNode(
      `Box #${newBox.id} at (${newBox.topLeftX}, ${newBox.topLeftY}) has width: ${newBox.width}px, height: ${newBox.height}px`
    );
  };
}

// Pick 1 out 9 random images of people on the street.
const getRandomImage = () => {
  const library = [
    "https://cdn2.lamag.com/wp-content/uploads/sites/6/2019/03/third-street-promenade-people-shopping-1068x712.jpg",
    "https://images.startups.co.uk/wp-content/uploads/2007/03/How-to-open-a-shop.jpg",
    "https://images.theconversation.com/files/259534/original/file-20190218-56240-1yjwyzm.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=754&fit=clip",
    "https://assets.traveltriangle.com/blog/wp-content/uploads/2018/04/Oxford-Street.jpg",
    "https://static01.nyt.com/images/2018/10/28/fashion/22STREET-TOKYO-1/merlin_145660254_4aa42037-33ca-4cf2-897b-c05cd3892438-jumbo.jpg",
    "https://neu-cdn-amnesty-org-prd.azureedge.net/cache/3/2/9/9/b/0/3299b08e47187a294c63c0c8b6dc76dac89ecef7.jpg",
    "https://www.foreground.com.au/app/uploads/2019/04/StreetTreesNoneRegentStLondon-ArthurEdelman.jpg",
    "https://vice-images.vice.com/images/content-images-crops/2016/08/24/we-asked-people-on-the-street-to-try-and-describe-their-dissertations-body-image-1472042032-size_1000.jpg?resize=640:*",
    "https://www.healthyactivebydesign.com.au/images/uploads/Case_Studies/SA/Adelaide_Design_Manual_new_2.jpg"
  ];
  const randomInteger = Math.floor(
    Math.random() * Math.floor(library.length - 1)
  );
  return library[randomInteger];
};

// Create an instance of BoundingBoxes.
const boundingBox = new BoundingBoxes(getRandomImage());
