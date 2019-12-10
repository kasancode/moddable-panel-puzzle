//@ts-ignore
import { Skin, Application, Content } from 'piu/MC'

declare let global: any;

const size = 4;
const panelSize = 50;
const margin = 2;
let x = 0;
let y = 0;

const backgroundSkin = new Skin({
    fill: "silver"
});

const panelSkin = new Skin({
    fill: ["#ff0000", "#0000ff", "#ff1493", "#4169e1"]
});

function range(n:number):any[]{
    return Array.apply(null, Array(n));
}

let panels: boolean[][] = range(size)
    .map(() => range(size)
        .map(() => false));

function getState(lx: number, ly: number): number {
    return (panels[lx][ly] ? 1 : 0) + ((lx === x && ly === y) ? 2 : 0);
}

function createContents(): Content[] {
    return range(size * size)
        .map((_, i: number) => {
            let x = i % size;
            let y = Math.floor(i / size);

            return new Content(i, {
                name: String(i),
                left: (panelSize + margin) * x,
                top: (panelSize + margin) * y,
                skin: panelSkin,
                width: panelSize,
                height: panelSize,
                state: getState(x, y)
            })
        });
}

let PanelsApplication = new Application(null, {
    skin: backgroundSkin,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    contents: createContents()
});

function toggle(): void {
    toggleOne(x, y);
    toggleOne(x - 1, y);
    toggleOne(x, y - 1);
    toggleOne(x + 1, y);
    toggleOne(x, y + 1);

    render();
}

function toggleOne(x: number, y: number): void {
    if (x < 0 || x >= size || y < 0 || y >= size)
        return;

    panels[x][y] = !panels[x][y];
}

function render(): void {
    for (let x = 0; x < size; x++)
        for (let y = 0; y < size; y++)
            PanelsApplication.content(String(x + y * size)).state = getState(x, y);
}

function addX(): void {
    x++;
    if (x >= size) x = 0;

    render();
}

function addY(): void {
    y++;
    if (y >= size) y = 0;

    render();
}

const buttonA = global.button.a
const buttonB = global.button.b
const buttonC = global.button.c

buttonA.onChanged = function () {
    if (this.read() === 0)
        addX();
}

buttonB.onChanged = function () {
    if (this.read() === 0)
        addY();
}

buttonC.onChanged = function () {
    if (this.read() === 0)
        toggle();
}

for (let i = 0; i < 100; i++) {
    x += Math.random() * size;
    y += Math.random() * size;

    x = Math.floor(x) % size;
    y = Math.floor(y) % size;

    toggle();
}

x = 0;
y = 0;
render();

export default PanelsApplication;
