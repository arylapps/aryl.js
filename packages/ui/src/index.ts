import {
    ArcRotateCamera,
    Color3,
    Color4,
    DirectionalLight,
    Engine,
    FreeCamera,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    RenderTargetTexture,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

// Side-effects only imports allowing the standard material to be used as default.
import "@babylonjs/core/Materials/standardMaterial";
import {
    GridMaterial,
} from "@babylonjs/materials";


const createScene = (engine: Engine) => {
    const scene = new Scene(engine);
    scene.clearColor = Color4.FromHexString("#E7FAFFFF");

    const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 0;

    const ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);

    // Set up camera
    // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    const camera = new ArcRotateCamera("camera1", 0, 0.8, 20, Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 90;
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    // Turn on light
    const ambient = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
    ambient.diffuse = new Color3(0.5, 0.5, 0.5);
    ambient.specular = new Color3(0, 0, 0);
    ambient.groundColor = new Color3(0.4, 0.4, 0.4);
    ambient.intensity = 0.5;

    const light = new DirectionalLight("light", new Vector3(-1, -2, -1), scene);
    light.position = new Vector3(12, 15, 5);
    light.diffuse = new Color3(1, 1, 1);
    light.intensity = 1;

    const lightSphere = Mesh.CreateSphere("lightSphere", 10, 2, scene);
    lightSphere.position = light.position;
    const material0 = new StandardMaterial("light", scene);
    material0.emissiveColor = new Color3(1, 1, 0);
    lightSphere.material = material0;

    const shadowGen = new ShadowGenerator(512, light);
    const shadowMap = shadowGen.getShadowMap()
    if (shadowMap) {
        shadowMap.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

        shadowMap.renderList?.push(sphere)
        ground.receiveShadows = true;
    }
    shadowGen.filteringQuality = ShadowGenerator.QUALITY_LOW;
    shadowGen.setDarkness(0.6);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.useKernelBlur = true;
    shadowGen.blurKernel = 32;

    // Draw a grid
    const grid = MeshBuilder.CreateGround("grid", {width: 20, height: 20}, scene);
    const material1 = new GridMaterial("grid", scene);
    material1.backFaceCulling = false;
    material1.gridRatio = 1;
    material1.mainColor = new Color3(0.6, 0.6, 0.6);
    material1.lineColor = new Color3(0.7, 0.7, 0.7);
    material1.opacity = 0.3;
    material1.freeze();
    grid.material = material1;
    grid.isPickable = false;
    grid.doNotSyncBoundingInfo = true;
    // grid.convertToUnIndexedMesh();
    grid.freezeWorldMatrix();
    grid.freezeNormals();

    return scene;
}


const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = createScene(engine);


engine.runRenderLoop(() => {
    scene.render();
});
