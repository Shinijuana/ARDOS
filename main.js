// main.js

window.addEventListener('DOMContentLoaded', () => {
    // Ottieni il canvas e crea il motore Babylon
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    // Crea una scena
    const createScene = async () => {
        const scene = new BABYLON.Scene(engine);

        // Aggiungi una telecamera
        const camera = new BABYLON.WebXRCamera('webXRCamera', scene);
        camera.position.set(0, 0, -5);
        scene.activeCamera = camera;

        // Aggiungi una luce
        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

        // Crea il sistema AR
        const xrHelper = await scene.createDefaultXRExperienceAsync({
            floorMeshes: [], // Nessun piano predefinito
            disableTeleportation: true // Disabilita la teletrasportazione
        });

        // Abilita il piano tracking
        xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.PLANE_DETECTION, 'latest', {
            planeDetection: { // Configura il tracking dei piani
                planeDetectionType: BABYLON.WebXRPlaneDetectionType.HORIZONTAL
            }
        });

        // Carica il modello GLB
        const assetManager = new BABYLON.AssetsManager(scene);
        const gltfTask = assetManager.addMeshTask('sandCastleTask', '', 'assets/', 'sand-castle.glb');

        gltfTask.onSuccess = (task) => {
            const sandCastle = task.loadedMeshes[0];
            sandCastle.position = new BABYLON.Vector3(0, 0, 0); // Posizione iniziale
        };

        gltfTask.onError = (task, message, exception) => {
            console.error('Error loading sand-castle.glb:', message, exception);
        };

        assetManager.load();

        return scene;
    };

    // Crea la scena e avvia il render loop
    createScene().then(scene => {
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Gestisci il ridimensionamento della finestra
        window.addEventListener('resize', () => {
            engine.resize();
        });
    });
});
