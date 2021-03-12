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

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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
        .get("channels/textures-fqn0veaotdq?per=100")
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


            getBlocksPool();



            //               // after placing the blocks, we add the click function
            //   // (html elements need to exist on the page before a click function can be added)
            //   $('.blobImage').click(function(e) {
            //     e.preventDefault();
            //     console.log('++ blob clicked');
            //     // find parent block
            //     var parentBlock = $(this).parent('.block');
            //     var linksWrapper = parentBlock.find('.linkswrapper');
            //     // toggle visibility of links wrapper
            //     linksWrapper.toggle();
            //     // if linksWrapper is empty, then add blocks to it
            //     if ($(linksWrapper).is(':empty')) {
            //       // also select three random blocks to put in linkswrapper
            //       var randomSample = getRandomElementsFromArray(availableBlocks, 3);
            //       // clear links wrapper
            //       populateArenaPopup(linksWrapper, randomSample);
            //     }
            //   });




        });

    let availableBlocks = []
        // this function prefetches all the blocks from arena that will be displayed in popups
        // so that when someone clicks a blob, no requests to the arena API are needed
    function getBlocksPool() {
        const listOfChannels = [
            // 'webzine-landscape-blob-pngs',
            'projects-ephemera',
            'when-do-you-wish-you-had-not-remained-silent',
            'what-do-you-need-to-say',
            'what-are-the-tyrannies-big-and-small-that-you-swallow-day-by-day-and-attempt-to-make-your-own',
            'if-we-have-been-socialized-to-respect-fear-more-than-our-own-need-for-language-ask-yourself-what-s-the-worst-that-could-happen-t'
        ];

        let completedRequests = 0;

        for (let i = 0; i < listOfChannels.length; i++) {
            var channel = listOfChannels[i];
            var channelUrl = "channels/" + channel + "?per=100"
            console.log('++ fetching blocks from ' + channel);
            axiosArena.get(channelUrl).then(response => {
                // console.log(response);
                if (response.data && response.data.contents.length > 1) {
                    for (let i = 0; i < response.data.contents.length; i++) {
                        // set the channel title to be part of the block so we can access it later
                        response.data.contents[i].channelTitle = response.data.title;
                        response.data.contents[i].channelSlug = response.data.slug;
                        // then add it to the queue
                        availableBlocks.push(response.data.contents[i])
                            // console.log(availableBlocks);
                    }
                }

                completedRequests += 1;
                if (completedRequests == listOfChannels.length) {
                    assignBlocksToCircles();
                }
            });

        }
    }



    function assignBlocksToCircles() {
        // make a function
        // sort avail blocks randomly
        shuffle(availableBlocks);
        console.log("!!!");
        // iterate throigh all the circles (102) and assign an available pool block to them
        console.log(availableBlocks);

        for (i = 0; i < allCircles.length; i++) {
            // console.log(allCircles[i])
            console.log(availableBlocks[i])


            console.log("=======", availableBlocks[i].channelTitle)

            allCircles[i].channelTitle = availableBlocks[i].channelTitle;
            allCircles[i].title = availableBlocks[i].title;
            allCircles[i].desc = availableBlocks[i].description;
            allCircles[i].content = availableBlocks[i].content
            if (availableBlocks[i].image != undefined) {
                allCircles[i].image = availableBlocks[i].image.original.url;
            }


            console.log(allCircles[i])

        }




    }

});



// now availableBlocks is filled with blocks

// -------------------------------
class Circle {


    constructor(path) {
        this.x = randomRange(50, 950);
        this.y = randomRange(50, 650);
        this.r = randomRange(15, 30);
        this.path = path;
        this.lines = [];
        this.animatedpaths = [];
        // this.text = "content";
        //add arena caregories here;
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

            add.colorMatrix('matrix', [1.0, 0, 0, 0, 0, 0, 0.24, 0, 0, 0, 0, 0, 0.39, 0, 0, 0, 0, 0, 1.0, 0])
        });

        var self = this;

        circle.on("click", function() {
            let channel = self.channelTitle;
            let title = self.title;
            let imageUrl = self.image;
            let description = self.desc;
            let content = self.content;
            // let description = this.desc

            if (!displaying) {
                let n = randomRange(0, allCircles.length - 1);
                
                if (imageUrl) {
                    document.querySelector("#info").innerHTML =
                    "<h3>" + channel + "</h3> <h1>" + title + "</h1> <img class='info-image' src=" + imageUrl + "> <p> " + content + "</p> <p>" + description + "</p>";
                }
                
                else {
                   document.querySelector("#info").innerHTML =
                    "<h3>" + channel + "</h3> <h1>" + title + "</h1> <p> " + content + "</p> <p>" + description + "</p>"; 
                }

                unfade(document.querySelector("#info"));
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

                    // make string to display along path

                    // use line of code below to have different symbols
                    let symbolNum = randomRange(0, pathSymbols.length);

                    // use this line of code if you want to specify just one symbol
                    // let symbolNum = 2;

                    let pathtext = pathSymbols[symbolNum].concat(" ").repeat(5);

                    let textpath = path.text(pathtext.repeat(path.length() / 10)).font({ fill: "#ffffff" });

                    path.fill("none");

                    path.stroke({
                        color: "#dddaf1",
                        width: 0.7,
                        linecap: "round",
                        linejoin: "round",
                    });
                    path.stroke("none");

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
let draw = SVG().addTo("#drawing").viewbox(0, 0, 1000, 700);

let drawing = document.getElementById("drawing");

let allCircles = [];
let displaying = false;

// add more symbols here!!!
// let pathSymbols = ["-", "*", "'", "⌾", "+"];
// let pathSymbols = ["-", "-", "-", "-", "᠁"];
let pathSymbols = ["‾"];

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
drawing.addEventListener("click", function(event) {
    if (displaying) {
        fade(document.querySelector("#info"));
    }
});

function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function() {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = "none";
            displaying = false;
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op -= op * 0.1;
    }, 30);
}

function unfade(element) {
    var op = 0.1; // initial opacity
    element.style.display = "block";
    var timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
            displaying = true;
        }
        element.style.opacity = op;
        element.style.filter = "alpha(opacity=" + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}