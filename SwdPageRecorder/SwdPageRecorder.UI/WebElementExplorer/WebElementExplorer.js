﻿/// <reference path="_reference.ts" />
var WebElementExplorer;
(function (WebElementExplorer) {
    function say(something) {
        if (typeof console !== "undefined" && console !== null) {
            return console.log(something);
        }
    }
    WebElementExplorer.say = say;

    function dbg(something) {
        if (typeof console !== "undefined" && console !== null) {
            return console.log("DBG:" + something);
        }
    }
    WebElementExplorer.dbg = dbg;

    function hello(something) {
        return dbg("(begin): " + something);
    }
    WebElementExplorer.hello = hello;

    function bye(something) {
        return dbg("(end): " + something);
    }
    WebElementExplorer.bye = bye;

    function pseudoGuid() {
        var result;
        hello("pseudoGuid");
        function pseudoPart(mode) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return mode ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        result = pseudoPart(false) + pseudoPart(true) + pseudoPart(true) + pseudoPart(false);
        bye("pseudoGuid");
        return result;
    }
    WebElementExplorer.pseudoGuid = pseudoGuid;
})(WebElementExplorer || (WebElementExplorer = {}));
/// <reference path="utils.ts" />
/// <reference path="_reference.ts" />
var WebElementExplorer;
(function (WebElementExplorer) {
    function findOneById(id) {
        return document.getElementById(id);
    }
    WebElementExplorer.findOneById = findOneById;

    function findManyByName(name) {
        return document.getElementsByName(name);
    }
    WebElementExplorer.findManyByName = findManyByName;

    function getTagName(element) {
        return element.tagName.toLowerCase();
    }

    function canFindById(element) {
        var result = null;
        if (!(element && element.id))
            return false;

        var elementExists = findOneById(element.id) === element;
        return elementExists;
    }

    function canFindByName(element) {
        var result = null;

        if (!(element && element["name"]))
            return false;

        var listOfElements = document.getElementsByName(element["name"]);

        var elementExists = listOfElements.length === 1 && listOfElements[0] == element;

        return elementExists;
    }

    function buldFullXPath(element) {
        var elementTagName = getTagName(element);
        if (element === document.body) {
            return "/html/" + elementTagName;
        }

        // XPath count starts from 1
        var xpathOrder = 1;
        var siblings = element.parentNode.childNodes;

        var ELEMENT_NODE_TYPE = 1;

        for (var i = 0, siblingsCount = siblings.length; i < siblingsCount; i++) {
            var sibling = siblings[i];
            if (sibling.nodeType !== ELEMENT_NODE_TYPE) {
                continue;
            }
            if (sibling === element) {
                return "" + (getXPath(element.parentNode)) + "/" + elementTagName + "[" + (xpathOrder) + "]";
            }
            var siblingTagName = getTagName(sibling);

            var hasSameTagAsCurrentElement = sibling.nodeType === ELEMENT_NODE_TYPE && siblingTagName === elementTagName;

            if (hasSameTagAsCurrentElement) {
                xpathOrder++;
            }
        }
    }

    function getXPath(element) {
        WebElementExplorer.hello("getPathTo");
        var result = "";

        var elementTagName = getTagName(element);

        var findResult = "";

        if (canFindById(element)) {
            result = "id(\"" + element.id + "\")";
        } else if (canFindByName(element)) {
            result = "//" + elementTagName + "[@name='" + element["name"] + "']";
        } else {
            result = buldFullXPath(element);
        }
        WebElementExplorer.bye("getPathTo");
        return result;
    }
})(WebElementExplorer || (WebElementExplorer = {}));
/// <reference path="../src/_reference.ts" />
/// <reference path="spec/jasmine.d.ts" />
/// <reference path="spec/helper.ts" />
/// <reference path="../_test_references.ts" />
var WebElementExplorer;
(function (WebElementExplorer) {
    (function (Helper) {
        function withTempElement(elementType, elementAddedCallback) {
            var newElement = document.createElement(elementType);
            document.body.appendChild(newElement);
            try  {
                elementAddedCallback(newElement);
            } catch (e) {
                document.body.removeChild(newElement);
                throw e;
            }

            document.body.removeChild(newElement);
        }
        Helper.withTempElement = withTempElement;
    })(WebElementExplorer.Helper || (WebElementExplorer.Helper = {}));
    var Helper = WebElementExplorer.Helper;
})(WebElementExplorer || (WebElementExplorer = {}));
/// <reference path="../_test_references.ts" />
var WebElementExplorer;
(function (WebElementExplorer) {
    describe("Doc", function () {
        describe("findOneById", function () {
            it("Can find an element inside Dom by Id", function () {
                WebElementExplorer.Helper.withTempElement("div", function (expectedDiv) {
                    expectedDiv.id = "tryToFindMe";
                    var actualElement = WebElementExplorer.findOneById(expectedDiv.id);
                    expect(actualElement).toBe(expectedDiv);
                });
            });
        });

        // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        describe("findManyByName", function () {
            it("Can find an element inside Dom by Name", function () {
                WebElementExplorer.Helper.withTempElement("input", function (expectedInput) {
                    var name = "tryToFindMeByName";
                    expectedInput.setAttribute("name", name);
                    var actualElements = WebElementExplorer.findManyByName(name);
                    expect(actualElements.length).toBe(1);
                    expect(actualElements[0]).toBe(expectedInput);
                });
            });

            it("Should return an empty array when no element any element found", function () {
                var name = "This Element does not exist";
                var actualElements = WebElementExplorer.findManyByName(name);
                expect(actualElements.length).toBe(0);
            });
            // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        });
    });
})(WebElementExplorer || (WebElementExplorer = {}));
