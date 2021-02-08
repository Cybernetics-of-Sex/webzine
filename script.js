/*
 * example arena code here: https://github.com/SFPC/code-societies/blob/master/index.html
 * and here: https://github.com/DigitalLoveLanguages/digitallovelanguages.github.io/blob/master/script.js
 */

// import { SVG } from "@svgdotjs/svg.js";

/* Helper Functions */

function random(num) {
    return Math.floor(Math.random() * num);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function distance(aX, aY, bX, bY) {
    return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

/* ****************************** */

const iconsWrapper = document.getElementById("icons");
const loadingWrapper = document.getElementById("loading-wrapper");

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// function to get a sample of size numElements from an array
function getRandomElementsFromArray(array, numElements) {
    var arr = [];
    const toReturn = [];
    while (arr.length < numElements) {
        var r = randomIntFromInterval(0, array.length);
        if (arr.indexOf(r) === -1) {
            arr.push(r);
            toReturn.push(array[r]);
        }
    }
    return toReturn;
}

// function placeIcons(arenaBlocks) {
//     // first lets randomly shuffle the blocks, so they are not always in the same order
//     shuffle(arenaBlocks);
//     // then lets loop through them
//     for (let i = 0; i < arenaBlocks.length; i++) {
//         //create block
//         let block = document.createElement("div");
//         block.className = "block";

//         //create image
//         if (arenaBlocks[i].image) {
//             var randWidth = randomIntFromInterval(80, 500);
//             const image = document.createElement("img");
//             var randomClass = "";
//             if (i % 6 === 0) {
//                 randomClass = " random";
//             } else {
//                 randomClass = "";
//             }

//             image.className = "image iconImage" + randomClass;

//             // console.log(arenaBlocks[i].image.original.url);
//             image.src = arenaBlocks[i].image.original.url;
//             $(image).width(randWidth);
//             $(image).height(randWidth);

//             // move the blob by a random position to make things a bit less grid-like
//             // this delta number should be bigger and smaller depending on screen width
//             var delta = 700;
//             // var moveLeftPixels = randomIntFromInterval(0, 3000);
//             // var moveTopPixels = randomIntFromInterval(200, 8000);
//             var moveLeftPixels = randomIntFromInterval(0, delta * 1.2);
//             var moveTopPixels = randomIntFromInterval(0, delta / 2);
//             $(block).css({
//                 left: moveLeftPixels,
//                 top: moveTopPixels,
//             });

//             // append to html
//             block.appendChild(image);
//         }
//         //   var linksWrapper = document.createElement("div");
//         //   linksWrapper.className = "linkswrapper"
//         //   block.appendChild(linksWrapper);

//         iconsWrapper.appendChild(block);
//     }
// }

$(document).ready(function() {
    console.log("ready!");
    // let cyberSexIcons = [];
    let loading = document.createElement("div");
    loading.className = "loading";
    loading.innerHTML = "loading...";
    loadingWrapper.appendChild(loading);

    const axiosArena = axios.create({
        baseURL: "https://api.are.na/v2/",
    });

    axiosArena.defaults.headers.Authorization = "Bearer ---";
    axiosArena
        .get("channels/looks-cybernetics-of-sex?per=100")
        .then((response) => {
            let arenaBlocks = [];
            // console.log(response);
            if (response.data && response.data.contents.length > 1) {
                loadingWrapper.removeChild(loading);
                for (let i = 0; i < response.data.contents.length; i++) {
                    let j = i % response.data.contents.length;
                    // then add to the list of blocks
                    arenaBlocks.push(response.data.contents[j]);
                }
                console.log(arenaBlocks);
                // placeIcons(arenaBlocks);

                // draw images when blocks are ready
                for (let i = 0; i < arenaBlocks.length; i++) {
                    if (
                        arenaBlocks[i].image === undefined ||
                        arenaBlocks[i].image === null
                    ) {
                        continue;
                    } else {
                        c = new Circle(arenaBlocks[i].image.square.url);
                        c.createLines();
                        // c.drawCircle();
                        allCircles.push(c);
                    }
                }
                // circle will be drawn after lines so it will be on top of it
                for (let c of allCircles) {
                    c.drawCircle();
                }
            }
        });
});



// -------------------------------
class Circle {
    constructor(path) {
        this.x = randomRange(50, 950);
        this.y = randomRange(50, 450);
        this.r = randomRange(10, 30);
        this.path = path;
        this.lines = [];
        this.animatedpaths = [];
        this.text = "content";
    }

    drawCircle(path) {
        //draw ellipse mask shape
        let ellipse = draw
            .ellipse(this.r * 2, this.r * 2)
            .move(this.x - this.r, this.y - this.r)
            .fill("#fff");
        // draw image elements
        let circle = draw
            .image(this.path)
            .size(this.r * 2, this.r * 2)
            .move(this.x - this.r, this.y - this.r);
        //  mask the image with ellipse
        let mask = draw.mask().add(ellipse);
        circle.maskWith(mask);
        // here goes the filter that applies to the image

        // for randomness -> set a random chance variable
        // and set if(randomChance < 0.3) do this else do that

        circle.filterWith(function(add) {
            // add.colorMatrix("hueRotate", 180);

            add.colorMatrix('matrix', [1.0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0, 1.0, 0])
        });

        circle.on("click", function() {
            if (!displaying) {
                displaying = true;
                let n = randomRange(0, allCircles.length - 1);
                document.querySelector("#info").innerHTML =
                    "<h2>title</h2> <p> " + allCircles[n].text + "</p>";
                unfade(document.querySelector("#info"));
            } else {
                displaying = false;
                fade(document.querySelector("#info"));
            }
        });
    }

    createLines() {
        if (allCircles.length > 0) {
            for (let c in allCircles) {
                let circle = allCircles[c];

                let dist = distance(this.x, this.y, circle.x, circle.y);
                if (dist > 50 && dist < 150) {
                    let pathvals = createPath(this.x, this.y, circle.x, circle.y);
                    let pathstring = makePathString(pathvals);
                    let path = draw.path(pathstring);
                    path.fill("none");
                    path.stroke({
                        color: "#394DF1",
                        width: 2,
                        linecap: "round",
                        linejoin: "round",
                    });

                    let animatedpathvals = createPath(this.x, this.y, circle.x, circle.y);

                    this.lines.push(path);
                    circle.lines.push(path);
                    this.animatedpaths.push(animatedpathvals);
                    circle.animatedpaths.push(animatedpathvals);
                }
            }
        }
    }
}

// let draw = SVG().addTo("#drawing").viewbox(0, 0, 1000, 500);
let draw = SVG().addTo("#drawing").viewbox(0, 0, 1010, 666);

let drawing = document.getElementById("drawing");

let allCircles = [];
let displaying = false;

function createPath(c1x, c1y, c2x, c2y) {
    let path = [
        [c1x, c1y],
        [
            c1x + (c2x - c1x) * (1 / 5) + randomRange(-10, 10),
            c1y + (c2y - c1y) * (1 / 5) + randomRange(-10, 10),
        ],
        [
            c1x + (c2x - c1x) * (2 / 5) + randomRange(-10, 10),
            c1y + (c2y - c1y) * (2 / 5) + randomRange(-10, 10),
        ],
        [
            c1x + (c2x - c1x) * (3 / 5) + randomRange(-10, 10),
            c1y + (c2y - c1y) * (3 / 5) + randomRange(-10, 10),
        ],
        [
            c1x + (c2x - c1x) * (4 / 5) + randomRange(-10, 10),
            c1y + (c2y - c1y) * (4 / 5) + randomRange(-10, 10),
        ],
        [c2x, c2y],
    ];

    return path;
}

function makePathString(vals) {
    str =
        "M " +
        vals[0][0] +
        " " +
        vals[0][1] +
        " C " +
        vals[1][0] +
        " " +
        vals[1][1] +
        ", " +
        vals[2][0] +
        " " +
        vals[2][1] +
        ", " +
        vals[3][0] +
        " " +
        vals[3][1] +
        " S " +
        vals[4][0] +
        " " +
        vals[4][1] +
        ", " +
        vals[5][0] +
        " " +
        vals[5][1];
    return str;
}

function animateLines(event) {
    //track mousePos
    let mouseX = event.pageX;
    let mouseY = event.pageY;

    for (let circle of allCircles) {
        let dist = distance(mouseX, mouseY, circle.x, circle.y);

        if (dist < circle.r + 10) {
            // console.log(circle.animatedpaths);
            for (let p in circle.lines) {
                circle.lines[p]
                    .animate(randomRange(1000, 2000))
                    .ease("<>")
                    .plot(makePathString(circle.animatedpaths[p]))
                    .loop(true, true);
            }
        } else {
            for (let p in circle.lines) {
                circle.lines[p].timeline().pause();
            }
        }
    }
}

drawing.addEventListener("mousemove", animateLines, false);

function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function() {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function unfade(element) {
    var op = 0.1; // initial opacity
    element.style.display = "block";
    var timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}