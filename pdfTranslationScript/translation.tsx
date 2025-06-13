import { h } from "dom-chef";

type temp = [ // t = translation
    string | t[], // initial - either character (string) or component translations
    string[] // english meanings
];
type t = temp | string; // most translations are temp; the string type is for punctuation and the like

/* --- */

// For when an HTMLElement must be un-hidden after the elements in a list of translations have all reached their final ("most translated") stage.
// Basically works to reveal an element after a translation is "finished".
type RevealInfo = {
    toReveal: HTMLElement,
    nodes: UiTreeNode[],
}

class UiTreeNode {
    static #revealInfos: RevealInfo[] = [];

    id: string;
    children: UiTreeNode[];
    meanings: string[];
    visible: boolean;
    parent: UiTreeNode | null;
    meaningInterval: number | null;
    keydownListeners: EventListenerOrEventListenerObject[];

    constructor(meanings: string[], parent: UiTreeNode | null) {
        this.id = "";
        this.children = [];
        this.visible = false;

        this.meanings = meanings;
        this.parent = parent;

        this.meaningInterval = null;
        this.keydownListeners = [];
    }

    static addRevealInfo(revealInfo: RevealInfo) {
        this.#revealInfos.push(revealInfo);
    }

    static checkRevealInfos() {
        for (const i of UiTreeNode.#revealInfos) {
            let revealIt = i.nodes.every(t => t.visible);
            if (revealIt) {
                i.toReveal.classList.add("visible");
            }
        }
    }

    // Create tree from a root translation of type t.
    static buildUiTree(rootTranslation: t, parent: UiTreeNode | null): UiTreeNode {
        let newNode: UiTreeNode;

        if (!Array.isArray(rootTranslation)) {
            newNode = new UiTreeNode([rootTranslation], parent);
        }
        else {
            const children = rootTranslation[0];
            const meanings = rootTranslation[1];


            if (!Array.isArray(children)) {
                newNode = new UiTreeNode(meanings, parent);
                const leafNode = new UiTreeNode([children], newNode);
                newNode.children = [leafNode];
            }
            else {
                newNode = new UiTreeNode(meanings, parent);
                const convertedInitials = children.map((i) => UiTreeNode.buildUiTree(i, newNode));
                newNode.children = convertedInitials;
            }
        }

        if (newNode.parent === null) {
            newNode.#assignIds();
        }
        return newNode;
    }

    static getUiNode(translation: t) {
        return UiTreeNode.buildUiTree(translation, null);
    }

    // Assign id values to node and all its children.
    #assignIds(): void {
        // unique value for each translation to prevent id conflicts
        const unique = getDeepestLeaves(this).map(i => i.meanings[0]).join("");
        let idCounter = 0;

        function dfs(node: UiTreeNode) {
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
    #addNodeContent(nodeDisplay: React.JSX.Element): void {
        nodeDisplay.innerHTML = this.meanings[0];

        if (this.meanings.length > 1) {
            const nextMeaning = () => {
                const strippedMeanings = this.meanings.map(i => stripHtml(i));
                const nextIndex = (strippedMeanings.indexOf(stripHtml(nodeDisplay.innerHTML)) + 1) % this.meanings.length;
                nodeDisplay.innerHTML = this.meanings[nextIndex];
            }

            if (this.parent !== null) {
                // cycle to next meaning while mouse is hovered over the word or it is pressed
                const enterListener = () => {
                    if (!this.meaningInterval) {
                        this.meaningInterval = setInterval(nextMeaning, 500);
                        nodeDisplay.classList.add("hovered");
                    }
                }
                const exitListener = () => {
                    if (this.meaningInterval) {
                        clearInterval(this.meaningInterval);
                        this.meaningInterval = null;
                        nodeDisplay.classList.remove("hovered");
                    }
                }

                nodeDisplay.addEventListener("mouseenter", enterListener);
                nodeDisplay.addEventListener("mouseleave", exitListener);

                nodeDisplay.addEventListener("touchstart", enterListener);
                nodeDisplay.addEventListener("touchend", exitListener);

                /*
                // cycle to next meaning, if right click/z press while hovered over the text
                const meaningKeyListener = (e) => {
                    if (e.key === " " && nodeDisplay.classList.contains("hovered")) {
                        nextMeaning();
                    }
                };
                document.addEventListener("keydown", meaningKeyListener);
                this.keydownListeners.push(meaningKeyListener);
                nodeDisplay.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    nextMeaning();
                });
                */
            }
            else {
                nodeDisplay.addEventListener("click", (e) => {
                    nextMeaning();
                });
            }
        }
    }

