// scripts/main.ts
import {
  EntityEquippableComponent,
  EquipmentSlot,
  system,
  world
} from "@minecraft/server";

// scripts/utils.ts
import { BlockPermutation, ItemStack } from "@minecraft/server";
function replaceItems(inventory, oldTypeId, newTypeId) {
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (item && item.typeId === oldTypeId) {
      const newItem = new ItemStack(newTypeId, item.amount);
      newItem.setLore([`\xA76placeable in offhand slot!`]);
      inventory.setItem(i, newItem);
    }
  }
}
function removeLightBlocks(dimension, x, y, z) {
  const radius = 4;
  const height = 2;
  const airBlock = BlockPermutation.resolve("minecraft:air");
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -height; dy <= height; dy++) {
      for (let dz = -radius; dz <= radius; dz++) {
        if (dx === 0 && dy === 1 && dz === 0)
          continue;
        const block = dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
        if (block && ["minecraft:light_block_13", "minecraft:light_block_11", "minecraft:light_block_9"].includes(block.typeId)) {
          block.setPermutation(airBlock);
        }
      }
    }
  }
}
function setLightLevel(player, level) {
  const dimension = player.dimension;
  const { x, y, z } = player.location;
  if (level !== null) {
    const centerBlock = dimension.getBlock({ x, y: y + 1, z });
    if (centerBlock) {
      const lightBlock = BlockPermutation.resolve("minecraft:light_block", { block_light_level: level });
      centerBlock.setPermutation(lightBlock);
    }
  }
  removeLightBlocks(dimension, x, y, z);
}

// scripts/config.ts
var light13 = ["torch_offhand", "minecraft:torch"];
var light11 = ["soul_torch", "soul_torch_offhand"];
var light9 = ["redstone_torch", "redstone_torch_offhand"];

// scripts/main.ts
var LightManager = class {
  async light13(player) {
    await setLightLevel(player, 13);
  }
  async light11(player) {
    await setLightLevel(player, 11);
  }
  async light9(player) {
    await setLightLevel(player, 9);
  }
  async no_light(player) {
    const { x, y, z } = player.location;
    const dimension = player.dimension;
    removeLightBlocks(dimension, x, y, z);
  }
};
var TorchlightManager = class {
  constructor() {
    this.LightManagerInstance = new LightManager();
    system.runInterval(() => this.updatePlayers());
  }
  updatePlayers() {
    const players = world.getPlayers();
    players.forEach((player) => this.updatePlayer(player));
  }
  updatePlayer(player) {
    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory)
      return;
    const container = inventory.container;
    if (container) {
      replaceItems(container, "minecraft:torch", "keyyard:torch_offhand");
      replaceItems(container, "minecraft:redstone_torch", "keyyard:redstone_torch_offhand");
      replaceItems(container, "minecraft:soul_torch", "keyyard:soul_torch_offhand");
    }
    const equip = player.getComponent(EntityEquippableComponent.componentId);
    const hand = equip?.getEquipment(EquipmentSlot.Mainhand);
    const offhand = equip?.getEquipment(EquipmentSlot.Offhand);
    this.updateHand(player, hand);
    this.updateOffhand(player, offhand);
  }
  updateHand(player, hand) {
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
  updateOffhand(player, offhand) {
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
};
new TorchlightManager();

//# sourceMappingURL=../debug/main.js.map
