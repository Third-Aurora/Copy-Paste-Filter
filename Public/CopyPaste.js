// -----JS CODE-----
//@input Component.Camera camera
//@input Component.MLComponent mlComponent
//@input Asset.Texture predictionTexture
//@input Asset.Texture cameraTexture
//@input Asset.ObjectPrefab copiedPrefab

var copiedObject;
// Creating event listeners
script.createEvent("TapEvent").bind(OnScreenTapped);

function OnScreenTapped(){
    if (copiedObject != null){
        PlaceCopy();
    } else {
        RunModel();
    }
}

function RunModel(){
    print("Running inference...");
    script.mlComponent.runImmediate(false);
}

script.mlComponent.onRunningFinished = onModelFinished;

function onModelFinished(){
    print("Creating copy...");
    //instantiate copy and parent to camera
    copiedObject = script.copiedPrefab.instantiate(script.camera.getSceneObject());
    //create copies of textures and materials
    var meshVisual = copiedObject.getComponent("Component.RenderMeshVisual");
    meshVisual.mainMaterial = meshVisual.mainMaterial.clone();
    meshVisual.mainMaterial.mainPass.baseTex = script.cameraTexture.copyFrame();
    meshVisual.mainMaterial.mainPass.baseTex = script.cameraTexture.copyFrame();
    meshVisual.mainMaterial.mainPass.opacityTex = script.predictionTexture.copyFrame();
    //set aspect ratio
    var size = 10;
    var scale = new vec3(size * script.camera.aspect ,size , 1);
    copiedObject.getTransform().setLocalScale(scale);
    //set distance from camera
    copiedObject.getTransform().setLocalPosition(new vec3(0,0,-100));
}

function PlaceCopy(){
    print("Placed!");
    //save world transform properties
    var worldPos = copiedObject.getTransform().getWorldPosition();
    var worldRot = copiedObject.getTransform().getWorldRotation();
    var worldScale = copiedObject.getTransform().getWorldScale();

    //unparent object from camera and set to null
    copiedObject.setParent(script.getSceneObject().getParent());
    
    //set world position
    copiedObject.getTransform().setWorldPosition(worldPos);
    copiedObject.getTransform().setWorldRotation(worldRot);
    copiedObject.getTransform().setWorldScale(worldScale);
    
    //clear reference to object
    copiedObject = null;
}