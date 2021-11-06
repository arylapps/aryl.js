import {
    ArcRotateCamera,
    Color3,
    Color4,
    DirectionalLight,
    Engine,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Ray,
    RayHelper,
    Scene,
    ShadowGenerator,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

// Side-effects only imports allowing the standard material to be used as default.
import "@babylonjs/core/Materials/standardMaterial";
import {GridMaterial,} from "@babylonjs/materials";


const createScene = (engine: Engine) => {
    const scene = new Scene(engine);
    scene.clearColor = Color4.FromHexString("#cfebfdff");

    const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
    // sphere.position.x = 10;
    sphere.position.y = 1;
    const sphereMat = new StandardMaterial("sphereMat", scene);
    sphereMat.diffuseColor = Color3.FromHexString("#91ddbc")
    sphereMat.specularColor = Color3.Black();
    sphere.material = sphereMat;

    const moveSphere = (counter: number) => {
        sphere.position.x = Math.sin(counter) * 10;
        sphere.position.z = Math.cos(counter) * 10;
    }


    const ground = Mesh.CreateGround("ground1", 25, 25, 2, scene);
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = Color3.White();
    // groundMat.specularColor = Color3.White();
    groundMat.specularPower = 64;
    ground.material = groundMat;
    ground.receiveShadows = true;

    // Set up camera
    // const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    const camera = new ArcRotateCamera("camera1", 0, 0.8, 20, Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2);
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 90;
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    // Turn on light
    const ambient = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
    ambient.diffuse = new Color3(0.5, 0.5, 0.5);
    ambient.specular = new Color3(0, 0, 0);
    ambient.groundColor = new Color3(0.4, 0.4, 0.4);
    ambient.intensity = 0.2;

    // const light = new PointLight("light", Vector3.Zero(), scene);
    const light = new DirectionalLight("light", new Vector3(0, -1, 0), scene);
    light.position = new Vector3(0, 15, 0)
    light.diffuse = new Color3(1, 1, 1);
    // light.specular = Color3.Black();
    light.intensity = 0.4;

    const lightSphere = Mesh.CreateSphere("lightSphere", 10, 0.1, scene);
    lightSphere.position = light.position;
    const lightSphereMat = new StandardMaterial("lightSphereMat", scene);
    lightSphereMat.emissiveColor = new Color3(1, 1, 0);
    lightSphere.material = lightSphereMat;

    const localMeshOrigin = lightSphere.position.clone();
    const localMeshDirection = new Vector3(0, -1, 0);

    scene.render();
    const ray = new Ray(localMeshOrigin, localMeshDirection, 15);
    const rayHelper = new RayHelper(ray);
    rayHelper.show(scene);
    rayHelper.attachToMesh(lightSphere);

    const moveLight = (counter: number) => {
        light.direction.x = Math.sin(counter) * 0.2;
        light.direction.z = Math.cos(counter) * 0.2;

        localMeshDirection.x = -light.direction.x;
        localMeshDirection.y = -1;
        localMeshDirection.z = -light.direction.z;
    }


    const shadowGen = new ShadowGenerator(512, light);
    const shadowMap = shadowGen.getShadowMap()
    if (shadowMap) {
        // shadowMap.refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;

        shadowMap.renderList?.push(sphere)
    }
    // shadowGen.filteringQuality = ShadowGenerator.QUALITY_LOW;
    shadowGen.setDarkness(0.6);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.useKernelBlur = true;
    shadowGen.blurKernel = 32;

    // Draw a grid
    const grid = MeshBuilder.CreateGround("grid", {width: 25, height: 25}, scene);
    const gridMat = new GridMaterial("gridMat", scene);
    gridMat.zOffset = -1;
    gridMat.backFaceCulling = false;
    gridMat.gridRatio = 1;
    gridMat.majorUnitFrequency = 2;
    // gridMat.mainColor = new Color3(0.6, 0.6, 0.6);
    gridMat.lineColor = new Color3(0.7, 0.7, 0.7);
    gridMat.opacity = 0.3;
    gridMat.freeze();
    grid.material = gridMat;
    grid.isPickable = false;
    grid.doNotSyncBoundingInfo = true;
    // grid.convertToUnIndexedMesh();
    grid.freezeWorldMatrix();
    grid.freezeNormals();


    let counter = 0;
    const offset = 50;

    engine.runRenderLoop(() => {
        scene.render();
        counter += 0.01;

        // moveSphere(counter / 10 + offset);
        moveLight(counter);
    });

    return scene;
}


const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = createScene(engine);


// engine.runRenderLoop(() => {
//     scene.render();
// });
