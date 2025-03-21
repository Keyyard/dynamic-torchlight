import {
  BlockPermutation,
  EntityEquippableComponent,
  EntityInventoryComponent,
  EquipmentSlot,
  Player,
  system,
  world,
} from "@minecraft/server";
import { removeLightBlocks, replaceItems, setLightLevel } from "./utils";
import { light11, light13, light9 } from "./config";

class LightManager {
  async light13(player: Player) {
    await setLightLevel(player, 13);
  }

  async light11(player: Player) {
    await setLightLevel(player, 11);
  }

  async light9(player: Player) {
    await setLightLevel(player, 9);
  }

  async no_light(player: Player) {
    const { x, y, z } = player.location;
    const dimension = player.dimension;
    removeLightBlocks(dimension, x, y, z);
  }
}

class TorchlightManager {
  private LightManagerInstance = new LightManager();

  constructor() {
    system.runInterval(() => this.updatePlayers());
  }

  private updatePlayers() {
    const players = world.getPlayers();
    players.forEach((player) => this.updatePlayer(player));
  }

  private updatePlayer(player: Player) {
    const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent;
    if (!inventory) return;

    const container = inventory.container;
    if (container) {
      replaceItems(container, "minecraft:torch", "keyyard:torch_offhand");
      replaceItems(container, "minecraft:redstone_torch", "keyyard:redstone_torch_offhand");
      replaceItems(container, "minecraft:soul_torch", "keyyard:soul_torch_offhand");
    }

    const equip = player.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    const hand = equip?.getEquipment(EquipmentSlot.Mainhand);
    const offhand = equip?.getEquipment(EquipmentSlot.Offhand);

    this.updateHand(player, hand);
    this.updateOffhand(player, offhand);
  }

  private updateHand(player: Player, hand: any) {
    if (!hand && !player.hasTag("offhand")) {
      player.removeTag("mainhand");
      this.LightManagerInstance.no_light(player);
    }

    if (hand && !player.hasTag("offhand")) {
      light13.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light13(player);
        }
      });
      light11.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light11(player);
        }
      });
      light9.forEach((i) => {
        if (hand.typeId.includes(i)) {
          player.addTag("mainhand");
          this.LightManagerInstance.light9(player);
        }
      });
    }
  }

  private updateOffhand(player: Player, offhand: any) {
    if (!offhand) {
      player.removeTag("offhand");
      if (!player.hasTag("mainhand")) {
        this.LightManagerInstance.no_light(player);
      }
    } else {
      if (offhand.typeId.includes("torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light13(player);
      }
      if (offhand.typeId.includes("soul_torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light11(player);
      }
      if (offhand.typeId.includes("redstone_torch_offhand")) {
        player.addTag("offhand");
        this.LightManagerInstance.light9(player);
      }
    }
  }
}

new TorchlightManager();