    #onAdvanceClick(nodeDisplay: React.JSX.Element): void {
        if (this.parent !== null) {
            if (!Array.isArray(this.parent.children)) {
                throw new Error("Parent doesn't have children array.");
            }

            if (this.#canAdvance) {
                // Show parent
                const parentNode = this.parent.toHtml();
                nodeDisplay.after(parentNode);

                // Remove all sibling leaves from DOM
                const siblingLeaves: UiTreeNode[] = this.parent.children;
                siblingLeaves.forEach((n) => {
                    const uiNode: HTMLElement = n.#uiElement;
                    if (n.meaningInterval) {
                        clearInterval(n.meaningInterval);
                    }
                    n.keydownListeners.forEach((listener) => {
                        removeEventListener("keydown", listener);
                    });
                    uiNode.remove();
                    n.visible = false;
                });

                UiTreeNode.checkRevealInfos();

                // now the parentNode is visible
                // we must check the canAdvance CSS class for every sibling of the parentNode for possible updates
                if (!this.parent.parent) {
                    return;
                }
                const parentSiblings = this.parent.parent.children;
                for (const sibling of parentSiblings) {
                    const uiNode: Element = sibling.#uiElement;
                    if (uiNode) {
                        uiNode.setAttribute("data-canadvance", "" + sibling.#canAdvance);
                    }
                }
            }
        }
    }

    get #uiElement(): HTMLElement | null {
        return document.querySelector("[data-node='" + this.id + "']");
    }

    get #canAdvance(): boolean {
        if (!this.parent) { return false; }
        return this.parent.children.every((n) => n.visible);
    }

    // Turn individual node into HTML.
    toHtml(): React.JSX.Element {
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

        const nodeDisplay = <span className={classes} data-node={this.id} data-canadvance={"" + this.#canAdvance} tabIndex={0}></span>;

        this.#addNodeContent(nodeDisplay);

        // cycle to next meaning, if left click
        // todo: mobile compatibility
        nodeDisplay.addEventListener("click", (e) => {
            this.#onAdvanceClick(nodeDisplay);
        });

        return nodeDisplay;
    }

    // Turn all of a node's deepest children into HTML, space-seperated.
    treeToHtml(): HTMLElement {
        const deepestLeaves = getDeepestLeaves(this);
        const returned = <span></span>;
        for (const i of deepestLeaves) {
            returned.append(i.toHtml());
            returned.append(document.createTextNode(" "));
        }
        return returned;
    }
}

function stripHtml(str: string): string {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
}

function getDeepestLeaves(node: UiTreeNode): UiTreeNode[] {
    if (node.children.length === 0) {
        return [node];
    }
    return node.children.flatMap(getDeepestLeaves);
}

function translationHtml(translation: t): HTMLElement {
    const uiTree = UiTreeNode.getUiNode(translation);
    return uiTree.treeToHtml();
}

function addTranslations(finalTranslations: t[], htmlContainerId?: string, toRevealId?: string) {
    const nodeArray = finalTranslations.map(i => UiTreeNode.getUiNode(i));

    if (typeof htmlContainerId === "undefined") {
        htmlContainerId = "translationContainer";
        if (htmlContainerId === null) {
            throw new Error("Calling addTranslations with only one argument, but can't find HTML element with id=\"" + htmlContainerId + "\" within the passage.");
        }
    }
    const container = document.getElementById(htmlContainerId);
    if (htmlContainerId === null) {
        throw new Error("Calling addTranslations with a second argument, but can't find HTML container element to place the translation in. There is no element with id=\"" + htmlContainerId + "\" within the passage.");
    }

    for (let i = 0; i < nodeArray.length; i++) {
        const replaced = container.querySelector("[data-i='" + i + "']");
        if (replaced === null) {
            throw new Error("Missing a data-i element with attribute data-i='" + i + "' inside the container with id " + htmlContainerId + " Check the element exists and check that you passed an array of translations, not a single translation, to addTranslations as the first argument.");
        }
        replaced.replaceWith(nodeArray[i].treeToHtml());
    }

    if (typeof toRevealId !== "undefined") {
        const toRevealElement: HTMLElement = document.getElementById(toRevealId);
        if (toRevealElement === null) {
            throw new Error("Can't find the third argument, the HTML element that will be revealed after the translation is finished, within the passage.")
        }

        toRevealElement.classList.add("hidden");
        const revealInfo: RevealInfo = {
            toReveal: toRevealElement,
            nodes: nodeArray
        }
        UiTreeNode.addRevealInfo(revealInfo);
    }
}

export { translationHtml, addTranslations };
export type { t };