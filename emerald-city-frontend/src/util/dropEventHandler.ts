import { api } from "@backend/types/api/Core";
import { store } from "@src/app/store";
import { Engine } from "@src/core/Engine";
import { SceneObject, SceneObjectType } from "@src/core/SceneGraph";
import { replaceMat } from "@src/core/utils";
import { DropData, DropObjectType } from "@src/types/Core";
import * as THREE from "three";

function handleModelDrop(engine: Engine, modelID: string) {
  const renderEngine = engine.renderEngine!;

  if (renderEngine.modelStore.has(modelID)) {
    const renderObject = renderEngine.modelStore.get(modelID)!.clone();
    renderEngine.mainScene.add(renderObject);

    renderObject.scale.set(0.04, 0.04, 0.04);
    renderEngine.mainScene.add(renderObject);
    engine.sceneGraph.add(
      engine.sceneGraph.root!.id,
      new SceneObject(
        "Untitled",
        renderObject,
        SceneObjectType.MeshObject,
        true
      )
    );
  } else {
    const promises: Promise<any>[] = [];

    const model = store
      .getState()
      .model.find((_model) => _model.id === modelID)!;

    if (model.type === api.ModelType.Imported) {
      if (model.materialID !== "")
        promises.push(renderEngine.ensureMaterial(model.materialID));

      if (model.importedMeshID !== "")
        promises.push(renderEngine.ensureImportedMesh(model.importedMeshID));
    }

    Promise.all(promises)
      .then(() => {
        const tempIModel = renderEngine.importedMeshStore.get(
          model.importedMeshID!
        )!;
        //.clone();

        const mat = renderEngine.materialStore.get(model.materialID!)!;

        replaceMat(tempIModel, mat);
        renderEngine.modelStore.set(modelID, tempIModel);
      })
      .then(() => {
        const renderObject = renderEngine.modelStore.get(modelID)!.clone();

        renderObject.scale.set(0.04, 0.04, 0.04);
        renderEngine.mainScene.add(renderObject);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject(
            "Untitled",
            renderObject,
            SceneObjectType.MeshObject,
            true
          )
        );
      });
  }
}

function handleBasicShapeDrop(
  engine: Engine,
  primitiveMeshType: api.PrimitiveMesh
) {
  const renderEngine = engine.renderEngine!;

  if (renderEngine.primitiveMeshStore.has(primitiveMeshType)) {
    const mat = new THREE.MeshStandardMaterial();
    const geometry = renderEngine.primitiveMeshStore.get(primitiveMeshType)!;
    const renderObject = new THREE.Mesh(geometry, mat);

    renderEngine.mainScene.add(renderObject);

    //renderObject.scale.set(0.04, 0.04, 0.04);
    renderEngine.mainScene.add(renderObject);
    engine.sceneGraph.add(
      engine.sceneGraph.root!.id,
      new SceneObject(
        "Untitled",
        renderObject,
        SceneObjectType.MeshObject,
        true
      )
    );
  }
}

function handleLightDrop(engine: Engine, lightType: api.Light) {
  const renderEngine = engine.renderEngine!;

  switch (lightType) {
    case api.Light.Ambient:
      {
        const light = new THREE.AmbientLight(0x404040, 1); // soft white light
        renderEngine.mainScene.add(light);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject("Sky Light", light, SceneObjectType.Light, true)
        );
      }
      break;
    case api.Light.Directional:
      {
        const light = new THREE.DirectionalLight(0x404040, 1); // soft white light
        renderEngine.mainScene.add(light);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject(
            "Directional Light",
            light,
            SceneObjectType.Light,
            true
          )
        );
      }
      break;
    case api.Light.RectArea:
      {
        const light = new THREE.RectAreaLight(0x404040, 1, 1, 1); // soft white light
        renderEngine.mainScene.add(light);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject("RectArea Light", light, SceneObjectType.Light, true)
        );
      }
      break;
    case api.Light.Spot:
      {
        const light = new THREE.SpotLight(0x404040, 1); // soft white light
        renderEngine.mainScene.add(light);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject("Spot Light", light, SceneObjectType.Light, true)
        );
      }
      break;
    case api.Light.Point:
      {
        const light = new THREE.PointLight(0x404040, 1); // soft white light
        renderEngine.mainScene.add(light);
        engine.sceneGraph.add(
          engine.sceneGraph.root!.id,
          new SceneObject("Point Light", light, SceneObjectType.Light, true)
        );
      }
      break;
    default:
      break;
  }

  /* renderEngine.mainScene.add(renderObject);

    //renderObject.scale.set(0.04, 0.04, 0.04);
    renderEngine.mainScene.add(renderObject);
    engine.sceneGraph.add(
      engine.sceneGraph.root!.id,
      new SceneObject(
        "Untitled",
        renderObject,
        SceneObjectType.MeshObject,
        true
      )
    ); */
}

export function dropCallback(
  engine: Engine,
  e: React.DragEvent<HTMLDivElement>
) {
  const renderEngine = engine.renderEngine!;
  if (renderEngine) {
    const dropData: DropData = JSON.parse(
      e.dataTransfer!.getData("text/plain")
    );

    if (dropData.dropObjectType === DropObjectType.Model)
      handleModelDrop(engine, dropData.data);
    else if (dropData.dropObjectType === DropObjectType.BasicShape)
      handleBasicShapeDrop(engine, dropData.data);
    else if (dropData.dropObjectType === DropObjectType.Light)
      handleLightDrop(engine, dropData.data);
  }
}
