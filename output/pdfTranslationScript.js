var pdfTranslationScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // index.js
  var pdfTranslationScript_exports = {};
  __export(pdfTranslationScript_exports, {
    addTranslations: () => addTranslations,
    translationHtml: () => translationHtml
  });

  // node_modules/svg-tag-names/index.js
  var svgTagNames = [
    "a",
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "animation",
    "audio",
    "canvas",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "handler",
    "hkern",
    "iframe",
    "image",
    "line",
    "linearGradient",
    "listener",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "prefetch",
    "radialGradient",
    "rect",
    "script",
    "set",
    "solidColor",
    "stop",
    "style",
    "svg",
    "switch",
    "symbol",
    "tbreak",
    "text",
    "textArea",
    "textPath",
    "title",
    "tref",
    "tspan",
    "unknown",
    "use",
    "video",
    "view",
    "vkern"
  ];

  // node_modules/dom-chef/index.js
  var svgTags = new Set(svgTagNames);
  svgTags.delete("a");
  svgTags.delete("audio");
  svgTags.delete("canvas");
  svgTags.delete("iframe");
  svgTags.delete("script");
  svgTags.delete("video");
  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  var isFragment = (type) => type === DocumentFragment;
  var setCSSProps = (element, style) => {
    for (const [name, value] of Object.entries(style)) {
      if (name.startsWith("-")) {
        element.style.setProperty(name, value);
      } else if (typeof value === "number" && !IS_NON_DIMENSIONAL.test(name)) {
        element.style[name] = `${value}px`;
      } else {
        element.style[name] = value;
      }
    }
  };
  var create = (type) => {
    if (typeof type === "string") {
      if (svgTags.has(type)) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
      }
      return document.createElement(type);
    }
    if (isFragment(type)) {
      return document.createDocumentFragment();
    }
    return type(type.defaultProps);
  };
  var setAttribute = (element, name, value) => {
    if (value === void 0 || value === null) {
      return;
    }
    if (/^xlink[AHRST]/.test(name)) {
      element.setAttributeNS("http://www.w3.org/1999/xlink", name.replace("xlink", "xlink:").toLowerCase(), value);
    } else {
      element.setAttribute(name, value);
    }
  };
  var addChildren = (parent, children) => {
    for (const child of children) {
      if (child instanceof Node) {
        parent.appendChild(child);
      } else if (Array.isArray(child)) {
        addChildren(parent, child);
      } else if (typeof child !== "boolean" && typeof child !== "undefined" && child !== null) {
        parent.appendChild(document.createTextNode(child));
      }
    }
  };
  var booleanishAttributes = /* @__PURE__ */ new Set([
    // These attributes allow "false" as a valid value
    "contentEditable",
    "draggable",
    "spellCheck",
    "value",
    // SVG-specific
    "autoReverse",
    "externalResourcesRequired",
    "focusable",
    "preserveAlpha"
  ]);
  var h = (type, attributes, ...children) => {
    var _a;
    const element = create(type);
    addChildren(element, children);
    if (element instanceof DocumentFragment || !attributes) {
      return element;
    }
    for (let [name, value] of Object.entries(attributes)) {
      if (name === "htmlFor") {
        name = "for";
      }
      if (name === "class" || name === "className") {
        const existingClassname = (_a = element.getAttribute("class")) !== null && _a !== void 0 ? _a : "";
        setAttribute(element, "class", (existingClassname + " " + String(value)).trim());
      } else if (name === "style") {
        setCSSProps(element, value);
      } else if (name.startsWith("on")) {
        const eventName = name.slice(2).toLowerCase().replace(/^-/, "");
        element.addEventListener(eventName, value);
      } else if (name === "dangerouslySetInnerHTML" && "__html" in value) {
        element.innerHTML = value.__html;
      } else if (name !== "key" && (booleanishAttributes.has(name) || value !== false)) {
        setAttribute(element, name, value === true ? "" : value);
      }
    }
    return element;
  };

  // translation.tsx
  var UiTreeNode = class _UiTreeNode {
    static #revealInfos = [];
    constructor(meanings, parent) {
      this.id = "";
      this.children = [];
      this.visible = false;
      this.meanings = meanings;
      this.parent = parent;
      this.meaningInterval = null;
      this.keydownListeners = [];
    }
    static addRevealInfo(revealInfo) {
      this.#revealInfos.push(revealInfo);
    }
    static checkRevealInfos() {
      for (const i of _UiTreeNode.#revealInfos) {
        let revealIt = i.nodes.every((t) => t.visible);
        if (revealIt) {
          i.toReveal.classList.add("visible");
        }
      }
    }
    // Create tree from a root translation of type t.
    static buildUiTree(rootTranslation, parent) {
      let newNode;
      if (!Array.isArray(rootTranslation)) {
        newNode = new _UiTreeNode([rootTranslation], parent);
      } else {
        const children = rootTranslation[0];
        const meanings = rootTranslation[1];
        if (!Array.isArray(children)) {
          newNode = new _UiTreeNode(meanings, parent);
          const leafNode = new _UiTreeNode([children], newNode);
          newNode.children = [leafNode];
        } else {
          newNode = new _UiTreeNode(meanings, parent);
          const convertedInitials = children.map((i) => _UiTreeNode.buildUiTree(i, newNode));
          newNode.children = convertedInitials;
        }
      }
      if (newNode.parent === null) {
        newNode.#assignIds();
      }
      return newNode;
    }
    static getUiNode(translation) {
      return _UiTreeNode.buildUiTree(translation, null);
    }
    // Assign id values to node and all its children.
    #assignIds() {
      const unique = getDeepestLeaves(this).map((i) => i.meanings[0]).join("");
      let idCounter = 0;
      function dfs(node) {
        node.id = unique + idCounter;
        idCounter++;
        if (Array.isArray(node.children)) {
          for (const child of node.children) {
            dfs(child);
          }
        }
      }
      dfs(this);
    }
    // Add content to inside of node.
    #addNodeContent(nodeDisplay) {
      nodeDisplay.innerHTML = this.meanings[0];
      if (this.meanings.length > 1) {
        const nextMeaning = () => {
          const strippedMeanings = this.meanings.map((i) => stripHtml(i));
          const nextIndex = (strippedMeanings.indexOf(stripHtml(nodeDisplay.innerHTML)) + 1) % this.meanings.length;
          nodeDisplay.innerHTML = this.meanings[nextIndex];
        };
        if (this.parent !== null) {
          const enterListener = () => {
            if (!this.meaningInterval) {
              this.meaningInterval = setInterval(nextMeaning, 500);
              nodeDisplay.classList.add("hovered");
            }
          };
          const exitListener = () => {
            if (this.meaningInterval) {
              clearInterval(this.meaningInterval);
              this.meaningInterval = null;
              nodeDisplay.classList.remove("hovered");
            }
          };
          nodeDisplay.addEventListener("mouseenter", enterListener);
          nodeDisplay.addEventListener("mouseleave", exitListener);
          nodeDisplay.addEventListener("touchstart", enterListener);
          nodeDisplay.addEventListener("touchend", exitListener);
        } else {
          nodeDisplay.addEventListener("click", (e) => {
            nextMeaning();
          });
        }
      }
    }
    #onAdvanceClick(nodeDisplay) {
      if (this.parent !== null) {
        if (!Array.isArray(this.parent.children)) {
          throw new Error("Parent doesn't have children array.");
        }
        if (this.#canAdvance) {
          const parentNode = this.parent.toHtml();
          nodeDisplay.after(parentNode);
          const siblingLeaves = this.parent.children;
          siblingLeaves.forEach((n) => {
            const uiNode = n.#uiElement;
            if (n.meaningInterval) {
              clearInterval(n.meaningInterval);
            }
            n.keydownListeners.forEach((listener) => {
              removeEventListener("keydown", listener);
            });
            uiNode.remove();
            n.visible = false;
          });
          _UiTreeNode.checkRevealInfos();
          if (!this.parent.parent) {
            return;
          }
          const parentSiblings = this.parent.parent.children;
          for (const sibling of parentSiblings) {
            const uiNode = sibling.#uiElement;
            if (uiNode) {
              uiNode.setAttribute("data-canadvance", "" + sibling.#canAdvance);
            }
          }
        }
      }
    }
    get #uiElement() {
      return document.querySelector("[data-node='" + this.id + "']");
    }
    get #canAdvance() {
      if (!this.parent) {
        return false;
      }
      return this.parent.children.every((n) => n.visible);
    }
    // Turn individual node into HTML.
    toHtml() {
      this.visible = true;
      let classes = "translationPart ";
      if (this.parent && this.meanings.length > 1) {
        classes += "hasmeanings ";
      }
      if (!this.parent && this.meanings.length > 1) {
        classes += "canLeftClick ";
      }
      if (!this.parent) {
        classes += "finalTranslation ";
      }
      if (this.children.length === 0) {
        classes += "initialTranslation ";
      }
      const nodeDisplay = /* @__PURE__ */ h("span", { className: classes, "data-node": this.id, "data-canadvance": "" + this.#canAdvance, tabIndex: 0 });
      this.#addNodeContent(nodeDisplay);
      nodeDisplay.addEventListener("click", (e) => {
        this.#onAdvanceClick(nodeDisplay);
      });
      return nodeDisplay;
    }
    // Turn all of a node's deepest children into HTML, space-seperated.
    treeToHtml() {
      const deepestLeaves = getDeepestLeaves(this);
      const returned = /* @__PURE__ */ h("span", null);
      for (const i of deepestLeaves) {
        returned.append(i.toHtml());
        returned.append(document.createTextNode(" "));
      }
      return returned;
    }
  };
  function stripHtml(str) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }
  function getDeepestLeaves(node) {
    if (node.children.length === 0) {
      return [node];
    }
    return node.children.flatMap(getDeepestLeaves);
  }
  function translationHtml(translation) {
    const uiTree = UiTreeNode.getUiNode(translation);
    return uiTree.treeToHtml();
  }
  function addTranslations(finalTranslations, htmlContainerId, toRevealId) {
    const nodeArray = finalTranslations.map((i) => UiTreeNode.getUiNode(i));
    if (typeof htmlContainerId === "undefined") {
      htmlContainerId = "translationContainer";
      if (htmlContainerId === null) {
        throw new Error(`Calling addTranslations with only one argument, but can't find HTML element with id="` + htmlContainerId + '" within the passage.');
      }
    }
    const container = document.getElementById(htmlContainerId);
    if (htmlContainerId === null) {
      throw new Error(`Calling addTranslations with a second argument, but can't find HTML container element to place the translation in. There is no element with id="` + htmlContainerId + '" within the passage.');
    }
    for (let i = 0; i < nodeArray.length; i++) {
      const replaced = container.querySelector("[data-i='" + i + "']");
      if (replaced === null) {
        throw new Error("Missing a data-i element with attribute data-i='" + i + "' inside the container with id " + htmlContainerId + " Check the element exists and check that you passed an array of translations, not a single translation, to addTranslations as the first argument.");
      }
      replaced.replaceWith(nodeArray[i].treeToHtml());
    }
    if (typeof toRevealId !== "undefined") {
      const toRevealElement = document.getElementById(toRevealId);
      if (toRevealElement === null) {
        throw new Error("Can't find the third argument, the HTML element that will be revealed after the translation is finished, within the passage.");
      }
      toRevealElement.classList.add("hidden");
      const revealInfo = {
        toReveal: toRevealElement,
        nodes: nodeArray
      };
      UiTreeNode.addRevealInfo(revealInfo);
    }
  }
  return __toCommonJS(pdfTranslationScript_exports);
})();
window.pdfTranslationScript = pdfTranslationScript;
